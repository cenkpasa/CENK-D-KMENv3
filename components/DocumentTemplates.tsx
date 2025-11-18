
import { DocumentTemplate } from "../types";

export const documentTemplates: DocumentTemplate[] = [
    {
        id: "yillik_izin",
        title: "Yıllık İzin Formu",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center; text-decoration: underline;">YILLIK ÜCRETLİ İZİN FORMU</h3>
                <br/>
                <p><strong>İNSAN KAYNAKLARI BİRİMİNE,</strong></p>
                <p>Şirketinizde <strong>{{GOREVI}}</strong> olarak görev yapmaktayım. 4857 sayılı İş Kanunu kapsamında hak etmiş olduğum yıllık ücretli izin hakkımı aşağıda belirttiğim tarihler arasında kullanmak istiyorum.</p>
                <br/>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; background-color: #f0f0f0; font-weight: bold;">Adı Soyadı</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{AD_SOYAD}}</td>
                        <td style="border: 1px solid #000; padding: 8px; background-color: #f0f0f0; font-weight: bold;">TC Kimlik No</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{TC_NO}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; background-color: #f0f0f0; font-weight: bold;">İzin Başlangıç Tarihi</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{BASLANGIC_TARIHI}}</td>
                        <td style="border: 1px solid #000; padding: 8px; background-color: #f0f0f0; font-weight: bold;">İşe Başlama Tarihi</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{ISE_BASLAMA_TARIHI}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; background-color: #f0f0f0; font-weight: bold;">Kullanılacak Gün</td>
                        <td style="border: 1px solid #000; padding: 8px;" colspan="3">{{GUN_SAYISI}} Gün</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; background-color: #f0f0f0; font-weight: bold;">İzindeki Adres / Tel</td>
                        <td style="border: 1px solid #000; padding: 8px;" colspan="3">{{IZIN_ADRESI}}</td>
                    </tr>
                </table>
                <br/>
                <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                    <div style="text-align: center;">
                        <p><strong>Talep Eden Personel</strong></p>
                        <p>{{AD_SOYAD}}</p>
                        <p>(İmza)</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>ŞİRKET YETKİLİSİ</strong></p>
                        <p>CENK DİKMEN<br/>Genel Müdür</p>
                        <p>(İmza)</p>
                    </div>
                </div>
            </div>
        `,
        dynamicFields: [
            { key: "BASLANGIC_TARIHI", label: "İzin Başlangıç Tarihi", type: "date" },
            { key: "ISE_BASLAMA_TARIHI", label: "İşe Başlama Tarihi (Dönüş)", type: "date" },
            { key: "GUN_SAYISI", label: "Gün Sayısı", type: "number" },
            { key: "IZIN_ADRESI", label: "İzindeki Adres/Tel", type: "text" }
        ]
    },
    {
        id: "arac_zimmet",
        title: "Araç Zimmet Tutanağı",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center; text-decoration: underline;">ARAÇ ZİMMET VE TESLİM TUTANAĞI</h3>
                <br/>
                <p>Şirketimize ait aşağıda özellikleri belirtilen araç, iş süreçlerinde kullanılmak üzere <strong>{{AD_SOYAD}}</strong> isimli personele, hasarsız ve çalışır vaziyette teslim edilmiştir.</p>
                <br/>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0; width: 30%; font-weight: bold;">Araç Plakası</td>
                        <td style="border: 1px solid #000; padding: 10px;"><strong>{{ARAC_PLAKA}}</strong></td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0; font-weight: bold;">Marka / Model</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{ARAC_MARKA}} / {{ARAC_MODEL}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0; font-weight: bold;">Teslim Kilometresi</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{TESLIM_KM}} km</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0; font-weight: bold;">Yakıt Durumu</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{YAKIT_DURUMU}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0; font-weight: bold;">Mevcut Hasar/Notlar</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{HASAR_DURUMU}}</td>
                    </tr>
                     <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0; font-weight: bold;">Teslim Edilenler</td>
                        <td style="border: 1px solid #000; padding: 10px;">[x] Ruhsat  [x] Kontak Anahtarı  {{AKSESUAR}}</td>
                    </tr>
                </table>
                <br/>
                <h4 style="text-decoration: underline;">Zimmet Şartları ve Taahhütname:</h4>
                <ol>
                    <li>Aracı teslim aldığım tarihten itibaren, araçta meydana gelecek her türlü hasar, arıza ve eksiklikten (olağan yıpranma hariç) sorumlu olduğumu,</li>
                    <li>Aracı trafik kurallarına uygun kullanacağımı, kullanımım sırasındaki kural ihlallerinden doğacak trafik cezalarını (OGS/HGS kaçak geçişleri dahil) şahsen ödeyeceğimi,</li>
                    <li>Aracı sadece şirket işleri için kullanacağımı, üçüncü şahıslara kullandırmayacağımı,</li>
                    <li>İş sözleşmemin sona ermesi veya işverenin talebi halinde aracı derhal, eksiksiz ve temiz olarak iade edeceğimi,</li>
                    <li>Araçta oluşan hasarları derhal şirkete bildireceğimi</li>
                </ol>
                <p>kabul, beyan ve taahhüt ederim.</p>
                <br/><br/>
                <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                    <div style="text-align: center;">
                        <p><strong>TESLİM EDEN (Firma Yetkilisi)</strong></p>
                        <p>CENK DİKMEN<br/>Genel Müdür</p>
                        <p>İmza</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>TESLİM TARİHİ</strong></p>
                        <p>{{TARIH}}</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>TESLİM ALAN (Personel)</strong></p>
                        <p>{{AD_SOYAD}}</p>
                        <p>İmza</p>
                    </div>
                </div>
            </div>
        `,
        dynamicFields: [
            { key: "ARAC_PLAKA", label: "Araç Plakası", type: "text" },
            { key: "ARAC_MARKA", label: "Marka", type: "text" },
            { key: "ARAC_MODEL", label: "Model Yılı/Tipi", type: "text" },
            { key: "TESLIM_KM", label: "Teslim Anındaki KM", type: "number" },
            { key: "YAKIT_DURUMU", label: "Yakıt Seviyesi (Çeyrek, Yarım, Depo vb.)", type: "text" },
            { key: "HASAR_DURUMU", label: "Mevcut Çizik/Hasar Notları", type: "text" },
            { key: "AKSESUAR", label: "Ek Teslim Edilenler (Stepne, Kit vb.)", type: "text" }
        ]
    },
    {
        id: "telefon_zimmet",
        title: "Telefon ve Hat Zimmet Tutanağı",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center; text-decoration: underline;">CEP TELEFONU VE HAT ZİMMET TUTANAĞI</h3>
                <br/>
                <p>Şirket hizmetlerinin yürütülmesi amacıyla aşağıda detayları verilen cep telefonu cihazı ve/veya GSM hattı <strong>{{AD_SOYAD}}</strong> isimli personele teslim edilmiştir.</p>
                <br/>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                    <tr style="background-color: #ccc;">
                        <th colspan="2" style="border: 1px solid #000; padding: 8px;">CİHAZ BİLGİLERİ</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; font-weight: bold; width: 40%;">Marka / Model</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{TEL_MARKA}} / {{TEL_MODEL}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">IMEI Numarası</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{TEL_IMEI}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">Cihaz Durumu</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{CIHAZ_DURUMU}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">Aksesuarlar</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{AKSESUAR}}</td>
                    </tr>
                     <tr style="background-color: #ccc;">
                        <th colspan="2" style="border: 1px solid #000; padding: 8px;">HAT BİLGİLERİ</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">GSM Numarası</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{HAT_NUMARASI}}</td>
                    </tr>
                </table>
                <br/>
                <p><strong>Taahhütlerim:</strong></p>
                <ul>
                    <li>Cihazı ve hattı sadece iş amaçlı kullanacağımı, şirket bilgi güvenliği politikalarına uyacağımı,</li>
                    <li>Cihazın çalınması, kaybolması veya kullanıcı hatası sonucu hasar görmesi durumunda maddi sorumluluğu üstleneceğimi,</li>
                    <li>Hattın kullanımıyla ilgili belirlenen kota/paket limitlerine uyacağımı, limit aşımlarının ücretimden kesilebileceğini,</li>
                    <li>İşten ayrılmam veya görev değişikliği durumunda cihazı ve hattı derhal iade edeceğimi kabul ediyorum.</li>
                </ul>
                <br/><br/>
                <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                    <div style="text-align: center;">
                        <p><strong>Teslim Eden</strong></p>
                        <p>CENK DİKMEN<br/>Genel Müdür</p>
                        <p>İmza</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>Tarih</strong></p>
                        <p>{{TARIH}}</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>Teslim Alan</strong></p>
                        <p>{{AD_SOYAD}}</p>
                        <p>İmza</p>
                    </div>
                </div>
            </div>
        `,
        dynamicFields: [
            { key: "TEL_MARKA", label: "Telefon Markası", type: "text" },
            { key: "TEL_MODEL", label: "Telefon Modeli", type: "text" },
            { key: "TEL_IMEI", label: "IMEI Numarası", type: "text" },
            { key: "HAT_NUMARASI", label: "Hat Numarası (05xx...)", type: "text" },
            { key: "CIHAZ_DURUMU", label: "Cihaz Durumu (Sıfır, 2.El, Çizik vb.)", type: "text" },
            { key: "AKSESUAR", label: "Aksesuarlar (Şarj, Kulaklık vb.)", type: "text" }
        ]
    },
    {
        id: "bilgisayar_zimmet",
        title: "Bilgisayar Zimmet Tutanağı",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center; text-decoration: underline;">BİLGİSAYAR ZİMMET TUTANAĞI</h3>
                <br/>
                <p>Aşağıda özellikleri belirtilen bilgisayar ve yan donanımları, işyeri kullanımı amacıyla <strong>{{AD_SOYAD}}</strong> isimli personele teslim edilmiştir.</p>
                <br/>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0; width: 30%; font-weight: bold;">Marka</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{PC_MARKA}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0; font-weight: bold;">Model</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{PC_MODEL}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0; font-weight: bold;">Seri Numarası</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{PC_SERI_NO}}</td>
                    </tr>
                     <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0; font-weight: bold;">Teknik Özellikler</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{DONANIM}}</td>
                    </tr>
                     <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0; font-weight: bold;">Aksesuarlar</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{PC_AKSESUARLAR}}</td>
                    </tr>
                </table>
                <br/>
                <h4>Kullanım Şartları ve Güvenlik:</h4>
                <ul>
                    <li>Zimmetlenen bilgisayara şirketin onayı dışında lisanssız yazılım yüklemeyeceğimi {{LISANS_YAZILIM}},</li>
                    <li>Şirket verilerini güvenli bir şekilde koruyacağımı ve şirket dışına izinsiz çıkarmayacağımı,</li>
                    <li>Cihazı özenle kullanacağımı, kullanıcı hatasından kaynaklanan arızaları karşılayacağımı,</li>
                    <li>İş akdimin sona ermesi durumunda cihazı ve aksesuarlarını eksiksiz iade edeceğimi taahhüt ederim.</li>
                </ul>
                <br/><br/>
                <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                    <div style="text-align: center;">
                        <p><strong>Teslim Eden</strong></p>
                        <p>CENK DİKMEN<br/>Genel Müdür</p>
                        <p>İmza</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>Tarih</strong></p>
                        <p>{{TARIH}}</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>Teslim Alan</strong></p>
                        <p>{{AD_SOYAD}}</p>
                        <p>İmza</p>
                    </div>
                </div>
            </div>
        `,
        dynamicFields: [
            { key: "PC_MARKA", label: "Bilgisayar Markası", type: "text" },
            { key: "PC_MODEL", label: "Bilgisayar Modeli", type: "text" },
            { key: "PC_SERI_NO", label: "Seri Numarası", type: "text" },
            { key: "DONANIM", label: "İşlemci/RAM/Disk Bilgisi", type: "text" },
            { key: "PC_AKSESUARLAR", label: "Aksesuarlar (Mouse, Çanta, Şarj Aleti vb.)", type: "text" },
            { key: "LISANS_YAZILIM", label: "Lisans Notu (Opsiyonel)", type: "text", placeholder: "Kabul ediyorum." }
        ]
    },
    {
        id: "mazeret_izni",
        title: "Mazeret İzni Formu",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center; text-decoration: underline;">MAZERET İZNİ TALEP FORMU</h3>
                <br/>
                <p>Aşağıda belirtmiş olduğum mazeretimden dolayı izin kullanmak istiyorum.</p>
                <p>Gereğini bilgilerinize arz ederim.</p>
                <br/>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; width: 30%; font-weight: bold;">Personel Adı Soyadı</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{AD_SOYAD}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">Mazeret Nedeni</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{MAZERET_NEDENI}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">İzin Başlangıç</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{BASLANGIC_TARIHI}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">İşe Başlama</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{ISE_BASLAMA_TARIHI}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">Toplam Gün/Saat</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{SURE}}</td>
                    </tr>
                </table>
                <br/>
                <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                    <div style="text-align: center;">
                        <p><strong>Personel</strong></p>
                        <p>(İmza)</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>Yönetici Onayı</strong></p>
                        <p>CENK DİKMEN<br/>Genel Müdür</p>
                        <p>(İmza)</p>
                    </div>
                </div>
            </div>
        `,
        dynamicFields: [
            { key: "MAZERET_NEDENI", label: "Mazeret Nedeni (Evlilik, Ölüm vb.)", type: "text" },
            { key: "BASLANGIC_TARIHI", label: "Başlangıç Tarihi/Saati", type: "text" },
            { key: "ISE_BASLAMA_TARIHI", label: "Bitiş Tarihi/Saati", type: "text" },
            { key: "SURE", label: "Süre (Gün veya Saat)", type: "text" }
        ]
    },
    {
        id: "ucretsiz_izin",
        title: "Ücretsiz İzin Formu",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center;">ÜCRETSİZ İZİN TALEP FORMU</h3>
                <br/>
                <p>Şirketinizde yürütmekte olduğum görevim sırasında, aşağıda belirttiğim sebeplerden dolayı <strong>Ücretsiz İzin</strong> kullanmak istiyorum.</p>
                <br/>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #eee; width: 30%;">Adı Soyadı</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{AD_SOYAD}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #eee;">Bölümü / Görevi</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{GOREVI}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #eee;">İzin Sebebi</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{IZIN_SEBEBI}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #eee;">İzin Tarihleri</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{BASLANGIC}} - {{BITIS}}</td>
                    </tr>
                     <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #eee;">Toplam Gün</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{GUN_SAYISI}} Gün</td>
                    </tr>
                </table>
                <br/>
                <p>Bu süre zarfında ücret ve sosyal haklarımın işlemeyeceğini bildiğimi ve kabul ettiğimi beyan ederim.</p>
                <br/><br/>
                <div style="float: right; width: 200px; text-align: center;">
                    <p><strong>Tarih:</strong> {{TARIH}}</p>
                    <p><strong>İmza</strong></p>
                </div>
                <div style="clear: both;"></div>
                <br/><br/>
                <div style="border-top: 1px dashed #000; padding-top: 10px;">
                    <p><strong>İŞVEREN ONAYI:</strong></p>
                    <p>CENK DİKMEN - Genel Müdür</p>
                    <p>Uygundur / Uygun Değildir</p>
                    <p>Tarih / İmza / Kaşe</p>
                </div>
            </div>
        `,
        dynamicFields: [
            { key: "IZIN_SEBEBI", label: "İzin Sebebi", type: "textarea" },
            { key: "BASLANGIC", label: "Başlangıç Tarihi", type: "date" },
            { key: "BITIS", label: "Bitiş Tarihi", type: "date" },
            { key: "GUN_SAYISI", label: "Toplam Gün", type: "number" }
        ]
    },
    {
        id: "babalik_izni",
        title: "Babalık İzni Dilekçesi",
        content: `
            {{HEADER}}
             <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center;">BABALIK İZNİ TALEP FORMU</h3>
                <br/>
                <p><strong>İNSAN KAYNAKLARI MÜDÜRLÜĞÜNE,</strong></p>
                <br/>
                <p>Şirketinizde <strong>{{GOREVI}}</strong> görevi ile çalışmaktayım.</p>
                <p>Eşimin doğum yapacak olması sebebi ile 4857 sayılı İş Kanunu Ek Madde 2 uyarınca hak ettiğim <strong>5 günlük</strong> ücretli babalık iznini aşağıda belirttiğim tarihten itibaren kullanmayı talep etmekteyim.</p>
                <br/>
                <p><strong>İzin Başlangıç Tarihi:</strong> {{BASLANGIC_TARIHI}}</p>
                <br/>
                <p>Gereğini saygılarım ile arz ederim.</p>
                <br/>
                <div style="float: right; text-align: center; width: 200px;">
                    <p><strong>{{TARIH}}</strong></p>
                    <p><strong>{{AD_SOYAD}}</strong></p>
                    <p><strong>(İmza)</strong></p>
                </div>
            </div>
        `,
        dynamicFields: [
             { key: "BASLANGIC_TARIHI", label: "İzin Başlangıç Tarihi", type: "date" }
        ]
    },
    {
        id: "fazla_mesai_onay",
        title: "Fazla Mesai Onay Formu (Yıllık)",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center;">FAZLA ÇALIŞMA ONAY FORMU</h3>
                <br/>
                <p>4857 Sayılı İş Kanunu'nun 41. maddesi gereğince;</p>
                <p>Ülkenin genel yararları, işin niteliği veya üretimin arttırılması gibi nedenlerle işverenin gerekli gördüğü zamanlarda, yasal sınırlar dahilinde yapılacak olan fazla çalışmalara (fazla mesai) katılmayı, bayram ve genel tatil günlerinde çalışmayı peşinen kabul ediyorum.</p>
                <br/>
                <p>İşbu muvafakatname <strong>{{YIL}}</strong> yılı sonuna kadar geçerlidir.</p>
                <br/><br/>
                <table style="width: 100%; border: 1px solid #000;">
                    <tr>
                        <td style="padding: 15px;">
                            <p><strong>PERSONELİN;</strong></p>
                            <p><strong>Adı Soyadı:</strong> {{AD_SOYAD}}</p>
                            <p><strong>TC Kimlik No:</strong> {{TC_NO}}</p>
                            <p><strong>Görevi:</strong> {{GOREVI}}</p>
                            <br/>
                            <p><strong>Tarih:</strong> {{TARIH}}</p>
                            <br/>
                            <p><strong>İmza:</strong></p>
                            <br/><br/>
                        </td>
                    </tr>
                </table>
            </div>
        `,
        dynamicFields: [
            { key: "YIL", label: "Geçerli Olduğu Yıl", type: "number", placeholder: "2025" }
        ]
    },
    {
        id: "savunma_istemi",
        title: "Savunma İstemi (Disiplin)",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center;">SAVUNMA İSTEMİ</h3>
                <br/>
                <p><strong>SAYIN:</strong> {{AD_SOYAD}}</p>
                <br/>
                <p><strong>KONU:</strong> {{OLAY_KONUSU}} Hakkında.</p>
                <br/>
                <p>Şirketimizde çalışmakta iken <strong>{{OLAY_TARIHI}}</strong> tarihinde tespit edilen aşağıdaki davranışınız/eyleminiz hakkında İş Kanunu ve Disiplin Yönetmeliği gereğince savunmanızı vermeniz gerekmektedir.</p>
                <br/>
                <div style="border: 1px solid #ccc; padding: 15px; background-color: #f9f9f9;">
                    <p><strong>Olayın Özeti:</strong></p>
                    <p>{{OLAY_DETAYI}}</p>
                </div>
                <br/>
                <p>Konuyla ilgili savunmanızı işbu yazının tarafınıza tebliğinden itibaren <strong>2 (iki) iş günü</strong> içinde yazılı olarak tarafımıza iletmenizi, aksi takdirde savunma hakkınızdan feragat etmiş sayılacağınızı ve mevcut delil durumuna göre işlem yapılacağını ihtaren bildiririz.</p>
                <br/>
                <div style="float: right; text-align: center; width: 250px;">
                    <p><strong>{{TARIH}}</strong></p>
                    <p><strong>ŞİRKET YÖNETİMİ</strong></p>
                    <p>CENK DİKMEN - Genel Müdür</p>
                    <p><strong>(Kaşe - İmza)</strong></p>
                </div>
                <div style="clear:both"></div>
                <br/><br/>
                <div style="border: 1px solid #000; padding: 10px;">
                    <p><strong>TEBELLÜĞ EDEN PERSONEL</strong></p>
                    <p>İşbu savunma istem yazısını elden teslim aldım.</p>
                    <p>Tarih: .../.../...</p>
                    <p>İmza:</p>
                </div>
            </div>
        `,
        dynamicFields: [
            { key: "OLAY_TARIHI", label: "Olay Tarihi", type: "date" },
            { key: "OLAY_KONUSU", label: "Konu Başlığı (Örn: Mesaiye Geç Kalma)", type: "text" },
            { key: "OLAY_DETAYI", label: "Olayın Detaylı Açıklaması", type: "textarea" }
        ]
    },
    {
        id: "mazeretsiz_gelmeme_ihtar",
        title: "İhtarname (Mazeretsiz Gelmeme)",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center;">İHTARNAME</h3>
                <br/>
                <p><strong>SAYIN:</strong> {{AD_SOYAD}}</p>
                <p><strong>TC KİMLİK NO:</strong> {{TC_NO}}</p>
                <br/>
                <p>Şirketimizde çalışmakta iken <strong>{{GELMEDIGI_TARIHLER}}</strong> tarihlerinde amirlerinizin izni ve bilgisi dışında, herhangi bir mazeret belirtmeden işinize gelmediğiniz tespit edilmiştir.</p>
                <br/>
                <p>İş Kanunu'nun 25/II maddesi uyarınca, işe devamsızlığınızı haklı gösterecek resmi bir belgeyi (rapor vb.) <strong>3 (üç) gün</strong> içinde şirketimiz İnsan Kaynakları departmanına ibraz etmeniz gerekmektedir.</p>
                <p>Aksi takdirde, iş sözleşmenizin 4857 sayılı İş Kanunu'nun 25/II-g maddesi uyarınca, <em>"İşçinin işverenden izin almaksızın veya haklı bir sebebe dayanmaksızın ardı ardına iki işgünü veya bir ay içinde iki defa herhangi bir tatil gününden sonraki iş günü, yahut bir ayda üç işgünü işine devam etmemesi"</em> sebebiyle bildirimsiz ve tazminatsız olarak feshedileceğini ihtaren bildiririz.</p>
                <br/>
                <div style="float: right; text-align: center; width: 250px;">
                    <p><strong>{{TARIH}}</strong></p>
                    <p><strong>ŞİRKET YÖNETİMİ</strong></p>
                    <p>CENK DİKMEN - Genel Müdür</p>
                    <p><strong>(Kaşe - İmza)</strong></p>
                </div>
                <div style="clear:both"></div>
                <br/><br/>
                <p><strong>Tebellüğ Eden:</strong></p>
                <p>İmza:</p>
                <p>Tarih:</p>
            </div>
        `,
        dynamicFields: [
            { key: "GELMEDIGI_TARIHLER", label: "Gelmediği Tarihler (Örn: 10.01.2025 ve 11.01.2025)", type: "text" }
        ]
    },
    {
        id: "genel_ihtarname",
        title: "Genel İhtarname (Performans/Davranış)",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center;">İHTARNAME</h3>
                <br/>
                <p><strong>SAYIN:</strong> {{AD_SOYAD}}</p>
                <br/>
                <p><strong>KONU:</strong> {{KONU}}</p>
                <br/>
                <p>Şirketimizde <strong>{{OLAY_TARIHI}}</strong> tarihinde tespit edilen aşağıdaki hususla ilgili olarak;</p>
                <div style="margin: 10px 0; padding: 10px; border-left: 3px solid red; background: #f9f9f9;">
                    {{ACIKLAMA}}
                </div>
                <p>Bu davranışınız İşyeri Disiplin Yönetmeliği'ne ve İş Sözleşmenize aykırılık teşkil etmektedir.</p>
                <p>Söz konusu davranışınız nedeniyle <strong>İHTAR</strong> edilmenize karar verilmiştir. Benzer hataların tekrarı halinde iş sözleşmenizin İş Kanunu hükümleri uyarınca feshedilebileceğini tarafınıza bildiririz.</p>
                <br/>
                <p>Gerekli özenin gösterilmesini rica ederiz.</p>
                <br/>
                <div style="float: right; text-align: center; width: 250px;">
                    <p><strong>{{TARIH}}</strong></p>
                    <p><strong>ŞİRKET YÖNETİMİ</strong></p>
                    <p>CENK DİKMEN - Genel Müdür</p>
                    <p><strong>(Kaşe - İmza)</strong></p>
                </div>
                <div style="clear:both"></div>
                <br/><br/>
                <p><strong>Tebellüğ Eden (Okudum, Anladım, Bir Nüshasını Aldım):</strong></p>
                <p>İmza:</p>
                <p>Tarih:</p>
            </div>
        `,
        dynamicFields: [
            { key: "KONU", label: "İhtar Konusu", type: "text" },
            { key: "OLAY_TARIHI", label: "Olay Tarihi", type: "date" },
            { key: "ACIKLAMA", label: "İhtar Nedeni/Açıklama", type: "textarea" }
        ]
    },
    {
        id: "fesih_bildirimi",
        title: "İş Sözleşmesi Fesih Bildirimi",
        content: `
             {{HEADER}}
             <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center;">FESİH BİLDİRİMİ</h3>
                <br/>
                <p><strong>SAYIN:</strong> {{AD_SOYAD}}</p>
                <br/>
                <p>Şirketimizde sürdürmekte olduğunuz iş sözleşmeniz, aşağıdaki gerekçe ile feshedilmiştir:</p>
                <br/>
                <p><strong>FESİH NEDENİ:</strong></p>
                <p style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">{{FESIH_NEDENI}}</p>
                <br/>
                <p>Kıdeminize uygun olarak <strong>{{IHBAR_SURESI}} hafta</strong> ihbar süreniz bulunmaktadır. İhbar süreniz <strong>{{IHBAR_BASLANGIC}}</strong> tarihinde başlayacak ve <strong>{{IHBAR_BITIS}}</strong> tarihinde sona erecektir.</p>
                <p>Bu süre zarfında, kanuni hakkınız olan "Yeni İş Arama İzni"ni (günde en az 2 saat) kullanabileceğinizi, dilerseniz bu saatleri birleştirerek toplu olarak kullanabileceğinizi bildiririz.</p>
                <br/>
                <p>Tüm kanuni haklarınız (varsa kıdem, ihbar tazminatı, yıllık izin ücreti vb.) hesaplanarak banka hesabınıza yatırılacaktır.</p>
                <br/>
                <p>Bilgilerinize sunarız.</p>
                <br/>
                <div style="float: right; text-align: center; width: 250px;">
                    <p><strong>{{TARIH}}</strong></p>
                    <p><strong>ŞİRKET YÖNETİMİ</strong></p>
                    <p>CENK DİKMEN - Genel Müdür</p>
                    <p><strong>(İmza)</strong></p>
                </div>
                <div style="clear:both"></div>
                <br/><br/>
                <p><strong>Tebellüğ Eden (Çalışan):</strong></p>
                <p>İşbu fesih bildirimini teslim aldım.</p>
                <p>Tarih: .../.../...</p>
                <p>İmza:</p>
            </div>
        `,
        dynamicFields: [
            { key: "FESIH_NEDENI", label: "Fesih Nedeni", type: "textarea" },
            { key: "IHBAR_SURESI", label: "İhbar Süresi (Hafta)", type: "number" },
            { key: "IHBAR_BASLANGIC", label: "İhbar Başlangıç Tarihi", type: "date" },
            { key: "IHBAR_BITIS", label: "İhbar Bitiş Tarihi", type: "date" }
        ]
    },
    {
        id: "ibraname",
        title: "İbraname (Genel)",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h2 style="text-align: center;">İBRANAME</h2>
                <br/>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="width: 40%; font-weight: bold;">ADI SOYADI:</td><td>{{AD_SOYAD}}</td></tr>
                    <tr><td style="font-weight: bold;">TC KİMLİK NO:</td><td>{{TC_NO}}</td></tr>
                    <tr><td style="font-weight: bold;">İŞE GİRİŞ TARİHİ:</td><td>{{ISE_GIRIS}}</td></tr>
                    <tr><td style="font-weight: bold;">İŞTEN ÇIKIŞ TARİHİ:</td><td>{{CIKIS_TARIHI}}</td></tr>
                </table>
                <br/>
                <p>Çalışmış olduğum yukarıda belirtilen tarihler arasında hak etmiş olduğum;</p>
                <ul>
                    <li>Maaş ve ücretlerimi,</li>
                    <li>Fazla mesai ücretlerimi,</li>
                    <li>Yıllık izin ücretlerimi,</li>
                    <li>Hafta tatili ve genel tatil ücretlerimi,</li>
                    <li>AGİ ve diğer sosyal yardımları,</li>
                    <li>(Varsa) Kıdem ve İhbar tazminatlarımı,</li>
                </ul>
                <p>tam ve eksiksiz olarak tahsil ettim.</p>
                <p>Şirketinizden, iş kanunundan ve iş sözleşmesinden doğan hiçbir hak ve alacağım kalmadığını, şirketinizi maddi ve manevi tüm talep haklarımdan dolayı gayrikabili rücu olarak ibra ettiğimi, şirketi hiçbir şekilde dava etmeyeceğimi beyan ve kabul ederim.</p>
                <br/>
                <div style="float: right; text-align: center; width: 200px;">
                    <p><strong>TARİH: {{TARIH}}</strong></p>
                    <p><strong>İBRA EDEN</strong></p>
                    <p><strong>{{AD_SOYAD}}</strong></p>
                    <p><strong>(İmza)</strong></p>
                </div>
            </div>
        `,
        dynamicFields: [
            { key: "CIKIS_TARIHI", label: "İşten Çıkış Tarihi", type: "date" }
        ]
    },
    {
        id: "zimmet_tutanagi",
        title: "Genel Demirbaş Zimmet Tutanağı",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h2 style="text-align: center;">DEMİRBAŞ ZİMMET TESLİM TUTANAĞI</h2>
                <br/>
                <p>Aşağıda özellikleri belirtilen şirket demirbaşları, işyeri kullanımı amacıyla <strong>{{AD_SOYAD}}</strong> isimli personele sağlam ve çalışır vaziyette teslim edilmiştir.</p>
                <br/>
                <table style="width: 100%; border: 1px solid black; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f0f0f0;">
                            <th style="border: 1px solid black; padding: 10px; width: 10%;">Sıra</th>
                            <th style="border: 1px solid black; padding: 10px;">Malzeme / Eşya Detayları (Marka, Model, Seri No)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{ZIMMET_ROWS}}
                    </tbody>
                </table>
                <br/>
                <p>Personel, kendisine teslim edilen demirbaşları iş amacı dışında kullanmayacağını, gereken özeni göstereceğini, işten ayrılırken eksiksiz ve hasarsız olarak iade edeceğini taahhüt eder.</p>
                <br/><br/>
                <div style="display: flex; justify-content: space-between;">
                    <div style="text-align: center;">
                        <p><strong>TESLİM EDEN</strong></p>
                        <p>CENK DİKMEN<br/>Genel Müdür</p>
                        <p>(İmza)</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>TESLİM ALAN</strong></p>
                        <p>{{AD_SOYAD}}</p>
                        <p>(İmza)</p>
                    </div>
                </div>
            </div>
        `,
        dynamicFields: [
            { key: "ESYALAR", label: "Zimmetlenen Eşyalar (Her satıra bir eşya yazınız)", type: "textarea", placeholder: "Örn:\nMasa\nSandalye\nTakım Çantası" }
        ]
    },
    {
        id: "zimmet_iade",
        title: "Genel Zimmet İade Tutanağı",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h2 style="text-align: center;">ZİMMET İADE TUTANAĞI</h2>
                <br/>
                <p>Aşağıda özellikleri belirtilen şirket demirbaşları, <strong>{{AD_SOYAD}}</strong> isimli personelden eksiksiz ve hasarsız bir şekilde teslim alınmıştır.</p>
                <br/>
                <table style="width: 100%; border: 1px solid black; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f0f0f0;">
                            <th style="border: 1px solid black; padding: 10px; width: 10%;">Sıra</th>
                            <th style="border: 1px solid black; padding: 10px;">İade Edilen Malzeme / Eşya Detayları</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{ZIMMET_ROWS}}
                    </tbody>
                </table>
                <br/>
                <p>İşbu tutanak, zimmet konusu eşyaların şirkete iadesini tevsik etmek amacıyla düzenlenmiştir. Personelin zimmet borcu kalmamıştır.</p>
                <br/><br/>
                <div style="display: flex; justify-content: space-between;">
                    <div style="text-align: center;">
                        <p><strong>TESLİM EDEN (Personel)</strong></p>
                        <p>{{AD_SOYAD}}</p>
                        <p>(İmza)</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>TESLİM ALAN (Yetkili)</strong></p>
                        <p>CENK DİKMEN<br/>Genel Müdür</p>
                        <p>(İmza)</p>
                    </div>
                </div>
            </div>
        `,
        dynamicFields: [
            { key: "ESYALAR", label: "İade Edilen Eşyalar (Her satıra bir eşya yazınız)", type: "textarea", placeholder: "Örn:\nLaptop (Lenovo X1)\nŞirket Hattı" }
        ]
    },
    {
        id: "egitim_katilim",
        title: "Eğitim Katılım Formu",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center;">EĞİTİM KATILIM FORMU</h3>
                <br/>
                <p>Şirketimiz tarafından düzenlenen aşağıda detayları verilen eğitime katılımım sağlanmıştır.</p>
                <br/>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0; width: 30%;">Eğitim Konusu</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{EGITIM_KONUSU}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0;">Eğitim Tarihi</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{EGITIM_TARIHI}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0;">Eğitim Yeri</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{EGITIM_YERI}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0;">Eğitmen</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{EGITMEN}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px; background-color: #f0f0f0;">Süre</td>
                        <td style="border: 1px solid #000; padding: 10px;">{{SURE}} Saat</td>
                    </tr>
                </table>
                <br/><br/>
                <div style="text-align: center; float: right; width: 200px;">
                    <p><strong>KATILIMCI PERSONEL</strong></p>
                    <p>{{AD_SOYAD}}</p>
                    <p>(İmza)</p>
                </div>
            </div>
        `,
        dynamicFields: [
            { key: "EGITIM_KONUSU", label: "Eğitim Konusu", type: "text" },
            { key: "EGITIM_TARIHI", label: "Tarih", type: "date" },
            { key: "EGITIM_YERI", label: "Yer", type: "text" },
            { key: "EGITMEN", label: "Eğitmen", type: "text" },
            { key: "SURE", label: "Süre (Saat)", type: "number" }
        ]
    },
    {
        id: "gorev_degisikligi",
        title: "Görev Yeri Değişikliği Bildirimi",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5;">
                <h3 style="text-align: center;">GÖREV YERİ DEĞİŞİKLİĞİ BİLDİRİM FORMU</h3>
                <br/>
                <p><strong>SAYIN:</strong> {{AD_SOYAD}}</p>
                <br/>
                <p>Şirketimizin gördüğü lüzum üzerine, mevcut görevinizde/görev yerinizde aşağıda belirtilen değişiklik yapılmıştır.</p>
                <br/>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                    <tr style="background-color: #f0f0f0;">
                        <th style="border: 1px solid #000; padding: 8px;">BİLGİ</th>
                        <th style="border: 1px solid #000; padding: 8px;">ESKİ DURUM</th>
                        <th style="border: 1px solid #000; padding: 8px;">YENİ DURUM</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">Bölüm / Departman</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{ESKI_BOLUM}}</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{YENI_BOLUM}}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">Ünvan / Görev</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{ESKI_UNVAN}}</td>
                        <td style="border: 1px solid #000; padding: 8px;">{{YENI_UNVAN}}</td>
                    </tr>
                     <tr>
                        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">Geçerlilik Tarihi</td>
                        <td style="border: 1px solid #000; padding: 8px;" colspan="2">{{GECERLILIK_TARIHI}}</td>
                    </tr>
                </table>
                <br/>
                <p>Yeni görevinizde başarılar dileriz.</p>
                <br/>
                <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                    <div style="text-align: center;">
                        <p><strong>ŞİRKET YÖNETİMİ</strong></p>
                        <p>CENK DİKMEN - Genel Müdür</p>
                        <p>(İmza - Kaşe)</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>TEBELLÜĞ EDEN</strong></p>
                        <p>Okudum, Kabul Ettim</p>
                        <p>(İmza)</p>
                    </div>
                </div>
            </div>
        `,
        dynamicFields: [
            { key: "ESKI_BOLUM", label: "Eski Bölüm", type: "text" },
            { key: "YENI_BOLUM", label: "Yeni Bölüm", type: "text" },
            { key: "ESKI_UNVAN", label: "Eski Ünvan", type: "text" },
            { key: "YENI_UNVAN", label: "Yeni Ünvan", type: "text" },
            { key: "GECERLILIK_TARIHI", label: "Geçerlilik Tarihi", type: "date" }
        ]
    },
    {
        id: "personel_ozluk_kapak",
        title: "Personel Özlük Dosyası Kapağı",
        content: `
            {{HEADER}}
            <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5; text-align: center; border: 2px solid #000; height: 800px;">
                <br/><br/><br/>
                <h1 style="font-size: 36px; text-decoration: underline;">PERSONEL ÖZLÜK DOSYASI</h1>
                <br/><br/><br/><br/>
                
                <div style="text-align: left; width: 70%; margin: 0 auto; font-size: 18px;">
                    <p style="border-bottom: 1px solid #000; padding-bottom: 5px;"><strong>ADI SOYADI:</strong> {{AD_SOYAD}}</p>
                    <br/>
                    <p style="border-bottom: 1px solid #000; padding-bottom: 5px;"><strong>TC KİMLİK NO:</strong> {{TC_NO}}</p>
                    <br/>
                    <p style="border-bottom: 1px solid #000; padding-bottom: 5px;"><strong>SİCİL NUMARASI:</strong> {{SICIL_NO}}</p>
                    <br/>
                    <p style="border-bottom: 1px solid #000; padding-bottom: 5px;"><strong>GÖREVİ:</strong> {{GOREVI}}</p>
                    <br/>
                    <p style="border-bottom: 1px solid #000; padding-bottom: 5px;"><strong>İŞE GİRİŞ TARİHİ:</strong> {{ISE_GIRIS}}</p>
                    <br/>
                    <p style="border-bottom: 1px solid #000; padding-bottom: 5px;"><strong>KAN GRUBU:</strong> {{KAN_GRUBU}}</p>
                    <br/>
                    <p style="border-bottom: 1px solid #000; padding-bottom: 5px;"><strong>ACİL DURUM TEL:</strong> {{ACIL_TEL}}</p>
                </div>
                
                <br/><br/><br/><br/>
                <p style="font-size: 14px;">BU DOSYA ŞİRKETİMİZİN MÜLKİYETİNDEDİR.</p>
            </div>
        `,
        dynamicFields: [
            { key: "KAN_GRUBU", label: "Kan Grubu", type: "text" },
            { key: "ACIL_TEL", label: "Acil Durum Telefonu", type: "text" }
        ]
    }
];
