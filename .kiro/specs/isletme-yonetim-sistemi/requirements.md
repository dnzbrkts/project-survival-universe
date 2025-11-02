# Gereksinimler Belgesi

## Giriş

İşletme Yönetim Sistemi, küçük ve orta ölçekli işletmelerin günlük operasyonlarını yönetmek için tasarlanmış kapsamlı bir yazılım çözümüdür. Sistem stok yönetimi, servis takibi, faturalandırma, cari hesap yönetimi, muhasebe işlemleri, kullanıcı yetkilendirmesi ve çoklu para birimi desteği sağlar.

## Sözlük

- **İşletme_Yönetim_Sistemi**: Tüm iş süreçlerini yöneten ana yazılım sistemi
- **Stok_Modülü**: Ürün envanteri ve stok hareketlerini yöneten alt sistem
- **Servis_Modülü**: Müşteri hizmetleri ve servis taleplerini yöneten alt sistem
- **Fatura_Modülü**: Satış ve alış faturalarını oluşturan ve yöneten alt sistem
- **Cari_Modülü**: Müşteri ve tedarikçi hesaplarını yöneten alt sistem
- **Muhasebe_Modülü**: Mali kayıtları ve raporları yöneten alt sistem
- **Yetkilendirme_Modülü**: Kullanıcı erişim kontrolü ve izinlerini yöneten alt sistem
- **Para_Birimi_Modülü**: TL, USD ve EUR kurları ile fiyatlandırmayı yöneten alt sistem
- **Yetkili_Kullanıcı**: Sisteme erişim izni olan ve belirli rollere sahip kişi
- **Stok_Kalemi**: Sistemde takip edilen fiziksel veya dijital ürün
- **Cari_Hesap**: Müşteri veya tedarikçi mali hesap kaydı

## Gereksinimler

### Gereksinim 1

**Kullanıcı Hikayesi:** Sistem yöneticisi olarak, farklı kullanıcılara farklı yetki seviyeleri atayabilmek istiyorum, böylece sistem güvenliğini sağlayabilirim.

#### Kabul Kriterleri

1. İşletme_Yönetim_Sistemi, Yetkili_Kullanıcı girişi yapabilecek
2. WHEN kullanıcı giriş yapmaya çalıştığında, Yetkilendirme_Modülü kullanıcı kimlik bilgilerini doğrulayacak
3. WHILE kullanıcı sistemde aktifken, Yetkilendirme_Modülü kullanıcının yetki seviyesini kontrol edecek
4. IF yetkisiz erişim denemesi yapılırsa, Yetkilendirme_Modülü erişimi engelleyecek ve uyarı kaydı oluşturacak

### Gereksinim 2

**Kullanıcı Hikayesi:** Depo sorumlusu olarak, stok seviyelerini takip edebilmek ve stok hareketlerini kaydedebilmek istiyorum, böylece envanter kontrolünü sağlayabilirim.

#### Kabul Kriterleri

1. Stok_Modülü, Stok_Kalemi bilgilerini saklayacak
2. WHEN stok hareketi gerçekleştiğinde, Stok_Modülü stok miktarını güncelleyecek
3. WHILE stok seviyesi kritik seviyenin altındayken, Stok_Modülü uyarı mesajı gösterecek
4. İşletme_Yönetim_Sistemi, stok raporları oluşturacak

### Gereksinim 3

**Kullanıcı Hikayesi:** Servis teknisyeni olarak, müşteri servis taleplerini takip edebilmek ve servis süreçlerini yönetebilmek istiyorum, böylece müşteri memnuniyetini artırabilirim.

#### Kabul Kriterleri

1. Servis_Modülü, servis taleplerini kaydedecek
2. WHEN yeni servis talebi oluşturulduğunda, Servis_Modülü talebe benzersiz numara atayacak
3. WHILE servis devam ederken, Servis_Modülü servis durumunu güncelleyecek
4. İşletme_Yönetim_Sistemi, servis geçmişi raporları oluşturacak

### Gereksinim 4

**Kullanıcı Hikayesi:** Muhasebe elemanı olarak, satış ve alış faturalarını oluşturabilmek ve yönetebilmek istiyorum, böylece mali işlemleri takip edebilirim.

#### Kabul Kriterleri

