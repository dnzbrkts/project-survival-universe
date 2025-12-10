# 🎮 PROJECT SURVIVAL UNIVERSE  
### **FULL AAA GAME DESIGN DOCUMENT — BÖLÜM I**  
*Sürüm: 1.0 — "Universe Draft"*  
*Hazırlayan: ChatGPT + Lead Designer (User)*  
*Format: Markdown*  

---

# 1.0 GENEL KAPAK SAYFASI

| Alan | İçerik |
|------|--------|
| **Oyun Adı (Kod Adı)** | Project Survival Universe |
| **Tür** | Loot-Survival, Crafting RPG, Base Building, Open World, Co-Op |
| **Kamera** | 2.5D İzometrik |
| **Tema** | Post-Apocalyptic Realistik |
| **Motor** | TBD (Öneri: Godot ECS veya Unity DOTS) |
| **Hedef Platform** | PC (Windows + Linux), uzun vadede WebGL |
| **Hedef Kitle** | Survival + RPG + Base-Building oyuncuları |
| **Doküman Versiyonu** | v1.0 (Full GDD Başlangıç) |
| **Hazırlayanlar** | ChatGPT (Design Assistant), User (Lead Designer) |

---

# 1.1 OYUNUN ÖZÜ (HIGH CONCEPT)

**Project Survival Universe**, oyuncunun keşfetme, hayatta kalma, loot toplama, crafting, üs inşası ve karakter gelişimini derin bir RPG sistemine bağlayan genişletilebilir bir açık dünya hayatta kalma oyunudur.

Geniş bir crafting ağacı, güçlü loot ekonomisi ve bölgesel mutasyon tehditleriyle oyun:

- yüksek risk  
- yüksek ödül  
- yüksek tekrar oynanabilirlik  

sunmayı amaçlar.

Oyuncunun nihai amacı **hayatta kalmak değil, ilerlemek ve evrenin sırlarını çözmektir.**

---

# 1.2 TASARIM MANİFESTOSU (OYUN FELSEFESİ)

Aşağıdaki prensipler oyun tasarımının omurgasını oluşturur:

### 🎯 **1) Her eylem anlamlı olmalıdır.**  
Loot → crafting → üs inşası → karakter gelişimi birbirine bağlıdır.  
Boşa iş yoktur.

### 🎯 **2) Risk ne kadar yüksekse, ödül o kadar tatmin edici olmalıdır.**  
Tehlikeli bölge → yüksek rarity loot.  
Sessiz loot → az risk ama uzun süre.  
Hızlı loot → zombileri çeker.

### 🎯 **3) Oyuncu kendi hikâyesini kendi yazmalıdır.**  
Görevler rehberdir ama zorunlu değildir.

### 🎯 **4) Crafting oyun sisteminin kalbidir.**  
Basit crafting değil: **multi-step industrial crafting**.

### 🎯 **5) Base building sınırsız genişleyebilir.**  
Üs, oyuncunun dünyadaki en güvenli yeri olmalı;  
ama **tamamen güvenli** ASLA olmamalı.

### 🎯 **6) Co-op destekli sistemler, tek oyunculu dengeyi bozmamalıdır.**

---

# 1.3 OYUNCU DENEYİMİ (PLAYER EXPERIENCE GOALS)

Oyuncunun oyun boyunca yaşaması amaçlanan duygular:

- **Merak:** “Bu bölge ne saklıyor?”  
- **Endişe:** “Gece olmadan eve dönmeliyim.”  
- **Tatmin:** “Sonunda efsane bir loot düştü.”  
- **Güçlüleşme:** “Üs artık güvenli hissettiriyor.”  
- **Kolektif başarı:** Co-op başarısı  
- **Stratejik planlama:** Gereksinimleri doğru yönetmek  
- **Bağlanma:** Karakterine, üssüne ve ekibine duygusal bağ

---

# 1.4 OYUNUN VAATLERİ (THE PROMISES OF PSU)

### ✔ **Devasa loot çeşitliliği**  
Yüzlerce materyal, yiyecek, ilaç, mekanik parça, elektronik bileşen.

### ✔ **Derin Crafting**  
Basit tariflerden **endüstriyel bileşen zincirlerine** kadar.

### ✔ **Sınırsız üs inşası**  
Her odanın işlevsel değeri var.  
Savunma sistemleri, workshop zincirleri, depolar.

### ✔ **Araba tamiri, geliştirme ve yönetimi**  
Gerçekçi ağırlık → yakıt ekonomisi.

### ✔ **Gerçekçi envanter ağırlık sistemi**

### ✔ **Farklı mutant ekosistemleri**

### ✔ **16 farklı oynanış tarzı (karakterler)**

### ✔ **Repeatable endgame loop**  
Yeni bölgeler → yeni mutasyon zincirleri → yeni teknolojiler.

---

# 1.5 OYUNUN GENEL SİSTEM HARİTASI

Aşağıdaki tablo, oyunun temel sistemlerinin birbirine etkisini gösterir.

| Sistem | Etkilediği | Etkilendiği |
|--------|------------|-------------|
| Loot | Crafting, Envanter, Araç, Base | Bölge, Risk, Zombi |
| Crafting | Base, Araç, Eşyalar | Loot, Skill Tree |
| Base | Morale, Craft Speed | Loot, Crafting |
| Araç | Keşif, Loot | Crafting, Yakıt |
| Skill Tree | Tüm sistemler | Deneyim |
| Ekonomi | NPC, Co-Op | Loot, Craft |
| Zombi AI | Risk, Loot | Bölge, Ses |
| Görevler | Keşif | Üs, NPC |

---

# 1.6 HEDEF KİTLE AYRINTISI

### 🎯 Ana hedef:
- Project Zomboid oyuncuları  
- DayZ loot loop sevenler  
- Factorio / Satisfactory crafting derinliği isteyenler  
- Escape From Tarkov risk/ödül sevenler  
- State of Decay base sistemi sevenler  

### 🎯 İkincil hedef:
- Singleplayer hikâye arayanlar  
- Co-op eğlencesi isteyenler  

---

# 1.7 SUNUM TARZI (ART DIRECTION)

- Renk paleti soluk ve kuru  
- Doku yoğunluğu düşük → okunabilirlik yüksek  
- Mutant tasarımları “aşırı grotesk” değil, “biyolojik olarak tutarlı”  
- Işık-mekanik: gece ışık kaynakları kritik rol oynar  
- UI sade, grid tabanlı ve sistemsel  

---

# 1.8 SES TASARIMI VİZYONU

### Ortam sesleri
- uzak çığlıklar  
- rüzgar  
- metal sürtünmesi  
- doğa sesi  

### Oyuncu tepkileri
- nefes  
- yorgunluk  
- stres  

### Zombi sesleri
- tür bazlı farklı vokal setleri  
- yakınlık bazlı reverb sistemi  

---

# 1.9 PERFORMANS & OPTİMİZASYON HEDEFLERİ

- 60 FPS sabit  
- Tile-based pathfinding  
- Level-of-Detail entity spawning  
- Gereksiz fizik hesaplamaları azaltılacak  

---

# 🌍 BÖLÜM II — DÜNYA TASARIMI & LORE  
### *Project Survival Universe – Full AAA Detay*

---

# 2.0 DÜNYA GENEL BAKIŞI

Project Survival Universe’in dünyası, biyolojik bir felaket sonrası **mutasyon ekosistemine dönüşmüş bir gezegendir**.  
Uygarlık çökmüş; doğa, betonun arasındaki çatlaklardan geri yükselmiştir.

Dünya:

- tam anlamıyla yok olmamış,  
- ancak **düzen, teknoloji, devlet, ekonomi** tamamen çürümüş bir halde  
- her bölge kendi kurallarını, kendi tehlikesini, kendi hayatta kalma şeklini yaratmıştır.

Mutasyon virüsü tek tip değildir:  
Her bölge **kendi mutasyon folklorunu** üretir.

---

# 2.1 FELAKETİN KÖKENİ — MUTASYON VİRÜSÜ (CLASS: HYBRID-Ω)

### Mutasyonun çıkış sebebi:
Gizli bir biyoteknoloji şirketi ve devlet ortaklığında yürütülen bir **“biyolojik adaptasyon projesi”** sırasında kontrol kaybedilir.

Amaç:  
- askerler için rejeneratif iyileşme  
- dayanıklılık artırma  
- DNA stabilizasyonu  
- hızlı öğrenme yeteneği geliştirme  

Sonuç:  
- çok biçimli bir mutasyon zinciri  
- canlı dokuların bölgesel çevresel etkilere göre **farklı evrimleşmesi**  
- şehir, orman, bataklık gibi bölgelerin kendi mutasyon tiplerini yaratması  

Virüs:

- **hava yoluyla bulaşmaz**  
- **kan ve dokusal temas gerektirir**  
- enfeksiyon süresi kişiden kişiye değişir  
- psikolojik davranış bozuklukları yaratır  
- ölen enfekte bireylerin mutasyonlarının **çevreye yayılmasına** neden olur  
- bu da biyom-tabanlı mutasyon türlerini doğurur

---

# 2.2 ZAMAN DİLİMİ — “BEŞ YILLIK BOZULMA”

Felaketin üzerinden **5 yıl geçmiştir**.  
Bu süre, dünyayı şu hale getirmiştir:

### Şehirler:
- çökük binalar  
- elektrik şebekesi tamamen yok  
- koloniler, kendi elektrik sistemlerini kurmaya çalışır  

### Ormanlar:
- şehre doğru genişlemiş  
- mutant hayvan popülasyonu artmış  

### Su kaynakları:
- çoğu kirli  
- içilebilir su için arıtma gerekir  

### Nüfus:
Global nüfusun %90’ı ya ölmüş ya da mutantlaşmıştır.

Kalan %10 ise:

- ufak koloniler  
- gezgin gruplar  
- yağmacı çeteler  
- eski asker veya bilim insanları  
- tamamen yalnız dolaşanlar  

olarak dağınıktır.

---

# 2.3 DÜNYANIN BİYOMLARI

Aşağıda oyunun **ana biyomları** detaylandırılmıştır.  
Her biyom:  
- özel loot  
- özel düşman  
- özel çevresel zorluk  
- özel atmosfer  
- özel crafting materyali  
sunar.

---

## 🌆 2.3.1 ŞEHİR MERKEZİ (HIGH-RISK ZONE)

**Genel tanım:**  
Yoğun nüfuslu bölge → yüksek enfeksiyon → en fazla mutant türü burada.

**Özellikler:**
- yüksek bina yoğunluğu  
- kapalı alan lootları  
- dar sokaklar (kaçış zor)  
- yüksek spawn rate  
- mini-boss çıkma ihtimali çok yüksek  

**Loot:**
- elektronik  
- tıbbi malzeme  
- ender mühimmat  
- silah modları  
- alet kutuları  

**Tehlikeler:**
- yüksek dikkat isteyen çevre  
- duvar arkası ani zombiler  
- hızlı enfekte türleri  
- çürümüş zemin → düşme tehlikesi  

**Atmosfer:**
- sisli, tozlu, boğuk bir hava  
- terk edilmiş araçlar  
- siren sesleri yankılanır gibi  

---

## 🌲 2.3.2 ORMAN BİYOMU (RESOURCE ZONE)

**Genel tanım:**  
Doğal kaynaklarla dolu en verimli biyom.

**Özellikler:**
- odun  
- bitki ve tıbbi otlar  
- mantarlar  
- hayvan kalıntıları  
- çok düşük zombi yoğunluğu  

**Loot:**
- şifalı bitkiler  
- doğal malzemeler  
- temel yiyecekler  

**Tehlikeler:**
- özel kamuflaj mutasyonları  
- düşük görüş  
- gece daha tehlikeli  

**Atmosfer:**
- hafif sis  
- kuş sesleri, doğa ambience  
- dikenli bitkiler, çalılıklar  

---

## 🛢️ 2.3.3 SANAYİ / FABRİKA BÖLGESİ (MEKANİK ZONE)

**Genel tanım:**  
Metal, hurda ve mekanik parçaların merkezi.

**Özellikler:**
- ağır makine kalıntıları  
- radyoaktif lekeler (opsiyonel)  
- patlamış tanklar  
- birçok mühendislik crafting malzemesi  

**Loot:**
- hurda metal  
- yağ filtresi  
- motor parçaları  
- karbon çeliği  
- kablo & elektronik devre  

**Tehlikeler:**
- metalik mutasyonlar  
- güçlü yakın dövüş mutantları  
- tehlikeli gaz alanları  

---

## 🧪 2.3.4 ARAŞTIRMA TESİSLERİ (BIOHAZARD ZONE)

**Genel tanım:**  
Mutasyon virüsünün kaynağını bulundurabilecek bölge.

**Özellikler:**
- ultra yüksek risk  
- bulmaca çözme temalı kapılar  
- kapalı laboratuvar odaları  
- gözetleme odaları  

**Loot:**
- üst seviye ilaçlar  
- serum parçaları  
- gizli raporlar  
- unique loot (hikâyeye bağlı)  

**Tehlikeler:**
- mutasyon fazladır  
- mini-boss garantilidir  
- çevresel hasar efektleri  

---

## 🛫 2.3.5 HAVALİMANI (HIGH-TIER LOOT ZONE)

**Genel tanım:**  
Zengin loot, büyük risk.

**Özellikler:**
- geniş açık alan  
- güvenlik robot kalıntıları  
- terk edilmiş uçaklar  
- bagaj alanları → random loot havuzu  

**Loot:**
- mühimmat  
- nadir kıyafet  
- elektronik cihazlar  
- alet kutuları  
- araç parçaları  

**Tehlikeler:**
- çok güçlü güvenlik zombileri  
- yüksek sese duyarlı mutantlar  
- büyük horde riski  

---

# 2.4 ÇEVRESEL TEHLİKELER

Oyun yalnızca zombilerden ibaret değildir.  
Çevre → OYNANIŞIN büyük parçasıdır.

### Örnek Çevresel Etkiler:
- **Karanlık:** görüş daralır  
- **Yoğun sis:** düşman algısı zorlaşır  
- **Yağmur:** ses maskeler, izleri azaltır  
- **Kar:** dayanıklılık tüketimini artırır  
- **Sıcak dalgası:** su tüketimini artırır  
- **Radyoaktif lekeler:** uzun süre kalırsan hastalık getirir  

---

# 2.5 FACTION (TOPLULUK) TÜRLERİ

Dünyada 5 yıl sonra “devlet” yok;  
ama **topluluklar** var.

### 1) Yerleşik Koloniciler  
- küçük şehir kurmaya çalışanlar  
- ticaret yaparlar  
- nötr davranırlar  

### 2) Yağmacı Çeteler  
- saldırgan  
- hammadde peşindeler  
- miniboss liderleri olabilir  

### 3) Bilim İnsanları Grubu  
- araştırma peşinde  
- özel görev zincirleri açabilir  
- yüksek risk + yüksek ödül  

### 4) Askeri Kalıntılar  
- profesyonel eğitimli hayatta kalanlar  
- zırh & taktiksel loot bulundururlar  

### 5) Yalnız Gezenler  
- rastgele spawn  
- ticaret yapabilir veya saldırabilir  

---

# 2.6 LORE İÇİN KRONOLOJİK ZAMAN ÇİZELGESİ

```
YIL -2 : İlk deney başarısız olur. Virüs karantinaya alınır.
YIL -1 : Mutasyon yayılmaya başlar. Sivil nüfusta kayıplar görülür.
YIL 0 : Felaket. Şehirler düşer. Devletler çöker.
YIL 1 : İlk mutant türleri oluşur.
YIL 2 : Büyük göçler ve koloniler kurulur.
YIL 3 : Araç yakıtı kritik kaynak haline gelir.
YIL 4 : Mutasyon çeşitleri bölgesel ayrışır.
YIL 5 : Oyun burada başlar.
```

---

# 2.7 BÖLÜM II ÖZETİ (NOT: Kısa değil, tasarımcı rehberi)

- Dünya *tek tip zombi oyunu değil*, biyom-tabanlı mutasyon evrenidir.  
- Her bölge farklı loot, tehlike ve atmosfer sunar.  
- Lore, crafting ve loot sistemini desteklemek için yazılmıştır.  
- Oyun mekaniklerinin %70’i çevreyle ilişkilidir.  
- Bölge tasarımları midgame & endgame içerikleri destekler.

---

# 🧍 BÖLÜM III — KARAKTER SİSTEMİ  
### *Project Survival Universe – Full AAA Detay*

---

# 3.0 KARAKTER SİSTEMİNE GENEL BAKIŞ

Oyunda toplam **16 oynanabilir karakter** vardır.  
Her biri:

- farklı geçmiş  
- farklı meslek  
- farklı başlangıç statları  
- farklı yetenek eğilimleri  
- farklı crafting verimlilikleri  
- farklı sosyal etkiler  
- farklı moral tetikleyicileri  

gibi unsurlar taşır.

Karakter sistemi *RPG derinliği* sunar ancak öğrenmesi kolaydır.

---

# 3.1 KARAKTER OLUŞTURMA (Seçim Mantığı)

Oyuncu karakter **yaratmaz**;  
16 hazır karakterden birini seçer.

Bunun nedeni:

- oyuna hızlı başlangıç  
- kişilik tabanlı görev tetikleyicileri  
- lore ve diyalog uyumu  
- mesleğe bağlı craft bonusları  

Karakter seçimi oyun tarzını ciddi şekilde etkiler.

---

# 3.2 KARAKTER ARKETİPLERİ

16 karakter 4 ana arketipe ayrılır:

| Arketip | Tanım | Rol |
|--------|------|-----|
| **Survivor** | Dengeli, genel hayatta kalma odaklı | Tek oyunculu başlangıcı kolaylaştırır |
| **Specialist** | Bir alanda yüksek uzmanlık | Üs yönetimi ve craft için ideal |
| **Scout** | Hızlı hareket, sessiz loot | Riskli bölgeler için ideal |
| **Support** | Moral, tıbbi yetenekler, sosyal güç | Co-op'un bel kemiği |

Bu arketipler oyuncuya farklı “power curve” sunar.

---

# 3.3 KARAKTERLERİN ARKA PLAN VE MESLEK SİSTEMİ

Her karakterin bir **mesleği** vardır.  
Meslek:

- crafting bonusu  
- loot bonusu  
- yetenek ağacı yönelimi  
- NPC tepkileri  
- moral tetikleyicileri  
- özel görev zincirleri  

gibi sistemleri etkiler.

Aşağıda örnek meslekler:

| Meslek | Oyundaki Rol | Bonus |
|--------|---------------|--------|
| **Aşçı (Cook)** | Yemek verimliliği, moral | +%25 yemek iyileştirme, moral artışı |
| **Mekanikçi (Mechanic)** | Araç tamiri | -%30 araç tamir süresi |
| **Lootçu (Scavenger)** | Nadir eşya bulma | +%15 rare loot |
| **Doktor (Medic)** | İyileştirme | +%40 tedavi verimi |
| **Avcı (Hunter)** | Sessiz hareket, tuzaklar | +%20 sessiz adım, +%30 tuzak hasarı |
| **Müzisyen (Musician)** | Moral ve sosyal buff | Kampta çalınca +moral |
| **Öğretmen (Teacher)** | EXP kazanımını artırır | +%20 skill EXP |
| **Asker Kalıntısı (Ex-Military)** | Savaş | +%10 hasar, -%10 geri tepme |
| **Tesis İşçisi (Factory Worker)** | Metal/Elektronik verim | Metal craft +%15 |

---

# 3.4 BAŞLANGIÇ STAT TABLOSU (16 KARAKTER İÇİN ŞABLON)

Her karakter şu başlangıç statlarına sahiptir:

| Stat | Açıklama |
|------|----------|
| **HP** | Can değeri |
| **Stamina** | Koşma, savaş, crafting verimi |
| **Carry Weight** | Taşıma kapasitesi |
| **Loot Speed** | Arama hızı |
| **Craft Efficiency** | Craft zaman çarpanı |
| **Focus** | Nişan alma doğruluğu |
| **Morale Stability** | Moral düşüşüne direnç |
| **Night Vision** | Karanlıkta görüş |

Aşağıda örnek 4 karakterin stat mockup’ı verilmiştir:

### KARAKTER STAT ÖRNEK TABLOSU
| Karakter | HP | STA | Carry | Loot Speed | Craft Eff. | Focus | Moral | NV |
|----------|----|-----|--------|------------|-------------|--------|--------|----|
| Aşçı | 100 | 80 | 18kg | Normal | +20% | Düşük | Yüksek | Orta |
| Mekanikçi | 110 | 90 | 22kg | Yavaş | +30% | Orta | Orta | Düşük |
| Lootçu | 90 | 85 | 16kg | +35% | Normal | Orta | Orta | Yüksek |
| Asker | 130 | 110 | 25kg | Normal | Normal | Yüksek | Yüksek | Orta |

Tam 16 karakterlik final tablo Bölüm Sonunda hazırlanacak.

---

# 3.5 KARAKTER DURUM EFEKTLERİ (MENTAL & FİZİKSEL)

Karakterler fiziksel yeteneklerinin yanında **zayıflıklara** da sahiptir.

### FİZİKSEL
- Açlık → stamina düşer  
- Susuzluk → max stamina düşer  
- Yorgunluk → hareket hızı düşer  
- Hastalık → HP rejenerasyonu azalır  
- Enfeksiyon → sürekli HP kaybı  

### MENTAL
- Moral düşük → savaş performansı düşer  
- İsolation debuff → yalnız kalınca verim düşer  
- Co-op synergy → ekip yanındaysa bonus  

---

# 3.6 KARAKTER SINIRLAMALARI (Weakness)

Her karakterin stratejik bir zayıflığı olmalıdır:

Örnekler:
- mızrak kullanamama  
- düşük night vision  
- crafting süresine +%10 ceza  
- yüksek açlık tüketimi  
- düşük moral stabilitesi  

Bu sayede karakter seçimi *gerçek tercih* olur.

---

# 3.7 KARAKTERLER ARASI SİNERJİ SİSTEMİ

Oyuncu co-op oynuyorsa veya ekibe NPC alıyorsa:

- Aşçı + Doktor: moral & iyileştirme bonusu  
- Mekanikçi + Lootçu: araç loot run’ları verimli  
- Avcı + Müzisyen: sessiz kamp moral buff’ı  
- Öğretmen + herhangi biri: skill öğrenimi hızlanır  

Bu sistem **co-op meta progression** sağlar.

---

# 3.8 KARAKTERİN OYUN BAŞLANGICI (EARLY-GAME FLOW)

Her karakter oyuna:

- 1 moral buff  
- kişisel eşyası (ör. aşçının bıçağı, mekanikçinin aleti)  
- düşük seviye crafting bilgisi  
- kendi özel “başlangıç görev zinciri”  

ile başlar.

---

# 3.9 KARAKTERLERİN DİNAMİK GELİŞİMİ

Karakterler sabit sınıf değildir.  
Oyun ilerledikçe oyuncu:

- yetenek ağacından farklı yollar açabilir  
- karakterini uzmanlıktan “jack-of-all-trades” hale getirebilir  
- craft, loot, savaş ve sosyal alanlarda hibrit build yapabilir  

Her karakter için geniş bir **growth curve** bulunur.

---

# 3.10 KARAKTERLERİN HAREKET VE ANİMASYON SETİ

Her karakter aşağıdaki temel animasyon setini kullanır:

- idle (4 yön)  
- walk (4 yön)  
- run  
- loot  
- craft  
- melee attack  
- ranged aim  
- ranged shoot  
- damage react  
- death  

Toplam minimum animasyon: **32**  
Opsiyonel gelişmiş set: **48–60 animasyon**

---

# 3.11 KARAKTER GELİŞİM HIZI (Meta Progression Formula)

EXP kazanımı:

```
Total EXP = BaseXP * (1 + SkillAffinity + FoodBonus + MoraleBonus)
```

SkillAffinity:  
- meslek bonusu (ör: Aşçı yemek yaparken +0.25)

FoodBonus:  
- yüksek kaliteli yemek → +0.05–0.12

MoraleBonus:  
- moral yüksekse → +0.10  

---

# 3.12 KARAKTERLERİN TAM LİSTESİ (İSİMLER GEÇİCİ)

Tam liste Bölüm X'te tablo olarak genişletilecek; burada arketip ve meslek sınıfları verilir:

1. “Clayton” — Mekanikçi  
2. “Evelyn” — Aşçı  
3. “Ridge” — Asker  
4. “Hollow” — Lootçu  
5. “Jun” — Doktor  
6. “Mira” — Öğretmen  
7. “Soren” — Avcı  
8. “Kara” — Müzisyen  
9. “Fletcher” — Tesis İşçisi  
10. “Nadia” — Elektronik Uzmanı  
11. “Troy” — İnşaatçı  
12. “Yumi” — Bitkibilimci  
13. “Oren” — Madenci  
14. “Selene” — İzci  
15. “Gabe” — Hayatta Kalan (Survivor)  
16. “Asha” — Sessiz Adım (Scout Specialist)

---

# 3.13 KARAKTER İLERLEME EĞRİSİ

Karakter progression 3 aşamaya ayrılır:

### Early Game (Level 1–10)
- temel craft  
- düşük risk bölgeleri  
- temel loot arayışı  

### Mid Game (Level 11–30)
- araç tamiri  
- base genişlemesi  
- ilk miniboss savaşları  

### Late Game (Level 31–60)
- derin crafting  
- advanced loot bölgeleri  
- bölgesel mutant liderleri  
- advanced skill tree  
- üs savunma etkinlikleri  

---

# 3.14 KARAKTER ÖLÜM VE CEZA SİSTEMİ

Ölüm cezaları:

- moral reset  
- loot kaybı (yüzdelik)  
- EXP cezası (küçük)  
- crafting verim düşüşü (geçici)  

Hardcore seçenek: permadeath (opsiyonel mod).

---

# 3.15 BÖLÜM III ÖZETİ

Bu bölüm karakter yapısının:

- arketiplerini  
- mesleklerini  
- stat sistemini  
- sinerji mekaniklerini  
- erken/orta/son oyun büyüme eğrisini  
- dünyayla ilişkisini  

kapsamlı biçimde tanımladı.

16 karakterin tam detay dökümü Bölüm IX’da final tablo olarak verilecek.

---

# 🧠 BÖLÜM IV — YETENEK AĞACI (SKILL TREE)  
### *Project Survival Universe — Full AAA Detay*

---

# 4.0 GENEL YETENEK SİSTEMİ BAKIŞI

Yetenek sistemi, oyunda karakterin uzun vadeli gelişimini tanımlar.  
PSU’daki yetenek sistemi iki temel katman üzerine kuruludur:

