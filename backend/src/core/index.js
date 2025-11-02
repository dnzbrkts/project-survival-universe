/**
 * Core Dinamik Modül Sistemi
 * Tüm core bileşenlerin merkezi export'u
 */

const ModuleRegistry = require('./ModuleRegistry');
const ModuleLoader = require('./ModuleLoader');
const PermissionManager = require('./PermissionManager');
const ModuleConfigManager = require('./ModuleConfigManager');

/**
 * Dinamik Modül Sistemi Ana Sınıfı
 * Tüm core bileşenleri koordine eder
 */
class DynamicModuleSystem {
  constructor(app) {
    this.app = app;
    
    // Core bileşenleri başlat
    this.moduleRegistry = new ModuleRegistry();
    this.moduleLoader = new ModuleLoader(this.moduleRegistry, app);
    this.permissionManager = new PermissionManager(this.moduleRegistry);
    this.configManager = new ModuleConfigManager();
    
    // Sistem durumu
    this.isInitialized = false;
    this.startupTime = null;
  }

  /**
   * Sistemi başlatma
   * @returns {Promise<Object>} Başlatma sonucu
   */
  async initialize() {
    try {
      console.log('Dinamik Modül Sistemi başlatılıyor...');
      this.startupTime = new Date();

      // Temel modülleri kaydet
      await this.registerCoreModules();

      // Aktif modülleri yükle
      const loadResults = await this.moduleLoader.loadAllActiveModules();

      this.isInitialized = true;

      console.log('Dinamik Modül Sistemi başarıyla başlatıldı');

      return {
        success: true,
        startupTime: this.startupTime,
        loadResults,
        message: 'Sistem başarıyla başlatıldı'
      };

    } catch (error) {
      console.error('Dinamik Modül Sistemi başlatma hatası:', error);
      return {
        success: false,
        error: error.message,
        startupTime: this.startupTime
      };
    }
  }

  /**
   * Temel sistem modüllerini kaydetme
   */
  async registerCoreModules() {
    // Sistem Yönetimi Modülü
    this.moduleRegistry.registerModule({
      code: 'SYSTEM',
      name: 'Sistem Yönetimi',
      version: '1.0.0',
      category: 'SISTEM',
      icon: 'settings',
      color: '#607D8B',
      description: 'Sistem ayarları ve modül yönetimi',
      permissions: [
        'system.modules.view',
        'system.modules.activate',
        'system.modules.deactivate',
        'system.modules.configure',
        'system.users.manage',
        'system.roles.manage',
        'system.permissions.manage',
        'system.logs.view'
      ],
      menuItems: [
        {
          title: 'Modül Yönetimi',
          path: '/system/modules',
          permission: 'system.modules.view',
          icon: 'extension'
        },
        {
          title: 'Kullanıcı Yönetimi',
          path: '/system/users',
          permission: 'system.users.manage',
          icon: 'people'
        },
        {
          title: 'Rol Yönetimi',
          path: '/system/roles',
          permission: 'system.roles.manage',
          icon: 'security'
        },
        {
          title: 'Sistem Logları',
          path: '/system/logs',
          permission: 'system.logs.view',
          icon: 'list_alt'
        }
      ]
    });

    // Kimlik Doğrulama Modülü
    this.moduleRegistry.registerModule({
      code: 'AUTH',
      name: 'Kimlik Doğrulama',
      version: '1.0.0',
      category: 'CORE',
      icon: 'lock',
      color: '#F44336',
      description: 'Kullanıcı kimlik doğrulama ve yetkilendirme',
      permissions: [
        'auth.login',
        'auth.logout',
        'auth.profile.view',
        'auth.profile.update',
        'auth.password.change'
      ]
    });

    // Stok Yönetimi Modülü
    const InventoryModule = require('../modules/inventory');
    this.moduleRegistry.registerModule(InventoryModule);

    // Cari Hesap Yönetimi Modülü
    const CustomerModule = require('../modules/customer');
    this.moduleRegistry.registerModule(CustomerModule);

    // Sistem modüllerini aktifleştir
    this.moduleRegistry.setModuleStatus('SYSTEM', 'ACTIVE');
    this.moduleRegistry.setModuleStatus('AUTH', 'ACTIVE');
    this.moduleRegistry.setModuleStatus('INVENTORY', 'ACTIVE');
    this.moduleRegistry.setModuleStatus('CUSTOMER', 'ACTIVE');
  }

