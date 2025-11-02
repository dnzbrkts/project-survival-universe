/**
 * Dinamik Modül Registry Sistemi
 * Modüllerin kayıt edilmesi, yönetilmesi ve erişim kontrolü
 */

class ModuleRegistry {
  constructor() {
    this.modules = new Map();
    this.moduleConfigs = new Map();
    this.dependencies = new Map();
    this.loadedModules = new Set();
  }

  /**
   * Modül kayıt etme
   * @param {Object} moduleDefinition - Modül tanımı
   */
  registerModule(moduleDefinition) {
    const {
      code,
      name,
      version,
      category,
      icon,
      color,
      description,
      dependencies = [],
      permissions = [],
      routes = [],
      menuItems = [],
      services = [],
      models = []
    } = moduleDefinition;

    if (!code || !name) {
      throw new Error('Modül kodu ve adı zorunludur');
    }

    if (this.modules.has(code)) {
      throw new Error(`Modül zaten kayıtlı: ${code}`);
    }

    const module = {
      code,
      name,
      version: version || '1.0.0',
      category: category || 'GENERAL',
      icon: icon || 'default',
      color: color || '#666666',
      description: description || '',
      dependencies,
      permissions,
      routes,
      menuItems,
      services,
      models,
      status: 'INACTIVE',
      registeredAt: new Date(),
      lastActivatedAt: null
    };

    this.modules.set(code, module);
    this.dependencies.set(code, dependencies);

    console.log(`Modül kayıt edildi: ${code} (${name})`);
    return module;
  }

  /**
   * Modül durumunu güncelleme
   * @param {string} moduleCode - Modül kodu
   * @param {string} status - Yeni durum (ACTIVE, INACTIVE, MAINTENANCE, TRIAL, EXPIRED)
   */
  setModuleStatus(moduleCode, status) {
    const validStatuses = ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'TRIAL', 'EXPIRED'];
    
    if (!validStatuses.includes(status)) {
      throw new Error(`Geçersiz modül durumu: ${status}`);
    }

    const module = this.modules.get(moduleCode);
    if (!module) {
      throw new Error(`Modül bulunamadı: ${moduleCode}`);
    }

    const oldStatus = module.status;
    module.status = status;

    if (status === 'ACTIVE') {
      module.lastActivatedAt = new Date();
      this.loadedModules.add(moduleCode);
    } else {
      this.loadedModules.delete(moduleCode);
    }