1. **Temel Yetenekler (Core Skills)**  
   - herkesde var  
   - koşma, loot, dayanıklılık, gece görüşü, sessiz hareket vb.

2. **Uzmanlık Yetenekleri (Specialist Skills)**  
   - karakterin mesleğine bağlı olarak açılır  
   - aşçı, mekanikçi, lootçu, doktor, avcı, öğretmen, müzisyen vb.

Yetenek sistemi:
- 5 ana kategori  
- 23 alt kategori  
- 90+ yetenek  
- her biri 1–5 seviye arasında  

derin RPG progression sunar.

---

# 4.1 SKILL TREE ANA DALLARI (5 MAJOR BRANCHES)

Aşağıdaki beş dal tüm oyunun sistemiyle bağlantılıdır.

## 🌿 1) Survival Tree  
- açlık yönetimi  
- susuzluk yönetimi  
- dayanıklılık  
- gece görüşü  
- sessiz adım  
- koşu verimliliği  
- doğal bitki tanıma  

## 🔧 2) Crafting & Engineering Tree  
- metal işleme  
- ahşap işleme  
- elektronik  
- kimya & tıbbi üretim  
- araç tamiri  
- araç modlama  
- endüstriyel üretim zincirleri  

## 🎯 3) Combat & Stealth Tree  
- yakın dövüş  
- ateşli silahlar  
- sessiz hareket  
- kritik hasar  
- geri tepme kontrolü  
- hedef takibi  
- tuzak kullanımı  

## 🎒 4) Scavenging & Loot Tree  
- loot hızı  
- nadir loot şansı  
- kapalı alan arama bonusu  
- çanta verimliliği  
- ağır eşya taşıma  
- kilit kırma (lockpicking)  

## 🤝 5) Social & Morale Tree  
- moral artırma  
- ekip sinerjisi  
- ticaret bonusları  
- müzik buff’ları  
- eğitim bonusu  
- NPC ikna gücü  

Bu beş ana dal oyunun tüm alt sistemleriyle organik olarak birleşir.

---

# 4.2 YETENEK AĞACININ MİMARİSİ (STRUCTURE)

Yetenek ağacı şu mimari yapıyı takip eder:

```
Ana Dal
 ├── Alt Dal
 │      ├── Tier 1 Yetenek (Level 1–5)
 │      ├── Tier 2 Yetenek (Level 1–3)
 │      └── Tier 3 Perk (Tek seviye)
 └── Master Perk (Dalın sonu)
```

### Açıklama:

- **Tier 1**: Her oyuncunun alabileceği temel geliştirmeler  
- **Tier 2**: Daha uzmanlaşmış geliştirmeler  
- **Tier 3**: Özel etkileri olan güçlü perk’ler  
- **Master Perk**: Ağacın son ödülü; oyunu ciddi etkiler

---

# 4.3 SKILL TREE PROGRESSION (YETENEK GELİŞİM FORMÜLÜ)

EXP kazanımı aktiviteye göre artar:

```
Skill XP Gain = BaseXP * (ActivityMatch + TalentFactor + MoraleBonus + FoodBonus)
```

- ActivityMatch: Yetenek kategorisine uygun iş yapınca bonus (örn. yemek → Cook EXP)  
- TalentFactor: Mesleğe özgü çarpan  
- MoraleBonus: moral yüksekse EXP artar  
- FoodBonus: premium yemek → EXP +%5–10  

---

# 4.4 TIER DETAYI ve GEREKSİNİMLER

| Tier | Gereksinim | Etki |
|------|------------|-------|
| **Tier 1** | Skill Level 1 | Küçük pasif buff’lar |
| **Tier 2** | Skill Level 10 | Büyük gelişmeler |
| **Tier 3** | Skill Level 25 | Güçlü perk |
| **Master** | Skill Level 50 | Ağacı tamamen değiştirir |

---

# 4.5 YETENEK ÖRNEKLERİ (TÜM DALLARDAN DETAYLI)

Aşağıda her dal için örnek 5–15 yetenek listesi verilmiştir.

---

# 🌿 4.5.1 SURVIVAL YETENEKLERİ (ÖRNEK 12)

### Tier 1
- **Efficient Breathing I–III:** Koşu sırasında stamina tüketimini %5–15 azaltır  
- **Night Sensitivity I–II:** Gece görüşü +%10 / +%20  
- **Basic Herb Recognition:** Bitkileri tanıma hızı %20 artar  

### Tier 2
- **Endurance Training I–III:** Max stamina +10 / +25 / +40  
- **Heat Resistance:** Sıcak havalarda su tüketimini azaltır  
- **Cold Resistance:** Soğukta stamina kaybını azaltır  

### Tier 3
- **Survival Instinct:** Düşük HP’de hasar direnci +%25  

### Master Perk
- **True Survivor:** Açlık/susuzluk kilitlenir → hiçbir zaman sıfıra düşmez (yavaş düşer)

---

# 🔧 4.5.2 CRAFTING & ENGINEERING YETENEKLERİ (15 ÖRNEK)

### Tier 1
- **Quick Assembly I–III:** Craft sürelerini %5–15 azaltır  
- **Metal Working Basics:** Hurda metali işleme verimi +%25  
- **Tool Maintenance:** Araç gereç dayanıklılığı +%20  

### Tier 2
- **Advanced Mechanics I–II:** Araç tamir hızını +%30 / +%50 artırır  
- **Chemistry Kit:** Tıbbi crafting ürünlerinin etkisi +%20  
- **Precision Crafting:** Craft kalitesi artar  

### Tier 3
- **Industrial Blueprinting:** Bir craft işlemi %5 ihtimalle 2 ürün verir  

### Master Perk
- **Master Engineer:** Tüm crafting süreleri %30 azalır + tüm üretim kalitesi artar

---

# 🎯 4.5.3 COMBAT & STEALTH YETENEKLERİ (15 ÖRNEK)

### Tier 1
- **Melee Training I–III:** Yakın dövüş hasarı %5–20 artar  
- **Steady Aim I–II:** Geri tepme kontrolü  
- **Silent Step I–III:** Ses çıkartma %10–30 azalır  

### Tier 2
- **Critical Strike I–II:** Kritik vuruş ihtimali +%5 / +%10  
- **Evasion Roll:** Hasarı hafifletme %15  
- **Quick Reload:** Mermi doldurma hızı +%20  

### Tier 3
- **Shadow Ambush:** Karanlıkta ilk saldırı %100 kritik  

### Master Perk
- **Assassin’s Flow:** Sessiz öldürme → 3 saniyelik görünmezlik

---

# 🎒 4.5.4 SCAVENGING & LOOT YETENEKLERİ (12 ÖRNEK)

### Tier 1
- **Quick Hands I–III:** Loot hızı %10–30 artar  
- **Heavy Lifter:** Taşıma kapasitesi +5kg  
- **Bag Management:** Envanter verimi +%10  

### Tier 2
- **Rare Sense I–II:** Rare loot bulma şansı +%5 / +%15  
- **Urban Scanner:** Şehir içi loot kalitesi +%20  
- **Lockpick Expert:** Kilitli kapıları açma süresi -%50  

### Tier 3
- **Treasure Hunter:** Legendary loot bulma şansı +%5  

### Master Perk
- **Master Scavenger:** İlk loot her zaman uncommon+ olur

---

# 🤝 4.5.5 SOCIAL & MORALE YETENEKLERİ (10 ÖRNEK)

### Tier 1
- **Positive Mindset I–II:** Moral düşüş hızını %10/%20 azaltır  
- **Basic Negotiator:** NPC ticaret fiyatları %5 iyileşir  

### Tier 2
- **Group Motivation:** Ekip yanındaysa tüm statlara +%5  
- **Camp Performer:** Müzik → moral +2/saniye  

### Tier 3
- **Inspiring Leader:** Co-op takımına +%10 EXP buff  

### Master Perk
- **Unbreakable Spirit:** Moral asla kritik seviyeye düşmez

---

# 4.6 SKILL TREE ÖRNEK GÖRSEL YAPISI (METİNSEL UML)

```
SURVIVAL TREE
 ├── Efficient Breathing (Tier 1)
 ├── Night Sensitivity (Tier 1)
 ├── Endurance Training (Tier 2)
 ├── Cold/Heat Resistance (Tier 2)
 └── Survival Instinct (Tier 3)
      └── MASTER: True Survivor
```

---

# 4.7 SKILL TREE PROGRESSION PACE (LEVEL ARALIKLARI)

| Oyun Aşaması | Skill Level | Açıklama |
|--------------|-------------|----------|
| Early Game | 1–10 | Temel yetenekler açılır |
| Mid Game | 11–30 | Tier 2 aktif olur |
| Late Game | 31–50 | Tier 3 perk’leri açılır |
| Endgame | 50–60 | Master Perk alınır |

---

# 4.8 MESLEKLERE ÖZEL SKILL AFFINITY (BONUS TABLOSU)

| Meslek | Bonus Etki |
|--------|------------|
| Aşçı | Cooking EXP +%40, Morale +%10 |
| Mekanikçi | Engineering EXP +%50 |
| Lootçu | Scavenging EXP +%35 |
| Doktor | Medical Crafting +%40 |
| Avcı | Stealth EXP +%25 |
| Müzisyen | Social EXP +%35 |
| Öğretmen | Global EXP +%20 |
| Asker | Combat EXP +%30 |

---

# 4.9 MASTER PERK LİSTESİ (8 ÖRNEK)

| Dal | Master Perk | Etki |
|-----|--------------|-------|
| Survival | True Survivor | Açlık/susuzluk 0’a düşmez |
| Crafting | Master Engineer | Craft süresi -%30 |
| Combat | Assassin’s Flow | Sessiz kill → görünmezlik |
| Loot | Master Scavenger | İlk loot = rare+ |
| Social | Unbreakable Spirit | Moral sabitlenir |
| Cooking | Culinary Genius | Yemek → +%40 buff |
| Mechanic | Mechanical Virtuoso | Araç tamir +%70 |
| Medical | Miracle Worker | Tedavi verimi +%50 |

---

# 4.10 BÖLÜM IV ÖZETİ

Bu bölüm:

- 5 ana skill ağacını  
- tüm alt yetenek dallarını  
- progression sistemini  
- EXP formüllerini  
- master perk’leri  
- sinerji yapılarını  

kapsamlı biçimde tanımlamıştır.

Karakter gelişiminin derin RPG çekirdeği oluşturulmuştur.


---

# 📐 BÖLÜM V — STAT SİSTEMİ & KARAKTER MEKANİKLERİ  
### *Project Survival Universe – Full AAA Detay*

---

# 5.0 STAT SİSTEMİNİN GENEL AMACI

Stat sistemi, oyundaki karakterlerin:

- savaşta  
- loot sırasında  
- crafting sürecinde  
- koşu / hareket döngüsünde  
- üs yönetiminde  
- sosyal etkileşimlerde  

nasıl davrandığını belirleyen **matematiksel çekirdektir.**

PSU’da stat sistemi **realistik + RPG hibridi** tasarlanmıştır.

Her stat, **oyuncu davranışı + çevresel koşullar + ekipman + yetenekler** ile şekillenir.

---

# 5.1 ANA STAT KATEGORİLERİ

Karakter statları 5 ana kategoriye ayrılır:

1. **Fiziksel Statlar** → HP, Stamina, Speed, Carry Weight  
2. **Algı Statları** → Vision, Night Vision, Awareness  
3. **Etkileşim Statları** → Loot Speed, Craft Efficiency  
4. **Savaş Statları** → Melee Damage, Accuracy, Recoil Control  
5. **Mental Statlar** → Morale, Stress, Focus  

Her kategori alt statlara sahiptir.

---

# 5.2 ANA STAT TABLOSU (TANIMLAR)

| Stat | Açıklama | Oyun Etkisi |
|------|----------|-------------|
| **HP (Health Points)** | Can değeri | Ölüm dayanıklılığı |
| **Stamina** | Enerji | Koşma / dövüş / crafting hızı |
| **Speed** | Yürüyüş ve koşu hızı | Loot kaçışı, savaş |
| **Carry Weight** | Taşıma kapasitesi | Envanter doluluğu, araç ekonomisi |
| **Loot Speed** | Eşya arama hızı | Loot riskini belirler |
| **Craft Efficiency** | Craft zaman çarpanı | Craft süresi ve ürün kalitesi |
| **Focus** | Konsantrasyon | Nişan alma ve kritik vuruş |
| **Awareness** | Algı | Zombi fark etme süresi |
| **Night Vision** | Karanlıkta görüş | Gece oynanışı kolaylaştırır |
| **Morale** | Ruh hali | Buff/debuff oranları |
| **Stress Resistance** | Panik direnci | Savaşta aim sapması |
| **Recoil Control** | Silah geri tepmesi | İsabet oranı |

---

# 5.3 STAT FORMÜLLERİ (AAA SEVİYE DETAY)

Aşağıdaki formüller oyunun iç dengesinde çekirdek rol oynar.

## 💓 5.3.1 HP Formülü

```
Max HP = BaseHP + (Strength * 2) + (SurvivalSkill * 1.5)
```

BaseHP karaktere göre değişir (80–130 arası).

---

## ⚡ 5.3.2 STAMINA TÜKETİM FORMÜLÜ

```
StaminaDrain = (MovementSpeed * 0.35) + (CarryWeightRatio * 0.25)
```

**CarryWeightRatio = taşınan ağırlık / maksimum ağırlık**

---

## 🏃‍♂️ 5.3.3 HIZ (SPEED) FORMÜLÜ

```
Speed = BaseSpeed * (1 - (CarryWeightRatio * 0.4)) * (1 + Buffs - Debuffs)
```

---

## 🎒 5.3.4 TAŞIMA KAPASİTESİ FORMÜLÜ

```
CarryWeight = BaseCarry + (Physicality * 0.5) + EquipmentBonus
```

---

## 🔍 5.3.5 LOOT SPEED FORMÜLÜ

```
LootTime = BaseLootTime * (1 - LootSkillBonus) * (1 - MoraleFactor)
```

MoraleFactor: moral yüksekse loot hızı artar.

---

## 🔧 5.3.6 CRAFT FORMÜLÜ

```
CraftTime = BaseTime * (1 - CraftEfficiency) * (1 + FatiguePenalty)
```

FatiguePenalty = stamina azsa craft yavaşlar.

---

## 🎯 5.3.7 NİŞAN ALMA (AIM ACCURACY) FORMÜLÜ

```
Accuracy = BaseAccuracy + (Focus * 0.15) - (Stress * 0.2) - (Recoil * 0.1)
```

---

# 5.4 STAT ETKİLEŞİM TABLOSU

| Stat | Etkilediği Sistem | Önem Derecesi |
|------|--------------------|----------------|
| HP | Combat, Survival | ⭐⭐⭐ |
| Stamina | Craft, Combat, Exploration | ⭐⭐⭐⭐ |
| Carry Weight | Loot, Movement, Vehicle | ⭐⭐⭐ |
| Loot Speed | Risk, Noise | ⭐⭐⭐⭐ |
| Craft Efficiency | Base progression | ⭐⭐⭐⭐ |
| Focus | Combat accuracy | ⭐⭐⭐⭐ |
| Morale | Tüm sistem | ⭐⭐⭐⭐⭐ |

Morale, oyunun en yüksek öneme sahip statıdır.

---

# 5.5 DURUMA BAĞLI STAT DEĞİŞİMLERİ

Statlar sabit değildir; çevre ve oyuncu davranışıyla değişir.

## 🌡️ Sıcaklık Etkisi
- sıcak → su tüketimi + hız düşer  
- soğuk → stamina tüketimi +  

## 🌧️ Yağmur
- ses maskelenir → stealth bonus  
- hareket hızı -%10  

## 🌘 Gece
- night vision kritik  
- awareness azalma → zombi fark etme süresi uzar  

## 😫 Açlık & Susuzluk
- craft verimi düşer  
- stamina yenilenmesi durur  

---

# 5.6 STRESS & MORALE SİSTEMİNİN DERİNLİĞİ

Morale, PSU’nun en benzersiz mekaniklerinden biridir.

### Morale Kaynakları:
- yemek kalitesi  
- sosyal etkileşim  
- ısıtılmış barınak  
- müzik (müzisyen perk)  
- başarıyla tamamlanan loot run  

### Morale Düştüğünde:
- aim sapması artar  
- loot süresi uzar  
- crafting hataları artar (çift ürün düşme ihtimali azalır)  
- bazı yetenekler çalışmaz  

### Stress Kaynakları:
- karanlık  
- çevre sesleri  
- horde yaklaşması  
- düşük HP  
- yalnızlık  

Stress → Focus ve Recoil üzerinde doğrudan etkilidir.

---

# 5.7 KARAKTER DAYANIKLILIK (FATIGUE) MODELİ

Fatigue üç fazdan oluşur:

| Faz | Açıklama | Etki |
|------|----------|-------|
| **Fresh** | Tam enerji | +%10 craft, +%5 speed |
| **Tired** | Orta seviye | stamina regen yarıya düşer |
| **Exhausted** | Kritik yorgunluk | speed -%20, craft +%20 süre, combat -%15 |

Fatigue yenilenmesi:

- yatak → hızlı  
- kamp ateşi → orta  
- ayakta dinlenme → düşük  

---

# 5.8 STAT BÜYÜME KATSAYILARI

Karakterler seviye atladıkça statlar şu şekilde artar:

| Stat | Lv-Up Artışı |
|------|--------------|
| HP | +2–3 |
| Stamina | +3–4 |
| Carry Weight | +0.2kg |
| Focus | +0.5 |
| Craft Efficiency | +0.5% |
| Loot Speed | +1% |
| Morale Stability | +1 |

---

# 5.9 MİN-MAX (POWER BUILD) OYNAMA İÇİN STAT SİNERJİLERİ

### Lootçu Power Build:
- Loot Speed  
- Carry Weight  
- Rare Sense perk  
- Night Vision  

### Craft Master Build:
- Craft Efficiency  
- Focus  
- Endurance  
- Engineering skill branch  

### Combat Build:
- Focus  
- Recoil Control  
- Stamina  
- Melee Damage  

### Support Build:
- Morale Stability  
- Social tree  
- Camp Performer  
- Teacher synergy  

---

# 5.10 ZAYIFLIK & AVANTAJ SİSTEMİ

Her karakterin:

### En az 1 güçlü alanı  
### En az 1 zayıf alanı  
### 1 nötr alanı  

olmalıdır.

Örnek:

| Karakter | Avantaj | Zayıflık |
|----------|---------|----------|
| Aşçı | moral + yüksek | düşük night vision |
| Mekanikçi | araç tamiri hızlı | düşük stamina |
| Lootçu | loot hızında çok iyi | düşük HP |
| Asker | savaş güçlü | crafting zayıf |

---

# 5.11 ÇEVRESEL STAT MODİFİKATÖRLERİ

| Çevre | Etki |
|-------|------|
| Karanlık | Awareness -%30 |
| Sis | Night vision gereksinimi artar |
| Yağmur | Noise -%15, Speed -%10 |
| Kar | Stamina tüketimi +%20 |
| Bataklık | Speed -%30, Awareness -%20 |

Bu modifikasyonlar oyuncuyu çevreye uygun şekilde oynamaya zorlar.

---

# 5.12 STAT CHECK SİSTEMİ (DICELESS SKILL CHECK)

PSU’da “zar atma” yoktur.  
Onun yerine **stat check = deterministik + RNG hibrit** modeldir.

Örnek lockpicking:

```
SuccessChance = BaseChance + (Focus * 1.25) + (SkillBonus) - (Stress * 0.5)
```

---

# 5.13 ÖZET

Bu stat sistemi:

- savaş  
- loot  
- crafting  
- moral  
- çevre  
- zombi AI  

ile doğrudan bağlantılıdır.

Yer yer realist, yer yer RPG hissi vererek derin bir sistem kurar.

---

# ☣️ BÖLÜM VI — DURUM EFEKTLERİ, HASTALIK, YORGUNLUK & ENFEKSİYON  
### *Project Survival Universe – Full AAA Detay*

---

# 6.0 DURUM EFEKTİ SİSTEMİNE GENEL BAKIŞ

Durum efektleri (Status Effects), PSU’da **savaş, loot, crafting ve hayatta kalmayı derinden etkileyen** sistemlerden biridir.

PSU’da durum efektleri sadece basit debuff’lar değildir.  
Aşağıdaki alanları etkiler:

- sağlık  
- stamina  
- moral  
- crafting verimi  
- nişan alma  
- hareket hızı  
- loot hızı  
- enfeksiyon riski  
- çevre ile etkileşim  

Durum efektleri 4 ana kategoriye ayrılır:

1. **Fiziksel Durumlar (Bleeding, Fracture, Burn)**
2. **Enfeksiyon & Hastalık (Virus, Bakteri, Gıda Zehirlenmesi)**
3. **Mentale Etkiler (Stress, Panic, Morale Drop)**
4. **Yorgunluk & Uykusuzluk (Fatigue System)**

---

# 6.1 DURUM EFEKTLERİ DETAY TABLOSU

Aşağıda her durum efektinin:

- tanımı  
- tetiklenme koşulları  
- etkileri  
- tedavi yöntemleri  

verilmiştir.

## 🔪 6.1.1 Kanama (Bleeding)

| Özellik | Değer |
|--------|--------|
| Tetiklenme | Yakın dövüşte kesici hasar, cam kırıkları, tuzaklar |
| Etki | Her 3 saniyede HP -2 |
| Ek Etki | Crafting yapılamaz; sprint yapılamaz |
| Tedavi | Bandaj, gelişmiş bandaj, dikiş seti |

Kanama tedavi edilmezse **enfeksiyona dönüşebilir.**

---

## 💀 6.1.2 Enfeksiyon (Infection)

| Özellik | Değer |
|--------|--------|
| Tetiklenme | Kanama uzun süre tedavi edilmezse, mutant ısırığı |
| Etki | Her 10 saniyede HP -1, Morale - sürekli |
| Gelişim | 3 aşamalı (hafif → orta → kritik) |
| Tedavi | Antibiyotik, tıbbi serum, özel crafting ilaçları |

**Kritik enfeksiyon → ölüm**

---

## 💥 6.1.3 Kırık / Çatlak (Fracture)

| Özellik | Değer |
|--------|--------|
| Tetik | Yüksekten düşme, mutant tarafından savrulma |
| Etki | Speed -%40, stamina yenilenmesi durur |
| Tedavi | Alçı, atel, tıbbi set |

İyileşme süresi: 3–6 oyun günü

---

## 🔥 6.1.4 Yanık (Burn)

| Özellik | Değer |
|--------|--------|
| Tetik | Ateş tuzakları, patlama, sıcak zemin |
| Etki | HP drain + moral düşüş |
| Tedavi | Yanık merhemi, su soğutma, gelişmiş tıbbi kit |

---

## 🤢 6.1.5 Gıda Zehirlenmesi (Food Poisoning)

| Özellik | Değer |
|--------|--------|
| Tetik | Çiğ et, bozulmuş yemek |
| Etki | Crafting hızı -%50, stamina -%30 |
| Tedavi | Kömür tableti, su içmek |

---

## 🧠 6.1.6 Panic (Panik)

| Özellik | Değer |
|--------|--------|
| Tetik | Horde yaklaşması, düşük HP, karanlık |
| Etki | Accuracy -%20, recoil +%20 |
| Tedavi | Şömine, konuşma, müzik, moral item'ları |

---

## 😨 6.1.7 Mental Breakdown (Mental Çöküş)

| Özellik | Değer |
|--------|--------|
| Tetik | Moral < 10 |
| Etki | Loot yapılamaz, crafting yapılamaz |
| Tedavi | Yatak, iyi yemek, sosyal etkileşim |

---

## 😴 6.1.8 Yorgunluk (Fatigue)

Fatigue üç seviye içerir:

| Seviye | Etki |
|--------|------|
| Fresh | +%10 crafting, +%5 speed |
| Tired | stamina regen düşer |
| Exhausted | speed -%20, aim -%20, loot yavaşlar |

Yorgunluk **uğranan hasarla** daha hızlı artar.

---

# 6.2 HASTALIK SİSTEMİ (DISEASE MODEL)

Hastalıklar statik değil; **dinamik** bir sistemdir.

Aşağıdaki faktörler hastalık riskini belirler:

- hava durumu  
- giysi kalitesi  
- karakterin hijyen seviyesi (opsiyonel alt sistem)  
- yeterli uyku almamak  
- çiğ yemek tüketmek  
- kirli su içmek  

### Hastalık türleri:

| Hastalık | Etkisi | Tedavi |
|----------|--------|--------|
| Grip | speed -%10, stamina regen -%20 | sıcak ortam, ilaç |
| Enfekte Kesik | HP drain + moral düşer | antibiyotik |
| Parazit | açlık hızlı düşer | özel ilaç |
| Ateş | crafting verimi -%40 | serum, yatak |

---

# 6.3 ENFEKSİYON SÜRECİ — DERİN MODEL

Enfeksiyon **3 aşamalıdır:**

### 🟡 Aşama 1 — Hafif Enfeksiyon  
- HP yavaş drain  
- craft penaltısı  
- karakter şikâyet animasyonları  

Tedavi edilirse tamamen iyileşir.

---

### 🟠 Aşama 2 — Orta Enfeksiyon  
- HP daha hızlı düşer  
- moral sert düşüş  
- stamina regen sıfır  

Tedavi edilmezse → Kritik Aşamaya geçer.

---

### 🔴 Aşama 3 — Kritik Enfeksiyon  
- ekran sararır  
- hareket yavaşlar  
- HP hızla düşer  
- karakter bayılabilir  

Tedavi edilmezse **ölüm kesindir.**

---

# 6.4 ENFEKSİYON PROGRESSION FORMÜLÜ

```
InfectionProgress = BaseRate * (WoundSeverity + EnvironmentFactor + DelayPenalty)
```

EnvironmentFactor:
- bataklık: +0.25  
- şehir çöplüğü: +0.10  
- temiz ortam: 0  

DelayPenalty: tedavi edilmeyen her 10 saniye için +0.05

---

# 6.5 YORGUNLUK (FATIGUE) DERİNLEŞTİRİLMİŞ MODEL

Yorgunluk sadece uyku ile değil:

- yemek kalitesi  
- su tüketimi  
- moral  
- sıcaklık  
- zombi stres seviyesi  

ile ilişkilidir.

### Fatigue Yükselme Hızı Formülü:

```
FatigueRate = (Movement * 0.2) + (CarryWeightRatio * 0.15) + (Stress * 0.3)
```

