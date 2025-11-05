const { AccountingEntry, AccountingAccount, AccountingMovement, Invoice, Customer, Payment } = require('../../models');
const { Op } = require('sequelize');
const sequelize = require('../../config/database');

class AccountingService {
  // Mali işlem kayıt API endpoint'lerini oluştur
  async createAccountingEntry(entryData) {
    const transaction = await sequelize.transaction();
    
    try {
      // Yevmiye kaydı oluştur
      const entry = await AccountingEntry.create({
        entry_number: await this.generateEntryNumber(),
        entry_date: entryData.entry_date || new Date(),
        description: entryData.description,
        reference_type: entryData.reference_type,
        reference_id: entryData.reference_id,
        total_debit: entryData.total_debit,
        total_credit: entryData.total_credit,
        created_by: entryData.created_by
      }, { transaction });

      // Hesap hareketlerini oluştur
      if (entryData.account_movements && entryData.account_movements.length > 0) {
        const movements = entryData.account_movements.map(movement => ({
          ...movement,
          accounting_entry_id: entry.id
        }));
        
        await AccountingMovement.bulkCreate(movements, { transaction });
      }

      await transaction.commit();
      return await this.getAccountingEntryById(entry.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Otomatik yevmiye kaydı oluşturma servisi
  async createAutomaticEntry(referenceType, referenceId, entryData) {
    try {
      let automaticEntry = null;

      switch (referenceType) {
        case 'invoice':
          automaticEntry = await this.createInvoiceEntry(referenceId, entryData);
          break;
        case 'payment':
          automaticEntry = await this.createPaymentEntry(referenceId, entryData);
          break;
        case 'expense':
          automaticEntry = await this.createExpenseEntry(referenceId, entryData);
          break;
        default:
          throw new Error('Desteklenmeyen referans tipi');
      }

      return automaticEntry;
    } catch (error) {
      throw error;
    }
  }

  // Fatura için otomatik yevmiye kaydı
  async createInvoiceEntry(invoiceId, entryData) {
    const invoice = await Invoice.findByPk(invoiceId, {
      include: [{ model: Customer, as: 'customer' }]
    });

    if (!invoice) {
      throw new Error('Fatura bulunamadı');
    }

    const movements = [];

    if (invoice.invoice_type === 'sales') {
      // Satış faturası için kayıtlar
      movements.push({
        account_code: '120.01', // Alıcılar hesabı
        account_name: 'Alıcılar',
        debit_amount: invoice.total_amount,
        credit_amount: 0,
        description: `${invoice.customer.company_name} - Satış Faturası`
      });

      movements.push({
        account_code: '600.01', // Yurtiçi Satışlar
        account_name: 'Yurtiçi Satışlar',
        debit_amount: 0,
        credit_amount: invoice.subtotal,
        description: `Satış - ${invoice.invoice_number}`
      });

      if (invoice.tax_amount > 0) {
        movements.push({
          account_code: '391.01', // Hesaplanan KDV
          account_name: 'Hesaplanan KDV',
          debit_amount: 0,
          credit_amount: invoice.tax_amount,
          description: `KDV - ${invoice.invoice_number}`
        });
      }
    } else {
      // Alış faturası için kayıtlar
      movements.push({
        account_code: '153.01', // Ticari Mallar
        account_name: 'Ticari Mallar',
        debit_amount: invoice.subtotal,
        credit_amount: 0,
        description: `Mal Alımı - ${invoice.invoice_number}`
      });

      if (invoice.tax_amount > 0) {
        movements.push({
          account_code: '191.01', // İndirilecek KDV
          account_name: 'İndirilecek KDV',
          debit_amount: invoice.tax_amount,
          credit_amount: 0,
          description: `KDV - ${invoice.invoice_number}`
        });
      }

      movements.push({
        account_code: '320.01', // Satıcılar hesabı
        account_name: 'Satıcılar',
        debit_amount: 0,
        credit_amount: invoice.total_amount,
        description: `${invoice.customer.company_name} - Alış Faturası`
      });
    }

    return await this.createAccountingEntry({
      description: `${invoice.invoice_type === 'sales' ? 'Satış' : 'Alış'} Faturası - ${invoice.invoice_number}`,
      reference_type: 'invoice',
      reference_id: invoiceId,
      total_debit: invoice.total_amount,
      total_credit: invoice.total_amount,
      account_movements: movements,
      created_by: entryData.created_by
    });
  }

  // Ödeme için otomatik yevmiye kaydı
  async createPaymentEntry(paymentId, entryData) {
    const payment = await Payment.findByPk(paymentId, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Invoice, as: 'invoice' }
      ]
    });

    if (!payment) {
      throw new Error('Ödeme bulunamadı');
    }

    const movements = [];
    const isReceivable = payment.invoice.invoice_type === 'sales';

    if (isReceivable) {
      // Alacak tahsilatı
      movements.push({
        account_code: this.getPaymentAccountCode(payment.payment_method),
        account_name: this.getPaymentAccountName(payment.payment_method),
        debit_amount: payment.amount,
        credit_amount: 0,
        description: `Tahsilat - ${payment.payment_number}`
      });

      movements.push({
        account_code: '120.01', // Alıcılar
        account_name: 'Alıcılar',
        debit_amount: 0,
        credit_amount: payment.amount,
        description: `${payment.customer.company_name} - Tahsilat`
      });
    } else {
      // Borç ödemesi
      movements.push({
        account_code: '320.01', // Satıcılar
        account_name: 'Satıcılar',
        debit_amount: payment.amount,
        credit_amount: 0,
        description: `${payment.customer.company_name} - Ödeme`
      });

      movements.push({
        account_code: this.getPaymentAccountCode(payment.payment_method),
        account_name: this.getPaymentAccountName(payment.payment_method),
        debit_amount: 0,
        credit_amount: payment.amount,
        description: `Ödeme - ${payment.payment_number}`
      });
    }

    return await this.createAccountingEntry({
      description: `${isReceivable ? 'Tahsilat' : 'Ödeme'} - ${payment.payment_number}`,
      reference_type: 'payment',
      reference_id: paymentId,
      total_debit: payment.amount,
      total_credit: payment.amount,
      account_movements: movements,
      created_by: entryData.created_by
    });
  }