1. Fatura_Modülü, satış ve alış faturalarını oluşturacak
2. WHEN fatura oluşturulduğunda, Fatura_Modülü otomatik fatura numarası atayacak
3. Fatura_Modülü, KDV hesaplamalarını otomatik yapacak
4. İşletme_Yönetim_Sistemi, fatura yazdırma özelliği sağlayacak

### Gereksinim 5

**Kullanıcı Hikayesi:** Mali işler sorumlusu olarak, müşteri ve tedarikçi hesaplarını takip edebilmek istiyorum, böylece alacak ve borç durumunu kontrol edebilirim.

#### Kabul Kriterleri

1. Cari_Modülü, Cari_Hesap bilgilerini saklayacak
2. WHEN mali işlem gerçekleştiğinde, Cari_Modülü hesap bakiyesini güncelleyecek
3. Cari_Modülü, vadesi geçen alacakları gösterecek
4. İşletme_Yönetim_Sistemi, cari hesap ekstresi oluşturacak

### Gereksinim 6

**Kullanıcı Hikayesi:** Muhasebeci olarak, tüm mali işlemleri kayıt altına alabilmek ve mali raporlar oluşturabilmek istiyorum, böylece şirketin mali durumunu analiz edebilirim.

#### Kabul Kriterleri

1. Muhasebe_Modülü, tüm mali işlemleri kayıt altına alacak
2. WHEN mali işlem gerçekleştiğinde, Muhasebe_Modülü otomatik yevmiye kaydı oluşturacak
3. Muhasebe_Modülü, bilanço ve gelir tablosu oluşturacak
4. İşletme_Yönetim_Sistemi, dönemsel mali raporlar üretecek

### Gereksinim 7

**Kullanıcı Hikayesi:** Satış temsilcisi olarak, ürünleri farklı para birimlerinde fiyatlandırabilmek istiyorum, böylece uluslararası müşterilere hizmet verebilirim.

#### Kabul Kriterleri

1. Para_Birimi_Modülü, TL, USD ve EUR kurlarını saklayacak
2. WHEN döviz kuru güncellendiğinde, Para_Birimi_Modülü tüm fiyatları yeniden hesaplayacak
3. İşletme_Yönetim_Sistemi, ürün fiyatlarını seçilen para biriminde gösterecek
4. WHERE çoklu para birimi seçeneği aktifse, İşletme_Yönetim_Sistemi fatura tutarını istenen para biriminde hesaplayacak

### Gereksinim 8

**Kullanıcı Hikayesi:** Satış müdürü olarak, satış performansını analiz edebilmek ve detaylı raporlar alabilmek istiyorum, böylece iş stratejilerini geliştirebilirim.

#### Kabul Kriterleri

1. Raporlama_Modülü, satış performans raporları oluşturacak
2. WHEN rapor talep edildiğinde, Raporlama_Modülü belirlenen tarih aralığında verileri analiz edecek
3. İşletme_Yönetim_Sistemi, grafik ve tablo formatında raporlar sunacak
4. Raporlama_Modülü, PDF ve Excel formatında rapor dışa aktarımı sağlayacak

### Gereksinim 9

**Kullanıcı Hikayesi:** Depo sorumlusu olarak, barkod sistemi ile hızlı stok işlemleri yapabilmek istiyorum, böylece operasyonel verimliliği artırabilirim.

#### Kabul Kriterleri

1. Barkod_Modülü, ürünler için benzersiz barkod oluşturacak
2. WHEN barkod okutulduğunda, Barkod_Modülü ürün bilgilerini otomatik getirecek
3. Stok_Modülü, barkod ile hızlı giriş/çıkış işlemlerini destekleyecek
4. İşletme_Yönetim_Sistemi, barkod etiketleri yazdırma özelliği sağlayacak

### Gereksinim 10

**Kullanıcı Hikayesi:** Muhasebe müdürü olarak, e-fatura ve e-arşiv entegrasyonu ile yasal uyumluluğu sağlamak istiyorum, böylece vergi mevzuatına uygun işlem yapabilirim.

#### Kabul Kriterleri

1. E_Fatura_Modülü, GİB e-fatura sistemine entegre olacak
2. WHEN fatura onaylandığında, E_Fatura_Modülü otomatik e-fatura gönderimi yapacak
3. E_Arşiv_Modülü, bireysel müşteriler için e-arşiv fatura oluşturacak
4. İşletme_Yönetim_Sistemi, e-fatura durumlarını takip edecek

### Gereksinim 11