### Uyku Kalitesi Faktörü:

```
Restoration = BaseRest * (BedQuality * 0.5 + WarmthBonus + SafetyFactor)
```

- BedQuality: barınak geliştirmesi ile artar  
- SafetyFactor: üs güvenliği  

---

# 6.6 ALERJİ & ÇEVRESEL HASSASİYETLER (Opsiyonel Sistem)

İleri aşamada eklenebilecek opsiyonel sistem:

- bazı karakterler bitkilere alerjik olabilir  
- alerji → kaşıntı, moral düşüş  
- tedavi için antihistaminik crafting gerekir  

---

# 6.7 STAT-BREAK ZONES (KARAKTERİN SINIR KIRILIM ALANLARI)

Belirli eşiklerde karakter davranışı değişir:

| Stat Eşiği | Sonuç |
|------------|--------|
| Açlık < 10 | stamina regen durur |
| Susuzluk < 5 | craft yapılamaz |
| Morale < 15 | accuracy düşer |
| Enfeksiyon Kritik | hareket hızı -%40 |
| Yorgunluk Max | karakter bayılır |

---

# 6.8 EMS (Emergency Mechanics System)

Kritik durumlarda tetiklenen “acil durum mekanikleri”:

- karakter yavaşça yerde sürünür  
- ekran vignette etkisi artırılır  
- müzik tansiyonu yükselir  
- UI titreşir  
- co-op arkadaşına “drag to safety” seçeneği çıkar  

---

# 6.9 TIBBİ CRAFTING VE DURUM EFEKTİ SİNERJİSİ

Tıbbi crafting’in bazı tarifleri:

| Ürün | Materyal | Etki |
|------|-----------|-------|
| Basit Bandaj | Kumaş | Kanamayı durdurur |
| Gelişmiş Bandaj | Kumaş + Alkol | Kanamayı durdurur + enfeksiyon azaltır |
| Yanık Merhemi | Bitki + Yağ | Yanık tedavisi |
| Antibiyotik | Kimyasal bileşenler | Enfeksiyon aşama 1–2 iyileştirir |
| Serum | İleri seviye kimya | Kritik enfeksiyonu çözer |

---

# 6.10 HASTALIK & DURUM EFEKTLERİNİN UX ETKİLERİ

Kullanıcı arayüzünde:

- ekran bulanıklığı  
- kırmızı vignette  
- titreşim  
- yavaş animasyon  
- karakter nefes sesi değişimi  
- loot/craft UI’sı sarsıntılı olur  

---

# 6.11 ÖZET

Bu bölümle birlikte şunlar tanımlandı:

- fiziksel durum efektleri  
- hastalık sistemi  
- enfeksiyon aşamaları  
- yorgunluk modeli  
- panik, moral çöküşü  
- durum efektleri için tedavi yolları  
- crafting ile etkileşim  


---

# 🏠 BÖLÜM VII — ÜS (BASE) SİSTEMİ  
### *Project Survival Universe – Full AAA Detay*

---

# 7.0 ÜS SİSTEMİNE GENEL BAKIŞ

Üs (Base), oyuncunun:

- güvenlik merkezi  
- moral merkezi  
- üretim merkezi (crafting)  
- depolama alanı  
- tıbbi bakım alanı  
- sosyal etkileşim alanı  
- stratejik planlama noktası  

olarak hizmet veren en önemli “meta progression” alanıdır.  

Üs sistemi tamamen **modüler**, **geliştirilebilir**, **sınırsız genişletilebilir** şekilde tasarlanmıştır.

---

# 7.1 ÜS OLUŞTURMA — BAŞLANGIÇ SENARYOSU

Oyuncu oyuna:

- küçük, harap bir **kulübe / barınak**  
- sınırlı malzemeler  
- kırık dökük bir yatak  
- basit bir ateş çukuru  
- 1 depo sandığı  

ile başlar.

Başlangıç üssü:

| Özellik | Değer |
|---------|--------|
| Depolama | 20 slot |
| Craft İstasyonu | Yok |
| Savunma | Yok |
| Moral | Düşük |
| Elektrik | Yok |

Oyuncu üssünü bu noktadan itibaren **organik şekilde büyütür**.

---

# 7.2 ÜSÜN TEMEL FONKSİYONLARI

| Fonksiyon | Açıklama |
|-----------|----------|
| **Güvenlik** | Zombilere ve mutantlara karşı güvenli alan sağlar |
| **Crafting Merkezi** | Workbench, kimya istasyonu, metal işleme vb. |
| **Depolama** | Lootlanan eşyaları saklama |
| **Sosyal Alan** | Moral artırıcı aktiviteler (müzik, sohbet, yemek) |
| **Enerji Merkezi** | Jeneratörler, solar paneller |
| **Uyku & Dinlenme** | Yorgunluğu azaltır |
| **Üretim** | Atölye zincirleri ile ileri craft |

Üs ilerledikçe oyunun zorluk eğrisi ile birlikte “gerekli” hale gelir.

---

# 7.3 BİNA TÜRLERİ (KATEGORİLER)

Üs binaları 5 ana kategoriye ayrılır:

1. **Barınak Binaları (Shelter Structures)**  
2. **Crafting ve Üretim Binaları**  
3. **Depolama Binaları**  
4. **Savunma Binaları**  
5. **Enerji ve Teknik Binalar**

Aşağıda her kategori *detaylı* anlatılmıştır.

---

# 7.4 BARINAK BİNALARI (SHELTER)

### 1) Basit Kulübe
- başlangıç yapısı  
- moral düşük  
- ısı yalıtımı kötü  

### 2) Ahşap Ev
- ısı yalıtımı +  
- küçük mutfak alanı  
- 2 yatak kapasitesi  

### 3) Gelişmiş Ev
- moral bonusu  
- ısı stabilitesi  
- 4 yatak kapasitesi  
- küçük ışık sistemi  

### 4) Kompozit Barınak (Late Game)
- zombi saldırılarına dayanıklı  
- elektrik sistemi entegre  
- gelişmiş mutfak bağlantısı  

---

# 7.5 CRAFTING & ÜRETİM BİNALARI

Crafting sisteminin genişliği nedeniyle üretim binaları çok önemlidir.

## 🔧 Workbench (Seviye 1–3)
| Seviye | Açılan Craft Türleri |
|--------|-----------------------|
| 1 | basit araçlar, bandaj |
| 2 | metal işleme, silah modları |
| 3 | ileri mühendislik ürünleri |

## 🔬 Kimya Laboratuvarı
- tıbbi ürünler  
- ilaç  
- serum  
- patlayıcı bazı maddeler  

## 🔩 Metal İşleme Tezgahı
- levha üretimi  
- metal modifikasyonu  
- araç parçaları  

## 🪵 Ahşap Atölyesi
- mobilya  
- duvar kaplaması  
- kapılar  
- savunma bariyerleri  

## 🔧 Araç Tamir Rampası
- araç motor tamiri  
- lastik değişimi  
- yakıt filtresi üretimi  
- araç modlama seçenekleri  

Araç rampası tek başına bir **orta oyun (midgame) hedefidir.**

---

# 7.6 DEPOLAMA BİNALARI

Loot sisteminin genişliği nedeniyle **depolama yönetimi** gameplay döngüsünün büyük parçasıdır.

### Depolama Türleri

| Depo Türü | Kapasite | Özel Etki |
|-----------|-----------|------------|
| Küçük Sandık | 20 slot | başlangıç |
| Orta Sandık | 40 slot | düzenleme |
| Büyük Depo | 80 slot | ileri seviye |
| Soğuk Depo | 40 slot | yiyecek bozulmaz |
| Kimyasal Dolap | 30 slot | kimyasallar için güvenli |

Depolama, crafting istasyonlarına yakın olunca **craft süresi azalır** (quality of life bonus).

---

# 7.7 SAVUNMA BİNALARI

Üs savunması gerçek anlamda **risk yönetimi** gerektirir.

## 🪵 Ahşap Bariyer
- ucuz  
- kolay kırılır  

## 🔩 Metal Bariyer
- dayanıklı  
- gürültü azaltır  
- orta seviye saldırılara dayanıklı  

## 🧱 Beton Duvar
- çok dayanıklı  
- ileri seviye crafting gerektirir  

## 🔫 Gözetleme Kulesi
- görüş açısı geniş  
- menzilli silah avantajı  

## 🔥 Taret Sistemi (Late Game)
- elektrikli veya benzinli  
- otomatik savunma  
- mühimmat tüketir  

---

# 7.8 ENERJİ & ELEKTRİK SİSTEMİ

Üs ilerledikçe enerji gereksinimi doğar.

### Enerji Kaynakları:

| Kaynak | Açıklama |
|--------|----------|
| Jeneratör | yakıt tüketir, gürültü yapar |
| Solar Panel | düşük güç üretir, sessiz |
| Rüzgar Türbini | orta güç üretir, bakım ister |
| Batarya | enerji depolar |

Enerji **aşağıdaki sistemler için şarttır:**

- ışıklandırma  
- soğuk depo  
- taretler  
- gelişmiş crafting  
- elektrikli tuzaklar  

---

# 7.9 ÜS GELİŞİM SEVİYELERİ (BASE TIERS)

Üs 4 tier üzerinden gelişir:

## **Tier 1 — Hayatta Kalma Aşaması**
- basit kulübe  
- küçük depo  
- ateş çukuru  
- basit workbench  

## **Tier 2 — Yerleşik Aşama**
- ahşap ev  
- gelişmiş workbench  
- metal işleme  
- orta depo  
- basit savunma  

## **Tier 3 — Endüstriyel Aşama**
- kompozit barınak  
- kimya laboratuvarı  
- araç tamir rampası  
- elektrik sistemi  
- güçlü savunmalar  

## **Tier 4 — Kale Aşaması (Late Game)**
- yüksek duvarlar  
- otomatik taret  
- büyük enerji altyapısı  
- ileri seviye depolar  
- üs baskınlarına karşı dirençli yapı  

---

# 7.10 ÜS BASKINLARI (BASE RAID EVENTS)

Üs belirli koşullarda “baskına uğrayabilir”.

### Baskın tetikleyicileri:
- çok gürültülü crafting  
- gece yakılan büyük ateş  
- jeneratör gürültüsü  
- çok loot biriktirmek  
- bölgesel mutant evresi  

### Baskın davranışı:

| Durum | Etki |
|-------|------|
| Hafif Baskın | küçük zombi grupları |
| Orta Baskın | mutant lider + zombi |
| Büyük Baskın | mini-boss + büyük sürü |

### Savunma etkileri:
- duvar dayanıklılığı  
- kulelerin menzili  
- tuzak kullanımı  
- taretler  

---

# 7.11 MORAL ÜZERİNDE ÜS ETKİSİ

Üs kalitesi moral sistemi ile doğrudan ilişkilidir.

### Üs geliştikçe:

- moral yavaş düşer  
- gece uykusu iyileşir  
- crafting verimi artar  
- takım sinerjisi yükselir  

Örnek moral bonusları:

| Yapı | Moral Etkisi |
|------|--------------|
| Temiz Yatak | +%10 moral yenilenmesi |
| Sıcak Oda | moral düşüşü azalır |
| Müzik Alanı | grup moral buff’ı |
| Gelişmiş Mutfak | yemek bonusları artar |

---

# 7.12 ÜS YERLEŞİMİ (LAYOUT STRATEGY)

Strategik yerleşim:

- crafting istasyonları birbirine yakın olmalı  
- depolar atölyelerin yanında olmalı  
- savunma yapıları üs çevresini çevirir  
- elektrik altyapısı içeri konumlandırılmalı  

Harita modunda üs grid tabanlıdır:

```
[ S ][ S ][ D ][ W ]
[ B ][ C ][ C ][ D ]
[ M ][ M ][ P ][ E ]
```

S = Savunma  
D = Depo  
W = Workbench  
B = Barınak  
C = Crafting  
M = Metal Atölye  
P = Power  
E = Elektrik odası  

---

# 7.13 ÜS’TE KARAKTER ETKİLEŞİMLERİ

Karakterler:

- yemek yer  
- uyur  
- müzik çalar  
- sohbet eder  
- crafting yapar  
- eşya taşır  

Bu etkileşimler moral ve stamina üzerinde etkili olur.

---

# 7.14 ÜS GÜNCELLEME MALİYETİ (ECONOMY TABLE)

Örnek maliyet tablosu:

| Yapı | Malzeme | Miktar |
|------|---------|--------|
| Ahşap Ev | Ahşap | 120 |
| | Çivi | 40 |
| | Kumaş | 10 |
| Metal Tezgah | Hurda | 80 |
| | Çelik Levha | 20 |
| Jeneratör | Motor Parçası | 1 |
| | Akü | 1 |
| | Metal | 50 |

---

# 7.15 ÜS SİNERJİ MEKANİKLERİ

Bazı yapılar yan yana olduğunda bonus verir:

| Yapı Kombinasyonu | Etki |
|--------------------|-------|
| Mutfak + Soğuk Depo | yemeklerin raf ömrü ↑ |
| Workbench + Metal Atölye | craft hızı ↑ |
| Elektrik + Kimya Lab | ileri tıbbi craft açılır |
| Gözetleme + Taret | savunma menzili ↑ |

---

# 7.16 ÜS SİSTEMİNİN META-PROGRESSION ROLÜ

Üs:

- long-term progression’ın %50’sini oluşturur  
- oyuncuya hedef verir  
- zorluk eğrisini yönetir  
- ekonomik döngünün merkezidir  
- risk/ödül dengesini belirler  

Üssü geliştirmek → yeni crafting tarifleri açar → yeni loot bölgelerine erişim sağlar.

---

# 7.17 ÖZET

Bu bölüm, PSU’nun:

- üs inşa mantığını  
- modüler bina sistemini  
- depolama yönetimini  
- crafting altyapısını  
- elektrik sistemini  
- savunma yapılarını  
- moral etkisini  
- baskın mekaniklerini  

tam kapsamlı şekilde anlatır.


---

# 🔧 BÖLÜM VIII — CRAFTING SİSTEMİ  
### *Project Survival Universe – Full AAA Detay*

---

# 8.0 CRAFTING SİSTEMİNİN GENEL VİZYONU

PSU’daki Crafting Sistemi **oyunun en derin mekaniklerinden biridir** ve aşağıdaki tasarım ilkelerine dayanır:

1. **Multi-Step Production** → Tek bir ürün bazen 3–6 ara ürün ister.  
2. **Role-Based Crafting** → Meslekler üretim verimini artırır.  
3. **Quality System** → Üretilen eşyaların kalite seviyeleri vardır.  
4. **Time Investment** → Craft süresi oyun ritmini belirler.  
5. **Environment-Based Crafting** → Üretim istasyonları “alan bonusları” sağlar.  
6. **Energy Integration** → Bazı craft işlemleri enerji gerektirir.  
7. **Risk & Error System** → Yanlış craft yapma ihtimali vardır (low skill).  
8. **Industrial Expansion (Late Game)** → Motor, araç, devre üretimi vb.

Crafting oyunun ana progression’ının %40’ını oluşturur.

---

# 8.1 CRAFTING KATEGORİLERİ

Crafting 6 ana kategoriden oluşur:

1. **Basic Survival Crafting** → bandaj, sopa, basit araçlar  
2. **Cooking & Food Processing** → yemek, içecek, moral yemekleri  
3. **Metalworking & Machining** → metal levha, civata, silah modulu  
4. **Woodworking** → mobilya, kapı, duvar, barricade  
5. **Chemistry & Medical Crafting** → ilaç, serum, kimyasal çözelti  
6. **Engineering & Vehicle Crafting** → motor parçası, akü, tekerlek, devreler  

Her kategori için alt sistemler aşağıda detaylandırılmıştır.

---

# 8.2 ÜRETİM ALTYAPISI — WORKBENCH & İSTASYON MODELİ

Crafting istasyonları 4 ana seviyeye ayrılır:

| İstasyon Seviyesi | Örnek İstasyon | Açılan Üretimler |
|-------------------|----------------|------------------|
| **Tier 1** | Basit Workbench | bandaj, ip, sopa, basit alet |
| **Tier 2** | Metal Tezgah | silah modları, metal levha |
| **Tier 3** | Gelişmiş Atölye | motor parçaları, kompleks devre |
| **Tier 4** | Endüstriyel İstasyon | araç modifikasyonları, yüksek kalite ürün |

Bunlar crafting zincirinin temelidir.

---

# 8.3 MALZEME SINIFLARI

Tüm crafting malzemeleri 6 kategoriye ayrılır:

| Sınıf | Örnek | Kullanım Alanı |
|------|--------|-----------------|
| **Organik** | bitki, et, odun | yemek, ilaç |
| **Basit Hammadde** | hurda metal, kumaş | early craft |
| **Gelişmiş Materyal** | çelik levha, karbon | midgame metal craft |
| **Elektronik** | kablo, devre, çip | mühendislik |
| **Kimyasal** | solvent, alkol, asit | ilaç, patlayıcı |
| **Araç Bileşeni** | yağ filtresi, piston | araç tamiri |

Her materyalin alt kalite seviyeleri vardır.

---

# 8.4 CRAFTING KALİTE SİSTEMİ

Crafting çıktıları 4 kalite seviyesine ayrılır:

1. **Normal**  
2. **İyi** (+%10 dayanıklılık)  
3. **Kaliteli** (+%20 dayanıklılık / +%10 performans)  
4. **Usta İşçilik** (rare durum) (+%30 dayanıklılık / özel bonus)

**Kalite**, şu formülle belirlenir:

```
QualityScore = CraftSkill * 0.3 + ToolQuality * 0.25 + MaterialQuality * 0.3 + RandomVariance
```

RandomVariance = -5 ile +5 arasında

---

# 8.5 CRAFT SÜRESİ FORMÜLÜ

```
CraftTime = BaseTime * (1 - CraftEfficiency) * (1 + FatiguePenalty) * ComplexityFactor
```

- CraftEfficiency karakterin stat ve skill tree değerlerinden gelir  
- FatiguePenalty yorgunluk değerine göre 0–0.5 arası  
- ComplexityFactor 1 (basit) ile 3 (çok karmaşık) arası  

---

# 8.6 CRAFT HATALARI (MISTAKE SYSTEM)

Low-skill oyuncular şu hataları yapabilir:

| Hata Türü | Etki |
|-----------|------|
| Malzeme İsrafı | %10 malzeme kaybı |
| Kalite Düşüşü | ürün +%15 düşük dayanıklılık |
| Zaman Uzaması | craft süresi +%50 |
| Ürün Başarısız | %5 ihtimalle craft iptal |

Skill Tree → crafting hatalarını büyük ölçüde azaltır.

---

# 8.7 MULTI-OUTPUT CRAFTING (TEK GİRDİDEN BİRDEN FAZLA ÜRÜN)

Bazı materyaller üretim sürecinde yan ürün çıkarır.

Örnek:

```
Metal İşleme:
 Hurda Metal → 1 Metal Parça + %25 ihtimal Hurda Civata
```

Gelişmiş craft’lar daha çok yan ürün çıkarabilir.

---

# 8.8 CRAFTING AĞACI (ÜRETİM ZİNCİRİ ÖRNEKLERİ)

Aşağıda 6 ana zincir örnek verilmiştir.

---

# 🍳 8.8.1 Yemek & Pişirme Zinciri

**Temel → Orta → İleri → Morale Meal**

```
Çiğ Sebze → Haşlanmış Sebze → Karışık Çorba → Enerji Çorbası
Çiğ Et → Izgara Et → Marineli Et → Moral Yükselten Yemek
Mantar → Kızarmış Mantar → Protein Yemeği
```

Yemek crafting moral üzerinde çok etkilidir.

---

# 🩹 8.8.2 Tıbbi Crafting Zinciri

```
Kumaş → Basit Bandaj → Gelişmiş Bandaj → Dikiş Seti

Bitki → Ekstrakt → İlaç Bazı → Ağrı Kesici

Kimyasal 1 + Kimyasal 2 → Serum Bazı → Antibiyotik Serum
```

Late game:  
**Advanced Serum** → mutasyon etkilerini aza indirebilir.

---

# 🔧 8.8.3 Araç Üretim Zinciri (Vehicle Engineering)

```
Hurda Metal → Metal Levha → Motor Kovanı

Kablo + Devre + Çip → Araç ECU (Elektronik Kontrol Ünitesi)

Lastik Parçası + Kauçuk → Tekerlek

Kimyasal → Yakıt Katkısı
```

Araç tamiri **birden fazla parçayı** gerektirir.

---

# 🪚 8.8.4 Ahşap İşleme Zinciri

```
Ağaç Kütüğü → Kesilmiş Odun → Tahta Plaka → Mobilya / Duvar / Kapı
```

Yüksek seviyede:

- ses yalıtımlı kapılar  
- güçlendirilmiş barricade  
- dekoratif mobilya  

üretilebilir.

---

# 🔩 8.8.5 Metal İşleme Zinciri

```
Hurda Metal → Eritilmiş Metal → Çelik Levha → Silah Modu / Parça Üretimi
```

Gelişmiş ürünler:

- namlu modları  
- susturucular  
- yakın dövüş silahları  
- araç çerçeve parçaları  

---

# 🧪 8.8.6 Kimya & Patlayıcı Zinciri

```
Solvent + Alkol → Temizleyici Solüsyon
Asit + Metal → Reaktif Bileşen
Kimyasal Baz + Katalizör → Patlayıcı Maddenin Çekirdeği
```

Patlayıcılar → sadece late-game crafting ile.

---

# 8.9 CRAFTING REÇETELERİ (ÖRNEK 25 TARİF)

### Basit Tarifler (Tier 1)
| Ürün | Gerekenler |
|------|-------------|
| Basit Bandaj | Kumaş |
| Tahta Mızrak | Odun + Bıçak |
| İp | Kumaş parçaları |

### Orta Tarifler (Tier 2)
| Ürün | Gerekenler |
|------|-------------|
| Metal Levha | Hurda Metal ×3 |
| Silah Modu | Metal Levha + Tornavida |
| Gelişmiş Bandaj | Kumaş + Alkol |

### İleri Tarifler (Tier 3)
| Ürün | Gerekenler |
|------|-------------|
| Motor Parçası | Çelik Levha + Civata + Yağ |
| İleri Serum | Kimyasal Baz + 2 özel bileşen |
| Sessiz Ayakkabı | Kumaş + Lastik Parça |

### Endüstriyel Tarifler (Tier 4)
| Ürün | Gerekenler |
|------|-------------|
| Araç ECU | Devre + Çip + Kablo |
| Mini Jeneratör | Motor + Akü + Metal |
| Kevlar Zırh | Kevlar Bazı + Çelik Parça |

---

# 8.10 CRAFTING PROFICIENCY (UZMANLIK ETKİLERİ)

Crafting yeterliliği 0–100 arası ölçülür.

| Yeterlilik | Etki |
|------------|-------|
| 0–20 | yüksek hata oranı |
| 21–50 | normal crafting |
| 51–80 | yüksek kalite ürün |
| 81–100 | ustalık, çift ürün ihtimali +%10 |

---

# 8.11 MESLEK BONUSLARI (CRAFTING SİNERJİ)

| Meslek | Craft Bonus |
|--------|-------------|
| Mekanikçi | araç craft süresi -%30 |
| Doktor | tıbbi craft kalitesi +%30 |
| Aşçı | yemek kalitesi +%40 |
| Metal İşçisi | metal craft verimi +%20 |
| Elektronikçi | devre craft başarısı +%25 |

---

# 8.12 ÇEVRESEL CRAFT BONUSLARI

Crafting üssün özelliklerinden etkilenir.

| Çevre Etkeni | Craft Etkisi |
|--------------|--------------|
| Işık | craft doğruluğu ↑ |
| Gürültü | hatalar ↑ |
| Temiz Alan | kalite ↑ |
| Depo Yakınlığı | craft süresi ↓ |

---

# 8.13 CRAFTING UI AKIŞI

Craft ekranı:

```
[Tarif Arama]  
[Tarif Detayları]  
[Gerekli Materyaller]  
[Craft Süresi & Kalite Tahmini]  
[Craft Butonu]  
[Çıktı Kalitesi]
```

Kalite tahmini oyuncuya risk değerlendirmesi sağlar.

---

# 8.14 ENDGAME CRAFTING — ENDÜSTRİYEL SEVİYE

Endgame crafting şunları içerir:

- yakıt üretimi  
- ileri seviye zırh üretimi  
- araç modlama  
- elektronik kontrol sistemleri  
- üs için elektrik altyapısı  
- taret üretimi  

Bunlar oyunun uzun vadeli metasını oluşturur.

---

# 8.15 CRAFTING & LOOT SİNERJİ TABLOSU

| Loot Türü | Crafting Kullanımı |
|-----------|---------------------|
| Hurda Metal | metal, araç parçaları |
| Bitki | ilaç, yemek |
| Kimyasal | serum, temizleyici |
| Elektronik | devre, sensör |
| Kumaş | kıyafet, bandaj |

---

# 8.16 ÖZET

Bu bölüm PSU’nun:

- üretim zincirlerini  
- crafting seviyelerini  
- kalite, süre, hata sistemini  
- meslek bonuslarını  
- advanced crafting içeriklerini  
- araç üretim mekaniğini  
- endüstriyel late-game crafting’i  

tam kapsamlı şekilde tanımlar.


---

# 🎒 BÖLÜM IX — LOOT SİSTEMİ  
### *Project Survival Universe – Full AAA Detay*

---

# 9.0 LOOT SİSTEMİNİN GENEL AMACI

Loot sistemi PSU’nun:

- keşif duygusunu  
- risk/ödül dengesini  
- crafting akışını  
- oyuncu motivasyonunu  
- ekonomik döngüyü  
- progression hızını  

belirleyen *ana çekirdek sistemlerden biridir.*

Loot sistemi tamamen **dinamik**, **bölgesel**, **risk temelli**, **rarity ağırlıklı** çalışır.

---

# 9.1 LOOT RARITY SİSTEMİ

Tüm loot öğeleri 5 kalite seviyesine sahiptir:

| Rarity | Renk | Tanım | Drop Oranı |
|--------|------|--------|-------------|
| **Common** | Gri | Temel malzemeler, sık bulunan | %60–70 |
| **Uncommon** | Yeşil | Orta seviye loot | %20 |
| **Rare** | Mavi | Değerli crafting malzemeleri | %7–12 |
| **Epic** | Mor | Özel modüller, ileri seviye bileşenler | %2–3 |
| **Legendary** | Turuncu | Unique loot, özel ekipman | %0.1–1 |