  // Bilanço oluşturma API'si
  async generateBalanceSheet(params = {}) {
    const { start_date, end_date, include_previous_period = false } = params;
    
    try {
      // Aktif hesaplar
      const assets = await this.getAccountBalances({
        account_type: 'asset',
        start_date,
        end_date
      });

      // Pasif hesaplar
      const liabilities = await this.getAccountBalances({
        account_type: 'liability',
        start_date,
        end_date
      });

      // Özkaynak hesapları
      const equity = await this.getAccountBalances({
        account_type: 'equity',
        start_date,
        end_date
      });

      const balanceSheet = {
        report_date: end_date || new Date(),
        assets: {
          current_assets: assets.filter(a => a.account_code.startsWith('1')),
          fixed_assets: assets.filter(a => a.account_code.startsWith('2')),
          total_assets: assets.reduce((sum, a) => sum + a.balance, 0)
        },
        liabilities_and_equity: {
          current_liabilities: liabilities.filter(l => l.account_code.startsWith('3')),
          long_term_liabilities: liabilities.filter(l => l.account_code.startsWith('4')),
          equity: equity,
          total_liabilities_and_equity: 
            liabilities.reduce((sum, l) => sum + l.balance, 0) + 
            equity.reduce((sum, e) => sum + e.balance, 0)
        }
      };

      return balanceSheet;
    } catch (error) {
      throw error;
    }
  }

  // Gelir tablosu oluşturma API'si
  async generateIncomeStatement(params = {}) {
    const { start_date, end_date } = params;
    
    try {
      // Gelir hesapları (6xx)
      const revenues = await this.getAccountBalances({
        account_type: 'revenue',
        start_date,
        end_date
      });

      // Gider hesapları (7xx)
      const expenses = await this.getAccountBalances({
        account_type: 'expense',
        start_date,
        end_date
      });

      // Maliyet hesapları (62x)
      const costs = await this.getAccountBalances({
        account_code_prefix: '62',
        start_date,
        end_date
      });

      const totalRevenue = revenues.reduce((sum, r) => sum + Math.abs(r.balance), 0);
      const totalCosts = costs.reduce((sum, c) => sum + Math.abs(c.balance), 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + Math.abs(e.balance), 0);

      const incomeStatement = {
        period: { start_date, end_date },
        revenues: {
          items: revenues,
          total: totalRevenue
        },
        cost_of_goods_sold: {
          items: costs,
          total: totalCosts
        },
        gross_profit: totalRevenue - totalCosts,
        operating_expenses: {
          items: expenses,
          total: totalExpenses
        },
        operating_profit: totalRevenue - totalCosts - totalExpenses,
        net_profit: totalRevenue - totalCosts - totalExpenses
      };

      return incomeStatement;
    } catch (error) {
      throw error;
    }
  }

  // Dönemsel rapor oluşturma fonksiyonları
  async generatePeriodicalReports(params = {}) {
    const { period_type = 'monthly', year, month, quarter } = params;
    
    try {
      let start_date, end_date;

      switch (period_type) {
        case 'monthly':
          start_date = new Date(year, month - 1, 1);
          end_date = new Date(year, month, 0);
          break;
        case 'quarterly':
          const quarterStart = (quarter - 1) * 3;
          start_date = new Date(year, quarterStart, 1);
          end_date = new Date(year, quarterStart + 3, 0);
          break;
        case 'yearly':
          start_date = new Date(year, 0, 1);
          end_date = new Date(year, 11, 31);
          break;
        default:
          throw new Error('Geçersiz dönem tipi');
      }

      const [balanceSheet, incomeStatement, trialBalance] = await Promise.all([
        this.generateBalanceSheet({ start_date, end_date }),
        this.generateIncomeStatement({ start_date, end_date }),
        this.generateTrialBalance({ start_date, end_date })
      ]);

      return {
        period: { period_type, start_date, end_date },
        balance_sheet: balanceSheet,
        income_statement: incomeStatement,
        trial_balance: trialBalance
      };
    } catch (error) {
      throw error;
    }
  }

