/**
 * Dinamik Modül Yükleme Sistemi
 * Modüllerin runtime'da yüklenmesi ve dependency injection
 */

const path = require('path');
const fs = require('fs').promises;

class ModuleLoader {
  constructor(moduleRegistry, app) {
    this.moduleRegistry = moduleRegistry;
    this.app = app;
    this.loadedServices = new Map();
    this.loadedRoutes = new Map();
    this.loadedModels = new Map();
    this.serviceInstances = new Map();
  }

  /**
   * Modül dosyalarını yükleme
   * @param {string} moduleCode - Modül kodu
   * @returns {Promise<Object>} Yükleme sonucu
   */
  async loadModule(moduleCode) {
    const module = this.moduleRegistry.getModule(moduleCode);
    if (!module) {
      throw new Error(`Modül bulunamadı: ${moduleCode}`);
    }

    if (!this.moduleRegistry.isModuleActive(moduleCode)) {
      throw new Error(`Modül aktif değil: ${moduleCode}`);
    }

    try {
      const loadResult = {
        moduleCode,
        loadedComponents: {
          models: [],
          services: [],
          routes: [],
          middleware: []
        },
        errors: []
      };

      // Modül dizinini kontrol et
      const modulePath = path.join(__dirname, '..', 'modules', moduleCode.toLowerCase());
      
      try {
        await fs.access(modulePath);
      } catch (error) {
        throw new Error(`Modül dizini bulunamadı: ${modulePath}`);
      }

      // Modelleri yükle
      await this.loadModels(moduleCode, modulePath, loadResult);

      // Servisleri yükle
      await this.loadServices(moduleCode, modulePath, loadResult);

      // Route'ları yükle
      await this.loadRoutes(moduleCode, modulePath, loadResult);

      // Middleware'leri yükle
      await this.loadMiddleware(moduleCode, modulePath, loadResult);

      console.log(`Modül yüklendi: ${moduleCode}`, loadResult.loadedComponents);
      return loadResult;

    } catch (error) {
      console.error(`Modül yükleme hatası: ${moduleCode}`, error);
      throw error;
    }
  }

  /**
   * Modül modellerini yükleme
   * @param {string} moduleCode - Modül kodu
   * @param {string} modulePath - Modül dizini
   * @param {Object} loadResult - Yükleme sonucu
   */
  async loadModels(moduleCode, modulePath, loadResult) {
    const modelsPath = path.join(modulePath, 'models');
    
    try {
      const modelFiles = await fs.readdir(modelsPath);
      
      for (const file of modelFiles) {
        if (file.endsWith('.js')) {
          try {
            const modelPath = path.join(modelsPath, file);
            const ModelClass = require(modelPath);
            
            if (typeof ModelClass === 'function') {
              const modelName = path.basename(file, '.js');
              this.loadedModels.set(`${moduleCode}.${modelName}`, ModelClass);
              loadResult.loadedComponents.models.push(modelName);
            }
          } catch (error) {
            loadResult.errors.push(`Model yükleme hatası (${file}): ${error.message}`);
          }
        }
      }
    } catch (error) {
      // Models dizini yoksa hata verme
      if (error.code !== 'ENOENT') {
        loadResult.errors.push(`Models dizini hatası: ${error.message}`);
      }
    }
  }

