const { User } = require('./src/models');

async function checkUsers() {
  try {
    const users = await User.findAll();
    console.log('Mevcut kullanıcılar:');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email})`);
    });
  } catch (error) {
    console.error('Hata:', error.message);
  }
  process.exit(0);
}

checkUsers();