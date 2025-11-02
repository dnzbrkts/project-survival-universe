'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE VIEW current_stock_levels AS
      SELECT 
        p.id as product_id,
        p.product_code,
        p.product_name,
        COALESCE(SUM(CASE 
          WHEN sm.movement_type IN ('in', 'adjustment') THEN sm.quantity 
          WHEN sm.movement_type IN ('out') THEN -sm.quantity 
          ELSE 0 
        END), 0) as current_stock,
        p.critical_stock_level,
        CASE 
          WHEN COALESCE(SUM(CASE 
            WHEN sm.movement_type IN ('in', 'adjustment') THEN sm.quantity 
            WHEN sm.movement_type IN ('out') THEN -sm.quantity 
            ELSE 0 
          END), 0) <= p.critical_stock_level 
          THEN true 
          ELSE false 
        END as is_critical
      FROM products p
      LEFT JOIN stock_movements sm ON p.id = sm.product_id
      WHERE p.is_active = true
      GROUP BY p.id, p.product_code, p.product_name, p.critical_stock_level;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP VIEW IF EXISTS current_stock_levels;');
  }
};