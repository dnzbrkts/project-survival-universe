const { User } = require('./src/models');
const bcrypt = require('bcrypt');

async function updateAdminPassword() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Tüm kullanıcıların şifresini güncelle
    const [updatedRowsCount] = await User.update(
      { passwordHash: hashedPassword },
      { where: {} } // Tüm kullanıcılar
    );
    
    console.log(`${updatedRowsCount} kullanıcının şifresi güncellendi: 123456`);
    
    // Kullanıcıları listele
    const users = await User.findAll();
    console.log('\nGiriş yapabileceğiniz kullanıcılar:');
    users.forEach(user => {
      console.log(`- Email: ${user.email}, Şifre: 123456`);
    });
  } catch (error) {
    console.error('Hata:', error.message);
  }
  process.exit(0);
}

updateAdminPassword();