**Kullanıcı Hikayesi:** İnsan kaynakları sorumlusu olarak, personel bilgilerini ve bordro işlemlerini yönetebilmek istiyorum, böylece insan kaynakları süreçlerini dijitalleştirebilirim.

#### Kabul Kriterleri

1. Personel_Modülü, çalışan bilgilerini saklayacak
2. Bordro_Modülü, maaş hesaplamalarını otomatik yapacak
3. WHEN bordro dönemi geldiğinde, Bordro_Modülü otomatik hesaplama başlatacak
4. İşletme_Yönetim_Sistemi, SGK ve vergi beyannamesi raporları oluşturacak

### Gereksinim 12

**Kullanıcı Hikayesi:** Satış temsilcisi olarak, mobil cihazlardan sisteme erişebilmek istiyorum, böylece sahada çalışırken işlemlerimi yapabilirim.

#### Kabul Kriterleri

1. Mobil_Arayüz, responsive tasarım ile tüm cihazlarda çalışacak
2. Mobil_Uygulama, offline çalışma özelliği sağlayacak
3. WHEN internet bağlantısı kesildiğinde, Mobil_Uygulama verileri yerel olarak saklayacak
4. WHEN bağlantı yeniden kurulduğunda, Mobil_Uygulama verileri otomatik senkronize edecek

### Gereksinim 13

**Kullanıcı Hikayesi:** Sistem yöneticisi olarak, sistem performansını izleyebilmek ve güvenlik loglarını takip edebilmek istiyorum, böylece sistem güvenliğini ve performansını optimize edebilirim.

#### Kabul Kriterleri

1. Monitoring_Modülü, sistem performans metriklerini toplayacak
2. Log_Modülü, tüm kullanıcı işlemlerini kayıt altına alacak
3. WHEN şüpheli aktivite tespit edildiğinde, Güvenlik_Modülü otomatik uyarı gönderecek
4. İşletme_Yönetim_Sistemi, sistem sağlık durumu dashboard'u sağlayacak

### Gereksinim 14

**Kullanıcı Hikayesi:** Müşteri temsilcisi olarak, CRM fonksiyonları ile müşteri ilişkilerini yönetebilmek istiyorum, böylece müşteri memnuniyetini artırabilirim.

#### Kabul Kriterleri

1. CRM_Modülü, müşteri iletişim geçmişini saklayacak
2. WHEN müşteri ile iletişim kurulduğunda, CRM_Modülü otomatik kayıt oluşturacak
3. CRM_Modülü, müşteri segmentasyonu ve analiz raporları sağlayacak
4. İşletme_Yönetim_Sistemi, müşteri memnuniyet anketleri gönderebilecek

### Gereksinim 15

**Kullanıcı Hikayesi:** B2B satış müdürü olarak, kurumsal müşterilere özel fiyatlandırma ve indirim sistemi uygulayabilmek istiyorum, böylece kurumsal satışları artırabilirim.

#### Kabul Kriterleri

1. B2B_Modülü, kurumsal müşteri kategorilerini yönetecek
2. WHEN kurumsal müşteri fiyat talebi yaptığında, B2B_Modülü özel fiyatlandırma uygulayacak
3. İndirim_Modülü, sabit tutar ve yüzdelik indirim kuponları oluşturacak
4. WHERE kurumsal anlaşma aktifse, İşletme_Yönetim_Sistemi otomatik indirim uygulayacak

### Gereksinim 16

**Kullanıcı Hikayesi:** Pazarlama sorumlusu olarak, müşterilere otomatik SMS ve email gönderebilmek istiyorum, böylece müşteri iletişimini otomatikleştirebilirim.

#### Kabul Kriterleri

1. İletişim_Modülü, SMS ve email şablonlarını yönetecek
2. WHEN belirli olaylar gerçekleştiğinde, İletişim_Modülü otomatik mesaj gönderecek
3. İletişim_Modülü, toplu mesaj gönderim özelliği sağlayacak
4. İşletme_Yönetim_Sistemi, mesaj gönderim durumlarını takip edecek

### Gereksinim 17

**Kullanıcı Hikayesi:** Müşteri olarak, kendi servis kayıtlarımı ve durumlarını online olarak görebilmek istiyorum, böylece servis süreçlerini takip edebilirim.

#### Kabul Kriterleri

