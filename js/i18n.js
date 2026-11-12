// Interface text in three languages. Content (universities, services...) is edited in the admin panel.
import { CONFIG } from "./config.js?v=202611121627";

export const UI = {
  ar: {
    cal_title: "تقويم المفاضلات ومواعيد التسجيل", cal_sub: "مواعيد التسجيل في الجامعات التركية، محدّثة باستمرار", cal_search_label: "ابحث عن جامعة:", cal_search_ph: "اكتب اسم الجامعة أو المدينة…", cal_clear: "مسح البحث", cal_university: "اسم الجامعة", cal_start: "بدء التسجيل", cal_end: "انتهاء التسجيل", cal_results: "تاريخ النتائج", cal_certs: "الشهادات المقبولة", cal_link: "رابط التسجيل", cal_register: "سجّل هنا", cal_open: "التسجيل مفتوح", cal_soon: "يفتح قريباً", cal_closed: "انتهى التسجيل", cal_note: "المواعيد قد تتغير حسب إعلانات الجامعات. تواصل معنا للتأكد قبل التقديم.",
    dir: "rtl", langName: "العربية",
    nav_home: "الرئيسية", nav_universities: "الجامعات", nav_gov: "الجامعات الحكومية", nav_private: "الجامعات الخاصة", nav_prices: "أسعار الجامعات الخاصة",
    nav_services: "خدماتنا", nav_scholarships: "المنح", nav_calendar: "التقويم", nav_articles: "مقالات وأخبار", nav_about: "من نحن", nav_contact: "تواصل معنا",
    apply_now: "سجّل الآن", whatsapp_us: "راسلنا واتساب", learn_more: "اقرأ المزيد", view_all: "عرض الكل", back: "رجوع",
    sec_services: "خدماتنا", sec_services_sub: "كل ما يحتاجه الطالب في مكان واحد",
    sec_unis: "جامعات مختارة", sec_unis_sub: "جامعات حكومية وخاصة في أنحاء تركيا",
    sec_steps: "كيف نعمل", step1: "استشارة مجانية", step1d: "نتعرف على معدلك وتخصصك وميزانيتك.",
    step2: "اختيار الجامعة", step2d: "نقترح أفضل الجامعات المناسبة لك.", step3: "التقديم", step3d: "نجهز الملف ونقدّم عنك.",
    step4: "القبول", step4d: "نتابع حتى صدور القبول النهائي.", step5: "السفر والإقامة", step5d: "استقبال، سكن، وإقامة طلابية.",
    sec_news: "آخر الأخبار والمقالات", sec_scholarships: "المنح الدراسية", sec_faq: "أسئلة شائعة",
    cta_title: "جاهز تبدأ؟", cta_text: "أرسل طلبك الآن وسيتواصل معك مستشارنا خلال 24 ساعة.",
    gov: "حكومية", private: "خاصة", all: "الكل", city: "المدينة", founded: "سنة التأسيس", website: "الموقع الرسمي",
    price_from: "تبدأ من", per_year: "سنوياً", program: "التخصص", annual_fee: "القسط السنوي", ask_price: "اسأل عن السعر", free: "مجاناً",
    search: "ابحث…", no_results: "لا توجد نتائج", deadline: "آخر موعد", official_link: "الرابط الرسمي",
    cat_all: "الكل", cat_news: "أخبار", cat_guide: "أدلة", cat_exams: "امتحانات", cat_recognition: "الاعتراف",
    form_title: "طلب تسجيل", form_sub: "املأ النموذج وسنتواصل معك. الحقول المعلّمة بـ * مطلوبة.",
    f_name: "الاسم الكامل", f_email: "البريد الإلكتروني", f_phone: "رقم الهاتف / واتساب", f_nationality: "الجنسية", f_country: "بلد الإقامة",
    f_degree: "المرحلة الدراسية", f_major: "التخصص المطلوب", f_university: "الجامعة المفضلة", f_unitype: "نوع الجامعة", f_gpa: "المعدل في الثانوية", f_message: "ملاحظات",
    f_service: "الخدمة المطلوبة", undecided: "لم أقرر بعد", any: "لا فرق",
    deg_bachelor: "بكالوريوس", deg_master: "ماجستير", deg_phd: "دكتوراه", deg_language: "سنة لغة", deg_associate: "دبلوم (سنتان)",
    f_consent: "قرأت <a href=\"#/privacy\">نص حماية البيانات (KVKK)</a> وأوافق على معالجة بياناتي للتواصل معي بخصوص طلبي.",
    submit: "إرسال الطلب", sending: "جارٍ الإرسال…", sent_title: "تم استلام طلبك ✓", sent_text: "شكراً لك! سيتواصل معك أحد مستشارينا قريباً. يمكنك أيضاً مراسلتنا على واتساب.",
    send_error: "حدث خطأ، حاول مرة أخرى أو راسلنا على واتساب.", required: "هذا الحقل مطلوب",
    contact_title: "تواصل معنا", phones: "الهاتف", email: "البريد", address: "العنوان", hours: "أوقات الدوام", follow: "تابعنا",
    privacy_title: "سياسة الخصوصية وحماية البيانات (KVKK)", footer_rights: "جميع الحقوق محفوظة", admin: "الإدارة",
    upcoming: "المواعيد القادمة", past: "مواعيد سابقة", not_found: "الصفحة غير موجودة", demo_banner: "نسخة تجريبية: البيانات محفوظة في هذا المتصفح فقط",
  },
  en: {
    cal_title: "Admission calendar & registration dates", cal_sub: "Registration dates of Turkish universities, kept up to date", cal_search_label: "Find a university:", cal_search_ph: "Type a university or city name…", cal_clear: "Clear", cal_university: "University", cal_start: "Registration opens", cal_end: "Registration closes", cal_results: "Results date", cal_certs: "Accepted certificates", cal_link: "Register", cal_register: "Register here", cal_open: "Open", cal_soon: "Opening soon", cal_closed: "Closed", cal_note: "Dates may change according to university announcements. Contact us to confirm before applying.",
    dir: "ltr", langName: "English",
    nav_home: "Home", nav_universities: "Universities", nav_gov: "Public universities", nav_private: "Private universities", nav_prices: "Private university prices",
    nav_services: "Services", nav_scholarships: "Scholarships", nav_calendar: "Calendar", nav_articles: "News & articles", nav_about: "About us", nav_contact: "Contact",
    apply_now: "Apply now", whatsapp_us: "WhatsApp us", learn_more: "Read more", view_all: "View all", back: "Back",
    sec_services: "Our services", sec_services_sub: "Everything a student needs, in one place",
    sec_unis: "Featured universities", sec_unis_sub: "Public and private universities across Türkiye",
    sec_steps: "How it works", step1: "Free consultation", step1d: "We learn about your grades, field and budget.",
    step2: "Choose a university", step2d: "We suggest the universities that fit you best.", step3: "Apply", step3d: "We prepare your file and apply for you.",
    step4: "Acceptance", step4d: "We follow up until your final acceptance.", step5: "Travel & residence", step5d: "Pickup, housing and student residence permit.",
    sec_news: "Latest news & articles", sec_scholarships: "Scholarships", sec_faq: "Frequently asked questions",
    cta_title: "Ready to start?", cta_text: "Send your application now and an advisor will contact you within 24 hours.",
    gov: "Public", private: "Private", all: "All", city: "City", founded: "Founded", website: "Official website",
    price_from: "From", per_year: "per year", program: "Program", annual_fee: "Annual fee", ask_price: "Ask for price", free: "Free",
    search: "Search…", no_results: "No results", deadline: "Deadline", official_link: "Official link",
    cat_all: "All", cat_news: "News", cat_guide: "Guides", cat_exams: "Exams", cat_recognition: "Recognition",
    form_title: "Application form", form_sub: "Fill in the form and we will contact you. Fields marked * are required.",
    f_name: "Full name", f_email: "Email", f_phone: "Phone / WhatsApp", f_nationality: "Nationality", f_country: "Country of residence",
    f_degree: "Degree level", f_major: "Desired program", f_university: "Preferred university", f_unitype: "University type", f_gpa: "High-school grade", f_message: "Notes",
    f_service: "Service needed", undecided: "Not decided yet", any: "No preference",
    deg_bachelor: "Bachelor's", deg_master: "Master's", deg_phd: "PhD", deg_language: "Language year", deg_associate: "Associate (2 years)",
    f_consent: "I have read the <a href=\"#/privacy\">data protection notice (KVKK)</a> and agree to my data being processed to contact me about my application.",
    submit: "Send application", sending: "Sending…", sent_title: "Application received ✓", sent_text: "Thank you! One of our advisors will contact you soon. You can also message us on WhatsApp.",
    send_error: "Something went wrong. Please try again or message us on WhatsApp.", required: "This field is required",
    contact_title: "Contact us", phones: "Phone", email: "Email", address: "Address", hours: "Working hours", follow: "Follow us",
    privacy_title: "Privacy & data protection notice (KVKK)", footer_rights: "All rights reserved", admin: "Admin",
    upcoming: "Upcoming dates", past: "Past dates", not_found: "Page not found", demo_banner: "Demo version: data is saved in this browser only",
  },
  tr: {
    cal_title: "Başvuru takvimi ve kayıt tarihleri", cal_sub: "Türk üniversitelerinin başvuru tarihleri, güncel olarak", cal_search_label: "Üniversite ara:", cal_search_ph: "Üniversite veya şehir adı yazın…", cal_clear: "Temizle", cal_university: "Üniversite", cal_start: "Başvuru başlangıcı", cal_end: "Başvuru bitişi", cal_results: "Sonuç tarihi", cal_certs: "Kabul edilen belgeler", cal_link: "Kayıt", cal_register: "Başvur", cal_open: "Başvuru açık", cal_soon: "Yakında açılıyor", cal_closed: "Başvuru kapandı", cal_note: "Tarihler üniversite duyurularına göre değişebilir. Başvurmadan önce bizimle teyit edin.",
    dir: "ltr", langName: "Türkçe",
    nav_home: "Ana sayfa", nav_universities: "Üniversiteler", nav_gov: "Devlet üniversiteleri", nav_private: "Vakıf üniversiteleri", nav_prices: "Vakıf üniversitesi ücretleri",
    nav_services: "Hizmetlerimiz", nav_scholarships: "Burslar", nav_calendar: "Takvim", nav_articles: "Haberler ve makaleler", nav_about: "Hakkımızda", nav_contact: "İletişim",
    apply_now: "Başvur", whatsapp_us: "WhatsApp'tan yazın", learn_more: "Devamını oku", view_all: "Tümünü gör", back: "Geri",
    sec_services: "Hizmetlerimiz", sec_services_sub: "Öğrencinin ihtiyacı olan her şey tek yerde",
    sec_unis: "Öne çıkan üniversiteler", sec_unis_sub: "Türkiye genelinde devlet ve vakıf üniversiteleri",
    sec_steps: "Nasıl çalışıyoruz", step1: "Ücretsiz danışma", step1d: "Notlarınızı, bölümünüzü ve bütçenizi öğreniyoruz.",
    step2: "Üniversite seçimi", step2d: "Size en uygun üniversiteleri öneriyoruz.", step3: "Başvuru", step3d: "Dosyanızı hazırlayıp başvurunuzu yapıyoruz.",
    step4: "Kabul", step4d: "Kesin kabul alınana kadar takip ediyoruz.", step5: "Seyahat ve ikamet", step5d: "Karşılama, konaklama ve öğrenci ikameti.",
    sec_news: "Son haberler ve makaleler", sec_scholarships: "Burslar", sec_faq: "Sık sorulan sorular",
    cta_title: "Başlamaya hazır mısınız?", cta_text: "Başvurunuzu şimdi gönderin, danışmanımız 24 saat içinde size ulaşsın.",
    gov: "Devlet", private: "Vakıf", all: "Tümü", city: "Şehir", founded: "Kuruluş", website: "Resmî web sitesi",
    price_from: "Başlangıç", per_year: "yıllık", program: "Bölüm", annual_fee: "Yıllık ücret", ask_price: "Fiyat sorun", free: "Ücretsiz",
    search: "Ara…", no_results: "Sonuç yok", deadline: "Son tarih", official_link: "Resmî bağlantı",
    cat_all: "Tümü", cat_news: "Haberler", cat_guide: "Rehberler", cat_exams: "Sınavlar", cat_recognition: "Tanınırlık",
    form_title: "Başvuru formu", form_sub: "Formu doldurun, size ulaşalım. * ile işaretli alanlar zorunludur.",
    f_name: "Ad soyad", f_email: "E-posta", f_phone: "Telefon / WhatsApp", f_nationality: "Uyruk", f_country: "İkamet ülkesi",
    f_degree: "Eğitim seviyesi", f_major: "İstenen bölüm", f_university: "Tercih edilen üniversite", f_unitype: "Üniversite türü", f_gpa: "Lise not ortalaması", f_message: "Notlar",
    f_service: "İstenen hizmet", undecided: "Henüz karar vermedim", any: "Fark etmez",
    deg_bachelor: "Lisans", deg_master: "Yüksek lisans", deg_phd: "Doktora", deg_language: "Dil yılı", deg_associate: "Ön lisans (2 yıl)",
    f_consent: "<a href=\"#/privacy\">KVKK aydınlatma metnini</a> okudum; başvurum hakkında benimle iletişime geçilmesi için verilerimin işlenmesini kabul ediyorum.",
    submit: "Başvuruyu gönder", sending: "Gönderiliyor…", sent_title: "Başvurunuz alındı ✓", sent_text: "Teşekkürler! Danışmanlarımızdan biri en kısa sürede size ulaşacak. WhatsApp'tan da yazabilirsiniz.",
    send_error: "Bir hata oluştu. Lütfen tekrar deneyin veya WhatsApp'tan yazın.", required: "Bu alan zorunludur",
    contact_title: "İletişim", phones: "Telefon", email: "E-posta", address: "Adres", hours: "Çalışma saatleri", follow: "Bizi takip edin",
    privacy_title: "Gizlilik ve KVKK aydınlatma metni", footer_rights: "Tüm hakları saklıdır", admin: "Yönetim",
    upcoming: "Yaklaşan tarihler", past: "Geçmiş tarihler", not_found: "Sayfa bulunamadı", demo_banner: "Deneme sürümü: veriler yalnızca bu tarayıcıda saklanır",
  },
};

const LANG_KEY = "kam_lang";
export function getLang() {
  let l = null;
  try { l = new URLSearchParams(location.search).get("lang") || localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
  return CONFIG.languages.includes(l) ? l : CONFIG.defaultLang;
}
export function setLang(l) {
  try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* ignore */ }
}
export function makeT(lang) {
  const ui = UI[lang] || UI.ar;
  const t = (key) => ui[key] ?? UI.en[key] ?? key;
  // pick the right language from a {ar,en,tr} object
  t.pick = (obj) => {
    if (obj == null) return "";
    if (typeof obj !== "object") return String(obj);
    return obj[lang] || obj.ar || obj.en || obj.tr || "";
  };
  return t;
}