Rare ve üzeri lootlar **riskli bölgelerde** daha fazla görülür.

---

# 9.2 LOOT KATEGORİLERİ

Loot sistemindeki item’lar kullanım amacına göre kategorize edilir:

| Kategori | Örnek | Kullanım |
|----------|--------|----------|
| **Yiyecek** | konserve, kurutulmuş et | Açlık yönetimi |
| **Su/İçecek** | temiz su, enerji içeceği | Susuzluk giderme |
| **Tıbbi** | bandaj, ilaç, serum | Tedavi |
| **Crafting Materyali** | metal, kumaş, bitki | Crafting zinciri |
| **Elektronik** | kablo, devre, çip | Mühendislik |
| **Silah/Mod** | tabanca, susturucu | Savaş |
| **Zırh/Kıyafet** | mont, çelik plaka | Dayanıklılık |
| **Araç Parçası** | akü, piston | Araç tamiri |
| **Özel Loot** | blueprint, rare item | Skill/craft progression |

---

# 9.3 BÖLGE BAZLI LOOT TABLOLARI (AAA DETAY)

Her bölgenin kendine özel loot tablosu vardır.

Aşağıda örnek *detaylı* loot dağılımları verilmiştir.

---

# 🏙️ 9.3.1 ŞEHİR MERKEZİ

Yüksek risk + yüksek loot bölgesidir.

| Kategori | Drop Oranı |
|----------|------------|
| Elektronik | %25 |
| Tıbbi | %15 |
| Crafting malzemesi | %20 |
| Rare modüller | %10 |
| Silah/Mod | %12 |
| Epic loot | %3 |
| Legendary | %0.5 |

Özel loot:
- Laptop parçaları  
- Gelişmiş devre  
- Yüksek kalite metal  

---

# 🌲 9.3.2 ORMAN BİYOMU

| Kategori | Drop Oranı |
|----------|------------|
| Bitki | %40 |
| Doğal yiyecek | %25 |
| Su | %15 |
| Craft (ahşap) | %20 |
| Rare | %2 |

Özel loot:
- nadir mantarlar  
- ilaç üretiminde kullanılan bitkiler  

---

# 🧪 9.3.3 LABORATUVAR / ARAŞTIRMA TESİSLERİ

| Kategori | Drop Oranı |
|----------|------------|
| Kimyasal | %30 |
| Tıbbi yüksek seviye | %25 |
| Epic | %5 |
| Legendary | %2 |
| Craft (elektronik) | %20 |

Özel loot:
- serum bileşenleri  
- mutasyon raporları  
- advanced blueprint  

---

# 🛢️ 9.3.4 SANAYİ BÖLGESİ

| Kategori | Drop Oranı |
|----------|------------|
| Metal | %40 |
| Araç parçası | %20 |
| Petrol türevleri | %10 |
| Rare mühendislik ürünleri | %8 |

Özel loot:
- motor parçaları  
- çelik levha kalıpları  

---

# 🛫 9.3.5 HAVALİMANI

| Kategori | Drop Oranı |
|----------|------------|
| Silah/Mod | %20 |
| Elektronik | %15 |
| Rare | %12 |
| Epic | %4 |
| Birden fazla loot paketi | yüksek şans |

Özel loot:
- güvenlik ekipmanı  
- çelik kaplama kıyafet  
- özel pilot çantası  

---

# 9.4 BİNA TİPİNE GÖRE LOOT TABLOLARI

Her bina farklı loot havuzuna sahiptir.

## 🏪 MARKET
| Loot Türü | Oran |
|-----------|-------|
| Yiyecek | %50 |
| Su | %20 |
| Craft malzemesi | %10 |
| Rare | %1 |

## 🏥 HASTANE
| Loot Türü | Oran |
|-----------|--------|
| Tıbbi | %60 |
| Serum | %10 |
| Kimyasal | %15 |
| Legendary (tıbbi) | %0.5 |

## 🏚️ METRUH BİNALAR
| Loot Türü | Oran |
|-----------|--------|
| Craft malzemesi | %35 |
| Kumaş | %20 |
| Metal | %10 |
| Rare | %5 |

## 🚗 ARAÇ İÇİ LOOT
| Loot Türü | Oran |
|-----------|--------|
| Araç parçası | %20 |
| Yakıt | %10 |
| Kişisel eşyalar | %20 |
| Silah (düşük oran) | %3 |

---

# 9.5 ZOMBİ DROP TABLOSU (AI-BASED LOOT)

Zombilerin loot drop oranı zombi tipine göre değişir.

| Zombi Tipi | Drop | Oran |
|------------|-------|-------|
| Normal | Common | %90 |
| Hızlı mutant | Rare | %10 |
| Kör mutant | Ses bazlı loot: elektronik | %5 |
| Sağır mutant | Görüş ekipmanları | %5 |
| Mini-Boss | Rare/Epic | %100 |
| Bölgesel Boss | Epic/Legendary | %100 |

Mini-boss ve boss lootları oyun ilerlemesinin ana parçalarındandır.

---

# 9.6 RISK/REWARD MODELİ (MATEMATİKSEL)

Loot kalitesi *tehlike seviyesi + oyuncu davranışı* ile ölçülür.

Formül:

```
LootQuality = BaseRarity + (AreaRisk * 0.4) + (NoiseGenerated * 0.1) + (TimeSpent * 0.05)
```

- AreaRisk: bölge tehlike katsayısı  
- NoiseGenerated: hızlı loot = daha fazla risk  
- TimeSpent: bölge ne kadar uzun keşfedilirse o kadar fazla loot şansı  

---

# 9.7 HIZLI LOOT vs SESSİZ LOOT

### Hızlı Loot:
- +%20 loot hızı  
- +gürültü  
- +zombi çekme  
- drop kalitesi bir miktar artabilir  

### Sessiz Loot:
- yavaş  
- zombi çekmez  
- rare bulma ihtimali +%5  

---

# 9.8 LOOT YENİLENME SİSTEMİ

Loot oyunda **yenilenmez.**  
Bu:

- kaynak kıtlığı  
- zor kararlar  
- üs geliştirme gerekliliği  
- bölgeler arası göç  
- co-op planlama  

gibi mekanikleri tetikler.

Sadece **doğal loot** yavaşça yenilenir:

| Doğal Loot | Yenilenme Süresi |
|-------------|------------------|
| Meyve | her sezon |
| Mantar | 3 gün |
| Bitkiler | 2–5 gün |
| Su kaynakları | sınırsız ama kirlenebilir |

---

# 9.9 LOOT KALİTESİNE GÖRE ETKİLER

| Rarity | Performans Etkisi |
|--------|-------------------|
| Common | Temel crafting |
| Uncommon | istikrarlı kullanım |
| Rare | oyun ortası güçlendirme |
| Epic | önemli zırh/silah farkı |
| Legendary | build-changing item |

Build-changing item örnekleri:  
- susturucu master modülü  
- mutant dedektörü  
- enerji tasarruflu araç modülü  

---

# 9.10 LOOT OLAYLARI (EVENT-BASED LOOT)

Bazı etkinliklerde **özel loot** bulunabilir:

### 1) Air Drop  
- rare–legendary loot  
- mini-boss savunur  

### 2) Mutant Nest  
- risk yüksek  
- epik craft malzemeleri içerir  

### 3) Araç Konvoyu  
- mühimmat  
- araç parçaları  

### 4) Laboratuvar Alarmı  
- tıbbi advanced loot  

---

# 9.11 SECRET LOOT AREAS (GİZLİ ODALAR)

Bazı bölgeler:

- gizli kapılar  
- bodrumlar  
- çatı çıkışları  
- tavan arası  
- kilitli odalar  

içerebilir.

**Rare → Epic → Legendary loot** bulunma ihtimali yüksektir.

---

# 9.12 LOOT & CRAFTING SİNERJİ MODELİ

```
Loot → Crafting Materials → Üretim → Üs Geliştirme → Yeni Bölgeler → Daha İyi Loot
```

Bu döngü oyunun “sonsuz progression” hissini doğurur.

---

# 9.13 EARLY/MID/LATE GAME LOOT DAĞILIMI

### Early Game
- yiyecek  
- su  
- basit crafting malzemesi  
- düşük seviye silahlar  

### Mid Game
- metal  
- elektronik  
- araç parçaları  
- rare lootlar  

### Late Game
- epic/legendary modüller  
- serum bileşenleri  
- devre çipleri  
- araç ECU  

---

# 9.14 ÖZET

Bu bölüm loot sisteminin:

- rarity tabanlı yapısını  
- bölge ve bina bazlı tablolarını  
- risk/ödül matematiğini  
- zombi drop mantığını  
- endgame lootlarını  
- crafting ile ilişkisini  

AAA detayında tanımlar.

---

# 🎒 BÖLÜM X — ENVANTER SİSTEMİ  
### *Project Survival Universe – Full AAA Detay*

---

# 10.0 ENVANTER SİSTEMİNİN VİZYONU

PSU envanter sistemi üç temel tasarım prensibine dayanır:

1. **Gerçekçilik:**  
   - büyük eşyalar çantaya sığmaz  
   - mızrak cepte taşınamaz  
   - ağır yük → yüksek stamina tüketimi  

2. **Strateji:**  
   - hangi item’i yanına alacağın hayati önem taşır  
   - cepler, çanta, kıyafet → farklı bonuslar verir  

3. **Okunabilirlik:**  
   - grid tabanlı, sade tasarım  
   - item boyutları belirgin  
   - filtre ve kategoriler ile hızlı navigasyon  

---

# 10.1 ENVANTERİN ANA BİLEŞENLERİ

Envanter üç ana bölmeden oluşur:

1. **Ana Envanter (Backpack & Kıyafet)**  
2. **Hızlı Slotlar (Quickslots)**  
3. **Ekipman Slotları (Gear Slots)**  
4. **Araç Bagajı (Vehicle Inventory)**  
5. **Giyilebilir Cepler (Pocket Slots)**  

Aşağıda her biri detaylı açıklanmıştır.

---

# 10.2 AĞIRLIK SİSTEMİ (WEIGHT MODEL)

Ağırlık sistemi oyun deneyiminin en önemli parçalarındandır.

### Toplam Taşıma Kapasitesi:

```
MaxCarry = BaseCarry + BackpackBonus + ClothingBonus + SkillBonus
```

BaseCarry karaktere göre 16–25 kg arasıdır.

### Ağırlığın Etkileri:

| Ağırlık Seviyesi | Etki |
|-------------------|-------|
| 0–50% | normal hareket |
| 51–75% | hız -%10 |
| 76–100% | hız -%20, stamina drain ↑ |
| 100%+ | koşamaz, stamina hızlı düşer |
| 120%+ | karakter düşme animasyonu → item bırakma |

---

# 10.3 ITEM BOYUT KATEGORİLERİ

Her eşyanın bir **boyut kategorisi** vardır. Bu gerçekçilik sağlar.

| Boyut | Örnek | Taşınma Şekli |
|-------|--------|----------------|
| **Mini** | çikolata, çakmak | cepler |
| **Küçük** | bıçak, bant | cepler veya çanta |
| **Orta** | yiyecek, modüller | çanta |
| **Büyük** | tüfek, mızrak | sırtta |
| **Ağır** | akü, motor parçası | her seferde 1 adet taşınabilir |
| **Dev** | jeneratör, kapı | sadece araçla taşınabilir |

---

# 10.4 GRID TABANLI ENVANTER

Ana envanter **grid sistemi** kullanır.

Örnek:

```
[2x2] Küçük Eşya
[2x4] Tıbbi Çanta
[1x3] Susturucu
[4x2] Tüfek
```

Grid düzeni oyuncuya görsel ve stratejik bir düzen sunar.

---

# 10.5 CEP SİSTEMİ (POCKETS)

Cepler hızlı erişim içindir.

| Cep Türü | Kapasite | Örnek |
|----------|-----------|--------|
| Küçük Cep | 1 mini item | çikolata, çakmak |
| Orta Cep | 1 küçük item | bıçak |
| Büyük Cep | 1 orta item | su, konserve |

Cepler → **loot hızını artırır** çünkü çantayı açmadan erişilir.

---

# 10.6 ÇANTA TİPLERİ (BACKPACK SYSTEM)

Çanta kalitesi oyun tarzını belirler.

| Çanta | Kapasite | Ağırlık | Bonus |
|-------|-----------|----------|--------|
| Küçük Sırt Çantası | 12 slot | hafif | early game |
| Orta Sırt Çantası | 20 slot | orta | balanced |
| Askeri Çanta | 30 slot | ağır | rare loot |
| Taktik Çanta | 24 slot | hafif | +2 pocket slot |
| Mühendis Çantası | 18 slot | ağır | craft ekipman bonusu |

---

# 10.7 KIYAFET BONUSLARI

Kıyafet statlara etki eder:

| Kıyafet Türü | Bonus |
|--------------|--------|
| Mont | soğuk direnci ↑ |
| Hafif Zırh | dayanıklılık ↑ |
| Çelik Kaplama | ağır ancak yüksek koruma |
| Yağmurluk | yağmur → ses maskesi ↑ |

Bazı kıyafetler **ek cepler** verir.

---

# 10.8 HIZLI SLOT (QUICKSLOT) SİSTEMİ

Oyuncunun hızlıca eriştiği slotlardır:

- 1 yakın dövüş silahı  
- 1 ateşli silah  
- 1 tıbbi eşya  
- 1 atılabilir eşya (molotof, tuzak)  

Quickslot → savaş akışını belirler.

---

# 10.9 EKİPMAN SLOTU (GEAR SLOTS)

Gear slotları:

- Başlık  
- Üst beden  
- Alt beden  
- AYakkabı  
- Sırt (büyük silah)  
- Bel (kılıf)  
- Eldiven  
- Gözlük  

Bu slotlar zırh ve bonus taşır.

---

# 10.10 ARAÇ BAGAJI (VEHICLE INVENTORY)

Araç bagajı **çeşitli büyüklüklerde** olabilir.

| Araç Tipi | Bagaj | Ağırlık Limiti |
|-----------|--------|------------------|
| Binek | 20–30 slot | 150 kg |
| Kamyonet | 40–60 slot | 300 kg |
| Kamyon | 80–120 slot | 600 kg |

### Kritik Mekanik:
Bagaj ağırlığı → yakıt tüketimini artırır.

Formül:

```
FuelConsumption = BaseFuel * (1 + (CargoWeight / MaxWeight) * 0.5)
```

---

# 10.11 ITEM DAYANIKLILIĞI (DURABILITY SYSTEM)

Silah, kıyafet ve araç parçaları zamanla yıpranır.

| Durum | Etki |
|--------|------|
| 100–75% | tam performans |
| 74–50% | %5 performans düşüşü |
| 49–25% | %15 performans düşüşü |
| 24–1% | %30 performans düşüşü |
| 0% | eşya kırılır |

Durability → tamir gerektirir.

---

# 10.12 ITEM AĞIRLIK KATEGORİ TABLOSU

| Item Türü | Ağırlık (kg) |
|-----------|----------------|
| Yiyecek | 0.2–1.0 |
| Su | 0.5–1.5 |
| Kumaş | 0.1 |
| Metal parça | 0.3–2.0 |
| Araç parçası | 1–6 |
| Motor | 20–40 |

---

# 10.13 ITEM FİZİKSEL YERLEŞİM KISITLAMALARI

- Tüfek → mutlaka “sırt” slotunda  
- Mızrak → çanta grid’ine sığmaz  
- 2 büyük silah aynı anda taşınamaz  
- Büyük araç parçaları → sadece elde veya araçla taşınabilir  

Bu sistem oyuncunun gerçekçi kararlar vermesini sağlar.

---

# 10.14 ENVANTER UI/UX TASARIMI

Envanter ekranı üç panelden oluşur:

```
[Karakter Paneli]   [Ana Grid]       [Item Detayları]
Statlar            Çanta İçeriği     Ağırlık
Kıyafet Slotları   Cepler            Durability
Silah Slotları     Quickslot         Kullanım
```

Filtreler:
- tıbbi  
- yiyecek  
- crafting  
- ekipman  
- araç parçaları  

Drag&Drop desteklenir.

---

# 10.15 ENVANTER BUFF/DEBUFF MODELİ

### Pozitif etkiler:
- düzenli inventory → loot hızı +  
- hafif yük → stamina tüketimi az  
- taktik çanta → craft +  

### Negatif etkiler:
- aşırı yük → yavaşlama  
- ağır araç parçaları → stamina drain ↑  
- düzensiz çanta → aranan item bulma süresi ↑ (opsiyonel mekanik)

---

# 10.16 ENVANTER & CRAFTING SİNERJİSİ

Crafting istasyonları yakınsa:

- çantadan otomatik olarak gerekli item alınabilir  
- craft süresi kısalır  
- hatalar azalır  

Bu mekanik oyuncuya motivasyon sağlar:  
**Üs düzeni → crafting verimi → oyun döngüsü.**

---

# 10.17 INVENTORY STRATEGY (YÜKSEK SEVİYE ANALİZ)

### Early game:
- 1 silah  
- temel yiyecek  
- bandaj  
- bıçak  

### Mid game:
- malzeme çeşitliliği  
- araç parçaları  
- tıbbi ürünler  

### Late game:
- devreler  
- kimyasal bileşenler  
- ağır ekipman  
- rare modüller  

---

# 10.18 ÖZET

Bu bölümde envanter sisteminin:

- ağırlık fiziği  
- grid düzeni  
- araç bagaj modeli  
- çanta/cepler  
- ekipman slotları  
- durability  
- UI/UX  
- stat ve crafting etkileşimi  

tam kapsamlı şekilde açıklanmıştır.

---

# 🚗 BÖLÜM XI — ARAÇ SİSTEMİ  
### *Project Survival Universe – Full AAA Detay*

---

# 11.0 ARAÇ SİSTEMİNE GENEL BAKIŞ

Araçlar PSU’da sadece ulaşım aracı değildir.  
Aynı zamanda:

- loot taşıma sistemi  
- acil kaçış mekanizması  
- zombi tehdidinden korunma yöntemi  
- üs gelişiminin bir parçası  
- crafting zincirinin ileri aşaması  

olarak tasarlanmıştır.

Araç sistemi tam anlamıyla **simülasyon + RPG hibriti** olarak çalışır.

---

# 11.1 ARAÇ TÜRLERİ

Oyunda başlangıç olarak **3 ana araç türü** bulunur:

## 1) **Binek Araç (Sedan / Hatchback)**
- hızlı  
- düşük yakıt tüketimi  
- küçük bagaj  
- düşük off-road performansı  

## 2) **Kamyonet / Pickup**
- orta hız  
- yüksek bagaj kapasitesi  
- dayanıklı  
- off-road’da başarılı  
- yakıt tüketimi orta  

## 3) **Kamyon (Cargo Truck)**
- yavaş  
- çok yüksek bagaj  
- çok yakıt tüketir  
- gürültülü (zombi çeker)  
- endgame seviyesi  

---

# 11.2 ARAÇ STAT SİSTEMİ

Her araç 8 ana stat değerine sahiptir:

| Stat | Açıklama |
|-------|----------|
| **Top Speed** | Maksimum hız |
| **Acceleration** | Hızlanma |
| **Fuel Consumption** | Yakıt tüketim oranı |
| **Durability** | Araç dayanıklılığı |
| **Traction** | Off-road tutunma |
| **Cargo Capacity** | Taşıyabileceği yük miktarı |
| **Noise Level** | Gürültü seviyesi |
| **Handling** | dönüş performansı |

---

# 11.3 ARAÇ PERFORMANS FORMÜLLERİ

## Top Speed Formülü
```
TopSpeed = BaseSpeed - (CargoWeight * 0.4)
```

## Yakıt Tüketimi (FuelBurn)
```
FuelBurn = BaseFuel * (1 + CargoWeightRatio * 0.5)
```

CargoWeightRatio = bagaj ağırlığı / maksimum kapasite

## Araç Gürültü Yayılımı
```
NoiseRange = BaseNoise * (SpeedFactor + EngineConditionFactor)
```

---

# 11.4 ARAÇ PARÇALARI (MODÜLER SİSTEM)

Her araç 7 ana parçadan oluşur:

1. Motor  
2. Akü  
3. Lastikler (4 adet)  
4. Yakıt filtresi  
5. Fren sistemi  
6. Gövde (Body)  
7. ECU (Elektronik Kontrol Ünitesi)

---

# 11.5 PARÇA DAYANIKLILIĞI

Her parça %100 → 0 arasında dayanıklılığa sahiptir.

| Durum | Etki |
|--------|------|
| 100–75% | normal |
| 74–50% | performans -%10 |
| 49–25% | performans -%25 |
| 24–1% | performans -%40 |
| 0% | araç çalışmaz |

---

# 11.6 PARÇA HASAR ALMA MEKANİĞİ

Parçalar şu durumlarda yıpranır:

- yüksek hızda çarpma  
- off-road kullanım  
- aşırı yük  
- düşük yağ seviyesi  
- eski parçaların kullanımı  

---

# 11.7 ARAÇ TAMİR SİSTEMİ

Araç tamiri yalnızca **Araç Tamir Rampasında** yapılabilir.

### Tamir Gereksinimleri:

| Parça | Gereken Malzeme |
|--------|------------------|
| Motor | çelik levha + cıvata + yağ |
| Lastik | kauçuk + lastik seti |
| Akü | kimyasal + devre |
| Gövde | metal levha |

Tamir süresi:

```
RepairTime = BaseTime * (1 - MechanicSkillBonus)
```

---

# 11.8 ARAÇ MODLAMA (UPGRADE SYSTEM)

Araçlar 5 modifikasyon yuvasına sahiptir:

1. **Motor Modu:** hız arttırıcı  
2. **Zırh Modu:** gövde dayanıklılığı  
3. **Sessiz Egzoz:** gürültü azaltır  
4. **Yakıt Verim Kiti:** fuel burn -%20  
5. **Depolama Modu:** bagaj kapasitesi +%20  

Rare ve Epic modlar late-game loot olarak bulunur.

---

# 11.9 ARAÇ ÇALIŞMA DURUMU (CONDITION STATES)

Araçlar spawn olduğunda 4 durumdan birinde olabilir:

| Durum | Tanım |
|--------|--------|
| **Çalışır** | yakıt varsa sürülebilir |
| **Az Hasarlı** | tamir gerektirir |
| **Çalışmıyor** | motor/akü eksik |
| **Hurda** | sadece parçaları alınabilir |

Hurda araçlardan çıkarılabilir parçalar:

- akü  
- lastik  
- metal  
- kablolar  
- motor parçaları  

---

# 11.10 YAKIT SİSTEMİ

Yakıt oyunda **nadir kaynaklardan biridir.**

Yakıt kaynakları:

- benzin istasyonu tankları  
- metal bidonlar  
- diğer araçlardan sifon ile yakıt çekme  
- petrol işleme (late-game crafting)  

### Yakıt Kalitesi:
- düşük kalite → %10 fazla tüketim  
- yüksek kalite → motor performansı +%5  

---

# 11.11 SİFON SİSTEMİ (ARAÇTAN YAKIT ÇEKME)

Her araçtan sifon ile yakıt alınabilir.

```
SiphonEfficiency = 0.25 + (MechanicSkill * 0.05)
```

Yani yetenek arttıkça daha iyi sifon yaparsın.

---

# 11.12 ARAÇ BAGAJI (INVENTORY SYNC)

Araç bagajı kendi ağırlık fiziğine sahiptir.

- bagaj doldukça hız düşer  
- yakıt tüketimi artar  
- gürültü seviyesi artar  
- araç yokuşlarda zorlanır  

Bu sistem loot run’larını daha stratejik yapar.

---

# 11.13 GÜRÜLTÜ → ZOMBİ ÇEKME SİSTEMİ

Araçlar yürüyerek dolaşan oyuncuya göre daha fazla zombi çeker.

```
ZombiAgroRange = BaseRange + (Noise * 1.5) + SpeedFactor
```

Kamyonlar → en yüksek Noise değerine sahiptir.

Sessiz egzoz mod’u bu değeri %30 azaltır.

---

# 11.14 SÜRÜŞ MODELİ (HANDLING & TRACTION)

Yol tipine göre araç farklı davranır:

| Zemin | Etki |
|--------|--------|
| Asfalt | en iyi hız ve kontrol |
| Toprak | hız -%10 |
| Çamur/Bataklık | hız -%40, kayma ↑ |
| Kar/Buz | hız -%50, fren zayıf |
| Orman zemini | engeller → hasar riski |

---

# 11.15 ARAÇ ÇARPIŞMA MODELİ

Çarpmalar:

- parçaya göre hasar verir  
- hız çarpanı hasar üzerinde belirleyicidir  

```
Damage = ImpactForce * (1 - ArmorMod)
```

ImpactForce = hız + çarpışma açısı

---

# 11.16 ARAÇ ANİMASYON VE SES MODELİ

- motor ses seviyesi → zombi agro  
- fren sesi  
- gaz sesinin tonu → motor durumu  
- egzoz patlamaları → risk artırıcı  

Kamyonun sesi uzaklardan bile duyulabilir.

---

# 11.17 ARAÇ KULLANIMININ PROGRESSION ÜZERİNDEKİ ROLÜ

### Early Game:
- araç bulmak bile zor  
- bozuk/çalışmayan araçlarla uğraşılır  
- yakıt çok değerli  

### Mid Game:
- araç tamir rampası kurulur  
- araç modlama başlar  
- bagaj kapasitesi loot run’ları artırır  

### Late Game:
- araçlar üs için kritik lojistik sağlar  
- benzersiz araç modülleri bulunabilir  
- kamyon ile büyük loot run’lar yapılır  

---

# 11.18 ÖZET

Bu araç sistemi:

- modüler parça modeli  
- ağırlık tabanlı fizik  
- yakıt simülasyonu  
- gürültü → zombi bağlantısı  
- tamir sistemi  
- endgame modifikasyonları  
- farklı araç tipleri  

ile tam kapsamlı AAA derinliğine sahiptir.

---

# ☣️ BÖLÜM XII — DÜŞMAN SİSTEMİ  
### *Project Survival Universe – Full AAA Detay*

---

# 12.0 DÜŞMAN SİSTEMİNİN TEMEL FELSEFESİ

PSU’da düşman sistemi üç tasarım ilkesine dayanır:

1. **Tehdit Sürekliliği:** Oyuncu her zaman bir risk hissetmeli.  
2. **Çeşitlilik:** Farklı zombi ve mutant türleri farklı taktikler gerektirmeli.  
3. **Öngörülebilir Kaos:** Düşman davranışları mantıklı ancak sürprizli olmalı.