  /**
   * Modül aktivasyon/deaktivasyon
   * @param {string} moduleCode - Modül kodu
   * @param {boolean} activate - Aktifleştir mi?
   * @returns {Promise<Object>} İşlem sonucu
   */
  async toggleModule(moduleCode, activate) {
    try {
      if (activate) {
        // Modülü aktifleştir
        const activationResult = this.moduleRegistry.activateModule(moduleCode);
        
        if (!activationResult.success) {
          return activationResult;
        }

        // Modül dosyalarını yükle
        const loadResult = await this.moduleLoader.loadModule(moduleCode);
        
        return {
          success: true,
          action: 'activated',
          module: activationResult.module,
          loadResult,
          message: `Modül aktifleştirildi: ${activationResult.module.name}`
        };

      } else {
        // Modül dosyalarını kaldır
        await this.moduleLoader.unloadModule(moduleCode);
        
        // Modülü deaktifleştir
        const deactivationResult = this.moduleRegistry.deactivateModule(moduleCode);
        
        return {
          success: deactivationResult.success,
          action: 'deactivated',
          module: deactivationResult.module,
          message: deactivationResult.message || `Modül deaktifleştirildi`,
          error: deactivationResult.error
        };
      }

    } catch (error) {
      console.error(`Modül toggle hatası: ${moduleCode}`, error);
      return {
        success: false,
        error: error.message,
        moduleCode
      };
    }
  }

  /**
   * Kullanıcı menüsü oluşturma
   * @param {number} userId - Kullanıcı ID
   * @param {Array} userPermissions - Kullanıcı yetkileri
   * @param {Array} userRoles - Kullanıcı rolleri
   * @returns {Promise<Array>} Dinamik menü
   */
  async generateUserMenu(userId, userPermissions = [], userRoles = []) {
    // Kullanıcı yetkilerini yükle
    this.permissionManager.loadUserPermissions(userId, userPermissions, userRoles);
    
    // Dinamik menü oluştur
    return await this.permissionManager.generateUserMenu(userId);
  }

  /**
   * Sistem durumu
   * @returns {Object} Sistem durumu
   */
  getSystemStatus() {
    return {
      isInitialized: this.isInitialized,
      startupTime: this.startupTime,
      uptime: this.startupTime ? Date.now() - this.startupTime.getTime() : 0,
      moduleRegistry: this.moduleRegistry.getRegistryStatus(),
      loadedComponents: this.moduleLoader.getLoadedComponentsStatus(),
      configManager: this.configManager.getConfigStatus()
    };
  }

  /**
   * Modül bilgileri
   * @param {string} moduleCode - Modül kodu (opsiyonel)
   * @returns {Object|Array} Modül bilgileri
   */
  getModuleInfo(moduleCode = null) {
    if (moduleCode) {
      const module = this.moduleRegistry.getModule(moduleCode);
      if (!module) {
        return null;
      }

      return {
        ...module,
        config: this.configManager.getModuleConfig(moduleCode),
        loadedComponents: this.getModuleLoadedComponents(moduleCode)
      };
    }

    return this.moduleRegistry.getAllModules().map(module => ({
      ...module,
      config: this.configManager.getModuleConfig(module.code),
      loadedComponents: this.getModuleLoadedComponents(module.code)
    }));
  }

  /**
   * Modülün yüklü bileşenlerini getirme
   * @param {string} moduleCode - Modül kodu
   * @returns {Object} Yüklü bileşenler
   */
  getModuleLoadedComponents(moduleCode) {
    const allComponents = this.moduleLoader.getLoadedComponentsStatus();
    const moduleComponents = {
      services: [],
      routes: [],
      models: [],
      serviceInstances: []
    };

    const prefix = `${moduleCode}.`;

    moduleComponents.services = allComponents.services.filter(s => s.startsWith(prefix));
    moduleComponents.routes = allComponents.routes.filter(r => r.startsWith(prefix));
    moduleComponents.models = allComponents.models.filter(m => m.startsWith(prefix));
    moduleComponents.serviceInstances = allComponents.serviceInstances.filter(si => si.startsWith(prefix));

    return moduleComponents;
  }

  /**
   * Middleware'leri getirme
   * @returns {Object} Middleware fonksiyonları
   */
  getMiddlewares() {
    return {
      requirePermissions: this.permissionManager.requirePermissions.bind(this.permissionManager),
      requireModuleAccess: this.permissionManager.requireModuleAccess.bind(this.permissionManager)
    };
  }

  /**
   * Sistem kapatma
   */
  async shutdown() {
    console.log('Dinamik Modül Sistemi kapatılıyor...');
    
    // Tüm aktif modülleri deaktifleştir
    const activeModules = this.moduleRegistry.getActiveModules();
    
    for (const module of activeModules) {
      try {
        await this.moduleLoader.unloadModule(module.code);
        this.moduleRegistry.setModuleStatus(module.code, 'INACTIVE');
      } catch (error) {
        console.error(`Modül kapatma hatası: ${module.code}`, error);
      }
    }

    // Cache'leri temizle
    this.permissionManager.clearAllCache();
    
    this.isInitialized = false;
    console.log('Dinamik Modül Sistemi kapatıldı');
  }
}

module.exports = {
  DynamicModuleSystem,
  ModuleRegistry,
  ModuleLoader,
  PermissionManager,
  ModuleConfigManager
};