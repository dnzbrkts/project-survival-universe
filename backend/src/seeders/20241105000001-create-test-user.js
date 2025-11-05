'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Test kullanıcısı için şifre hash'le
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Test kullanıcısı oluştur
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@test.com',
        password_hash: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'test',
        email: 'test@test.com',
        password_hash: hashedPassword,
        first_name: 'Test',
        last_name: 'User',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    // Test rolü oluştur
    await queryInterface.bulkInsert('roles', [
      {
        role_code: 'ADMIN',
        role_name: 'Administrator',
        description: 'Sistem yöneticisi',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_code: 'USER',
        role_name: 'User',
        description: 'Normal kullanıcı',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: ['admin@test.com', 'test@test.com']
    }, {});
    
    await queryInterface.bulkDelete('roles', {
      role_code: ['ADMIN', 'USER']
    }, {});
  }
};