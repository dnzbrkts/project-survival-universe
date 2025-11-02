/**
 * Kimlik Doğrulama Servisi
 * JWT token oluşturma, doğrulama ve kullanıcı yetkilendirme
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role, Permission, UserRole, UserPermission, RolePermission } = require('../models');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  }

  /**
   * Kullanıcı girişi
   * @param {string} identifier - Username veya email
   * @param {string} password - Şifre
   * @returns {Promise<Object>} Giriş sonucu
   */
  async login(identifier, password) {
    try {
      // Kullanıcıyı bul
      const user = await User.findByUsernameOrEmail(identifier);
      
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı',
          code: 'USER_NOT_FOUND'
        };
      }

      // Kullanıcı aktif mi?
      if (!user.isActive) {
        return {
          success: false,
          error: 'Kullanıcı hesabı deaktif',
          code: 'USER_INACTIVE'
        };
      }

      // Şifre kontrolü
      const isPasswordValid = await user.validatePassword(password);
      
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Geçersiz şifre',
          code: 'INVALID_PASSWORD'
        };
      }

      // Son giriş zamanını güncelle
      await user.update({ lastLoginAt: new Date() });

      // Kullanıcı yetkilerini yükle
      const userWithPermissions = await this.loadUserPermissions(user.id);

      // JWT token oluştur
      const tokens = this.generateTokens(userWithPermissions);

      return {
        success: true,
        user: userWithPermissions,
        tokens,
        message: 'Giriş başarılı'
      };

    } catch (error) {
      console.error('Login hatası:', error);
      return {
        success: false,
        error: 'Giriş işlemi sırasında hata oluştu',
        code: 'LOGIN_ERROR'
      };
    }
  }

  /**
   * Kullanıcı kaydı
   * @param {Object} userData - Kullanıcı bilgileri
   * @returns {Promise<Object>} Kayıt sonucu
   */
  async register(userData) {
    try {
      const { username, email, password, firstName, lastName } = userData;

      // Kullanıcı zaten var mı kontrol et
      const existingUser = await User.findOne({
        where: {
          [User.sequelize.Sequelize.Op.or]: [
            { username },
            { email }
          ]
        }
      });

      if (existingUser) {
        return {
          success: false,
          error: 'Kullanıcı adı veya email zaten kullanımda',
          code: 'USER_EXISTS'
        };
      }

      // Yeni kullanıcı oluştur
      const newUser = await User.create({
        username,
        email,
        passwordHash: password, // Hook ile hashlenecek
        firstName,
        lastName
      });

      // Varsayılan rol ata (USER)
      const userRole = await Role.findByCode('USER');
      if (userRole) {
        await UserRole.create({
          userId: newUser.id,
          roleId: userRole.id
        });
      }

      // Kullanıcı yetkilerini yükle
      const userWithPermissions = await this.loadUserPermissions(newUser.id);

      // JWT token oluştur
      const tokens = this.generateTokens(userWithPermissions);

      return {
        success: true,
        user: userWithPermissions,
        tokens,
        message: 'Kayıt başarılı'
      };

    } catch (error) {
      console.error('Register hatası:', error);
      return {
        success: false,
        error: 'Kayıt işlemi sırasında hata oluştu',
        code: 'REGISTER_ERROR'
      };
    }
  }

  /**
   * Token doğrulama
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Doğrulama sonucu
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      
      // Kullanıcı hala aktif mi kontrol et
      const user = await User.findByPk(decoded.userId);
      
      if (!user || !user.isActive) {
        return {
          success: false,
          error: 'Geçersiz token',
          code: 'INVALID_TOKEN'
        };
      }

      // Token oluşturulma zamanı şifre değişikliğinden sonra mı?
      const tokenIssuedAt = new Date(decoded.iat * 1000);
      if (user.passwordChangedAt && tokenIssuedAt < user.passwordChangedAt) {
        return {
          success: false,
          error: 'Token geçersiz (şifre değiştirilmiş)',
          code: 'TOKEN_EXPIRED_PASSWORD_CHANGED'
        };
      }

      // Kullanıcı yetkilerini yükle
      const userWithPermissions = await this.loadUserPermissions(user.id);

      return {
        success: true,
        user: userWithPermissions,
        decoded
      };

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          success: false,
          error: 'Token süresi dolmuş',
          code: 'TOKEN_EXPIRED'
        };
      }

      if (error.name === 'JsonWebTokenError') {
        return {
          success: false,
          error: 'Geçersiz token',
          code: 'INVALID_TOKEN'
        };
      }

      console.error('Token doğrulama hatası:', error);
      return {
        success: false,
        error: 'Token doğrulama hatası',
        code: 'TOKEN_VERIFICATION_ERROR'
      };
    }
  }

  /**
   * Refresh token ile yeni token oluşturma
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} Yenileme sonucu
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtSecret);
      
      if (decoded.type !== 'refresh') {
        return {
          success: false,
          error: 'Geçersiz refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        };
      }

      // Kullanıcıyı yükle
      const user = await User.findByPk(decoded.userId);
      
      if (!user || !user.isActive) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı veya deaktif',
          code: 'USER_NOT_FOUND'
        };
      }

      // Kullanıcı yetkilerini yükle
      const userWithPermissions = await this.loadUserPermissions(user.id);

      // Yeni tokenlar oluştur
      const tokens = this.generateTokens(userWithPermissions);

      return {
        success: true,
        user: userWithPermissions,
        tokens,
        message: 'Token yenilendi'
      };

    } catch (error) {
      console.error('Refresh token hatası:', error);
      return {
        success: false,
        error: 'Token yenileme hatası',
        code: 'REFRESH_TOKEN_ERROR'
      };
    }
  }

  /**
   * Şifre değiştirme
   * @param {number} userId - Kullanıcı ID
   * @param {string} currentPassword - Mevcut şifre
   * @param {string} newPassword - Yeni şifre
   * @returns {Promise<Object>} Değiştirme sonucu
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı',
          code: 'USER_NOT_FOUND'
        };
      }

      // Mevcut şifre kontrolü
      const isCurrentPasswordValid = await user.validatePassword(currentPassword);
      
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          error: 'Mevcut şifre yanlış',
          code: 'INVALID_CURRENT_PASSWORD'
        };
      }

      // Yeni şifre aynı mı kontrol et
      const isSamePassword = await user.validatePassword(newPassword);
      
      if (isSamePassword) {
        return {
          success: false,
          error: 'Yeni şifre mevcut şifre ile aynı olamaz',
          code: 'SAME_PASSWORD'
        };
      }

      // Şifreyi güncelle
      await user.update({ 
        passwordHash: newPassword // Hook ile hashlenecek
      });

      return {
        success: true,
        message: 'Şifre başarıyla değiştirildi'
      };

    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
      return {
        success: false,
        error: 'Şifre değiştirme sırasında hata oluştu',
        code: 'PASSWORD_CHANGE_ERROR'
      };
    }
  }

  /**
   * Kullanıcı yetkilerini yükleme
   * @param {number} userId - Kullanıcı ID
   * @returns {Promise<Object>} Yetkilerle birlikte kullanıcı
   */
  async loadUserPermissions(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: 'roles',
          where: { isActive: true },
          required: false,
          through: {
            where: { isActive: true },
            attributes: []
          },
          include: [{
            model: Permission,
            as: 'permissions',
            where: { isActive: true },
            required: false,
            through: { attributes: [] }
          }]
        },
        {
          model: Permission,
          as: 'permissions',
          where: { isActive: true },
          required: false,
          through: {
            where: { accessType: 'allow' },
            attributes: []
          }
        }
      ]
    });

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Tüm yetkileri topla
    const allPermissions = new Set();

    // Rol bazlı yetkiler
    if (user.roles) {
      user.roles.forEach(role => {
        if (role.permissions) {
          role.permissions.forEach(permission => {
            allPermissions.add(permission.permissionCode);
          });
        }
      });
    }

    // Direkt yetkiler
    if (user.permissions) {
      user.permissions.forEach(permission => {
        allPermissions.add(permission.permissionCode);
      });
    }

    // Kullanıcı nesnesini düzenle
    const userObj = user.toJSON();
    userObj.allPermissions = Array.from(allPermissions);
    userObj.roleNames = user.roles ? user.roles.map(role => role.roleName) : [];
    userObj.roleCodes = user.roles ? user.roles.map(role => role.roleCode) : [];

    return userObj;
  }

  /**
   * JWT tokenları oluşturma
   * @param {Object} user - Kullanıcı bilgileri
   * @returns {Object} Access ve refresh tokenlar
   */
  generateTokens(user) {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      roles: user.roleCodes || [],
      permissions: user.allPermissions || []
    };

    // Access token
    const accessToken = jwt.sign(
      { ...payload, type: 'access' },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn }
    );

    // Refresh token
    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      this.jwtSecret,
      { expiresIn: this.refreshTokenExpiresIn }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.jwtExpiresIn
    };
  }

  /**
   * Şifre hashleme
   * @param {string} password - Şifre
   * @returns {Promise<string>} Hashlenmiş şifre
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  /**
   * Şifre doğrulama
   * @param {string} password - Şifre
   * @param {string} hash - Hash
   * @returns {Promise<boolean>} Doğrulama sonucu
   */
  async validatePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = AuthService;