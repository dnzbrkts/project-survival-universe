/**
 * Frontend Dinamik Modül Sistemi
 * React bileşenlerinin dinamik yüklenmesi ve yönetimi
 */

import { lazy, ComponentType, ReactNode } from 'react';

// Modül tanımı interface'i
export interface ModuleDefinition {
  code: string;
  name: string;
  version: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'TRIAL' | 'EXPIRED';
  permissions: string[];
  routes: ModuleRoute[];
  menuItems: MenuItem[];
}

// Route tanımı
export interface ModuleRoute {
  path: string;
  component: string;
  exact?: boolean;
  permissions?: string[];
}

// Menü öğesi tanımı
export interface MenuItem {
  title: string;
  path: string;
  icon?: string;
  permission?: string;
  children?: MenuItem[];
}

// Yüklü bileşen cache'i
const componentCache = new Map<string, ComponentType<any>>();

// Modül registry
const moduleRegistry = new Map<string, ModuleDefinition>();

// Aktif modüller
const activeModules = new Set<string>();

/**
 * Modül Registry Sınıfı
 */
export class FrontendModuleRegistry {
  /**
   * Modül kaydetme
   */
  static registerModule(module: ModuleDefinition): void {
    moduleRegistry.set(module.code, module);
    
    if (module.status === 'ACTIVE') {
      activeModules.add(module.code);
    }

    console.log(`Frontend modül kayıt edildi: ${module.code}`);
  }

  /**
   * Modül durumunu güncelleme
   */
  static setModuleStatus(moduleCode: string, status: ModuleDefinition['status']): void {
    const module = moduleRegistry.get(moduleCode);
    if (!module) {
      throw new Error(`Modül bulunamadı: ${moduleCode}`);
    }

    module.status = status;

    if (status === 'ACTIVE') {
      activeModules.add(moduleCode);
    } else {
      activeModules.delete(moduleCode);
    }
  }

  /**
   * Aktif modülleri getirme
   */
  static getActiveModules(): ModuleDefinition[] {
    return Array.from(activeModules)
      .map(code => moduleRegistry.get(code))
      .filter(Boolean) as ModuleDefinition[];
  }

  /**
   * Tüm modülleri getirme
   */
  static getAllModules(): ModuleDefinition[] {
    return Array.from(moduleRegistry.values());
  }

  /**
   * Modül bilgisi getirme
   */
  static getModule(moduleCode: string): ModuleDefinition | undefined {
    return moduleRegistry.get(moduleCode);
  }

  /**
   * Modül aktif mi kontrol etme
   */
  static isModuleActive(moduleCode: string): boolean {
    return activeModules.has(moduleCode);
  }
}

/**
 * Dinamik Bileşen Yükleyici
 */
export class DynamicComponentLoader {
  /**
   * Bileşen yükleme
   */
  static loadComponent(moduleCode: string, componentName: string): ComponentType<any> | null {
    const cacheKey = `${moduleCode}.${componentName}`;
    
    // Cache'den kontrol et
    if (componentCache.has(cacheKey)) {
      return componentCache.get(cacheKey)!;
    }

    try {
      // Dinamik import ile bileşeni yükle
      const component = lazy(() => 
        import(`../modules/${moduleCode.toLowerCase()}/${componentName}`)
          .catch(() => import(`../modules/${moduleCode.toLowerCase()}/index`))
      );

      componentCache.set(cacheKey, component);
      return component;

    } catch (error) {
      console.error(`Bileşen yükleme hatası: ${cacheKey}`, error);
      return null;
    }
  }

  /**
   * Modül bileşenlerini toplu yükleme
   */
  static async loadModuleComponents(moduleCode: string): Promise<void> {
    const module = FrontendModuleRegistry.getModule(moduleCode);
    if (!module) {
      throw new Error(`Modül bulunamadı: ${moduleCode}`);
    }

    // Route bileşenlerini yükle
    for (const route of module.routes) {
      this.loadComponent(moduleCode, route.component);
    }
  }

  /**
   * Cache'i temizleme
   */
  static clearCache(moduleCode?: string): void {
    if (moduleCode) {
      const keysToDelete = Array.from(componentCache.keys())
        .filter(key => key.startsWith(`${moduleCode}.`));
      
      keysToDelete.forEach(key => componentCache.delete(key));
    } else {
      componentCache.clear();
    }
  }
}

/**
 * Yetki Yönetimi
 */
export class FrontendPermissionManager {
  private static userPermissions = new Set<string>();
  private static userRoles = new Set<string>();

  /**
   * Kullanıcı yetkilerini yükleme
   */
  static loadUserPermissions(permissions: string[], roles: string[]): void {
    this.userPermissions = new Set(permissions);
    this.userRoles = new Set(roles);
  }

  /**
   * Yetki kontrolü
   */
  static hasPermission(permission: string): boolean {
    return this.userPermissions.has(permission);
  }

  /**
   * Çoklu yetki kontrolü (AND)
   */
  static hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(perm => this.userPermissions.has(perm));
  }

  /**
   * Çoklu yetki kontrolü (OR)
   */
  static hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(perm => this.userPermissions.has(perm));
  }

  /**
   * Modül erişim kontrolü
   */
  static hasModuleAccess(moduleCode: string): boolean {
    const module = FrontendModuleRegistry.getModule(moduleCode);
    if (!module || !FrontendModuleRegistry.isModuleActive(moduleCode)) {
      return false;
    }

    if (module.permissions.length === 0) {
      return true;
    }

    return this.hasAnyPermission(module.permissions);
  }

  /**
   * Route erişim kontrolü
   */
  static hasRouteAccess(moduleCode: string, routePath: string): boolean {
    if (!this.hasModuleAccess(moduleCode)) {
      return false;
    }

    const module = FrontendModuleRegistry.getModule(moduleCode);
    if (!module) {
      return false;
    }

    const route = module.routes.find(r => r.path === routePath);
    if (!route || !route.permissions) {
      return true;
    }

    return this.hasAllPermissions(route.permissions);
  }
}