Her düşman:

- algı sistemine  
- ses ve görüş modeline  
- koşma/koşmama karar mekaniklerine  
- hasar profiline  
- drop tablosuna  

sahiptir.

---

# 12.1 ZOMBİ TÜRLERİ GENEL SINIFLANDIRMA

Düşmanlar 3 ana sınıfta toplanır:

1. **Klasik Zombiler**  
2. **Mutant Zombiler (Özel Davranışlı)**  
3. **Boss & Mini-Boss Enfekte Varlıklar**

Her sınıf farklı davranış ağacına sahiptir.

---

# 12.2 KLASİK ZOMBİ TÜRLERİ

## 1) **Normal Zombi**
- yavaş  
- düşük farkındalık  
- büyük gruplar halinde tehlikeli  
- ses ile kolay yönlendirilir  

| Stat | Değer |
|-------|--------|
| HP | düşük |
| Hasar | düşük |
| Görüş | kısa |
| Ses Algısı | orta |

Drop: common loot

---

## 2) **Yavaş Ama Güçlü Zombi (Brute Walker)**
- yavaş yürür  
- yüksek hasar verir  
- kırılgan olmayan iskelet yapısı  

| Stat | Değer |
| HP | yüksek |
| Hasar | yüksek |
| Görüş | kısa |
| Ses Algısı | düşük |

---

## 3) **Hızlı Zombi (Runner)**
- duruma göre 2–3 kat hızlı koşabilir  
- ses ve harekete çok duyarlı  

| Stat | Değer |
| HP | düşük |
| Hasar | orta |
| Hız | çok yüksek |
| Ses Algısı | yüksek |

Drop: uncommon veya rare şansı

---

# 12.3 ÖZEL MUTANT TÜRLERİ

## 1) **Kör Mutant**
- görme yok  
- ses algısı 3 kat fazla  
- oyuncunun hareket hızına göre tepki verir  

### Davranış:
- sessiz yürürsen seni duymaz  
- ateş edersen hemen üzerine koşar  

---

## 2) **Sağır Mutant**
- ses duyamaz  
- geniş görüş açısı (270°)  
- gece görüşü güçlü  

### Davranış:
- görüş alanına girersen seni direkt takip eder  
- arkasına geçerek stealth yaklaşma mümkündür  

---

## 3) **Tırmanıcı (Climber)**
- duvarlara, araçlara, çatı kenarlarına tırmanabilir  
- oyuncuyu yüksekten hedef alabilir  

Tehlikeli şehir bölgelerinde kullanılır.

---

## 4) **Çığlıkçı (Screamer)**
- hasar almadan bağırmaz  
- bağırınca 20–40 metredeki zombileri sana çeker  
- kendisi zayıf ama sürü çağırma gücü çok yüksek

---

## 5) **Şişmiş Mutant (Bloater)**
- vurunca patlar → zehirli bulut  
- yakın dövüş için riskli  
- ses çıkarınca içindeki gaz basıncı artar

---

## 6) **Gölge Zombi (Shadowed)**
- karanlıkta görünmezlik benzeri efekt  
- gece aktif  
- termal iz bırakır (late-game ekipmanla tespit edilebilir)

---

# 12.4 BOSS & MINI-BOSS TÜRLERİ

Bosslar belirli bölgelerde veya etkinliklerde spawn olur.

## MINI-BOSS: “FERAL HUNTER”
- çok hızlı  
- duvarlara zıplar  
- zıplayarak saldırır  
- sesi yüksek frekansta  

Drop: rare–epic loot

---

## BOSS: “THE ABERRATION”
- devasa mutant  
- alan hasarı  
- oyuncuyu savurur  
- laboratuvar bölgelerinde görünür  

Drop: epic–legendary loot  
Bazen özel blueprint verir.

---

## EVENT BOSS: “THE NEST”
- mutant yumurtası merkezli bir “yuva”  
- yuva yok edilmeden zombiler durmaz  
- çevrede sürekli spawn olur  

Drop: kimyasal bileşenler, serum materyali

---

# 12.5 ZOMBİ ALGI SİSTEMİ (GÖRÜŞ & SES)

Zombiler 2 ana algı sistemi kullanır:

### 1) **Görüş Algısı**
```
VisionRange = BaseVision * (LightMultiplier + MovementVisibility)
```

- gece = düşük görüş  
- ışık kaynağı taşıyan oyuncu = yüksek görünürlük  

### 2) **Ses Algısı**
```
HearingRange = BaseHearing * (NoiseLevel)
```

NoiseLevel oyuncu tarafından tetiklenir:

| Eylem | Noise |
|--------|--------|
| yavaş yürüyüş | düşük |
| koşu | orta |
| hızlı loot | yüksek |
| ateş etme | çok yüksek |
| araç kullanma | aşırı yüksek |

---

# 12.6 ZOMBİ DAVRANIŞ AĞACI (BASIC AI TREE)

```
[Idle]
   ↓ (Ses duyarsa)
[Investigate]
   ↓ (Oyuncu görülürse)
[Chase]
   ↓ (Mesafe yakınsa)
[Attack]
   ↓ (Oyuncu kaybolursa)
[Search]
   ↓
[Idle]
```

Mutant AI’lar daha gelişmiş varyasyonlara sahiptir.

---

# 12.7 MUTANT AI DAVRANIŞ AĞACI (ADVANCED AI)

```
[Idle]
   ↓
[Environmental Scan]
   → yüksek ses → Investigate
   → hareket → Chase
   → koku (opsiyonel sistem) → Track
   ↓
[Ambush Mode] (sadece bazı mutantlarda)
   ↓
[Attack Combo]
   ↓
[Retreat / Reposition]
```

---

# 12.8 ÇATIŞMA (COMBAT) DAVRANIŞLARI

Zombiler:

- sayı avantajını kullanır  
- oyuncuyu kuşatmaya çalışır  
- bazen kapı veya pencere kırmayı dener  
- bazen yere düşüp sürünerek ilerler  

Sürü davranışları:

- bir zombi bağırırsa diğerleri kulak misafiri olur  
- bir zombi seni görürse yakınındaki 2–3 zombi de tetiklenir  

---

# 12.9 HASSAS NOKTA (WEAKPOINT) MEKANİĞİ

Bazı mutantların zayıf noktaları vardır:

- şişmiş mutant → gövde  
- screamer → kafa  
- climber → bacaklar  
- aberration → omuz plakası  

Zayıf noktayı vurmak daha çok hasar verir.

---

# 12.10 KAPILAR & ENGELLERLE ETKİLEŞİM

Zombiler:

- ahşap kapıları kırabilir  
- camları parçalayabilir  
- metal kapılar → kırılmaz ama bükülebilir  
- araçlara saldırabilir  

Göçük veya yıkık binalar içinde sıkışabilirler.

---

# 12.11 ZOMBİ SPAWN SİSTEMİ

Spawn 3 ana kategoriye ayrılır:

---

## 1) **Bölge Bazlı Spawn**
Her bölgenin *zorluk katsayısı* vardır.

Örneğin:

| Bölge | Spawn Yoğunluğu |
|--------|-----------------|
| Orman | düşük |
| Şehir merkezi | yüksek |
| Laboratuvar | çok yüksek |

---

## 2) **Zaman Bazlı Spawn**
Zaman sistemi spawn oranını etkiler.

- gece → daha güçlü zombiler  
- sabah → azalma  
- yağmurlu hava → ses maskesi → daha yakın spawn  

---

## 3) **Event Bazlı Spawn**
- air drop  
- nest keşfi  
- oyuncunun çok gürültü yapması  
- üs savunması  

bazlı olarak spawn artar.

---

# 12.12 ZOMBİ LOOT TABLOSU

| Zombi Türü | Loot |
|-------------|--------|
| Normal | common |
| Runner | uncommon/rare |
| Kör | elektronik (nadiren) |
| Sağır | tıbbi loot |
| Mini-Boss | rare/epic |
| Boss | epic/legendary |

---

# 12.13 ÜS BASKIN DAVRANIŞLARI

Baskın sırasında:

- zombiler farklı açılardan yaklaşır  
- çığlıkçı mutant çağrı yapabilir  
- brute walker kapıları kırmaya çalışır  
- climber çatıdan giriş yapabilir  
- eğer taret varsa hedefi dağıtırlar  

Bu baskın tamamen oyuncunun üs düzenine göre şekillenir.

---

# 12.14 ZOMBİLER & SES FİZİĞİ

Ses fiziği çok önemlidir:

### Ateş etme:
- her silah kendi desibel değerine sahiptir  
- susturucu → %40 azaltır  

### Araç:
- motor sesi → büyük agro  
- kamyon → en yüksek agro  

### Crafting:
- metal işleme → orta  
- jeneratör → yüksek  

---

# 12.15 SON BOSS TASLAĞI (OPSİYONEL GELECEK EKLENTİSİ)

**“TITAN OF DECAY”**  
- şehir yıkıntılarında spawn olur  
- 3 fazlı dövüş  
- faz geçişlerinde alan saldırısı  
- sadece co-op için önerilir  

---

# 12.16 ÖZET

Bu bölüm zombi & mutant sisteminin:

- türlerini  
- davranışlarını  
- AI yapısını  
- algı modellerini  
- boss mekaniklerini  
- spawn sistemini  
- loot bağlantılarını  

AAA detayında açıklamıştır.

---

# 🌍 BÖLÜM XIII — DÜNYA TASARIMI  
### *Project Survival Universe – Full AAA Detay*

---

# 13.0 DÜNYA TASARIM FELSEFESİ

PSU’nun dünyası, **post-apocalyptic + yarı-realistik + keşfe ödül veren** bir yapıda tasarlanmıştır.

Dünya:

- her köşesi keşfedilebilir  
- farklı biyomlardan oluşur  
- bölgesel tehlike seviyeleri vardır  
- loot çeşitliliğini destekleyecek şekilde inşa edilmiştir  
- atmosfer, hava durumu ve mevsimler ile sürekli değişir  

---

# 13.1 DÜNYANIN GENEL YAPISI

Dünya **modüler açık dünya** yapısındadır.

Örnek dünya yapısı:

```
         [Dağlık Bölge]
  [Orman]   [Şehir Merkezi]   [Sanayi]
   [Göl]      [Banliyö]      [Askeri Üssü]
      [Tarlalar]     [Laboratuvar]
```

Yaklaşık plan:

- Başlangıç bölgesi orta zorlukta  
- Kuzeye gittikçe doğal biyomlar  
- Güneye gittikçe şehir yıkıntıları  
- Doğu → endüstriyel alanlar  
- Batı → laboratuvar ve karantina bölgeleri  

---

# 13.2 BİYOMLAR

Dünya 6 büyük biyomdan oluşur:

## 1) **Orman**
- bol bitki  
- mantar  
- hayvan izleri  
- düşük zombi yoğunluğu  
- loot kalitesi düşük-orta  

Atmosfer: yeşilimsi, sisli sabahlar

---

## 2) **Şehir Alanı**
- çok katlı binalar  
- yüksek zombi yoğunluğu  
- yüksek loot potansiyeli  
- mutant spawn oranı artar  

Atmosfer: dumanlı, sessiz, terk edilmiş sokaklar

---

## 3) **Banliyö Mahalleleri**
- müstakil evler  
- yiyecek ve kumaş loot’u yoğun  
- orta zorluk  

Atmosfer: sessiz, rüzgarda sallanan bayraklar

---

## 4) **Sanayi Bölgesi**
- fabrikalar  
- metal ve araç parçaları  
- kimyasal sızıntılar  

Atmosfer: paslı metal kokusu, zehirli gaz uyarıları

---

## 5) **Askeri Üs**
- en iyi silah ve ekipman  
- çok yüksek risk  
- dev mutantlar için olası spawn noktası  

Atmosfer: çöküş sonrası askeri kalıntılar, alarm sesleri

---

## 6) **Laboratuvar & Karantina Alanı**
- serum materyalleri  
- kimyasal loot  
- boss ve mutasyon çalışmaları  

Atmosfer: kırmızı ışıklar, uyarı sirenleri

---

# 13.3 BİNA TİPLERİ VE LOOT ROLLERİ

Dünyadaki her bina tipi farklı loot profiline sahiptir:

| Bina | Özellik |
|--------|---------|
| Market | yiyecek, su, temel eşya |
| Eczane | tıbbi loot |
| Hastane | serum bileşenleri |
| Metruh ev | kumaş, metal |
| Otopark | araç loot |
| Silah dükkanı | rare silah/mod |
| Karakol | mühimmat, zırh |
| Laboratuvar | epic loot |

Bina içleri **procedural loot distribution** mantığı ile çalışır.

---

# 13.4 BÖLGESEL ZORLUK SİSTEMİ

Dünyanın her bölgesi bir **Tehlike Seviyesi (Threat Level)** taşır.

| Threat Level | Açıklama |
|---------------|-----------|
| 1 | düşük risk – temel zombiler |
| 2 | orta risk – runner ve mutant başlangıç |
| 3 | yüksek risk – özel mutantlar |
| 4 | aşırı risk – mini-boss |
| 5 | kritik risk – boss alanları |

Bu seviyeler oyuncunun seviye atlamasıyla değil **coğrafya** ile belirlenir.

---

# 13.5 KEŞİF MEKANİKLERİ (EXPLORATION SYSTEM)

Keşif sistemi üç temel tasarım içerir:

1. **Line-of-Sight Fog of War:**  
   Görmediğin yer karanlık kalır.

2. **Araştırılabilir POI’ler (Point of Interest):**  
   - “İlginç ev”  
   - “Terk edilmiş karavan”  
   - “Yıkık bina”  
   - “Sığınak kapısı”  

3. **Gizli Alan & Tünel Sistemi:**  
   - kanalizasyon tünelleri  
   - gizli laboratuvar girişleri  
   - yıkıntıların altındaki bodrumlar  

---

# 13.6 LOOT YOĞUNLUK HARİTASI

Her bölgenin loot yoğunluğu farklıdır:

| Bölge | Loot Yoğunluğu | Risk |
|--------|-----------------|-------|
| Orman | düşük | düşük |
| Banliyö | orta | orta |
| Şehir Merkezi | yüksek | çok yüksek |
| Askeri Üs | çok yüksek | aşırı |
| Laboratuvar | epic | kritik |

Bu tablo oyuncunun loot planlamasını destekler.

---

# 13.7 SES ATMOSFERİ

Ses atmosferi dünya tasarımında kritik rol oynar.

### Orman:
- kuş sesleri  
- rüzgar  
- uzakta yürüyen zombi ayak sesleri  

### Şehir:
- metal çarpışmaları  
- araç alarmı  
- yankı yapan zombi sesleri  

### Laboratuvar:
- kırmızı alarm bip sesi  
- mırıldanan mutantlar  
- titreşimli elektrik sesleri  

---

# 13.8 HAVA DURUMU SİSTEMİ

Hava durumu:

- düşman algısını  
- oyuncu hareketini  
- loot sesi maskelenmesini  
- görüş mesafesini  

etkiler.

### Hava Türleri:
- açık hava → normal görüş  
- yağmur → ses maskesi ↑, hız ↓  
- sis → görüş ↓  
- kar → stamina tüketimi ↑  
- fırtına → zombiler rastgele dağılır  

---

# 13.9 MEVSİM SİSTEMİ

Mevsimler:

- loot çeşitliliğini  
- bitki toplama  
- ısı yönetimi  
- moral  
- crafting verimi  

üzerinde etkilidir.

### Örnek:

| Mevsim | Değişim |
|---------|----------|
| İlkbahar | bitkiler bol, yağmur fazla |
| Yaz | yiyecek bulunabilirliği artar |
| Sonbahar | mantar bol, havalar soğur |
| Kış | zorluk artar, zombiler sertleşir |

---

# 13.10 GİZLİ BÖLGELER & OYUNCU KEŞFİ

Dünyada çeşitli **hidden area** noktaları bulunur:

- gizli tüneller  
- terk edilmiş sığınak  
- tavan arası  
- gizli askeri depo  
- bodrum laboratuvarı  

Bu alanlar **rare–legendary loot** içerir.

---

# 13.11 DİNAMİK DÜNYA OLAYLARI (WORLD EVENTS)

### 1) Air Drop  
Gökyüzünden ikmal düşer → mini-boss korur.

### 2) Mutant Yuva Olayı  
Haritanın bir yerinde yuva belirir → yok edilirse iyi loot.

### 3) Araç Konvoyu  
Yol kenarında hasarlı araçlar zinciri.

### 4) Karantina İhlali  
Laboratuvardan mutant sızması = risk yükselir.

### 5) Şehir Çöküşü  
Binaların çökme ihtimali (rare event).

---

# 13.12 DÜNYA PROGRESSION MODELİ

Dünya oyuncuyla birlikte “gelişmez”, ancak:

- oyuncu daha tehlikeli bölgelere girer  
- yeni POI’ler keşfeder  
- loot azalınca daha derin alanlara yönelir  
- araç bulunması keşif hızını artırır  

Yani progression tamamen **coğrafi risk** üzerine kuruludur.

---

# 13.13 ÖZET

Bu bölüm dünya tasarımının:

- biyomlarını  
- bina çeşitlerini  
- zorluk seviyelerini  
- atmosfer ve ses tasarımını  
- hava ve mevsim etkilerini  
- gizli bölgeleri  
- dünyadaki olay sistemlerini  

AAA detayında açıklamıştır.

---

# 🔄 BÖLÜM XIV — CORE LOOP & META LOOP  
### *Project Survival Universe – Full AAA Detay*

---

# 14.0 OYUN DÖNGÜSÜNÜN TEMEL TASARIM FELSEFESİ

PSU’nun oynanışı **keşif → loot → mücadele → üs geliştirme → daha tehlikeli bölgelere ilerleme** üzerine kuruludur.

Amaç:
- oyuncunun her zaman *bir sonraki hedefi* olsun  
- risk/ödül dengesi sürekli aktif kalsın  
- oyuncu kendi hikâyesini yazabilsin  

Bu bölüm oyunun DNA’sıdır.

---

# 14.1 CORE LOOP (ANLIK OYNANIŞ DÖNGÜSÜ)

Core Loop = oyuncunun 5–10 dakikada bir yaptığı temel döngü:

```
Keşfet →
Loot Yap →
Tehlikeden Kaç / Mücadele Et →
Kaynakları Üse Getir →
Craft & Geliştir →
Daha İyi Donanım ile Daha Derine Git
```

Bu döngü hem solo hem co-op için geçerlidir.

---

# 14.2 CORE LOOP DETAYI (AŞAMALAR)

## 1) **Keşfet (Explore)**  
- haritada gez  
- sesleri ve riskleri değerlendir  
- loot noktaları belirle  

## 2) **Loot Yap (Scavenge)**  
- hızlı loot / sessiz loot kararını ver  
- envanteri ağırlığa göre yönet  

## 3) **Tehlikeden Kaç veya Savaş (Fight/Flight)**  
- zombi davranışına göre strateji  
- araç ile kaçış ihtimali  
- stealth avantajı  

## 4) **Kaynakları Eve Getir (Return to Base)**  
- loot’u güvenli alana al  
- çantayı boşalt, depoları kullan  

## 5) **Craft & Upgrade**  
- daha iyi araçlar  
- daha iyi silahlar  
- daha iyi yemek  
- üs geliştirme  
- skill tree ilerlemesi  

## 6) **Daha Derine İlerle**  
- giderek daha zor alanlara gir  
- rare–legendary loot bul  
- araç, modül, serum vb. üret  

Bu döngü kesintisiz şekilde devam eder.

---

# 14.3 MİD LOOP (GÜNLÜK OYNANIŞ DÖNGÜSÜ)

Mid loop yaklaşık **30–60 dakika** periyotlarla gerçekleşir.

```
Günlük Hedef Belirle →
Bölgeyi Keşfet →
Araçla Taşıma →
Üs Geliştirme →
Yeni Crafting Zincirleri Aç →
Yeni Bölgelere Erişim
```

Mid loop'un motivasyon kaynakları:

- yeni craft tarifleri  
- yeni binalar  
- araç modifikasyonları  
- skill tree ilerlemesi  
- moral sistemi  

---

# 14.4 META LOOP (UZUN VADELİ OYUN DÖNGÜSÜ)

Meta Loop, oyunun **10–50 saatlik genel hedef akışı**dır.

```
Küçük Kulübe →
İşleyen Üs →
Endüstriyel Üretim →
Araç Filosuna Sahip Olma →
Tehlikeli Bölgelerin Fethedilmesi →
Laboratuvar & Boss İçerikleri →
Dünyanın Sırlarını Öğrenme
```

Bu döngü oyuncuya devasa bir progression hissi verir.

---

# 14.5 OYUNCU MOTİVASYON EĞRİSİ

Motivasyon kaynakları:

| Kaynak | Açıklama |
|--------|----------|
| Loot | Doyumsuz arayış, rare/endgame motivasyonu |
| Crafting | sürekli gelişen üretim zinciri |
| Base | kendi alanını kurma, düzenleme |
| Araçlar | hareket özgürlüğü ve kapasite |
| Skill Tree | güçlenme hissi |
| Hikâye Etkileri | NPC, notlar, gizli alanlar |
| Co-op | birlikte hayatta kalma motivasyonu |

Her döngünün sonunda oyuncu bir “şunu da yapayım” hissi ile devam eder.

---

# 14.6 CORE LOOP ZORLUK EĞRİSİ

Core Loop zorluk eğrisi:

- başlangıç → düşük zombi yoğunluğu  
- midgame → runner + mutantlar  
- late game → boss alanları + olay tabanlı spawn  

Crafting & base geliştirme döngüsü ile zorluk dengede tutulur.

---

# 14.7 PLAYER JOURNEY (OYUNCU YOLCULUĞU)

## 🕒 İlk 10 Dakika
- eve giriş  
- ilk loot  
- ilk zombi ile karşılaşma  
- temel crafting  
- ufak bir korku ve merak atmosferi  

## 🕐 İlk 1 Saat
- çanta bulma  
- temel silah bulma  
- üs düzeninin oturmaya başlaması  
- ilk bölgesel keşif  
- stamina ve moral sistemine alışma  

## 🕒 İlk 3 Saat
- araç bulma girişimi  
- metal craft açılması  
- gece keşfi  
- runner ve mutantla ilk karşılaşma  
- risk yönetimi öğrenimi  

## 🕛 İlk 10 Saat
- üs ciddi bir seviyeye gelir  
- kimya ve tıbbi crafting açılır  
- araç tamiri tamamlanır  
- şehir merkezine giriş  
- rare loot bulmaya başlanır  

## 🕒 İlk 20 Saat
- endüstriyel üretim  
- boss bölgeleri  
- özel görevler  
- co-op taktikleri gelişir  
- üs savunma olayları başlar  

## 🕒 50 Saat ve Sonrası
- tüm sistemler oturur  
- yeni build denemeleri  
- high-risk keşif görevleri  
- araç filosu yönetimi  
- mutant yuvaları temizleme  

---

# 14.8 DEATH LOOP (ÖLÜM & CEZA SİSTEMİ)

Ölüm anında:

- oyuncu karakter değişimi  
- envanterin %20–40’ı kaybedilir (ayar yapılabilir)  
- bazı skill exp’leri azalır  
- moral sert düşer  

Ancak oyuncu:
- üssü  
- crafting seviyeleri  
- araştırma ilerlemesi  
- araçları  

gibi uzun vadeli varlıklarını kaybetmez.

Bu bir **“rogue-lite metaprogression modeli”**dir.

---

# 14.9 CO-OP CORE LOOP

Co-op özel döngü:

```
Görev Dağılımı →
Bölge Baskını →
Loot Bölüşümü →
Üs Geliştirme →
Büyük Event İçin Hazırlık
```

Roller:

- Scout (keşif)  
- Fighter (savaş)  
- Mule (yük taşıyıcı)  
- Mechanic (araç sorumlusu)  
- Medic (tıbbi craft)  

Co-op → oyunun en iyi deneyimi.

---

# 14.10 RETRY DÖNGÜSÜ (MOTİVASYON)

Ölüm veya başarısızlık sonrası:

```
Neyi yanlış yaptım?
Daha iyi hazırlıkla tekrar deneyeyim.
Daha iyi loot → daha iyi craft → daha iyi üs.
```

Bu döngü oyuncuyu oyuna geri çeker.

---

# 14.11 ÖZET

Bu bölümde PSU’nun:

- Core Loop  
- Mid Loop  
- Meta Loop  
- Oynanış yolculuğu  
- Ölüm sonrası döngü  
- Co-op eşleşmesi  
- Motivasyon unsurları  

AAA derinlikte tanımlanmıştır.

---

# 📈 BÖLÜM XV — PROGRESSION SİSTEMİ  
### *Project Survival Universe – Full AAA Detay*

---

# 15.0 PROGRESSION FELSEFESİ

PSU’da progression şu prensibe dayanır:

1. **Karakter gelişir** → statlar artar  
2. **Oyuncu öğrenir** → beceriler gelişir  
3. **Üretim zinciri genişler** → craft seçenekleri artar  
4. **Dünya açılır** → daha tehlikeli alanlara giriş  
5. **Ev/Üs güçlenir** → yeni modüller açılır  
6. **Araç geliştirme** → daha uzak bölgelere erişim  

Progression tamamen **oyuncu tercihine dayalıdır**.  
Zorunlu sınıf sistemi YOKTUR — her oyuncu kendi yolunu seçer.

---

# 15.1 LEVEL SİSTEMİ

Karakter toplam **60 level** olabilmektedir.

Her level:

- küçük stat artışı  
- skill point (2–3 puan)  
- crafting öğrenme hızına etki  
- moral dayanıklılığı artışı  

Kazandırır.

### Level-Up Stat Artış Örneği:

| Stat | Artış |
|-------|--------|
| HP | +2–3 |
| Stamina | +3–4 |
| Carry Weight | +0.2 kg |
| Focus | +0.5 |
| Craft Efficiency | +0.5% |
| Loot Speed | +1% |

---

# 15.2 SKILL POINT DAĞITIM SİSTEMİ

Skill point’ler **yetenek ağaçlarında** kullanılır.  
Toplamda 8 ana skill kategorisi vardır:

1. **Survival**  
2. **Combat**  
3. **Stealth**  
4. **Crafting**  
5. **Medical**  
6. **Mechanical/Engineering**  
7. **Cooking/Nutrition**  
8. **Social/Morale**

Her kategori birçok pasif ve aktif yetenek içerir.

---

# 15.3 MESLEK SİSTEMİ (CLASSLESS PROFESSION MODEL)

Oyunda klasik sınıflar yoktur, ancak **karakter profilleri** vardır.

