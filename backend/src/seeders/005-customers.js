'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('customers', [
      {
        customer_code: 'C001',
        company_name: 'ABC Teknoloji Ltd. Şti.',
        customer_type: 'customer',
        tax_number: '1234567890',
        tax_office: 'Kadıköy',
        address: 'Atatürk Cad. No:123 Kadıköy/İstanbul',
        phone: '+90 216 123 45 67',
        email: 'info@abcteknoloji.com',
        contact_person: 'Ahmet Yılmaz',
        payment_terms: 30,
        credit_limit: 100000.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        customer_code: 'S001',
        company_name: 'XYZ Bilişim A.Ş.',
        customer_type: 'supplier',
        tax_number: '0987654321',
        tax_office: 'Beşiktaş',
        address: 'İstiklal Cad. No:456 Beşiktaş/İstanbul',
        phone: '+90 212 987 65 43',
        email: 'satinalma@xyzbilisim.com',
        contact_person: 'Mehmet Demir',
        payment_terms: 15,
        credit_limit: 250000.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        customer_code: 'B001',
        company_name: 'DEF Ticaret Ltd.',
        customer_type: 'both',
        tax_number: '5555666677',
        tax_office: 'Şişli',
        address: 'Büyükdere Cad. No:789 Şişli/İstanbul',
        phone: '+90 212 555 66 77',
        email: 'muhasebe@defticaret.com',
        contact_person: 'Ayşe Kaya',
        payment_terms: 45,
        credit_limit: 150000.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', null, {});
  }
};