  // Mizan raporu oluşturma
  async generateTrialBalance(params = {}) {
    const { start_date, end_date } = params;
    
    try {
      const accounts = await this.getAccountBalances({
        start_date,
        end_date,
        include_zero_balances: true
      });

      const totalDebits = accounts.reduce((sum, acc) => 
        sum + (acc.balance > 0 ? acc.balance : 0), 0);
      const totalCredits = accounts.reduce((sum, acc) => 
        sum + (acc.balance < 0 ? Math.abs(acc.balance) : 0), 0);

      return {
        period: { start_date, end_date },
        accounts: accounts.map(acc => ({
          account_code: acc.account_code,
          account_name: acc.account_name,
          debit_balance: acc.balance > 0 ? acc.balance : 0,
          credit_balance: acc.balance < 0 ? Math.abs(acc.balance) : 0
        })),
        totals: {
          total_debits: totalDebits,
          total_credits: totalCredits,
          difference: totalDebits - totalCredits
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Yardımcı fonksiyonlar
  async generateEntryNumber() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    
    const lastEntry = await AccountingEntry.findOne({
      where: {
        entry_number: {
          [Op.like]: `YEV${year}${month}%`
        }
      },
      order: [['entry_number', 'DESC']]
    });

    let sequence = 1;
    if (lastEntry) {
      const lastSequence = parseInt(lastEntry.entry_number.slice(-4));
      sequence = lastSequence + 1;
    }

    return `YEV${year}${month}${String(sequence).padStart(4, '0')}`;
  }

  async getAccountBalances(params = {}) {
    const { 
      account_type, 
      account_code_prefix, 
      start_date, 
      end_date,
      include_zero_balances = false 
    } = params;

    let whereClause = {};
    
    if (account_type) {
      whereClause.account_type = account_type;
    }
    
    if (account_code_prefix) {
      whereClause.account_code = {
        [Op.like]: `${account_code_prefix}%`
      };
    }

    const accounts = await AccountingAccount.findAll({
      where: whereClause,
      include: [{
        model: AccountingMovement,
        as: 'movements',
        required: false,
        where: {
          ...(start_date && { created_at: { [Op.gte]: start_date } }),
          ...(end_date && { created_at: { [Op.lte]: end_date } })
        }
      }]
    });

    const accountBalances = accounts.map(account => {
      const balance = account.movements.reduce((sum, movement) => {
        return sum + (movement.debit_amount - movement.credit_amount);
      }, 0);

      return {
        account_code: account.account_code,
        account_name: account.account_name,
        account_type: account.account_type,
        balance: balance
      };
    });

    return include_zero_balances 
      ? accountBalances 
      : accountBalances.filter(acc => acc.balance !== 0);
  }

  getPaymentAccountCode(paymentMethod) {
    const accountCodes = {
      'cash': '100.01',
      'bank_transfer': '102.01',
      'credit_card': '108.01',
      'check': '101.01'
    };
    return accountCodes[paymentMethod] || '100.01';
  }

  getPaymentAccountName(paymentMethod) {
    const accountNames = {
      'cash': 'Kasa',
      'bank_transfer': 'Bankalar',
      'credit_card': 'Kredi Kartı Alacakları',
      'check': 'Çekler'
    };
    return accountNames[paymentMethod] || 'Kasa';
  }

  async getAccountingEntryById(id) {
    return await AccountingEntry.findByPk(id, {
      include: [{
        model: AccountingMovement,
        as: 'movements'
      }]
    });
  }

  async getAllAccountingEntries(params = {}) {
    const { page = 1, limit = 50, start_date, end_date, reference_type } = params;
    const offset = (page - 1) * limit;

    let whereClause = {};
    
    if (start_date) {
      whereClause.entry_date = { [Op.gte]: start_date };
    }
    
    if (end_date) {
      whereClause.entry_date = { ...whereClause.entry_date, [Op.lte]: end_date };
    }
    
    if (reference_type) {
      whereClause.reference_type = reference_type;
    }

    const { count, rows } = await AccountingEntry.findAndCountAll({
      where: whereClause,
      include: [{
        model: AccountingMovement,
        as: 'movements'
      }],
      order: [['entry_date', 'DESC'], ['id', 'DESC']],
      limit,
      offset
    });

    return {
      entries: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }
}

module.exports = AccountingService;