Başlangıçta oyuncu **bir meslek seçebilir** (opsiyonel):

| Meslek | Bonus | Dezavantaj |
|--------|--------|--------------|
| **Aşçı** | yemek kalitesi ↑, moral bonus | düşük fiziksel dayanıklılık |
| **Mekanikçi** | araç craft/tamir hız ↑ | düşük stealth |
| **Avcı** | ok/silah bonusları | düşük craft verimi |
| **Doktor** | tıbbi craft +%30 | düşük melee |
| **Lootçu (Scavenger)** | hızlı loot | düşük HP |

Meslekler oyunun orta aşamalarında değiştirilemez, ancak **ek mesleki yetenekler öğrenilebilir**.

---

# 15.4 YETENEK AĞACI (SKILL TREE)

Her kategori 3 alt dala ayrılır.

Örnek olarak **Combat Skill Tree** yapısı:

### Combat Tree
1) **Melee Branch**  
- +yakın dövüş hasarı  
- +kritik şansı  
- stamina tüketimi ↓  

2) **Ranged Branch**  
- nişan alma stabilitesi  
- geri tepme azaltma  
- silah mod etkisi ↑  

3) **Survivor Branch**  
- hasar azaltma  
- bleeding direnci  
- panic resist ↑  

---

# 15.5 SURVIVAL SKILL TREE

### 1) Resourcefulness  
- loot hızını artırır  
- rare bulma şansı +  
- ağırlık yönetimi  

### 2) Endurance  
- koşu süresi ↑  
- yorgunluk oluşumu ↓  
- sıcak/soğuk direnci  

### 3) Awareness  
- zombi algısı ↑  
- gece görüşü ↑  
- ses ile yön tayini  

---

# 15.6 STEALTH SKILL TREE

### 1) Footstep Reduction  
- adım sesi ↓  
- hızlı loot ile bile daha az ses  

### 2) Shadow Presence  
- görüş alanında görünme ihtimali ↓  
- karanlık bonusu ↑  

### 3) Takedown Skills  
- sessiz öldürme  
- stealth takedown  
- mutantları arkadan yavaşlatma  

---

# 15.7 CRAFTING SKILL TREE

Crafting en geniş skill ağacıdır.

### 1) Base Crafting  
- craft süre ↓  
- hatalar ↓  
- multi-output artışı  

### 2) Engineering  
- metal işlemede ustalık  
- araç parçalarında mastery  
- devre üretiminde başarı ↑  

### 3) Advanced Chemistry  
- serum crafting  
- medkit verimi  
- patlayıcı bileşen üretimi  

---

# 15.8 MEDICAL SKILL TREE

### 1) Anatomy  
- tıbbi müdahale hızı ↑  
- bandaj verimi ↑  

### 2) Pharmacy  
- ilaç crafting kalitesi ↑  

### 3) Immunology  
- enfeksiyon direnci  
- serum gücü ↑  

---

# 15.9 COOKING SKILL TREE

### 1) Meal Efficiency  
- yemek buff’ları uzun sürer  

### 2) Ingredient Mastery  
- tek malzemeden çoklu ürün çıkabilir  

### 3) Morale Foods  
- moral buff yemekleri  
- grup bonusları  

---

# 15.10 MECHANICAL / ENGINEERING SKILLS

### 1) Mechanics  
- araç tamir süresi ↓  
- yakıt verimliliği ↑  

### 2) Electronics  
- devre üretim başarısı ↑  
- taret yapımı açılır  

### 3) Industrial Engineering  
- jeneratör kurma  
- advanced araç modları  

---

# 15.11 SOCIAL / MORALE SKILL TREE

### 1) Leadership  
- grup moral buff’ı  
- co-op için özel yetenekler  

### 2) Communication  
- npc ile trade avantajı  
- fiyat düşürme  
- bilgi toplama  

### 3) Performance  
- müzik çalar → moral +  
- skill efektleri geliştirilir  

---

# 15.12 MASTERY SİSTEMİ (USTALIK)

Her kategori ustalık seviyesine sahiptir.

Ustalık 0–100 arasıdır.

Örneğin:

- **Crafting Mastery 80+** → %10 çift ürün  
- **Scavenging Mastery 90+** → rare eşya bulma +%12  
- **Medical Mastery 100** → kritik tedavi başarısı  

Ustalık → sadece **kullanım ile** artar.  
Yani craft yapmadan Crafting Mastery gelişmez.

---

# 15.13 BLUEPRINT SİSTEMİ (TARİF AÇMA)

Blueprint elde etmenin yolları:

1. Rare loot  
2. Boss drop  
3. NPC trade  
4. Laboratuvar araştırması  
5. Event ödülleri  
6. Araç konvoyları  
7. Gizli POI’ler  

Blueprint türleri:

- silah modları  
- zırh plating  
- araç modları  
- serum formülleri  
- elektrik sistemi bileşenleri  

Blueprint, crafting menüsünde **kalıcı** olarak açılır.

---

# 15.14 ARAŞTIRMA SİSTEMİ

Araştırmalar oyuncunun **orta ve geç oyun** içeriğini belirler.

Araştırma istasyonunda yapılır:

| Araştırma Türü | Etki |
|----------------|------|
| Kimyasal Araştırma | serum & ilaç reçeteleri açılır |
| Mühendislik Araştırması | taret, jeneratör, araç modları |
| Genetik Araştırma | mutant zayıflıkları (opsiyonel) |
| Evrim Araştırması | boss mekanikleri anlaşılır |

Araştırma süresi:

```
ResearchTime = BaseTime * ResearchComplexity / ResearchSkill
```

---

# 15.15 PERMA-PROGRESSION (KALICI İLERLEME)

Oyuncu ölse bile bazı ilerlemeler kalır:

- araştırma tamamlanan projeler  
- blueprint’ler  
- üs yapılarının çoğu  
- crafting seviyeleri  
- mastery  

Bu sistem, her denemede oyuncuyu ilerlemeye teşvik eder.

---

# 15.16 PROGRESSION EKONOMİSİ

Progression şu kaynaklara bağlıdır:

- loot  
- crafting  
- rare item  
- blueprint  
- araç parçaları  
- moral buff yemekleri  
- üs geliştirmeleri  

Hepsi bir çark gibi birbirine bağlıdır:

```
Loot → Craft → Skill → Base → Research → New Loot → Progression
```

---

# 15.17 CO-OP PROGRESSION SİSTEMİ

Co-op oyuncuları şu alanlarda sinerji kurabilir:

- farklı meslekler  
- farklı skill tree yolları  
- tek oyuncunun mastery’si tüm gruba buff verebilir  
- yemek buff’ı grup için geçerli olur  
- araç tamirinde bonus hız  

Co-op progression oyunun *uzun süreli oynanabilirliğini* güçlendirir.

---

# 15.18 PROGRESSION YOL HARİTASI (EXAMPLE JOURNEY)

### Level 1–10
- temel loot  
- ilkel crafting  
- ilk araç bulma girişimi  
- küçük ev onarımı  

### Level 11–20
- metal işleme  
- yemek çeşitleri  
- ilk mutant karşılaşmaları  
- orta seviye üs  

### Level 21–40
- tıbbi craft  
- araç modlama  
- mekanik ustalık  
- şehir merkezine giriş  
- rare loot dönemi  

### Level 41–60
- endgame crafting  
- taretler  
- jeneratör sistemleri  
- boss bölgeleri  
- legendary loot  

---

# 15.19 ÖZET

Bu bölüm şunları tanımlar:

- level sistemi  
- skill tree yapısı  
- meslek profilleri  
- crafting unlock progression  
- blueprint sistemi  
- araştırma sistemi  
- mastery  
- co-op progression  

Yani PSU’nun **RPG omurgası** burada tamamlanır.

---

# 💱 BÖLÜM XVI — EKONOMİ & KAYNAK YÖNETİMİ  
### *Project Survival Universe – Full AAA Detay*

---

# 16.0 EKONOMİ SİSTEMİNE GENEL BAKIŞ

PSU’da ekonomi:

- loot  
- crafting  
- ticaret  
- kaynak kıtlığı  
- tüketim  
- üretim zincirleri  
- risk/ödül  

gibi tüm mekaniklerle bağlantılıdır.

Ekonomi tamamen **emergent (oyuncu davranışıyla şekillenen)** dinamik bir sistemdir.

---

# 16.1 KAYNAK TÜRLERİ (RESOURCE CLASSES)

Ekonomi 6 temel kaynak üzerine kuruludur:

| Kaynak Türü | Kullanım Alanı | Kıtlık Seviyesi |
|--------------|-----------------|------------------|
| **Yiyecek** | hayatta kalma, moral | orta |
| **Su** | hayatta kalma, craft | orta |
| **Tıbbi Malzeme** | tedavi, serum | yüksek |
| **Metal & Parçalar** | crafting, tamir | orta–yüksek |
| **Kimyasal Malzemeler** | ilaç & patlayıcı craft | yüksek |
| **Yakıt** | araç & jeneratör | çok yüksek |

Kaynak kıtlığı, oyundaki zorluk hissinin önemli bir parçasıdır.

---

# 16.2 KAYNAK TÜKETİM SİSTEMİ

### Oyuncu tüketimi:
- her 5–8 dakikada açlık düşüşü  
- her 4–6 dakikada susuzluk düşüşü  
- stamina harcamaları  
- tıbbi malzemelerin sürekli kullanımı  

### Üs tüketimi:
- jeneratör yakıt yakar  
- üretim makineleri enerji ister  
- bazı crafting işlemleri kimyasal harcar  

---

# 16.3 KAYNAK YENİLENME MODELİ

Kaynakların çoğu **yenilenmez**:

- market rafları → yenilenmez  
- binalardaki loot → yenilenmez  

DOĞAL kaynaklar yenilenir:

| Kaynak | Yenilenme |
|---------|------------|
| Meyve | sezonsal |
| Bitki | 2–5 gün |
| Mantar | hava durumuna göre |
| Su | sürekli, ancak kalite değişir |

Bu sistem oyuncuyu **haritayı keşfetmeye zorlar**.

---

# 16.4 LOOT EKONOMİSİ

Loot rarity ekonomik değer ile doğrudan ilişkilidir.

| Rarity | Ekonomik Değer |
|--------|------------------|
| Common | düşük |
| Uncommon | orta |
| Rare | yüksek |
| Epic | çok yüksek |
| Legendary | oyunun en değerli varlıkları |

Loot ekonomisi 2 faktörle çalışır:

### 1) **Arz (Supply)**  
- bölgeye göre loot tipi  
- bina türü  
- risk seviyesi  

### 2) **Talep (Demand)**  
- crafting tarifleri  
- araç tamiri  
- üs yapıları  
- oyuncunun kendi ihtiyaç profili  

---

# 16.5 CRAFTING EKONOMİSİ

Crafting zincirleri ekonominin merkezidir.

### Craft’ın maliyet unsurları:
- materyal  
- zaman  
- skill seviyesi  
- araç & istasyon  
- enerji (elektrik veya yakıt)  

### Crafting verimi artırıcı unsurlar:
- skill tree  
- kaliteli araçlar  
- üs düzeni  
- moral yüksekliği  

Crafting maliyeti → ilerledikçe büyür.  
Örneğin:

```
İleri Motor Parçası = 6 çelik levha + 2 yağ + 1 devre + 45s craft süresi
```

---

# 16.6 PARÇA & EŞYA PAHALILIK TABLOSU

### En ucuz kaynaklar:
- kumaş  
- odun  
- hurda metal  

### Orta seviye kaynaklar:
- bitki  
- kimyasal baz  
- civata-seti  
- basit devre  

### Pahalı kaynaklar:
- akü  
- araç ECU  
- serum bileşenleri  
- kevlar  
- motor parçaları  

---

# 16.7 TİCARET SİSTEMİ (NPC & CO-OP)

Oyuncular ticaret yapabilir:

## 1) NPC Ticaret Sistemi
NPC’ler rastgele yol kenarı kamplarında bulunurlar.

Her NPC’nin:

- uzmanlık alanı  
- satın alma talebi  
- satacağı ürünler  
- fiyat çarpanı  

vardır.

Örnek:

| NPC Türü | Tarzı | Alma | Satma |
|-----------|--------|--------|---------|
| Aşçı | yiyecek odaklı | mantar/sebze | yemek, moral buff |
| Mühendis | araç odaklı | metal/devre | araç modları |
| Doktor | tıbbi | bitki/kimyasal | ilaçlar/serum |

### NPC Fiyat Kuralı:
```
Satış Fiyatı = BasePrice * (1 + NPC_RarityMultiplier) * (1 - PlayerNegotiation)
```

Negotiation = Social Skill Tree’den gelir.

---

## 2) CO-OP TİCARET
Co-op oyuncuları birbirlerine item transfer edebilir.

- görev dağılımına göre ticaret  
- biri mühendis → araç mod craft  
- biri aşçı → moral yemekleri  
- biri doktor → serum craft  

Co-op ekonomi oyunu hızlandırır.

---

# 16.8 ÜS EKONOMİSİ

Üs geliştirmek **pahalıdır**.

Örnek maliyet tablosu:

| Yapı | Malzeme |
|-------|----------|
| Ahşap Ev | 120 odun + 40 çivi |
| Metal Bariyer | 100 metal + 20 cıvata |
| Jeneratör | 1 akü + 1 motor + 50 metal |
| Kimya Lab | 30 kimyasal + 40 metal |

Bu ekonominin amacı:  
**oyuncuyu dünyayı keşfetmeye zorlamak.**

---

# 16.9 ARAÇ EKONOMİSİ

Araçlar pahalıdır:

### Araç temel maliyeti:
- akü  
- motor  
- tekerlek  
- yağ  
- çelik levha  

### Araç işletme maliyeti:
```
Yakıt + Parça Yıpranması + Tamir Kiti + Zaman
```

### Araç zenginliği:
- loot run kapasitesi ↑  
- harita erişimi ↑  
- exploration döngüsü hızlanır  

---

# 16.10 NADİR KAYNAK EKONOMİSİ

Bazı kaynaklar **çok değerli**dir:

| Kaynak | Kullanım | Değer |
|---------|----------|--------|
| Serum Bileşeni | tıbbi ilerleme | çok yüksek |
| Çip (Advanced Circuitry) | araç ECU, taret | çok yüksek |
| Kevlar | zırh | yüksek |
| Anti-Enfeksiyon Kimyasalı | kritik tedavi | yüksek |

Bu nadir kaynaklar → oyuncuyu sürekli tehlikeli alanlara iter.

---

# 16.11 RISK VS. REWARD EKONOMİ MODELİ

Ekonomi şu eşitliğe dayanır:

```
Risk ↑ → Loot Kalitesi ↑
Risk ↑ → Kaynak Kazanımı ↑
Risk ↑ → Eşya Dayanıklılık Kaybı ↑
Risk ↑ → Yakıt Tüketimi ↑
```

Bu nedenle oyuncu:

- araçla uzak bölgelere gider  
- üs savunmasını güçlendirir  
- daha iyi eşyalar craft eder  
- skill tree ile güçlenir  

---

# 16.12 ENFLASYON & KAYNAK KAYBI ÖNLEME

Ekonomik denge şu yollarla korunur:

### 1) Loot yenilenmemesi  
- bir alan temizlenirse tekrar dolmaz  

### 2) Eşya dayanıklılığı  
- sürekli tamir gerektirir  

### 3) Araç yakıt ekonomisi  
- yakıt her zaman kıttır  

### 4) Tıbbi sarf malzemesi  
- sürekli tüketilir  

Bu döngü ekonominin **dairesel** olmasını sağlar.

---

# 16.13 KRİTİK KARARLAR

Oyuncu sık sık şu kararlarla karşılaşır:

- “Bu yakıtı araca mı kullanayım, jeneratöre mi?”  
- “Bu nadir metal ile zırh mı craft edeyim, silah mod mu?”  
- “Üs genişletmek mi, araç tamir etmek mi?”  
- “Şehre gitmek riskli ama orada rare loot var.”  

İyi ekonomi tasarımının özü tam olarak budur.

---

# 16.14 EKONOMİK DÖNGÜ ŞEMASI

```
Loot →
Malzeme Topla →
Craft →
Araç/Tamir →
Üs Geliştir →
Yeni Bölgeler →
Daha İyi Loot →
Yeni Craft →
(sonsuz döngü)
```

---

# 16.15 ÖZET

Bu bölümde oyunun ekonomi sisteminin:

- kaynak türleri  
- loot ekonomisi  
- crafting maliyetleri  
- üs ekonomisi  
- yakıt & araç ekonomisi  
- ticaret sistemi  
- risk/ödül modeli  
- uzun vadeli kaynak kıtlığı  

AAA kalitede açıklanmıştır.


---

# 🖥️ BÖLÜM XVII — OYUNCU DENEYİMİ (UX/UI, KONTROLLER, FEEDBACK)  
### *Project Survival Universe – Full AAA Detay*

---

# 17.0 UX TASARIM FELSEFESİ

PSU’nun UX tasarımı şu temel ilkelere dayanır:

1. **Temiz ve okunabilir bir arayüz**  
2. **Hayatta kalma hissini destekleyen minimal bilgi**  
3. **Oyuncuyu boğmayan ama derin sistemleri gösteren tasarım**  
4. **Gerçek zamanlı geri bildirim ile risk algısını artırma**  
5. **Kontrol akıcılığı → karar verme hızını destekleme**

Her sistem, oyuncunun durumu hızla değerlendirebilmesini hedefler.

---

# 17.1 UI BÖLÜMLERİ (ARAYÜZ HARİTASI)

UI aşağıdaki ana bölümlerden oluşur:

### 1. **HUD (Oyuncu Durumu)**
- HP bar  
- Stamina bar  
- Açlık, susuzluk  
- Enfeksiyon durumu  
- Moral göstergesi  
- Yorgunluk seviyesi  

### 2. **Mini-Map / Compass**
- pusula yönü  
- yakın tehdit sinyalleri  
- marker sistemi  

### 3. **Envanter UI**
- sol: karakter  
- sağ: grid envanter  
- altta: item bilgisi  

### 4. **Crafting UI**
- tarif listesi  
- gerekli malzemeler  
- kalite tahmin göstergesi  

### 5. **Üs Yönetim UI**
- build menu  
- malzeme gereksinimleri  
- yapı seviyeleri  

### 6. **Araç UI**
- hız  
- yakıt  
- motor durumu  
- gürültü seviyesi  

---

# 17.2 UX KURAL SETİ

Her UI elemanı şu kurallara göre tasarlanır:

- Kritik bilgiler → ekranın köşelerinde  
- Uzun süreli bilgiler → menülerde  
- Anlık uyarılar → titreşim + renk değişimi  
- Tehlike yaklaşınca → ekran kenarlarında kırmızı vignette  

Oyun *bilgi bombardımanı* yaratmaz, ama tehlikeyi iyi hissettirir.

---

# 17.3 KONTROL ŞEMASI (MOVEMENT & INTERACTION)

### Hareket Kontrolleri (Top-Down / Isometric için)
- WASD: hareket  
- Shift: koşu  
- Ctrl: stealth (sessiz hareket)  
- Space: dodge/roll  
- F: etkileşim  
- R: reload  
- Tab: envanter  
- C: karakter bilgisi  
- V: araç kameraları arasında geçiş  
- G: hızlı eşya atma  
- Q/E: craft istasyonlarında seçim  

### Araç Kontrolleri
- W/S: hız arttır/azalt  
- A/D: dönüş  
- Shift: turbo (varsa)  
- Space: el freni  
- R: ışıklar  
- H: korna  

### Combat Kontrolleri
- Sol tık: saldır / ateş  
- Sağ tık: aim (nişan)  
- R: mermi doldurma  
- 1–4: quickslot seçimleri  

---

# 17.4 TEHDİT SİNYALLERİ (FEEDBACK SYSTEM)

Oyuncuya yaklaşan tehlike şu yollarla iletilir:

### Görsel Sinyaller
- ekran kenarında kararma  
- titreşim  
- kan sıçraması efekti  
- kırmızı pulsasyon → düşük HP  
- çarpık lens efektleri → enfeksiyon  

### İşitsel Sinyaller
- zombilerin mesafeye göre ses yoğunluğu  
- kalp atışı efekti  
- mutant çığlık efektleri  
- düşük moral → iç ses eklemeleri  
- araç motorunun zorlanma sesi  

### UI Sinyalleri
- “low stamina” yazısı  
- “inventory full”  
- “infection progressing”  

---

# 17.5 SES TASARIMI (AUDIO DESIGN)

Ses tasarımı oyunun atmosferinin en güçlü unsurudur.

### Zombi Sesleri
- mesafeye göre yankı  
- binalarda çınlama efekti  
- mutasyon türüne göre frekans farkı  

### Ortam Sesleri
- rüzgar  
- kırık pencerelerin sallanması  
- uzaktan gelen metal düşme sesleri  
- yağmur ve çatı damlama efektleri  

### Oyuncu Sesleri
- nefes alma (stamina düşükse ağırlaşır)  
- adım türü yüzey bazlı değişir  
- kılıç / silah sesleri kaliteye göre değişir  

### Araç Sesleri
- motorun yıpranma durumuna göre tını değişimi  
- tekerlek çamura girince hırıltı  
- egzoz patlamaları → zombi çeker  

---

# 17.6 KAMERA (CAMERA DESIGN)

PSU 2.5D izometrik veya top-down yapılacağı için kamera:

### Kamera Özellikleri:
- oyuncu merkezli dinamik zoom  
- combat sırasında hafif shake  
- araç kullanırken kamera biraz geri çekilir  
- karanlık alanlarda görüş konisi (cone of vision)  

### Kamera Tepki Modeli:
```
Zoom = BaseZoom ± (MovementSpeed * 0.1)
Shake = DamageAmount * ShakeFactor
```

---

# 17.7 ANİMASYON AKIŞI (ANIMATION SYSTEM)

Oyuncu animasyonları:

- yürüyüş/koşu  
- stealth hareket  
- dodge/roll  
- yaralanma animasyonları  
- bitki toplama  
- araç tamiri  
- crafting animasyonları  
- yorgunluk animasyonu  
- panik animasyonu  

Zombiler:

- işitme reaksiyonu  
- tırmanma  
- kapı kırma  
- sürünme  
- saldırı varyasyonları  

---

# 17.8 HAPTIC FEEDBACK (TETİKLEYİCİ GERİ BİLDİRİM)

Opsiyonel olarak:

- düşük HP → ritmik titreşim  
- araç çarpması → sert titreşim  
- enjeksiyon/serum → kısa titreşim  
- mutant çığlığı → tiz titreşim  

---

# 17.9 UI OKUNABİLİRLİK KURALLARI

### Metin:
- sade  
- büyük puntolu  
- düşük opaklık paneller  
- ekranı kaplamayan minimal tasarım  

### Renk Kodlama:
- yeşil → güvenli  
- sarı → uyarı  
- turuncu → risk  
- kırmızı → kritik tehlike  

### Crafting UI:
- tarifler sol  
- detay sağ  
- hata olasılığı grafiği alt panelde  

---

# 17.10 ACCESSIBILITY (ERİŞİLEBİLİRLİK)

Oyun daha geniş oyuncu kitlesi için şu seçenekleri sunabilir:

- renk körlüğü modu  
- titreşim kapatma  
- büyük font modu  
- UI sadeleştirme modu  
- ses yönlendirme yardımı  
- düşük zorlukta otomatik ses analizi  

---

# 17.11 KONTROL AKICILIĞI (GAME FEEL)

PSU’nun oyun hissi hedefi:

- “ağırlığı hissedilen, gerçekçi ama akıcı bir kontrol”  

Bu nedenle:

- koşarken ivme var  
- yön değiştirirken kayma  
- silah geri tepmesi hissedilir  
- yakın dövüşte **impact** efekti verilir  

---

# 17.12 ÖZET

Bu bölümde PSU’nun oyuncu deneyimi için:

- UI tasarımı  
- UX ilkeleri  
- kontrol akışı  
- tehdit sinyalleri  
- ses & kamera tasarımı  
- animasyon akışı  
- erişilebilirlik özellikleri  

AAA standardında tanımlanmıştır.


---

# 🖥️ BÖLÜM XVIII — TEKNİK TASARIM DÖKÜMANI (TDD)  
### *Project Survival Universe – Full AAA Detay*

---

# 18.0 GENEL MİMARİ FELSEFESİ

PSU teknik tasarımı şu temel ilkelere dayanır:

1. **Modüler Mimari:**  
   Tüm mekanikler bağımsız modüller hâlinde tasarlanır.

2. **Veri Tabanlı Tasarım (Data-Driven):**  
   Crafting, loot, skill, enemy davranışı → veri setlerinden yönetilir.

3. **Performans Öncelikli:**  
   2.5D izometrik yapıya uygun şekilde GPU dostu rendering pipeline.

4. **Kolay Genişletilebilirlik:**  
   DLC/Expansion eklemek kolay olmalı.

5. **Co-op Uyumluluğu:**  
   Networking katmanı temel mimariye entegre bir şekilde tasarlanır.

---

# 18.1 OYUN MOTORU SEÇENEKLERİ

## Önerilen Motorlar:
### **⚙️ Unity (URP ile)**
Avantajlar:
- 2D/2.5D için çok uygun  
- ECS + Jobs + Burst ile optimize edilebilir  
- Asset workflow kolay  
- Networking için NGO (Netcode for GameObjects)

### **⚙️ Unreal Engine 5 (Paper2D + Custom Camera)**
Avantajlar:
- güçlü rendering  
- data asset sistemi  
- multiplayer güçlü  

### Tek başına geliştirici için öneri:  
➡ **Unity** (daha hızlı prototipleme)

---

# 18.2 ANA SİSTEMLER & MANAGER YAPISI

Oyun çekirdeği **Manager bazlı** bir mimari üzerine kurulur.

```
GameManager
 ├── PlayerManager
 ├── EnemyManager
 ├── AIManager
 ├── InventoryManager
 ├── CraftingManager
 ├── LootManager
 ├── WorldManager
 ├── TimeManager
 ├── VehicleManager
 ├── BaseManager
 ├── SaveLoadManager
 └── NetworkManager
```

Bu yapı sayesinde tüm modüller bağımsızdır.

---

# 18.3 ENTITY MODELİ (ECS / HYBRID ECS)

Tavsiye edilen model:

### **Hybrid ECS:**
- Player → klasik OOP (MonoBehaviour)  
- Enemy → ECS (çok sayıda olduğu için)  
- Loot → ECS (sahne optimizasyonu için)  
- World objects → ECS  
- UI → OOP  