1. Müşteri_Portalı, müşteri girişi için güvenli erişim sağlayacak
2. WHEN müşteri portala giriş yaptığında, Müşteri_Portalı kendi servis kayıtlarını gösterecek
3. Müşteri_Portalı, servis durumu güncellemelerini real-time gösterecek
4. İşletme_Yönetim_Sistemi, müşterinin servis geçmişini detaylı raporlayacak

### Gereksinim 18

**Kullanıcı Hikayesi:** Satış temsilcisi olarak, müşterilere hızlı fiyat teklifi hazırlayabilmek ve onaylandığında faturaya dönüştürebilmek istiyorum, böylece satış sürecini hızlandırabilirim.

#### Kabul Kriterleri

1. Teklif_Modülü, ürün bazlı fiyat teklifleri oluşturacak
2. WHEN teklif hazırlandığında, Teklif_Modülü otomatik teklif numarası atayacak
3. WHEN teklif onaylandığında, Teklif_Modülü otomatik faturaya dönüştürecek
4. İşletme_Yönetim_Sistemi, teklif geçerliliği ve takip sistemi sağlayacak

### Gereksinim 19

**Kullanıcı Hikayesi:** Satış elemanı olarak, perakende ve toptan satış yapabilmek, irsaliye düzenleyebilmek istiyorum, böylece farklı satış kanallarını yönetebilirim.

#### Kabul Kriterleri

1. Satış_Modülü, perakende ve toptan satış işlemlerini destekleyecek
2. İrsaliye_Modülü, sevkiyat belgelerini oluşturacak ve yönetecek
3. WHEN satış gerçekleştiğinde, Satış_Modülü otomatik stok düşümü yapacak
4. İşletme_Yönetim_Sistemi, satış kanalı bazlı raporlama sağlayacak

### Gereksinim 20

**Kullanıcı Hikayesi:** Kasiyer olarak, POS sistemi ile hızlı perakende satış yapabilmek istiyorum, böylece müşteri memnuniyetini artırabilirim.

#### Kabul Kriterleri

1. POS_Modülü, barkod okuma ile hızlı ürün ekleme sağlayacak
2. WHEN ürün satıldığında, POS_Modülü anlık ödeme işlemi yapacak
3. POS_Modülü, nakit, kredi kartı ve diğer ödeme yöntemlerini destekleyecek
4. İşletme_Yönetim_Sistemi, günlük kasa raporu oluşturacak

### Gereksinim 21

**Kullanıcı Hikayesi:** E-ticaret müdürü olarak, çoklu e-ticaret platformlarına entegre olabilmek istiyorum, böylece online satış kanallarını genişletirebilirim.

#### Kabul Kriterleri

1. E_Ticaret_Modülü, Trendyol, Hepsiburada, N11 gibi platformlara entegre olacak
2. WHEN online sipariş geldiğinde, E_Ticaret_Modülü otomatik sipariş oluşturacak
3. E_Ticaret_Modülü, stok senkronizasyonu ve fiyat güncellemesi yapacak
4. İşletme_Yönetim_Sistemi, platform bazlı satış raporları oluşturacak

### Gereksinim 22

**Kullanıcı Hikayesi:** Lojistik sorumlusu olarak, kargo şirketleriyle entegre çalışabilmek istiyorum, böylece sevkiyat süreçlerini otomatikleştirebilirim.

#### Kabul Kriterleri

1. Kargo_Modülü, MNG, Yurtiçi, Aras, PTT gibi kargo şirketlerine entegre olacak
2. WHEN sevkiyat hazırlandığında, Kargo_Modülü otomatik kargo etiketi oluşturacak
3. Kargo_Modülü, takip numarası ile gerçek zamanlı kargo takibi sağlayacak
4. İşletme_Yönetim_Sistemi, kargo maliyeti ve teslimat süresi analizi yapacak

### Gereksinim 23

**Kullanıcı Hikayesi:** Pazarlama müdürü olarak, omnichannel satış deneyimi sunabilmek istiyorum, böylece müşteri deneyimini iyileştirebilirim.

#### Kabul Kriterleri

1. Omnichannel_Modülü, tüm satış kanallarını tek merkezden yönetecek
2. WHEN müşteri farklı kanallardan alışveriş yaptığında, Omnichannel_Modülü birleşik profil oluşturacak
3. Omnichannel_Modülü, kanal bazlı stok ve fiyat yönetimi sağlayacak
4. İşletme_Yönetim_Sistemi, cross-channel analitik raporlar üretecek