/**
 * Dinamik Menü Oluşturucu
 */
export class DynamicMenuGenerator {
  /**
   * Kullanıcı menüsü oluşturma
   */
  static generateUserMenu(): MenuItem[] {
    const activeModules = FrontendModuleRegistry.getActiveModules();
    const userMenu: MenuItem[] = [];

    for (const module of activeModules) {
      // Modül erişimi kontrol et
      if (!FrontendPermissionManager.hasModuleAccess(module.code)) {
        continue;
      }

      const moduleMenu: MenuItem = {
        title: module.name,
        path: `/${module.code.toLowerCase()}`,
        icon: module.icon,
        children: []
      };

      // Menü öğelerini kontrol et
      for (const menuItem of module.menuItems) {
        if (menuItem.permission && !FrontendPermissionManager.hasPermission(menuItem.permission)) {
          continue;
        }

        moduleMenu.children!.push({
          title: menuItem.title,
          path: menuItem.path,
          icon: menuItem.icon,
          permission: menuItem.permission
        });
      }

      // Alt menü varsa ana menüyü ekle
      if (moduleMenu.children!.length > 0) {
        userMenu.push(moduleMenu);
      }
    }

    return this.groupMenuByCategory(userMenu);
  }

  /**
   * Menüyü kategoriye göre gruplama
   */
  private static groupMenuByCategory(menu: MenuItem[]): MenuItem[] {
    const activeModules = FrontendModuleRegistry.getActiveModules();
    const categories = new Map<string, MenuItem[]>();

    // Modülleri kategoriye göre grupla
    for (const module of activeModules) {
      if (!FrontendPermissionManager.hasModuleAccess(module.code)) {
        continue;
      }

      const category = module.category || 'GENERAL';
      if (!categories.has(category)) {
        categories.set(category, []);
      }

      const menuItem = menu.find(item => 
        item.path === `/${module.code.toLowerCase()}`
      );

      if (menuItem) {
        categories.get(category)!.push(menuItem);
      }
    }

    // Kategorileri sırala
    const sortedCategories = Array.from(categories.entries()).sort(([a], [b]) => {
      const order: Record<string, number> = {
        'CORE': 1,
        'OPERASYON': 2,
        'SATIS': 3,
        'MUHASEBE': 4,
        'IK': 5,
        'ENTEGRASYON': 6,
        'SISTEM': 7,
        'GENERAL': 8
      };
      return (order[a] || 9) - (order[b] || 9);
    });

    // Düz menü listesi oluştur
    const result: MenuItem[] = [];
    for (const [category, items] of sortedCategories) {
      result.push(...items);
    }

    return result;
  }
}

/**
 * Modül Durumu Hook'u için tip
 */
export interface ModuleSystemState {
  modules: ModuleDefinition[];
  activeModules: ModuleDefinition[];
  userMenu: MenuItem[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Ana Modül Sistemi Sınıfı
 */
export class FrontendModuleSystem {
  private static isInitialized = false;

  /**
   * Sistemi başlatma
   */
  static async initialize(modules: ModuleDefinition[]): Promise<void> {
    try {
      console.log('Frontend Modül Sistemi başlatılıyor...');

      // Modülleri kaydet
      for (const module of modules) {
        FrontendModuleRegistry.registerModule(module);
      }

      // Aktif modül bileşenlerini yükle
      const activeModules = FrontendModuleRegistry.getActiveModules();
      for (const module of activeModules) {
        try {
          await DynamicComponentLoader.loadModuleComponents(module.code);
        } catch (error) {
          console.warn(`Modül bileşenleri yüklenemedi: ${module.code}`, error);
        }
      }

      this.isInitialized = true;
      console.log('Frontend Modül Sistemi başarıyla başlatıldı');

    } catch (error) {
      console.error('Frontend Modül Sistemi başlatma hatası:', error);
      throw error;
    }
  }

  /**
   * Kullanıcı oturumunu başlatma
   */
  static initializeUserSession(permissions: string[], roles: string[]): MenuItem[] {
    FrontendPermissionManager.loadUserPermissions(permissions, roles);
    return DynamicMenuGenerator.generateUserMenu();
  }

  /**
   * Sistem durumu
   */
  static getSystemStatus(): {
    isInitialized: boolean;
    totalModules: number;
    activeModules: number;
    loadedComponents: number;
  } {
    return {
      isInitialized: this.isInitialized,
      totalModules: FrontendModuleRegistry.getAllModules().length,
      activeModules: FrontendModuleRegistry.getActiveModules().length,
      loadedComponents: componentCache.size
    };
  }

  /**
   * Modül toggle
   */
  static async toggleModule(moduleCode: string, activate: boolean): Promise<void> {
    const status = activate ? 'ACTIVE' : 'INACTIVE';
    FrontendModuleRegistry.setModuleStatus(moduleCode, status);

    if (activate) {
      await DynamicComponentLoader.loadModuleComponents(moduleCode);
    } else {
      DynamicComponentLoader.clearCache(moduleCode);
    }
  }
}

// Export edilen ana objeler
export {
  FrontendModuleRegistry as ModuleRegistry,
  DynamicComponentLoader as ComponentLoader,
  FrontendPermissionManager as PermissionManager,
  DynamicMenuGenerator as MenuGenerator,
  FrontendModuleSystem as ModuleSystem
};