  /**
   * Modül servislerini yükleme
   * @param {string} moduleCode - Modül kodu
   * @param {string} modulePath - Modül dizini
   * @param {Object} loadResult - Yükleme sonucu
   */
  async loadServices(moduleCode, modulePath, loadResult) {
    const servicesPath = path.join(modulePath, 'services');
    
    try {
      const serviceFiles = await fs.readdir(servicesPath);
      
      for (const file of serviceFiles) {
        if (file.endsWith('.js')) {
          try {
            const servicePath = path.join(servicesPath, file);
            const ServiceClass = require(servicePath);
            
            if (typeof ServiceClass === 'function') {
              const serviceName = path.basename(file, '.js');
              const serviceKey = `${moduleCode}.${serviceName}`;
              
              this.loadedServices.set(serviceKey, ServiceClass);
              loadResult.loadedComponents.services.push(serviceName);
            }
          } catch (error) {
            loadResult.errors.push(`Servis yükleme hatası (${file}): ${error.message}`);
          }
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        loadResult.errors.push(`Services dizini hatası: ${error.message}`);
      }
    }
  }

  /**
   * Modül route'larını yükleme
   * @param {string} moduleCode - Modül kodu
   * @param {string} modulePath - Modül dizini
   * @param {Object} loadResult - Yükleme sonucu
   */
  async loadRoutes(moduleCode, modulePath, loadResult) {
    const routesPath = path.join(modulePath, 'routes');
    
    try {
      const routeFiles = await fs.readdir(routesPath);
      
      for (const file of routeFiles) {
        if (file.endsWith('.js')) {
          try {
            const routePath = path.join(routesPath, file);
            const routeHandler = require(routePath);
            
            if (typeof routeHandler === 'function') {
              const routeName = path.basename(file, '.js');
              const routeKey = `${moduleCode}.${routeName}`;
              
              // Route'u Express app'e kaydet
              const basePath = `/api/${moduleCode.toLowerCase()}`;
              this.app.use(basePath, routeHandler);
              
              this.loadedRoutes.set(routeKey, {
                handler: routeHandler,
                basePath,
                file: routePath
              });
              
              loadResult.loadedComponents.routes.push(routeName);
            }
          } catch (error) {
            loadResult.errors.push(`Route yükleme hatası (${file}): ${error.message}`);
          }
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        loadResult.errors.push(`Routes dizini hatası: ${error.message}`);
      }
    }
  }

  /**
   * Modül middleware'lerini yükleme
   * @param {string} moduleCode - Modül kodu
   * @param {string} modulePath - Modül dizini
   * @param {Object} loadResult - Yükleme sonucu
   */
  async loadMiddleware(moduleCode, modulePath, loadResult) {
    const middlewarePath = path.join(modulePath, 'middleware');
    
    try {
      const middlewareFiles = await fs.readdir(middlewarePath);
      
      for (const file of middlewareFiles) {
        if (file.endsWith('.js')) {
          try {
            const mwPath = path.join(middlewarePath, file);
            const middleware = require(mwPath);
            
            if (typeof middleware === 'function') {
              const middlewareName = path.basename(file, '.js');
              loadResult.loadedComponents.middleware.push(middlewareName);
            }
          } catch (error) {
            loadResult.errors.push(`Middleware yükleme hatası (${file}): ${error.message}`);
          }
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        loadResult.errors.push(`Middleware dizini hatası: ${error.message}`);
      }
    }
  }

  /**
   * Modülü kaldırma
   * @param {string} moduleCode - Modül kodu
   */
  async unloadModule(moduleCode) {
    try {
      // Route'ları kaldır
      const routesToRemove = [];
      for (const [key, route] of this.loadedRoutes.entries()) {
        if (key.startsWith(`${moduleCode}.`)) {
          routesToRemove.push(key);
        }
      }

      routesToRemove.forEach(key => {
        this.loadedRoutes.delete(key);
      });

      // Servisleri kaldır
      const servicesToRemove = [];
      for (const [key] of this.loadedServices.entries()) {
        if (key.startsWith(`${moduleCode}.`)) {
          servicesToRemove.push(key);
        }
      }

      servicesToRemove.forEach(key => {
        this.loadedServices.delete(key);
        this.serviceInstances.delete(key);
      });

      // Modelleri kaldır
      const modelsToRemove = [];
      for (const [key] of this.loadedModels.entries()) {
        if (key.startsWith(`${moduleCode}.`)) {
          modelsToRemove.push(key);
        }
      }

      modelsToRemove.forEach(key => {
        this.loadedModels.delete(key);
      });

      // Require cache'i temizle
      const moduleBasePath = path.join(__dirname, '..', 'modules', moduleCode.toLowerCase());
      Object.keys(require.cache).forEach(key => {
        if (key.startsWith(moduleBasePath)) {
          delete require.cache[key];
        }
      });

      console.log(`Modül kaldırıldı: ${moduleCode}`);
      
      return {
        success: true,
        removedRoutes: routesToRemove.length,
        removedServices: servicesToRemove.length,
        removedModels: modelsToRemove.length
      };

    } catch (error) {
      console.error(`Modül kaldırma hatası: ${moduleCode}`, error);
      throw error;
    }
  }

  /**
   * Servis instance'ı getirme (Dependency Injection)
   * @param {string} serviceKey - Servis anahtarı (moduleCode.serviceName)
   * @param {Object} dependencies - Bağımlılıklar
   * @returns {Object} Servis instance'ı
   */
  getServiceInstance(serviceKey, dependencies = {}) {
    // Önce cache'den kontrol et
    if (this.serviceInstances.has(serviceKey)) {
      return this.serviceInstances.get(serviceKey);
    }

    const ServiceClass = this.loadedServices.get(serviceKey);
    if (!ServiceClass) {
      throw new Error(`Servis bulunamadı: ${serviceKey}`);
    }

    try {
      const instance = new ServiceClass(dependencies);
      this.serviceInstances.set(serviceKey, instance);
      return instance;
    } catch (error) {
      throw new Error(`Servis instance oluşturma hatası: ${serviceKey} - ${error.message}`);
    }
  }

  /**
   * Model sınıfı getirme
   * @param {string} modelKey - Model anahtarı (moduleCode.modelName)
   * @returns {Function} Model sınıfı
   */
  getModel(modelKey) {
    const ModelClass = this.loadedModels.get(modelKey);
    if (!ModelClass) {
      throw new Error(`Model bulunamadı: ${modelKey}`);
    }
    return ModelClass;
  }

  /**
   * Yüklü bileşenlerin durumunu getirme
   * @returns {Object} Yüklü bileşenler durumu
   */
  getLoadedComponentsStatus() {
    return {
      services: Array.from(this.loadedServices.keys()),
      routes: Array.from(this.loadedRoutes.keys()),
      models: Array.from(this.loadedModels.keys()),
      serviceInstances: Array.from(this.serviceInstances.keys())
    };
  }

  /**
   * Tüm aktif modülleri yükleme
   * @returns {Promise<Array>} Yükleme sonuçları
   */
  async loadAllActiveModules() {
    const activeModules = this.moduleRegistry.getActiveModules();
    const results = [];

    for (const module of activeModules) {
      try {
        const result = await this.loadModule(module.code);
        results.push(result);
      } catch (error) {
        results.push({
          moduleCode: module.code,
          error: error.message,
          success: false
        });
      }
    }

    return results;
  }
}

module.exports = ModuleLoader;