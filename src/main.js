/*
  ✅ Phaser config: Oyunun “motor ayarları”.
  Burada çözünürlük, fizik, sahne, arka plan rengi gibi şeyleri seçiyoruz.

  KRİTİK: Buradaki ayarlar oyunun performansını, hissini ve ölçeklenmesini etkiler.
*/
const config = {
  type: Phaser.AUTO,       // AUTO: tarayıcı WebGL destekliyorsa WebGL, yoksa Canvas kullanır.
  parent: "game",          // index.html’deki <div id="game"> içine canvas’ı koy.
  width: 1280,              // oyun genişliği
  height: 720,             // oyun yüksekliği
  backgroundColor: "#1a1a1a",

  /*
    ✅ Physics: arcade fizik (basit ve hızlı).
    KRİTİK: Başlangıç için arcade physics en iyi seçim.
    Çünkü:
    - hızlı öğrenilir
    - performanslı
    - top-down oyun için yeterli
  */
  physics: {
    default: "arcade",
    arcade: { debug: false }  // debug true olursa collider çizgilerini görürsün (öğrenirken faydalı)
  },

  /*
    ✅ Scene: Phaser’ın oyun akışı.
    preload: asset yükleme (resim/ses)
    create: sahneyi kurma (objeleri oluşturma)
    update: her frame çalışır (hareket, AI vs)
    
    KRİTİK: Phaser projelerinde bu 3 fonksiyon “çekirdek yapı”dır.
  */
  scene: { preload, create, update }
};

// ✅ Oyunu başlatan satır. Bunu koymazsan oyun hiç çalışmaz.
const game = new Phaser.Game(config);

/*
  Aşağıdaki değişkenleri "global" tuttuk.
  Yeni başlayanlar için basit.
  İleride büyüdüğünde Scene class yapısına taşıyabiliriz.
*/
let player, zombie, loot, cursors, wasd, infoText;

function preload() {
  /*
    Şu an resim/ses yüklemiyoruz; kare şekiller çiziyoruz.
    KRİTİK: Placeholder ile başlamak doğru strateji.
    Asset aramak/çizmek zaman öldürür.
  */
}

function create() {
  /*
    ✅ Player: Basit beyaz kare.
    this.add.rectangle(x,y,width,height,color)

    KRİTİK: Şu an sprite yerine rectangle kullanıyoruz.
    Çünkü hızlı prototip.
  */
  player = this.add.rectangle(200, 200, 26, 26, 0xffffff);

  /*
    ✅ rectangle bir "görsel" nesne; ama fizik yok.
    Fizik eklemek için physics.add.existing(obj)
    Bu, objeye arcade physics body ekler.
    
    KRİTİK: Hareket/çarpışma/overlap istiyorsan fizik body şart.
  */
  this.physics.add.existing(player);

  /*
    ✅ Dünya sınırları dışına çıkmasın diye.
    KRİTİK: Yoksa ekran dışına gider kaybolur.
  */
  player.body.setCollideWorldBounds(true);

  // ✅ Zombie: kırmızı kare
  zombie = this.add.rectangle(600, 300, 26, 26, 0xff4444);
  this.physics.add.existing(zombie);
  zombie.body.setCollideWorldBounds(true);

  // ✅ Loot: sarı küçük kare
  loot = this.add.rectangle(450, 200, 18, 18, 0xffcc00);
  this.physics.add.existing(loot);

  /*
    ✅ loot sabit dursun diye immovable.
    KRİTİK: Eğer immovable yapmazsak player çarptığında loot fiziksel olarak itilebilir.
    Loot pickup için genelde “sabit obje” olmasını istersin.
  */
  loot.body.setImmovable(true);

  /*
    ✅ Input: klavye kontrolleri.
    createCursorKeys(): ok tuşları
    addKeys("W,A,S,D"): WASD
    
    KRİTİK: Input olmadan hareket yok.
  */
  cursors = this.input.keyboard.createCursorKeys();
  wasd = this.input.keyboard.addKeys("W,A,S,D");

  /*
    ✅ Overlap: player ile loot birbirine değince tetiklenir.
    physics.add.overlap(obj1, obj2, callback)

    KRİTİK: Loot almak gibi şeyler "collision" değil "trigger/overlap" olur.
    Çünkü çarpışma ile durdurmak istemezsin, sadece “tetiklemek” istersin.
  */
  this.physics.add.overlap(player, loot, () => {
    loot.destroy();                 // loot'u yok et (alındı gibi)
    infoText.setText("Loot aldın!");// ekranda mesaj göster
  });

  // ✅ Basit UI metni
  infoText = this.add.text(
    16, 16,
    "WASD: Hareket | Loot'a dokun",
    { fontSize: "16px", color: "#ddd" }
  );

  /*
    ✅ World bounds: fizik dünyasının sınırı.
    KRİTİK: setCollideWorldBounds true olan objeler bu sınırdan çıkamaz.
  */
  this.physics.world.setBounds(0, 0, width, height);
}

function update() {
  /*
    ✅ Player movement:
    vx, vy hız bileşenleri.
    speed = saniyedeki pixel hızı gibi düşünebilirsin.

    KRİTİK: update içinde input okunur, fixed timestep gibi düşün.
    Arcade physics’te genelde update yeterli olur.
  */
  const speed = 180;
  let vx = 0, vy = 0;

  // Sol/Sağ
  if (cursors.left.isDown || wasd.A.isDown) vx = -speed;
  else if (cursors.right.isDown || wasd.D.isDown) vx = speed;

  // Yukarı/Aşağı
  if (cursors.up.isDown || wasd.W.isDown) vy = -speed;
  else if (cursors.down.isDown || wasd.S.isDown) vy = speed;

  // ✅ velocity set
  player.body.setVelocity(vx, vy);

  /*
    ✅ normalize:
    Diagonal (W+D) basınca hız 2 kat olmasın diye normalize ediyoruz.
    KRİTİK: Bu “oyun hissi” için çok önemlidir.
    Yoksa çapraz giderken daha hızlı olur, oyun kötü hisseder.
  */
  player.body.velocity.normalize().scale(speed);

  /*
    ✅ Zombie follow:
    Zombie oyuncuya doğru vektör çıkarır, normalize eder, hız uygular.

    KRİTİK: Bu AI’nın en temel hali.
    İleride buraya:
    - görüş mesafesi
    - engel varsa dolaşma
    - saldırı mesafesi
    - “ses” sistemi
    ekleyeceğiz.
  */
  const zSpeed = 90;
  const dx = player.x - zombie.x;
  const dy = player.y - zombie.y;

  // hypot: sqrt(dx^2 + dy^2)
  const len = Math.hypot(dx, dy) || 1;

  zombie.body.setVelocity((dx / len) * zSpeed, (dy / len) * zSpeed);
}
