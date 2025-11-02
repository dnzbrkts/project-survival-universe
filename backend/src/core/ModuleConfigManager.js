/**
 * Modül Konfigürasyon Yönetim Sistemi
 * Runtime modül konfigürasyonu ve ayar yönetimi
 */

class ModuleConfigManager {
  constructor() {
    this.configs = new Map(); // moduleCode -> config object
    this.defaultConfigs = new Map(); // moduleCode -> default config
    this.configValidators = new Map(); // moduleCode -> validation function
    this.configChangeListeners = new Map(); // moduleCode -> array of listeners
  }

  /**
   * Modül için varsayılan konfigürasyon kaydetme
   * @param {string} moduleCode - Modül kodu
   * @param {Object} defaultConfig - Varsayılan konfigürasyon
   * @param {Function} validator - Konfigürasyon doğrulama fonksiyonu
   */
  registerModuleConfig(moduleCode, defaultConfig = {}, validator = null) {
    this.defaultConfigs.set(moduleCode, { ...defaultConfig });
    
    if (validator && typeof validator === 'function') {
      this.configValidators.set(moduleCode, validator);
    }

    // Varsayılan konfigürasyonu aktif konfigürasyon olarak ayarla
    if (!this.configs.has(moduleCode)) {
      this.configs.set(moduleCode, { ...defaultConfig });
    }

    console.log(`Modül konfigürasyonu kayıt edildi: ${moduleCode}`);
  }

  /**
   * Modül konfigürasyonu güncelleme
   * @param {string} moduleCode - Modül kodu
   * @param {Object} newConfig - Yeni konfigürasyon
   * @param {boolean} merge - Mevcut konfigürasyonla birleştir mi?
   * @returns {Object} Güncelleme sonucu
   */
  updateModuleConfig(moduleCode, newConfig, merge = true) {
    try {
      // Konfigürasyon doğrulama
      const validator = this.configValidators.get(moduleCode);
      if (validator) {
        const validationResult = validator(newConfig);
        if (!validationResult.isValid) {
          return {
            success: false,
            error: 'Konfigürasyon doğrulama hatası',
            validationErrors: validationResult.errors
          };
        }
      }

      const currentConfig = this.configs.get(moduleCode) || {};
      const updatedConfig = merge 
        ? { ...currentConfig, ...newConfig }
        : { ...newConfig };

      // Eski konfigürasyonu sakla
      const oldConfig = { ...currentConfig };

      // Yeni konfigürasyonu kaydet
      this.configs.set(moduleCode, updatedConfig);

      // Değişiklik dinleyicilerini bilgilendir
      this.notifyConfigChange(moduleCode, oldConfig, updatedConfig);

      console.log(`Modül konfigürasyonu güncellendi: ${moduleCode}`);

      return {
        success: true,
        oldConfig,
        newConfig: updatedConfig,
        message: 'Konfigürasyon başarıyla güncellendi'
      };

    } catch (error) {
      console.error(`Konfigürasyon güncelleme hatası: ${moduleCode}`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Modül konfigürasyonu getirme
   * @param {string} moduleCode - Modül kodu
   * @param {string} key - Belirli bir anahtar (opsiyonel)
   * @returns {*} Konfigürasyon değeri
   */
  getModuleConfig(moduleCode, key = null) {
    const config = this.configs.get(moduleCode);
    
    if (!config) {
      return null;
    }

    if (key) {
      return this.getNestedValue(config, key);
    }

    return { ...config };
  }

  /**
   * Nested object'ten değer getirme
   * @param {Object} obj - Nesne
   * @param {string} path - Nokta ile ayrılmış yol (örn: "database.host")
   * @returns {*} Değer
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Nested object'e değer ayarlama
   * @param {Object} obj - Nesne
   * @param {string} path - Nokta ile ayrılmış yol
   * @param {*} value - Değer
   */
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    
    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key];
    }, obj);

