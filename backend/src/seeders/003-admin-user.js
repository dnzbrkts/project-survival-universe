/**
 * Seeder: Admin User
 * Varsayılan admin kullanıcısını oluşturur
 */

'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Admin kullanıcısını oluştur
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@isletme-yonetim.com',
        password_hash: hashedPassword,
        first_name: 'Sistem',
        last_name: 'Yöneticisi',
        is_active: true,
        password_changed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    // Admin kullanıcısına SUPER_ADMIN rolünü ata
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE username = 'admin'"
    );
    
    const [roles] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE role_code = 'SUPER_ADMIN'"
    );

    if (users.length > 0 && roles.length > 0) {
      await queryInterface.bulkInsert('user_roles', [
        {
          user_id: users[0].id,
          role_id: roles[0].id,
          starts_at: new Date(),
          expires_at: null,
          is_active: true,
          created_at: new Date()
        }
      ], {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_roles', {
      user_id: {
        [Sequelize.Op.in]: queryInterface.sequelize.literal(
          "(SELECT id FROM users WHERE username = 'admin')"
        )
      }
    }, {});
    
    await queryInterface.bulkDelete('users', {
      username: 'admin'
    }, {});
  }
};