Böylece hem kullanım kolaylığı hem performans sağlanır.

---

# 18.4 VERİ MODELİ (SCRIPTABLE OBJECT TABANLI)

Tüm veri dosyaları ScriptableObject ile yönetilir:

### Örnek Veri Objeleri:
- ItemData  
- WeaponData  
- EnemyData  
- VehicleData  
- SkillTreeNode  
- CraftRecipe  
- LootTable  
- BiomeConfig  
- EventConfig  

Örnek Craft Recipe tanımı:

```json
{
  "id": "metal_plate",
  "inputs": [
    {"material": "scrap_metal", "amount": 3}
  ],
  "outputs": [
    {"item": "metal_plate", "amount": 1}
  ],
  "craftTime": 10,
  "station": "MetalWorkbench",
  "qualityRange": [1, 4]
}
```

---

# 18.5 AI MİMARİSİ (BEHAVIOR TREE)

Tüm zombi ve mutant AI’ları **Davranış Ağacı** (Behavior Tree) altyapısı ile çalışır.

Örnek ağaç:

```
Root
 ├── CheckForPlayer
 │      ├── HearPlayer
 │      ├── SeePlayer
 │      └── InvestigateSound
 ├── ChasePlayer
 ├── AttackPlayer
 └── SearchForPlayer
```

Mutant AI daha gelişmiş node’lara sahiptir:

- JumpAttack  
- ClimbSurface  
- Retreat  
- ScreamerCall  
- PackCoordination (Sürü davranışı)  

---

# 18.6 PATHFINDING (NAVIGATION)

### Unity için:
- NavMesh + NavMeshAgent  
- NavMeshSurface ile dinamik alanlar  

### Özel durumlar:
- tırmanıcı mutant → özel path  
- binaların içi → farklı navmesh layer  
- zombilerin kapı kırma davranışı → path değişimi tetiklenir  

**Off-mesh links** tırmanma ve yüksekten atlama için kullanılır.

---

# 18.7 LOOT SİSTEMİ TEKNİĞİ

Loot sistemi **Seed-Based RNG** ile çalışır.

Her binada bir “loot seed” bulunur:

```
lootSeed = hash(buildingID + worldSeed)
```

Bu sayede:

- her yeni oyunda farklı loot  
- ama aynı binada davranış deterministik (save/load tutarlı)

Loot dağılımı:

```
finalLoot = BaseLootTable * RarityCurve * AreaRiskMultiplier
```

---

# 18.8 CRAFTING SİSTEMİ ALTYAPISI

Crafting işlemi üç katmandan oluşur:

### 1) RecipeResolver  
Ne craft edilebilir? (Crafting UI'de görünür)

### 2) CraftProcessor  
Craft süresi, kalite hesabı, hata olasılığı

### 3) CraftResult  
Çıkan ürün → durability, rarity, quality

Craft süreci Coroutine veya Unity Jobs ile yapılabilir.

---

# 18.9 DAY/NIGHT CYCLE (ZAMAN MOTORU)

TimeManager:

```
CurrentTime
DayLength
NightLength
Weather
Season
```

Gün dönüşüm döngüsü:

- gündüz → düşük zombi agresyonu  
- gece → artan spawn, düşük görüş  

Işık sistemi URP’nin “2D Renderer” pipeline ile entegre edilir.

---

# 18.10 ENVANTER SİSTEMİ TEKNİĞİ

Envanter bir **grid tabanlı veri modeli** ile tutulur:

```json
{
  "slots": [
    {"itemID": "water", "sizeX":2, "sizeY":2, "weight":1.0},
    {"itemID": "rifle", "sizeX":4, "sizeY":2, "weight":5.0}
  ],
  "maxWeight": 22.0
}
```

Özellikler:

- grid çarpışma hesaplama  
- backpack + clothing + vehicle combined inventory  
- drag&drop UI sistemi  

---

# 18.11 ARAÇ SİSTEMİ TEKNİĞİ

Araç sistemi hibrit yapıda çalışır:

- Rigidbody2D + custom traction modeli  
- araç parçaları veri seti ile yönetilir  
- hasar modelleri event bazlı  

Yakıt tüketimi:

```
fuel -= Time.deltaTime * (speed * 0.1 + cargoWeight * 0.02)
```

Motor sesleri → AudioMixer parametreleri ile kontrol edilir.

---

# 18.12 ÜS SİSTEMİ (BASE SYSTEM)

Üs modüler yapıda inşa edilir:

```
BaseGrid[ x ][ y ]
```

Her yapı:

- maliyet  
- seviye  
- enerji tüketimi  
- dayanıklılık  
- crafting bonusları  

sahibidir.

Oluşturma Object Pooling ile yapılır.

---

# 18.13 OYUN KAYIT SİSTEMİ (SAVE/LOAD)

Kritik sistemler JSON veya Binary olarak kaydedilir:

- player state  
- world seed  
- opened containers  
- base layout  
- vehicles  
- weather & time state  

Örnek Save Data:

```json
{
  "player": {
    "hp": 85,
    "stamina": 60,
    "inventory": [...],
    "position": [123, 532]
  },
  "world": {
    "seed": 491320,
    "time": "Day3-14:52"
  }
}
```

---

# 18.14 MULTIPLAYER / CO-OP MİMARİSİ

Co-op oyun **server-authoritative** model ile çalışır.

### Önerilen Teknoloji:
- Unity NGO  
- Steamworks P2P  
- Relay Server opsiyonel  

### Replikasyon Katmanları:

1. **Player Movement**
2. **Combat**
3. **Inventory**
4. **Crafting Actions**
5. **Base Building**
6. **Vehicle Sync**
7. **Enemy AI State**

Düşman AI sunucu tarafında yönetilir.

---

# 18.15 OPTİMİZASYON STRATEJİLERİ

### 1) Object Pooling  
Zombiler, lootlar ve mermiler için zorunlu.

### 2) LOD (Level of Detail)  
2.5D sprite LOD sistemi.

### 3) Tick Rate Yönetimi  
AI her frame değil, 0.2–0.5s aralıklarla çalışır.

### 4) Culling Sistemleri  
Ekran dışındaki düşmanlar “sleep mode”a alınır.

### 5) Physics Deregulation  
Araç fiziği sadece hareket halindeyken aktif.

### 6) Burst-compiled ECS  
Zombi sürüleri için ideal.

---

# 18.16 TEKNİK RİSKLER VE ÇÖZÜMLER

| Risk | Açıklama | Çözüm |
|------|----------|--------|
| Yüksek enemy sayısı | performans düşebilir | ECS + pooling |
| Büyük harita | memory blow | streaming + chunking |
| Co-op sync | lag, desync | server authoritative |
| Araç fiziği | karmaşık olabilir | simplified traction model |
| Crafting çeşitliliği | veri yönetimi zor | ScriptableObject Data-Driven |

---

# 18.17 DIŞ KÜTÜPHANE / ARAÇ ÖNERİLERİ

- DOTween → UI animasyonları  
- Odin Inspector → veri yönetimi  
- FMOD → gelişmiş ses sistemi  
- A* Pathfinding Project → alternatif nav sistemi  
- Rewired → kontrol sistemi  

---

# 18.18 ÖZET

Bu bölümde oyunun:

- çekirdek teknik mimarisi  
- veri modeli  
- AI sistemi  
- loot & crafting altyapısı  
- envanter ve araç teknik tasarımı  
- optimizasyon stratejileri  
- multiplayer modeli  
- save/load sistemi  

AAA seviyesinde detaylandırılmıştır.


---

# 📜 BÖLÜM XIX — HİKÂYE & EVREN TASARIMI  
### *Project Survival Universe – Full AAA Detay*

---

# 19.0 EVRENİN TONU VE DİLİ

PSU'nun evreni şu tonlara sahiptir:

- **Post-apocalyptic gerçekçilik**  
- **Bilimsel arka planı olan bir salgın**  
- **Toplumsal çöküş sonrası mikro topluluklar**  
- **Karanlık, kasvetli ama keşfetmeye değer bir dünya**  
- **İnsan doğasının hem iyi hem kötü yüzünü gösteren anlatım**  

Evrende umut vardır, ama her zaman bir bedeli vardır.

---

# 19.1 SALGININ BAŞLANGICI (OUTBREAK ORIGINS)

Salgının kaynağı **deneysel bir biyoteknoloji projesi**dir.

### Proje Adı:  
**EVO-23 İnsan Adaptasyon Serumu**

Amaç:  
- insanların ekstrem koşullara adapte olmasını sağlamak  
- askeri kullanım: dayanıklılığı ve refleksleri artırmak  
- enfeksiyonlara karşı hızlı hücresel yenilenme sağlamak  

### Sorun:  
Serumun yan etkisi, hücre bölünmesinin **kontrolsüz mutasyona** dönüşmesi.

### Sonuç:
- hızlı mutasyon  
- saldırganlık  
- sinir sistemi bozulması  
- duyusal organlarda farklılaşma  

Salgın 3 hafta içinde küresel çapta yayıldı.

---

# 19.2 KRONOLOJİK ZAMAN ÇİZELGESİ

### 📅 5 YIL ÖNCE — İlk Proje Başlatıldı  
EVO-23 askeri ve bilimsel bir ortak proje olarak geliştirildi.

### 📅 2 YIL ÖNCE — İlk Sızıntı  
Karantina tesisinde açıklanamayan davranış bozuklukları.

### 📅 1 YIL ÖNCE — Mutasyon Hızlandı  
Test denekleri:
- cilt sertleşmesi  
- agresif refleksler  
- duyusal organ kaymaları  

### 📅 6 AY ÖNCE — Büyük Felaket  
Serum taşıyan bir laboratuvar konvoyu yok oldu.  
Bölgedeki insanlar enfekte oldu → şehirler çöktü.

### 📅 ŞİMDİ — Dünya Nüfusunun %90'ı Yok  
Hayatta kalanlar:
- küçük gruplar  
- tek başına dolaşan haydutlar  
- karanlık köşelerde gizlenen NPC’ler  
- eski askerler  
- bilim insanlarının kalıntıları  

Dünya sessiz, ama ölümcül.

---

# 19.3 VİRÜSÜN YAPISI (EVO-23 MUTAGEN)

Virüs üç bileşenli:

### 1) **Nöral Bozucu**
- bilinç kaybı  
- saldırgan davranışlar  

### 2) **Hücresel Hızlandırıcı**
- iyileşme → mutasyon dönüşür  
- kas yoğunluğu artar  

### 3) **Duyu Mutasyon Bileşeni**
- bazı zombiler kör  
- bazıları sağır  
- bazıları yüksek frekas duyuyor  

Virüs **ölen bedenlerde bile** bir süre aktif kalır.

---

# 19.4 MUTASYON MEKANİKLERİ

Virüs, bölgeye göre farklı etkiler üretir:

| Bölge | Mutasyon | Nedeni |
|--------|-----------|----------|
| Laboratuvar | gelişmiş mutantlar | kimyasal yoğunluk |
| Şehir Merkezi | runner | yoğun stres & av baskısı |
| Banliyö | normal zombiler | düşük mutasyon |
| Sanayi Bölgesi | bloater | kimyasal zehirlenme |
| Askeri Üs | mini-boss | askeri deneyler |

---

# 19.5 HAYATTA KALANLAR (SURVIVORS)

Hayatta kalan insanların ortak özellikleri:

- bağışıklıklarının güçlü olması  
- tesadüfi genetik direnç  
- çevresel adaptasyon  
- mental dayanıklılık  

Oyuncunun karakterleri de “tam bağışık değildir”, sadece mutasyona dirençlidir.

---

# 19.6 KARAKTERLERİN ORTAK MOTİVASYONLARI

1. **Hayatta kalmak**  
2. **Güçlü bir üs kurmak**  
3. **Arkadaşlarını korumak**  
4. **Kaynak bulmak**  
5. **Dünyanın gerçeğini öğrenmek**  
6. **Mutasyona çözüm bulmak (opsiyonel hikâye yönü)**  
7. **Sıradan bir yaşamı geri kazanmak**  

---

# 19.7 OYUNCUNUN ANA KARAKTER GRUBU

Oyun başlangıcında 2–4 kişilik bir grup:

- profesyonel olmayan ama hayatta kalmayı bilen  
- farklı fiziksel özelliklere sahip  
- meslek ve yetenek farklılıkları olan  

Karakterler tamamen **kişisel hikâye potansiyeli** taşıyacak şekilde tasarlanır.

Örnek profiller:

### 1) Arda — Eski bir mekanikçi  
- araç tamiri hızlı  
- düşük sosyal beceri  

### 2) Deren — Aşçı  
- moral buff yemekleri  
- düşük dayanıklılık  

### 3) Batu — Atlet  
- hızlı koşu  
- loot hızı yüksek  

### 4) Mert — Güvenlik görevlisi  
- temel silahlarda başarılı  
- düşük crafting yeteneği  

Bu sadece örnektir; asıl sistem modülerdir.

---

# 19.8 NPC SİSTEMİ

NPC’ler rastgele davranış modellerine sahiptir:

### Türleri:
- **Gezgin (Wanderer)**  
- **Tüccar (Trader)**  
- **Bilim İnsanları**  
- **Eski Askerler**  
- **Göçmen Gruplar**  
- **Tehlikeli Haydutlar**

NPC’ler:

- görev verebilir  
- ticaret yapabilir  
- bilgi paylaşır  
- not bırakır  
- event tetikler  

Bazıları tehlikelidir.

---

# 19.9 FRANKSYONLAR (OPSİYONEL GELECEK EKLENTİSİ)

3 büyük fraksiyon önerilebilir:

### 1) **The Remnants (Kalıntılar)**
- eski askeri topluluk  
- disiplinli  
- sert yönetim  

### 2) **Green Dawn**
- doğa odaklı hayatta kalanlar  
- bitki & ilaç bilgisi  
- barışçıl ama mesafeliler  

### 3) **Black Cell**
- bilimsel güdümlü, karanlık bir topluluk  
- serum deneyleri peşindeler  
- mutant kontrolü hedefleri var  

Bu fraksiyonlar hikâyeye *dallanabilirlik* katar.

---

# 19.10 ÇEVRESEL HİKÂYE ANLATIMI

Oyuncu dünyayı keşfederken hikâye pasif şekilde anlatılır:

### 1) **Ses Kayıtları**  
- laboratuvar araştırmacı notları  
- son anlarını kaydeden insanlar  

### 2) **Evlerdeki Notlar**  
- aile hikâyeleri  
- son kaçış planları  
- kaybolmuş insanların izleri  

### 3) **Grafiti & Duvardaki İşaretler**  
- haydut uyarıları  
- yönlendirmeler  
- gizli depo işaretleri  

### 4) **Görsel Kalıntılar**  
- devrilmiş konvoy  
- patlamış laboratuvar tünelleri  
- mutant yuvaya yakın kan izleri  

---

# 19.11 ANA HİKÂYE (OPSİYONEL) - KISA ÖZET

### Ana Tema:
**“Salgını durduramazsın, ama gerçeği öğrenebilirsin.”**

Oyuncu:

- EVO-23 projesinin perde arkasını öğrenir  
- kaçak bilim insanlarının izini sürer  
- hastalığın asıl formülünü keşfedebilir  
- mutasyonun durdurulması için prototip serum geliştirebilir  

Bu hikâye tamamen opsiyoneldir.  
Oyun, sandbox oynanışı destekler.

---

# 19.12 YAN HİKÂYE ÖRNEKLERİ

### 1) Kaybolmuş Çocuk  
Bir kamp grubunun çocuğu kaybolmuştur.  
Şehirde izler bulunur.

### 2) Terk Edilmiş Üs  
Bir askeri üste devasa mutant izleri vardır.

### 3) İlaç Arayışı  
Yaşlı bir NPC kızını kurtarmak için serum parçası ister.

### 4) Mekanikçinin Günlüğü  
Araç modlarının prototip planları bir günlüğe yayılmıştır.

---

# 19.13 HİKÂYE TEMPOSU

Hikâye temposu üç fazdan oluşur:

1. **Kaos Fazı (Başlangıç)**  
- oyuncu ne olduğunu anlamaya çalışır  
- kısa ve yoğun anlatım  

2. **Keşif Fazı (Orta Oyun)**  
- laboratuvar kayıtları  
- fraksiyonlarla tanışma  
- dünya genişler  

3. **Gerçeklerin Gün Yüzüne Çıkışı (Geç Oyun)**  
- mutantların doğası tam anlaşılır  
- serum gerçeği öğrenilir  

---

# 19.14 HİKÂYE LORE BİLGİ BANKASI

Oyunda oyuncunun açabildiği bir **Lore Bankası** bulunabilir.

Kategoriler:

- EVO-23 Araştırma Notları  
- Mutasyon Kataloğu  
- NPC Anıları  
- Bölgesel Tarih  
- Laboratuvar Raporları  
- Eski Asker Kayıtları  

---

# 19.15 ÖZET

Bu bölümde oyunun:

- hikâye geçmişi  
- virus & mutasyon yapısı  
- evrenin kronolojisi  
- karakter motivasyonları  
- NPC sistemi  
- çevresel hikâye anlatımı  
- opsiyonel ana hikâye akışı  

AAA seviyesinde açıklanmıştır.

---

# 🏠 BÖLÜM XX — ÜS KURULUMU & GELİŞİM TASARIMI  
### *Project Survival Universe – Full AAA Detay*

---

# 20.0 ÜS SİSTEMİNİN VİZYONU

PSU’da üs (HOME BASE):

- oyuncunun güvenli alanı  
- crafting merkezidir  
- moral ve karakter gelişimini etkiler  
- depolama ve üretim zincirinin kalbidir  
- zombi saldırılarına karşı savunma gerektirir  
- co-op oyuncular için sosyal bir merkezdir  

Üs sistemi hem RPG hem strateji mekaniğini destekler.

---

# 20.1 ÜS BAŞLANGICI (STARTING BASE FLOW)

Oyun başında oyuncu:

1. **Yarı yıkık bir kulübede başlar**  
2. Çevre:
   - çökmüş çatı parçaları  
   - kırık kapılar  
   - dağılmış mobilyalar  
   - kirlenmiş su varilleri  

3. Oyuncu bu kulübeyi:
   - temizler  
   - tamir eder  
   - kullanıma hazır hâle getirir  

Bu süreç mini bir tutorial görevi görür.

---

# 20.2 ALAN TEMİZLEME (AREA CLEAR SYSTEM)

Üssün bulunduğu alan ilk aşamada zombiler ve hurdalarla doludur.

Oyuncu:

- çöpleri toplar  
- zararlı nesneleri kaldırır  
- alanı genişletmek için çevredeki ağaçları keser  
- kayaları kırar  
- duvar boşluklarını kapatır  

Bu sistem **resource sink** olarak çalışır → oyuncu erken oyunda temel kaynak toplar.

---

# 20.3 MODÜLER YAPI SİSTEMİ

Üs tamamen **grid üzerine kurulmuş modüler bir yapıdır**.

### Yapı Kategorileri:

1. **Temel Yapılar**
   - duvar  
   - kapı  
   - pencere  
   - zemin  
   - merdiven  

2. **Gelişmiş Yapılar**
   - metal duvar  
   - güçlendirilmiş kapı  
   - çelik çerçeve  

3. **Destek Yapıları**
   - kolon  
   - çatı kirişleri  

4. **Depolama**
   - sandık  
   - dolap  
   - raf sistemi  
   - soğutuculu depo (late game)

5. **Üretim İstasyonları**
   - marangoz tezgâhı  
   - metal işleme tezgâhı  
   - tıbbi laboratuvar  
   - kimya laboratuvarı  
   - araç tamir rampası  

6. **Savunma Yapıları**
   - dikenli tel  
   - tuzaklar  
   - taret  
   - projektör kuleleri  

7. **Enerji & Utility**
   - jeneratör  
   - su deposu  
   - solar panel (late game)  
   - akü bankası  

Üs gelişimi tamamen oyuncunun yaratıcılığına bırakılır.

---

# 20.4 ÜS DAYANIKLILIK SİSTEMİ

Her yapı bir **durability** değerine sahiptir.

| Dayanıklılık Aralığı | Durum |
|----------------------|--------|
| 100–75% | sağlam |
| 74–50% | hafif hasarlı |
| 49–25% | zayıf |
| 24–1%  | ciddi hasarlı |
| 0% | yıkılır |

Yıkılan yapılar zombilerin içeri girmesine neden olur.

---

# 20.5 ZOMBİ BASKINLARI (BASE RAID)

Gece veya belirli event’lerde üssünü şu tehditler vurabilir:

### Baskın Etkenleri:
- yüksek gürültü üretimi  
- sürekli crafting çalışması  
- jeneratör sesi  
- bölgede yüksek mutant etkisi  
- oyuncunun son yaptığı eylemler  

### Baskın Türleri:
1. **Küçük Saldırı** (1–3 zombi)  
2. **Orta Baskın** (small horde)  
3. **Muted Mutant Baskını**  
4. **Mini-Boss + Horde**  
5. **The Nest Event → Base Attack** (late game)

Zombiler:
- kapılara saldırır  
- duvarları kırmayı dener  
- çatıya tırmanabilir (climbers)  
- savunma kulelerine saldırır  

---

# 20.6 ENERJİ SİSTEMİ (POWER SYSTEM)

Üretim istasyonları enerji ister.

Enerji kaynakları:

1. **Jeneratör**  
   - yakıt tüketir  
   - gürültü üretir  

2. **Solar Panel (late game)**  
   - gündüz enerji üretir  
   - geceleri battery bank kullanılır  

3. **Battery Bank**
   - enerji depolar  
   - solar panel ile uyumlu  

### Enerji Formülü:

```
PowerBalance = (EnergyProduction) - (EnergyConsumption)
```

Eksiye düşerse üretim durur.

---

# 20.7 SU SİSTEMİ

Su kaynakları:

- yağmur suyu toplayıcı  
- su kuyusu (mid game)  
- su arıtma sistemi  
- doğal kaynaklardan su  
- kirli su → kaynatma/temizleme gerekir  

Su **crafting & yemek** için de gereklidir.

---

# 20.8 ÜRETİM İSTASYONLARI (PRODUCTION CHAINS)

Her istasyon benzersiz bir üretim zincirinin parçasıdır.

### 1. Marangoz Tezgâhı  
- yapı parçaları  
- sandık, raf  
- ahşap zırh modülleri  

### 2. Metal İşleme Tezgâhı  
- metal levha  
- çivi, cıvata  
- zırh parçaları  
- silah parçaları  

### 3. Tıbbi Laboratuvar  
- bandaj  
- medkit  
- serum bileşeni  

### 4. Kimya Laboratuvarı  
- patlayıcı  
- yakıt katkısı  
- ilaç bileşenleri  

### 5. Araç Tamir Rampası  
- motor değişimi  
- lastik tamiri  
- araç modifikasyonları  

Her istasyon **seviye atlayabilir**.

---

# 20.9 ÜS GENİŞLEME AŞAMALARI (BASE TIERS)

Oyuncunun üssü 3 aşamalı gelişir:

## 🟩 **Tier 1: Hayatta Kalma Aşaması**
- küçük kulübe  
- ahşap duvarlar  
- temel sandıklar  
- ilkel crafting  

## 🟧 **Tier 2: Yerleşik Üs Aşaması**
- metal kapı  
- büyük depolama alanları  
- jeneratör  
- tıbbi lab & metal workbench  
- savunma hatları  

## 🟥 **Tier 3: İleri Teknoloji Üssü**
- solar panel  
- battery bank  
- advanced araç modları  
- taret sistemleri  
- kimya lab  
- güçlendirilmiş savunmalar  

---

# 20.10 BASE LAYOUT SİSTEMİ

BaseManager şu bileşenlerden oluşur:

```
BaseCells[ x ][ y ]
 ├── type (wall, floor, station)
 ├── durability
 ├── energyConsumption
 ├── interactions
 └── upgradeStage
```

Oyuncunun üssünün düzeni:

- crafting hızını  
- savunma gücünü  
- enerji verimliliğini  
- moral durumunu  

etkiler.

---

# 20.11 MORAL ÜZERİNE ÜS ETKİLERİ

Üsteki düzen moral sistemine etki eder.

### Pozitif:
- temiz ortam  
- yemek masası  
- aydınlatma  
- sessizlik  
- müzik çalar  

### Negatif:
- karanlık ortam  
- çöpler  
- kırık duvarlar  
- sürekli zombi gürültüsü  

Oyuncu karakterleri çevrelerine tepki verir.

---

# 20.12 BASE AUTOMATION (OPSİYONEL)

Gelecek güncellemesinde otomasyon eklenebilir:

- su pompaları  
- elektrik dağıtım sistemi  
- otomatik savunmalar  
- üretim zincirleri  

---

# 20.13 BASE DEFENSE STRATEJİSİ

Savunma önemli bir gameplay döngüsüdür:

### Yapılar:
- diken teli  
- çivi tuzakları  
- çukur tuzakları  
- molotof rampaları  
- taretler  
- ışık tuzakları  
- alarm sistemi  

Her savunma yapısı:

- enerji  
- dayanıklılık  
- malzeme  
- bakım  

ister.

---

# 20.14 ÜS YIKIM MODELİ (DESTRUCTION SYSTEM)

Duvarlar ve yapılar:

- çarpma  
- patlama  
- mutant saldırısı  
- yangın  
- bakım eksikliği  

nedenleriyle hasar alır.

Yıkım hesaplaması:

```
finalDamage = BaseDamage * (1 - MaterialResistance) * MutantMultiplier
```

---

# 20.15 GÖRSEL VE SESSEL ATMOSFER

Oyuncunun üssü zamanla:

- güvenli görünür  
- sıcak bir aydınlatma alır  
- ses izolasyonu yapılabilir  
- karakterlerin konuşmaları duyulur  
- crafting sesleri tatmin edici olur  

Üs—dünyadaki tek “ev” hissi verir.

---

# 20.16 ÖZET

Bu bölümde PSU’nun:

- üs kurma sistemi  
- genişleme aşamaları  
- savunma mekanikleri  
- enerji & su sistemi  
- üretim istasyonları  
- moral etkileşimi  
- base layout algoritması  

AAA kalitede tanımlanmıştır.


---

# 🔧 BÖLÜM XXI — CRAFTING & ÜRETİM EKOSİSTEMİ  
### *Project Survival Universe – Full AAA Detay*

---

# 21.0 CRAFTING SİSTEMİ VİZYONU

PSU’da crafting:

- oyun ilerlemesinin **kolonu**  
- survival döngüsünün **devamı**  
- karakter gelişiminin **yakıtı**  
- üs gelişiminin **temeli**  
- araç sisteminin **tamamlayıcısı**  

olarak tasarlanmıştır.

Crafting sisteminin ana hedefi:

**"Oyuncu ne kadar emek verirse o kadar güçlü olur"** felsefesini desteklemektir.

---

# 21.1 CRAFTING KATEGORİLERİ

Crafting beş ana kategoriye ayrılır:

## 1) **Temel Crafting (Basic Survival Crafting)**
- bandaj  
- çubuk, sopa  
- ilkel mızrak  
- basit çanta  
- odun parçalama  

## 2) **Marangozluk (Woodworking)**
- kapı, pencere  
- mobilya  
- sandık & raf  
- ev geliştirme parçaları  

## 3) **Metal İşleme (Smithing / Metalworking)**
- çelik levha  
- zırh parçaları  
- silah modları  
- araç parçaları  

## 4) **Tıbbi Crafting (Medical)**
- bandaj → steril bandaj → medkit  
- ağrı kesici  
- serum ön maddeleri  

## 5) **Kimya & Mühendislik (Chemistry / Engineering)**
- elektronik parçalar  
- taret modülleri  
- yakıt katkıları  
- patlayıcı madde  
- gelişmiş araç modları  

---

# 21.2 CRAFTING İSTASYONLARI

Her crafting türü özel bir istasyon gerektirir.

| İstasyon | Açıklama | Tier |
|----------|----------|-------|
| Basic Workbench | temel eşya | T1 |
| Carpentry Bench | ahşap işler | T1–T2 |
| Metal Workbench | metal şekillendirme | T2 |
| Advanced Metal Forge | çelik işlemleri | T3 |
| Medical Lab | tıbbi maddeler | T2 |
| Chemical Lab | kimyasal ve elektronik | T3 |
| Engineering Station | araç modları | T3 |

İstasyonda yükseltme mümkündür:

```
Workbench Tier 1 → Tier 2 → Tier 3
```

Tier arttıkça:
- crafting verimi ↑  
- crafting süresi ↓  
- kalite artışı ↑  

---

# 21.3 CRAFTING SÜRE FORMÜLÜ

Her craft işlemi bir süre gerektirir.

### Base Formula:
```
CraftTime = BaseTime × (1 - CraftSkillBonus) × (1 - StationBonus)
```

Örnek parametreler:

- BaseTime: tarifin temel süresi (örn. 30s)
- CraftSkillBonus: %0–40 arası
- StationBonus: %0–30 arası

Örnek hesaplama:
```
30s × (1 - 0.20) × (1 - 0.15) = 20.4s
```

---

# 21.4 KALİTE (QUALITY TIER) SİSTEMİ

Üretilen item 5 kalite seviyesine ayrılır:

| Tier | Renk | Etki |
|-------|-------|--------|
| T1 | gri | düşük dayanıklılık |
| T2 | yeşil | normal |
| T3 | mavi | yüksek kalite |
| T4 | mor | epic |
| T5 | turuncu | legendary |

### Kalite Belirleme:

```
Quality = (SkillLevel × 0.5) + (StationTier × 0.3) + (Mastery × 0.2) + RNG
```

Bu formül oyuncunun gelişimini ödüllendirir.

---

# 21.5 MULTI-OUTPUT (ÇOKLU ÇIKTI) SİSTEMİ

Crafting sonucu birden fazla ürün çıkabilir.

Örnek:

- 1 kumaş → 2–3 bandaj  
- 1 metal parçası → 2 cıvata  
- 1 bitki → 1–3 kimyasal bileşik  

Skill seviyesi yüksekse:

```
BonusOutputChance = 5% + (Mastery × 0.5%)
```

---

# 21.6 HATA SİSTEMİ (FAILURE CHANCE)

Crafting nadiren başarısız olabilir.

Başlıca sebepler:

- az skill  
- düşük istasyon tier’ı  
- düşük moral  
- kalitesiz malzeme  

Formül:

```
FailureChance = BaseFailure - Skill×0.4 - Station×0.35 - Morale×0.1
```

Başarısız olursa:

- malzeme yanabilir  
- düşük kaliteli ürün çıkabilir  
- craft süresi uzayabilir  

---

# 21.7 ÜRETİM ZİNCİRLERİ (PRODUCTION CHAINS)

Crafting sistemi geniş zincirlerden oluşur.

## Ahşap Zinciri:
```
Ağaç → Kütük → Plank → Kapı/Pencere/Mobilya
```

## Metal Zinciri:
```
Hurda → Eritme → Metal Levha → Zırh/Silah/Araç Parçası
```

## Tıbbi Zincir:
```
Bitki → Kimyasal → Steril Madde → Medkit
```

## Elektronik Zinciri:
```
Hurda cihaz → Devre → Motor Kontrol Birimi → Araç Modu
```

## Araç Mod Zinciri:
```
Çelik + Devre + Yağ → Modül → Araç Üzerine Uygulama
```

---

# 21.8 ADVANCED CRAFTING (LATE GAME)

Geç oyunda oyuncu:

- taret üretir  
- serum sentezler  
- mutant zayıflatıcı maddeler üretir  
- patlayıcı bombalar yapar  
- advanced araç modlarında uzmanlaşır  

Örnek:

### “Mutant Repellent Serum”
Gereken:
- 2 kimyasal bileşik  
- 1 genetik materyal  
- 1 medlab T3  
- 80 tıbbi skill  

Etki:
- mutantların algı menzili %40 azalır  
- 5 dakika sürer  

---

# 21.9 BLUEPRINT & RESEARCH İLE TARİF AÇMA

Bazı tarifler sadece:

- blueprint  
- NPC ticareti  
- araştırma istasyonu  
- boss düşüşü  
- gizli POI  

ile açılır.

Research sample örneği:

```
ResearchProject:
  id: serum_tier3
  requiredItems: ["mutant_tissue", "bio_sample_A", "chemical_X"]
  time: 120s
  unlocks: ["serum_tier3_recipe"]
```

---

# 21.10 CRAFTING MASTERIES (ORTA VE GEÇ OYUN)

Her kategori ustalık kazanır:

- Woodworking Mastery  
- Metalworking Mastery  
- Medical Mastery  
- Chemistry Mastery  
- Engineering Mastery  

Mastery etkileri:

| Mastery | Etki |
|---------|-------|
| 20 | craft süresi -%5 |
| 40 | kalite +%10 |
| 60 | bonus çıktı şansı +%10 |
| 80 | minimum kalite T2 olur |
| 100 | efsanevi ürün çıkarma şansı +%5 |

---

# 21.11 CRAFTING UI & UX TASARIMI

Crafting ekranı 3 panele ayrılır:

### Panel A — Tarif Listesi
- kategori filtreleri  
- rarity filtrelemesi  
- mastery gereksinimi  

### Panel B — Malzeme Gereksinimi  
- miktar  
- kalite  
- stok bilgisi  

### Panel C — Sonuç Paneli  
- kalite tahmini  
- craft süresi  
- bonus şansı  
- gerekli istasyon  

UI feedback örneği:

- eksik malzeme = kırmızı  
- yeterli = yeşil  
- bonus = mavi  

---

# 21.12 CRAFTING TEKNİK TASARIM (VERİ MODELİ)

Crafting Recipe Data Model:

```json
{
  "id": "steel_plate",
  "category": "metal",
  "tier": 2,
  "inputs": [
    {"id": "scrap_metal", "amount": 4},
    {"id": "charcoal", "amount": 1}
  ],
  "outputs": [
    {"id": "steel_plate", "amount": 1}
  ],
  "time": 30,
  "station": "MetalWorkbench_T2",
  "skill_required": 35,
  "mastery_gain": 2
}
```

Crafting Processor Pseudocode:

```
function CraftItem(recipe):
    if !HasMaterials(recipe.inputs): return ERROR
    time = recipe.time * SkillMultiplier * StationMultiplier
    quality = CalculateQuality()
    result = GenerateOutput(quality)
    RemoveMaterials()
    AddItem(result)
```

---

# 21.13 CRAFTING & WORLD PROGRESSION BAĞLANTISI

Crafting dünya ilerlemesinin kilididir:

### Early Game:
- temel eşya  
- hayatta kalma araçları  

### Mid Game:
- metal işleme  
- araç tamiri  
- daha iyi yemek  

### Late Game:
- taret  
- serum  
- ileri mühendislik ürünleri  
- endgame zırhlar  

Crafting → oyuncuyu **şehirlere, sanayi alanlarına, laboratuvarlara** sürükler.

---

# 21.14 CRAFTING DENGESİ (ECONOMY TUNING)

Denge faktörleri:

- malzeme kıtlığı = zorluk artırır  
- crafting süresi = risk/ödül belirler  
- enerji tüketimi = üs ekonomisi ayarlar  
- kalite RNG = oyun heyecanı  

Örnek denge hedefi:

- T1 crafting → 5–20 saniye  
- T2 crafting → 20–60 saniye  
- T3 crafting → 60–180 saniye  

---

# 21.15 ÖZET

Bu bölüm crafting sisteminin:

- üretim zincirleri  
- istasyonları  
- formülleri  
- kalite sistemi  
- mastery gelişimi  
- teknik mimarisi  
- UI akışı  
- progression ilişkisi  

AAA detayında tanımlamaktadır.


---

# 🎮 BÖLÜM XXII — TAM OYUN PLAYFLOW  
### *Project Survival Universe – Full AAA Detay*

---

# 22.0 OYUN PLAYFLOW TASARIM FELSEFESİ

PSU’nun Playflow tasarımının amacı:

- oyuncuya sürekli ilerleme hissi vermek  
- ama hiçbir zaman güvenlik hissini tam olarak sağlamamak  
- oyuncuyu hem yüksek risk hem yüksek ödül arasında dengelemek  
- her 10 dakikada bir mikro hedef  
- her 1–2 saatte bir makro hedef  
- her 10–20 saatte bir büyük milestone vermektir  

Oyun bir **survival sandbox + RPG progression** döngüsü üzerine kuruludur.

---

# 22.1 PLAYFLOW ÖZET GRAFİĞİ

```
Tutorial (0–10 dk)
↓
Early Game (0–3 saat)
↓
Midgame Transition (3–8 saat)
↓
Midgame (8–20 saat)
↓
Late Midgame (20–40 saat)
↓
Endgame Unlock (40+ saat)
↓
Endgame Sandbox (50–100 saat)
```

---

# 22.2 OYUN BAŞLANGICI (0–10 DAKİKA)

### 1) Oyuncu yarı-yıkık bir kulübede uyanır
- ekran kirli  
- hafif karanlık  
- nefes alma sesi  
- dışarıdan zombi kükremeleri duyulur  

### 2) İlk Loot
Oyuncu kulübede:

- yarım su şişesi  
- bandaj  
- kırık bir bıçak  
- eski bir çanta  

bulur.

### 3) İlk Tamirat Görevi
Oyuncuya:
- kapıyı tamir et  
- alanı temizle  
- sandık yap  

gibi basit görevler verilir.

### 4) İlk Zombi Teması
Dışarıda tek bir zombi spawn olur → oyuncu nasıl savaşacağını öğrenir.

Bu aşamada oyun öğretir ama elini tutmaz.

---

# 22.3 ERKEN OYUN (0–3 SAAT)

Amaç:  
**Hayatta kalmak → temel üs kurmak → ilk silah/araç bulmak.**

### Oyuncu Şunları Öğrenir:
- loot yapma  
- ses yönetimi  
- envanter kapasitesi  
- stamina ve moral  
- basic crafting  
- su/yiyecek dengesi  

### Açılan İçerikler:
- Basic Workbench  
- Carpentry Bench  
- Wooden Barricade  
- basic yemek tarifleri  
- basic silahlar  

### Riskler:
- runner ile karşılaşma  
- bina içi zombi grupları  
- yağmur & gece etkileri  

### Hedef:
**Küçük fakat güvenli bir üssün kurulması.**

---

# 22.4 ERKEN → ORTA OYUN GEÇİŞİ (3–8 SAAT)

Bu aşama oyun döngüsünü **tamamen açan** bölümdür.

### Oyuncu artık:
- araç bulmaya çalışır  
- metal crafting zincirine giriş yapar  
- daha tehlikeli şehirlere yönelir  
- mutantlarla temas eder  
- tıbbi crafting’e erişir  

### Açılan Sistemler:
- Metal Workbench  
- araç tamir rampası  
- jerrycan + yakıt sistemi  
- basic araç tamiri  
- tıbbi laboratuvar (T1)  
- skill tree’nin yeni dalları  

### Dünyanın yeni yüzü:
- mini-boss spawn’ları  
- göçmen NPC grupları  
- gizli POI'ler  
- askeri depolar  

### Hedef:
**İlk aracın çalıştırılması + üssün metal seviyesine çıkması.**

---

# 22.5 ORTA OYUN (8–20 SAAT)

Oyunun en geniş oynanış kısmıdır.

### Oyuncu Artık:
- rahatça uzun loot run’ları yapar  
- şehrin derinliklerine iner  
- mutant yuvalarını tespit eder  
- advanced crafting zincirlerine geçer  
- ilk defa boss benzeri tehditlerle karşılaşır  

### Açılan Sistemler:
- Metal Workbench T2  
- Medical Lab T2  
- Chemical Lab T1  
- taret prototipleri  
- advanced yemek tarifleri  
- rare silah modları  

### Ekonomik genişleme:
- depolar dolar  
- craft zincirleri çeşitlenir  
- nadir malzemeler aranır  

### Yeni Riskler:
- özel mutantlar (climber, screamer, bloater)  
- küçük horde event’leri  
- kimyasal bölgeler  
- zombi yoğunluğu artışı  

### Amiral Görev:
**Şehir Merkezi Görevi**  
(İlk büyük mutant tehdidi ve rare loot fırsatı)

### Hedef:
**Araç filosunun genişlemesi + üs savunmasının kurulması.**

---

# 22.6 GEÇ ORTA OYUN (20–40 SAAT)

Bu aşamada oyuncu artık *profesyonel bir hayatta kalandır*.

### Ana İçerikler:
- kimya lab T2–T3  
- advanced engineering  
- solar panel & battery bank  
- taret sistemleri  
- serum üretimi  
- gelişmiş savunma hatları  
- ağır zırh & silahlar  

### Yeni Riskler:
- mutant boss  
- horde night event  
- NPC karakolları  
- The Nest event’leri  

### Dünya Açılır:
- laboratuvar kompleksi  
- karantina altındaki bölgeler  
- askeri üs içinde gizli tesis  

### Hedef:
**Late game crafting + büyük tesislere giriş.**

---

# 22.7 ENDGAME GEÇİŞİ (40 SAAT +)

Oyuncu artık:

- tüm crafting zincirlerine hâkim  
- gelişmiş bir üs kurmuş  
- birden fazla araç moduna sahip  
- mutant boss’larla savaşacak güçte  
- legendary loot arayışında  

### Yeni Teknolojiler:
- mutasyon serumu  
- taret T3  
- advanced araç modları  
- kimyasal patlayıcılar  
- ağır zırh plating  

### Dünya:
- en tehlikeli bölgeler açılır  
- boss alanları  
- gizli laboratuvar koridorları  

### Hedef:
**EVO-23 projesinin gerçeğine ulaşmak.**

---

# 22.8 ENDGAME OYNANIŞ (50–100+ SAAT)

Oyuncu bu süreçte tamamen sandbox oynar.

### Ana Oynanış:
- en tehlikeli mutant yuvalarını temizleme  
- serum geliştirme  
- nadir blueprint arayışı  
- araç filosunu mükemmelleştirme  
- üs otomasyonunu tamamlama  
- co-op görevler  
- dev mutantlar ile mücadele  
- high-risk şehir operasyonları  

### Endgame Döngüsü:

```
Büyük Loot Run →
Endgame Mutantlarla Çarpış →
Blueprint / Serum Kazan →
Gelişmiş Craft →
Daha Büyük Hedef →
Yeni Bölgeyi Fethet
```

Oyuncu artık kendi hikâyesini yazar.

---

# 22.9 OYUNUN TEKRAR OYNANABİLİRLİK MEKANİKLERİ

### 1. Procedural loot  
Her oyun farklı loot dağılımı.

### 2. Procedural event sistemi  
Değişen baskınlar, mutant spawn’ları.

### 3. Farklı karakter profilleri  
Başlangıç özellikleri oyunu değiştirir.

### 4. Crafting mastery  
Her yeni oyunda farklı build’ler denenir.

### 5. Co-op rolleri  
Ekip sinerjisi yeni deneyimler yaratır.

### 6. Farklı üs kurulum stratejileri  
Her oyuncu başka düzen kurabilir.

---

# 22.10 PLAYFLOW ZORLUK EĞRİSİ

### Early Game:
- temel zombi tehditleri  
- düşük loot kalitesi  

### Mid Game:
- daha yoğun zombiler  
- mutant türleri  
- craft zinciri derinleşir  

### Late Game:
- boss mutantlar  
- hardcore exploration  
- legendary loot arayışı  

Zorluk, oyuncunun kendi ilerlemesine göre şekillenir.

---

# 22.11 ÖZET

Bu bölümde oyunun:

- tüm aşamalarının ilerleyişi  
- içerik açılma sırası  
- risk/ödül eğrisi  
- oyuncu yolculuğu  
- early–mid–late game farklılıkları  
- endgame döngüsü  

AAA seviyesinde detaylandırılmıştır.


---

# 📚 BÖLÜM XXIII — GDD ANA ÖZETİ + TEKNİK EKLER + BALANCING  
### *Project Survival Universe – Ultra Detay Teknik ve Tasarımsal Özet Bölümü*

---

# 23.0 GDD ANA ÖZET TABLOSU

Bu belge boyunca tasarlanan sistemlerin tümü kısa ama güçlü bir özet hâlinde aşağıdadır:

| Sistem | Durum | Açıklama |
|--------|--------|-----------|
| Core Loop | ✓ | keşif → loot → savaş → üs → craft progression |
| Meta Loop | ✓ | uzun vadeli hedefler, base & crafting gelişimi |
| Dünya Tasarımı | ✓ | 6 biyom, POI’ler, event sistemi |
| Düşman Sistemi | ✓ | zombi + mutant + boss + AI ağaçları |
| Araç Sistemi | ✓ | yakıt, gürültü, fizik, modlar, dayanıklılık |
| Envanter Sistemi | ✓ | grid, ağırlık, cepler, kıyafet bonusları |
| Crafting | ✓ | kalite, istasyon tier, mastery, advanced chains |
| Üs Kurulumu | ✓ | enerji, su, savunma, tamirat, genişleme |
| Ekonomi | ✓ | loot rarity, crafting maliyeti, ticaret |
| Progression | ✓ | level, skill tree, mastery, blueprint |
| Teknik Mimari | ✓ | manager sistemi, ECS hybrid, data-driven |

Bu özet, PSU’nun omurgasını tek tabloda özetler.

---

# 23.1 Tüm Oyunun Sistem Diyagramı (High-Level)

```
             [World]
                │
                ▼
        [Exploration System]
                │
                ▼
     [Loot System] → [Economy]
                │
                ▼
        [Inventory System]
                │
                ▼
        [Crafting System]
                │
                ▼
         [Base Building]
                │
                ▼
         [Character Progression]
                │
                ▼
         [Vehicles & Travel]
                │
                ▼
         [Mid/Late Game Areas]
                │
                ▼
           [Boss / Events]
```

Bu akış, oyunun tüm yapısını 1 diyagramda açıklar.

---

# 23.2 OYUNCU DENEYİMİ ZAMAN ÇİZELGESİ

```
0–10 dk: Tutorial, ilk loot
10–60 dk: İlk üs, temel crafting
1–3 saat: Şehir dışı loot, runner encounter
3–8 saat: Metal crafting, araç sistemi
8–20 saat: Mutantlar, advanced crafting
20–40 saat: Base Tier 3, solar & battery systems
40+ saat: Endgame regions, bosses, legendary loot
```

---

# 23.3 SAVAŞ BALANCING TABLOLARI (Enemy Damage Tuning)

### Zombi Hasar Tablosu:

| Zombi Türü | Damage | Attack Speed | Notes |
|------------|---------|----------------|--------|
| Normal | düşük | orta | sürü olursa tehlike |
| Runner | orta | yüksek | solo oyuncu için ölümcül |
| Brute | yüksek | düşük | kapı kırar |
| Sağır | orta | orta | geniş görüş |
| Kör | yüksek | düşük | sese çok duyarlı |
| Mutant (avg) | yüksek | yüksek | özel davranışlar |
| Mini-Boss | çok yüksek | orta | 1v1 yapılmaz |
| Boss | aşırı | fazlı saldırı | co-op için ideal |

---

# 23.4 LOOT RARITY BALANCING

| Rarity | Spawn Rate | Kullanım |
|--------|-------------|-----------|
| Common | %60–70 | temel crafting |
| Uncommon | %25 | midgame |
| Rare | %8 | advanced crafting |
| Epic | %2 | late game |
| Legendary | %0.2 | boss & special events |

Loot rarity oyunun risk/ödül eğrisini dengeler.

---

# 23.5 CRAFTING BALANCING

Craft maliyetlerinin genel ölçeği:

```
T1 Eşya → 1–3 temel malzeme  
T2 Eşya → 3–7 malzeme  
T3 Eşya → 5–12 malzeme + ileri istasyon  
Epic → 1 rare bileşen  
Legendary → Boss bileşeni / research result
```

Craft süresi:

```
T1 = 5–20 saniye
T2 = 20–60 saniye
T3 = 60–180 saniye
Special = 2–5 dakika
```

---

# 23.6 ÜS GELİŞİM FORMÜLLERİ (Base Expansion Logic)

### Dayanıklılık:
```
DurabilityLoss = (ZombieDamage × AreaRisk) - (MaterialResistance)
```

### Enerji:
```
PowerBalance = Production - Consumption
```

### Savunma:
```
DefenseScore = (WallTier × Count) + (Traps × Efficiency) + (Turrets × DPS)
```

Savunma skoru belirli eşiklerin altına düşerse gece baskınları daha agresif olur.

---

# 23.7 ARAÇ SİSTEMİ BALANCING

### Yakıt:
```
Fuel Burn = BaseFuel * (1 + CargoWeightRatio * 0.5)
```

### Ağırlık:
```
MaxSpeed = BaseSpeed - (Weight × 0.4)
```

### Gürültü:
```
Noise = EngineState × SpeedFactor × DamageFactor
```

### Araç ekonomisi:
- Binek: hızlı fakat küçük kapasite  
- Pickup: denge  
- Kamyon: yavaş ama late game için vazgeçilmez  

---

# 23.8 ZAMAN & MEVSİM BALANCING

| Mevsim | Etki |
|--------|-------|
| İlkbahar | bitkiler bol, yağmur çok |
| Yaz | yiyecek iyi, sıcaklık tehlikesi |
| Sonbahar | yakıt & metal arayışı artar |
| Kış | zorluk zirve, stamina drain ↑ |

---

# 23.9 ÜRETİM ZİNCİRİ DİYAGRAMI

```
Wood → Planks → Structures
Scrap → Metal → Plates → Armor/Weapons
Chemicals → Reagents → Serum
Electronics → Circuit → ECU/Mods
Food → Cooked Meals → Morale Buffs
```

---

# 23.10 MASTER PROGRESSION FLOWCHART

```
Level Up →
Skill Points →
Crafting Unlock →
Blueprint Research →
Base Expansion →
Vehicle Unlock →
Region Unlock →
Endgame Mutations →
Final Gear
```

Bu metaprogression akışkanı oyunun 100+ saat oynanmasını sağlar.

---

# 23.11 TEKNİK DİAGRAM — MANAGER & SYSTEM FLOW

```
[GameManager]
 ├── PlayerManager
 │     ├── CombatSystem
 │     ├── StaminaSystem
 │     ├── InventorySystem
 │
 ├── EnemyManager
 │     ├── AISystem (Behavior Trees)
 │     ├── SpawnSystem
 │
 ├── WorldManager
 │     ├── WeatherSystem
 │     ├── TimeOfDay
 │     ├── BiomeController
 │
 ├── CraftingManager
 ├── VehicleManager
 ├── BaseManager
 ├── SaveLoadManager
 └── NetworkManager
```

---

# 23.12 EK FORMÜLLER

### Stamina:
```
StaminaDrain = Movement × WeightFactor × TerrainModifier
```

### Moral:
```
MoralChange = (FoodQuality + Environment + Events + SocialBonuses)
```

### Infection:
```
InfectionRate = VirusStrength × InjurySeverity - ImmunityLevel
```

---

# 23.13 TEST SCENARIO LİSTESİ (QA TEMELLİ)

### Early Test:
- loot dengesi  
- ilk zombi öldürme kolaylığı  
- ilk craft zinciri hızı  

### Midgame Test:
- araç erişimi  
- mutant zorluğu  
- base savunma doğruluğu  

### Late Game Test:
- boss dengesi  
- enerji–crafting ekonomisi  
- legendary loot drop oranı  

---

# 23.14 PROJECT SCOPE ÖZETİ

Bu GDD toplam:

- 20+ büyük sistem  
- 200+ alt sistem  
- 70+ formül  
- 30+ progression mekanizması  
- 40+ crafting zinciri  
- 15+ zombi/mutant türü  
- 6+ büyük biyom  
- 3 aşamalı uzun vadeli playflow  
- 100+ saatlik tasarlanmış oyun ömrü  

sunmaktadır.

---

# 23.15 SON ÖZET — PSU’NUN DNA’SINI TANIMLAYAN 12 CÜMLE

1. Oyun gerçekçi loot odaklı survival’dır.  
2. Crafting temel değil, oyunun kalbidir.  
3. Üs oyuncunun evi, üretimi, koruma alanıdır.  
4. Araçlar hareket özgürlüğünün kilididir.  
5. Envanter sistemi stratejik planlama gerektirir.  
6. Düşmanlar akıllı değil, tutarlı ve ölümcüldür.  
7. Dünya keşif odaklıdır ve her yer tehlikelidir.  
8. Progression tamamen oyuncu tercihine dayanır.  
9. Ekonomi kıtlık ve risk üzerine kuruludur.  
10. Co-op oyunun altın deneyimidir.  
11. Oynanış döngüsü organik olarak genişler.  
12. PSU, uzun vadeli ve kişisel bir hayatta kalma hikâyesidir.

---

# 23.16 BÖLÜM TAMAMLANMIŞTIR

Bu GDD artık AAA seviyesinde tam bir tasarım setidir.  
Tüm sistemler, formüller, davranışlar ve teknik temel açıklanmıştır.


---