    target[lastKey] = value;
  }

  /**
   * Belirli bir konfigürasyon anahtarını güncelleme
   * @param {string} moduleCode - Modül kodu
   * @param {string} key - Anahtar (nokta notasyonu desteklenir)
   * @param {*} value - Değer
   * @returns {Object} Güncelleme sonucu
   */
  setModuleConfigValue(moduleCode, key, value) {
    const currentConfig = this.getModuleConfig(moduleCode) || {};
    const newConfig = { ...currentConfig };
    
    this.setNestedValue(newConfig, key, value);
    
    return this.updateModuleConfig(moduleCode, newConfig, false);
  }

  /**
   * Modül konfigürasyonunu varsayılana sıfırlama
   * @param {string} moduleCode - Modül kodu
   * @returns {Object} Sıfırlama sonucu
   */
  resetModuleConfig(moduleCode) {
    const defaultConfig = this.defaultConfigs.get(moduleCode);
    
    if (!defaultConfig) {
      return {
        success: false,
        error: 'Varsayılan konfigürasyon bulunamadı'
      };
    }

    return this.updateModuleConfig(moduleCode, defaultConfig, false);
  }

  /**
   * Konfigürasyon değişiklik dinleyicisi ekleme
   * @param {string} moduleCode - Modül kodu
   * @param {Function} listener - Dinleyici fonksiyonu
   */
  addConfigChangeListener(moduleCode, listener) {
    if (!this.configChangeListeners.has(moduleCode)) {
      this.configChangeListeners.set(moduleCode, []);
    }

    this.configChangeListeners.get(moduleCode).push(listener);
  }

  /**
   * Konfigürasyon değişiklik dinleyicilerini bilgilendirme
   * @param {string} moduleCode - Modül kodu
   * @param {Object} oldConfig - Eski konfigürasyon
   * @param {Object} newConfig - Yeni konfigürasyon
   */
  notifyConfigChange(moduleCode, oldConfig, newConfig) {
    const listeners = this.configChangeListeners.get(moduleCode) || [];
    
    listeners.forEach(listener => {
      try {
        listener(moduleCode, oldConfig, newConfig);
      } catch (error) {
        console.error(`Konfigürasyon dinleyici hatası: ${moduleCode}`, error);
      }
    });
  }

  /**
   * Tüm modül konfigürasyonlarını getirme
   * @returns {Object} Tüm konfigürasyonlar
   */
  getAllConfigs() {
    const allConfigs = {};
    
    for (const [moduleCode, config] of this.configs.entries()) {
      allConfigs[moduleCode] = { ...config };
    }

    return allConfigs;
  }

  /**
   * Konfigürasyon şemasını getirme
   * @param {string} moduleCode - Modül kodu
   * @returns {Object} Konfigürasyon şeması
   */
  getConfigSchema(moduleCode) {
    const defaultConfig = this.defaultConfigs.get(moduleCode);
    const currentConfig = this.configs.get(moduleCode);
    
    if (!defaultConfig) {
      return null;
    }

    return {
      moduleCode,
      defaultConfig: { ...defaultConfig },
      currentConfig: currentConfig ? { ...currentConfig } : null,
      hasValidator: this.configValidators.has(moduleCode),
      hasListeners: this.configChangeListeners.has(moduleCode)
    };
  }

  /**
   * Konfigürasyon doğrulama fonksiyonu örneği
   * @param {Object} config - Doğrulanacak konfigürasyon
   * @returns {Object} Doğrulama sonucu
   */
  static createValidator(schema) {
    return (config) => {
      const errors = [];

      for (const [key, rules] of Object.entries(schema)) {
        const value = config[key];

        // Required kontrolü
        if (rules.required && (value === undefined || value === null)) {
          errors.push(`${key} alanı zorunludur`);
          continue;
        }

        // Type kontrolü
        if (value !== undefined && rules.type) {
          const actualType = Array.isArray(value) ? 'array' : typeof value;
          if (actualType !== rules.type) {
            errors.push(`${key} alanı ${rules.type} tipinde olmalıdır`);
          }
        }

        // Min/Max kontrolü
        if (typeof value === 'number') {
          if (rules.min !== undefined && value < rules.min) {
            errors.push(`${key} minimum ${rules.min} olmalıdır`);
          }
          if (rules.max !== undefined && value > rules.max) {
            errors.push(`${key} maksimum ${rules.max} olmalıdır`);
          }
        }

        // Enum kontrolü
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`${key} şu değerlerden biri olmalıdır: ${rules.enum.join(', ')}`);
        }

        // Custom validator
        if (rules.validator && typeof rules.validator === 'function') {
          const customResult = rules.validator(value);
          if (customResult !== true) {
            errors.push(customResult || `${key} geçersiz değer`);
          }
        }
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    };
  }

  /**
   * Konfigürasyon export/import
   * @param {string} moduleCode - Modül kodu
   * @returns {Object} Export edilebilir konfigürasyon
   */
  exportModuleConfig(moduleCode) {
    const config = this.getModuleConfig(moduleCode);
    const defaultConfig = this.defaultConfigs.get(moduleCode);

    return {
      moduleCode,
      config,
      defaultConfig,
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Konfigürasyon import etme
   * @param {Object} exportedConfig - Export edilmiş konfigürasyon
   * @returns {Object} Import sonucu
   */
  importModuleConfig(exportedConfig) {
    const { moduleCode, config } = exportedConfig;

    if (!moduleCode || !config) {
      return {
        success: false,
        error: 'Geçersiz konfigürasyon formatı'
      };
    }

    return this.updateModuleConfig(moduleCode, config, false);
  }

  /**
   * Konfigürasyon geçmişi (basit implementasyon)
   * @param {string} moduleCode - Modül kodu
   * @param {number} limit - Maksimum kayıt sayısı
   * @returns {Array} Konfigürasyon geçmişi
   */
  getConfigHistory(moduleCode, limit = 10) {
    // Bu implementasyon basit bir örnek
    // Gerçek uygulamada veritabanında saklanmalı
    const historyKey = `${moduleCode}_history`;
    const history = this.configHistory?.get(historyKey) || [];
    
    return history.slice(-limit);
  }

  /**
   * Konfigürasyon durumu özeti
   * @returns {Object} Durum özeti
   */
  getConfigStatus() {
    const totalModules = this.configs.size;
    const modulesWithValidators = this.configValidators.size;
    const modulesWithListeners = this.configChangeListeners.size;

    return {
      totalModules,
      modulesWithValidators,
      modulesWithListeners,
      registeredModules: Array.from(this.configs.keys())
    };
  }
}

module.exports = ModuleConfigManager;