    console.log(`Modül durumu güncellendi: ${moduleCode} (${oldStatus} -> ${status})`);
    return module;
  }

  /**
   * Modül bağımlılıklarını kontrol etme
   * @param {string} moduleCode - Modül kodu
   * @returns {Object} Bağımlılık kontrolü sonucu
   */
  checkDependencies(moduleCode) {
    const dependencies = this.dependencies.get(moduleCode) || [];
    const missingDependencies = [];
    const inactiveDependencies = [];

    for (const depCode of dependencies) {
      const depModule = this.modules.get(depCode);
      
      if (!depModule) {
        missingDependencies.push(depCode);
      } else if (depModule.status !== 'ACTIVE') {
        inactiveDependencies.push(depCode);
      }
    }

    return {
      canActivate: missingDependencies.length === 0 && inactiveDependencies.length === 0,
      missingDependencies,
      inactiveDependencies
    };
  }

  /**
   * Modülü aktifleştirme
   * @param {string} moduleCode - Modül kodu
   * @returns {Object} Aktivasyon sonucu
   */
  activateModule(moduleCode) {
    const module = this.modules.get(moduleCode);
    if (!module) {
      throw new Error(`Modül bulunamadı: ${moduleCode}`);
    }

    // Bağımlılık kontrolü
    const depCheck = this.checkDependencies(moduleCode);
    if (!depCheck.canActivate) {
      return {
        success: false,
        error: 'Bağımlılık hatası',
        missingDependencies: depCheck.missingDependencies,
        inactiveDependencies: depCheck.inactiveDependencies
      };
    }

    this.setModuleStatus(moduleCode, 'ACTIVE');

    return {
      success: true,
      module: module,
      message: `Modül aktifleştirildi: ${module.name}`
    };
  }

  /**
   * Modülü deaktifleştirme
   * @param {string} moduleCode - Modül kodu
   */
  deactivateModule(moduleCode) {
    const module = this.modules.get(moduleCode);
    if (!module) {
      throw new Error(`Modül bulunamadı: ${moduleCode}`);
    }

    // Bu modüle bağımlı olan aktif modülleri kontrol et
    const dependentModules = this.getDependentModules(moduleCode);
    const activeDependents = dependentModules.filter(dep => 
      this.modules.get(dep).status === 'ACTIVE'
    );

    if (activeDependents.length > 0) {
      return {
        success: false,
        error: 'Bağımlı modüller var',
        dependentModules: activeDependents
      };
    }

    this.setModuleStatus(moduleCode, 'INACTIVE');

    return {
      success: true,
      module: module,
      message: `Modül deaktifleştirildi: ${module.name}`
    };
  }

  /**
   * Bir modüle bağımlı olan modülleri bulma
   * @param {string} moduleCode - Modül kodu
   * @returns {Array} Bağımlı modül kodları
   */
  getDependentModules(moduleCode) {
    const dependents = [];
    
    for (const [code, deps] of this.dependencies.entries()) {
      if (deps.includes(moduleCode)) {
        dependents.push(code);
      }
    }

    return dependents;
  }

  /**
   * Aktif modülleri getirme
   * @returns {Array} Aktif modüller
   */
  getActiveModules() {
    const activeModules = [];
    
    for (const [code, module] of this.modules.entries()) {
      if (module.status === 'ACTIVE') {
        activeModules.push(module);
      }
    }

    return activeModules.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Tüm modülleri getirme
   * @returns {Array} Tüm modüller
   */
  getAllModules() {
    return Array.from(this.modules.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Modül bilgisi getirme
   * @param {string} moduleCode - Modül kodu
   * @returns {Object|null} Modül bilgisi
   */
  getModule(moduleCode) {
    return this.modules.get(moduleCode) || null;
  }

  /**
   * Modül aktif mi kontrol etme
   * @param {string} moduleCode - Modül kodu
   * @returns {boolean} Aktif durumu
   */
  isModuleActive(moduleCode) {
    const module = this.modules.get(moduleCode);
    return module && module.status === 'ACTIVE';
  }

  /**
   * Kategoriye göre modülleri getirme
   * @param {string} category - Kategori
   * @returns {Array} Kategorideki modüller
   */
  getModulesByCategory(category) {
    const modules = [];
    
    for (const [code, module] of this.modules.entries()) {
      if (module.category === category) {
        modules.push(module);
      }
    }

    return modules.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Modül konfigürasyonu ayarlama
   * @param {string} moduleCode - Modül kodu
   * @param {Object} config - Konfigürasyon
   */
  setModuleConfig(moduleCode, config) {
    if (!this.modules.has(moduleCode)) {
      throw new Error(`Modül bulunamadı: ${moduleCode}`);
    }

    this.moduleConfigs.set(moduleCode, {
      ...this.moduleConfigs.get(moduleCode),
      ...config,
      updatedAt: new Date()
    });
  }

  /**
   * Modül konfigürasyonu getirme
   * @param {string} moduleCode - Modül kodu
   * @returns {Object} Konfigürasyon
   */
  getModuleConfig(moduleCode) {
    return this.moduleConfigs.get(moduleCode) || {};
  }

  /**
   * Registry durumunu getirme
   * @returns {Object} Registry durumu
   */
  getRegistryStatus() {
    const totalModules = this.modules.size;
    const activeModules = this.getActiveModules().length;
    const categories = new Set();
    
    for (const module of this.modules.values()) {
      categories.add(module.category);
    }

    return {
      totalModules,
      activeModules,
      inactiveModules: totalModules - activeModules,
      categories: Array.from(categories),
      loadedModules: Array.from(this.loadedModules)
    };
  }
}

module.exports = ModuleRegistry;