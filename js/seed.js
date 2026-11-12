// Starting content. In demo mode this is loaded into the browser.
// In Supabase mode it is only used as fallback for missing settings;
// the admin panel has an "Import starter content" button to copy it into the database.
// NOTE: prices and dates below are EXAMPLES. Replace them from the admin panel.

const L = (ar, en, tr) => ({ ar, en, tr });
let n = 0;
const item = (o) => ({ id: "seed-" + ++n, sort: n, published: true, created_at: "2026-11-01T00:00:00Z", ...o });

export const SEED = {
  settings: {
    siteName: L("كَم للخدمات العامة", "KAM Knowledge · Advisory · Mobility", "KAM Danışmanlık"),
    tagline: L("المعرفة · الاستشارة · التنقل", "Knowledge · Advisory · Mobility", "Bilgi · Danışmanlık · Mobilite"),
    heroTitle: L("طريقك للدراسة في تركيا يبدأ من هنا", "Your path to studying in Türkiye starts here", "Türkiye'de eğitim yolculuğunuz burada başlıyor"),
    heroSubtitle: L(
      "نرافقك من اختيار الجامعة حتى استلام القبول والإقامة: قبولات الجامعات الحكومية والخاصة، المنح، المعادلة، وخدمات السفر والسكن.",
      "We guide you from choosing a university to receiving your acceptance and residence permit: public and private university admissions, scholarships, equivalency, travel and housing.",
      "Üniversite seçiminden kabul belgesi ve ikamet iznine kadar yanınızdayız: devlet ve vakıf üniversitesi başvuruları, burslar, denklik, seyahat ve konaklama."
    ),
    heroImage: "",
    about: L(
      "كَم للخدمات العامة من المكاتب الموثوقة والمعروفة في مجال الخدمات العامة والقبولات الجامعية والاستشارات التعليمية وخدمات السفر والتنقل. هدفنا أن نكون الخيار الأول للعملاء الذين يبحثون عن خدمة احترافية وسريعة وشفافة.",
      "KAM is a trusted office for general services, university admissions, educational consulting, and travel and mobility services. Our goal is to be the first choice for clients who want a professional, fast and transparent service.",
      "KAM; genel hizmetler, üniversite kabulleri, eğitim danışmanlığı ve seyahat-mobilite hizmetlerinde güvenilir bir ofistir. Amacımız profesyonel, hızlı ve şeffaf hizmet arayanların ilk tercihi olmaktır."
    ),
    phones: "+90 534 299 05 63\n+90 534 822 54 26",
    whatsapp: "905342990563",
    email: "",
    address: L("إسطنبول، تركيا", "Istanbul, Türkiye", "İstanbul, Türkiye"),
    workingHours: L("السبت - الخميس، 10:00 - 19:00", "Saturday - Thursday, 10:00 - 19:00", "Cumartesi - Perşembe, 10:00 - 19:00"),
    instagram: "https://www.instagram.com/kam.edu.tr",
    facebook: "https://www.facebook.com/kam.edu.tr",
    telegram: "https://t.me/kamedutr",
    linkedin: "https://www.linkedin.com/in/kam-kam-b2823a432",
    mapEmbed: "",
    currency: "USD",
    priceNote: L(
      "الأسعار تقريبية وقد تتغير حسب الجامعة والبرنامج. تواصل معنا لتأكيد السعر النهائي.",
      "Prices are indicative and may change by university and program. Contact us to confirm the final price.",
      "Fiyatlar yaklaşıktır, üniversiteye ve programa göre değişebilir. Kesin fiyat için bizimle iletişime geçin."
    ),
    stats: [
      { value: "+40", label: L("جامعة شريكة", "Partner universities", "Partner üniversite") },
      { value: "+1000", label: L("طالب استشرناه", "Students advised", "Danışılan öğrenci") },
      { value: "3", label: L("لغات للتواصل", "Languages", "Dil") },
      { value: "24h", label: L("وقت الرد", "Response time", "Yanıt süresi") },
    ],
    companyLegalName: "",
    taxNumber: "",
  },

  content: {
    universities: [
      item({ type: "gov", name: L("جامعة إسطنبول", "Istanbul University", "İstanbul Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), founded: "1453", image: "", website: "https://www.istanbul.edu.tr", featured: true,
        description: L("من أعرق الجامعات في تركيا، ولها كليات في الطب والحقوق والآداب والعلوم والاقتصاد.", "One of Türkiye's oldest universities, with faculties of medicine, law, humanities, science and economics.", "Türkiye'nin en köklü üniversitelerinden biri; tıp, hukuk, edebiyat, fen ve iktisat fakülteleri bulunur."),
        fees: "", priceFrom: "" }),
      item({ type: "gov", name: L("جامعة إسطنبول التقنية", "Istanbul Technical University", "İstanbul Teknik Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), founded: "1773", image: "", website: "https://www.itu.edu.tr", featured: true,
        description: L("جامعة رائدة في الهندسة والعمارة، ومن أكثر الجامعات طلباً بين الطلاب الدوليين.", "A leading university in engineering and architecture, very popular with international students.", "Mühendislik ve mimarlıkta öncü, uluslararası öğrencilerin en çok tercih ettiği üniversitelerden."),
        fees: "", priceFrom: "" }),
      item({ type: "gov", name: L("جامعة يلدز التقنية", "Yıldız Technical University", "Yıldız Teknik Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), founded: "1911", image: "", website: "https://www.yildiz.edu.tr", featured: true,
        description: L("جامعة تقنية معروفة في إسطنبول، تقدم برامج قوية في الهندسة والتصميم.", "A well-known technical university in Istanbul with strong engineering and design programs.", "İstanbul'da güçlü mühendislik ve tasarım programlarıyla bilinen bir teknik üniversite."),
        fees: "", priceFrom: "" }),
      item({ type: "gov", name: L("جامعة مرمرة", "Marmara University", "Marmara Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), founded: "1883", image: "", website: "https://www.marmara.edu.tr",
        description: L("جامعة كبيرة بتخصصات متنوعة وبرامج باللغة الإنكليزية والتركية.", "A large university with a wide range of programs in English and Turkish.", "Türkçe ve İngilizce geniş program yelpazesine sahip büyük bir üniversite."),
        fees: "", priceFrom: "" }),
      item({ type: "gov", name: L("جامعة أنقرة", "Ankara University", "Ankara Üniversitesi"), city: L("أنقرة", "Ankara", "Ankara"), founded: "1946", image: "", website: "https://www.ankara.edu.tr",
        description: L("أول جامعة تأسست في عهد الجمهورية، ولها حضور قوي في العلوم الإنسانية والطب.", "The first university founded in the Republican era, strong in humanities and medicine.", "Cumhuriyet döneminin ilk üniversitesi; beşeri bilimler ve tıpta güçlü."),
        fees: "", priceFrom: "" }),
      item({ type: "gov", name: L("جامعة حجة تبة", "Hacettepe University", "Hacettepe Üniversitesi"), city: L("أنقرة", "Ankara", "Ankara"), founded: "1967", image: "", website: "https://www.hacettepe.edu.tr",
        description: L("مشهورة بكليات الطب والعلوم الصحية.", "Renowned for its medical and health sciences faculties.", "Tıp ve sağlık bilimleri fakülteleriyle tanınır."),
        fees: "", priceFrom: "" }),
      item({ type: "private", name: L("جامعة باهتشه شهير", "Bahçeşehir University", "Bahçeşehir Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), founded: "1998", image: "", website: "https://bau.edu.tr", featured: true,
        description: L("جامعة خاصة في قلب إسطنبول، معظم برامجها باللغة الإنكليزية.", "A private university in central Istanbul, most programs taught in English.", "İstanbul'un merkezinde, programlarının çoğu İngilizce olan bir vakıf üniversitesi."),
        priceFrom: "6000", fees: "الطب | Medicine | Tıp | 25000\nطب الأسنان | Dentistry | Diş Hekimliği | 20000\nهندسة الحاسوب | Computer Engineering | Bilgisayar Mühendisliği | 7000\nإدارة الأعمال | Business Administration | İşletme | 6000" }),
      item({ type: "private", name: L("جامعة إسطنبول ميديبول", "Istanbul Medipol University", "İstanbul Medipol Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), founded: "2009", image: "", website: "https://www.medipol.edu.tr", featured: true,
        description: L("جامعة خاصة متخصصة في العلوم الصحية ولها مستشفيات جامعية.", "A private university focused on health sciences, with its own university hospitals.", "Sağlık bilimlerine odaklı, kendi üniversite hastaneleri olan bir vakıf üniversitesi."),
        priceFrom: "5000", fees: "الطب | Medicine | Tıp | 28000\nالصيدلة | Pharmacy | Eczacılık | 18000\nالتمريض | Nursing | Hemşirelik | 5000" }),
      item({ type: "private", name: L("جامعة إسطنبول آيدن", "Istanbul Aydın University", "İstanbul Aydın Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), founded: "2007", image: "", website: "https://www.aydin.edu.tr",
        description: L("جامعة خاصة كبيرة بعدد كبير من الطلاب الدوليين وتخصصات متنوعة.", "A large private university with many international students and diverse programs.", "Çok sayıda uluslararası öğrencisi ve çeşitli programları olan büyük bir vakıf üniversitesi."),
        priceFrom: "3500", fees: "الهندسة المدنية | Civil Engineering | İnşaat Mühendisliği | 4500\nالعمارة | Architecture | Mimarlık | 4500\nإدارة الأعمال | Business Administration | İşletme | 3500" }),
      item({ type: "private", name: L("جامعة ألتن باش", "Altınbaş University", "Altınbaş Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), founded: "2008", image: "", website: "https://www.altinbas.edu.tr",
        description: L("جامعة خاصة في إسطنبول بتخصصات طبية وهندسية وقانونية.", "A private university in Istanbul offering medicine, engineering and law.", "Tıp, mühendislik ve hukuk programları sunan bir İstanbul vakıf üniversitesi."),
        priceFrom: "5000", fees: "طب الأسنان | Dentistry | Diş Hekimliği | 19000\nالحقوق | Law | Hukuk | 7000\nهندسة البرمجيات | Software Engineering | Yazılım Mühendisliği | 6000" }),
      item({ type: "private", name: L("جامعة أوسكودار", "Üsküdar University", "Üsküdar Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), founded: "2011", image: "", website: "https://uskudar.edu.tr",
        description: L("جامعة خاصة معروفة بعلم النفس والعلوم الصحية.", "A private university known for psychology and health sciences.", "Psikoloji ve sağlık bilimleriyle tanınan bir vakıf üniversitesi."),
        priceFrom: "4000", fees: "علم النفس | Psychology | Psikoloji | 5000\nالعلاج الطبيعي | Physiotherapy | Fizyoterapi | 4500" }),
    ],

    services: [
      item({ icon: "🎓", title: L("القبولات الجامعية", "University admissions", "Üniversite başvuruları"), description: L("التقديم على الجامعات الحكومية والخاصة، ومتابعة الطلب حتى صدور القبول.", "Applying to public and private universities and following up until acceptance.", "Devlet ve vakıf üniversitelerine başvuru ve kabul alınana kadar takip."), price: "0", priceLabel: L("مجاناً للجامعات الخاصة", "Free for private universities", "Vakıf üniversiteleri için ücretsiz") }),
      item({ icon: "🏅", title: L("المنح الدراسية", "Scholarships", "Burslar"), description: L("مساعدتك في التقديم على المنح التركية ومنح الجامعات وتجهيز الملف.", "Help applying for Turkish government and university scholarships and preparing your file.", "Türkiye Bursları ve üniversite burslarına başvuru ve dosya hazırlığında destek."), price: "150", priceLabel: L("", "", "") }),
      item({ icon: "📄", title: L("المعادلة والترجمة", "Equivalency & translation", "Denklik ve tercüme"), description: L("معادلة الشهادة الثانوية، الترجمة المحلفة، والتصديق لدى النوتر.", "High-school diploma equivalency, sworn translation and notary certification.", "Lise diploması denkliği, yeminli tercüme ve noter onayı."), price: "100", priceLabel: L("", "", "") }),
      item({ icon: "🪪", title: L("الإقامة الطلابية", "Student residence permit", "Öğrenci ikamet izni"), description: L("حجز الموعد وتجهيز أوراق الإقامة الطلابية والتأمين الصحي.", "Booking the appointment and preparing residence permit documents and health insurance.", "Randevu alma, ikamet evrakı ve sağlık sigortası hazırlığı."), price: "120", priceLabel: L("", "", "") }),
      item({ icon: "✈️", title: L("الاستقبال والسكن", "Airport pickup & housing", "Karşılama ve konaklama"), description: L("استقبال من المطار ومساعدة في إيجاد سكن طلابي أو شقة.", "Airport pickup and help finding a dormitory or apartment.", "Havalimanı karşılama ve yurt ya da ev bulmada yardım."), price: "80", priceLabel: L("", "", "") }),
      item({ icon: "📝", title: L("امتحانات اليوس والتسجيل", "YÖS exams & registration", "YÖS sınavları ve kayıt"), description: L("التسجيل في امتحانات اليوس الخاصة بالجامعات ومتابعة النتائج.", "Registering for university YÖS exams and following results.", "Üniversite YÖS sınavlarına kayıt ve sonuç takibi."), price: "50", priceLabel: L("", "", "") }),
    ],

    scholarships: [
      item({ title: L("المنحة التركية الحكومية", "Türkiye Scholarships (Türkiye Bursları)", "Türkiye Bursları"), deadline: "", link: "https://www.turkiyeburslari.gov.tr", image: "",
        body: L("منحة حكومية كاملة تشمل الرسوم الدراسية والسكن والراتب الشهري والتأمين الصحي وسنة لغة تركية. التقديم إلكتروني ومرة واحدة في السنة.", "A fully funded government scholarship covering tuition, accommodation, a monthly stipend, health insurance and a Turkish language year. Applications are online, once a year.", "Öğrenim ücreti, konaklama, aylık burs, sağlık sigortası ve bir yıl Türkçe eğitimini kapsayan tam burslu devlet bursu. Başvurular yılda bir kez çevrim içi yapılır.") }),
      item({ title: L("خصومات الجامعات الخاصة", "Private university discounts", "Vakıf üniversitesi indirimleri"), deadline: "", link: "", image: "",
        body: L("كثير من الجامعات الخاصة تقدم خصومات للطلاب الدوليين تصل إلى 50٪ حسب المعدل. نساعدك في الحصول على أفضل خصم متاح.", "Many private universities offer international students discounts of up to 50% based on grades. We help you get the best available discount.", "Birçok vakıf üniversitesi not ortalamasına göre %50'ye varan indirimler sunar. En iyi indirimi almanız için yardımcı oluyoruz.") }),
      item({ title: L("منح التفوق الجامعية", "University merit scholarships", "Üniversite başarı bursları"), deadline: "", link: "", image: "",
        body: L("منح جزئية أو كاملة يقدمها عدد من الجامعات للطلاب المتفوقين في امتحانات اليوس أو السات.", "Partial or full scholarships offered by some universities to students with high YÖS or SAT scores.", "Bazı üniversitelerin YÖS veya SAT'ta başarılı öğrencilere verdiği kısmi ya da tam burslar.") }),
    ],

    calendar: [
      item({ university: L("جامعة إسطنبول", "Istanbul University", "İstanbul Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), regStart: "2026-11-01", regEnd: "2026-11-25", results: L("2026-12-05", "2026-12-05", "2026-12-05"), certificates: L("يوس – سات – ثانوية", "YÖS – SAT – High school", "YÖS – SAT – Lise"), link: "" }),
      item({ university: L("جامعة يلدز التقنية", "Yıldız Technical University", "Yıldız Teknik Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), regStart: "2026-11-05", regEnd: "2026-11-30", results: L("بشكل دوري", "periodically", "dönemsel"), certificates: L("يوس – سات", "YÖS – SAT", "YÖS – SAT"), link: "" }),
      item({ university: L("جامعة مرمرة", "Marmara University", "Marmara Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), regStart: "2026-11-10", regEnd: "2026-12-10", results: L("2026-12-20", "2026-12-20", "2026-12-20"), certificates: L("يوس موحد – ثانوية", "Unified YÖS – High school", "Ortak YÖS – Lise"), link: "" }),
      item({ university: L("جامعة حجة تبة", "Hacettepe University", "Hacettepe Üniversitesi"), city: L("أنقرة", "Ankara", "Ankara"), regStart: "2026-12-01", regEnd: "2026-12-20", results: L("2027-01-10", "2027-01-10", "2027-01-10"), certificates: L("يوس – سات – ثانوية", "YÖS – SAT – High school", "YÖS – SAT – Lise"), link: "" }),
      item({ university: L("جامعة أنقرة", "Ankara University", "Ankara Üniversitesi"), city: L("أنقرة", "Ankara", "Ankara"), regStart: "2027-01-15", regEnd: "2027-02-15", results: L("2027-03-01", "2027-03-01", "2027-03-01"), certificates: L("يوس – ثانوية", "YÖS – High school", "YÖS – Lise"), link: "" }),
      item({ university: L("جامعة إسطنبول التقنية", "Istanbul Technical University", "İstanbul Teknik Üniversitesi"), city: L("إسطنبول", "Istanbul", "İstanbul"), regStart: "2026-09-15", regEnd: "2026-10-15", results: L("2026-10-30", "2026-10-30", "2026-10-30"), certificates: L("سات – ثانوية", "SAT – High school", "SAT – Lise"), link: "" }),
    ],

    articles: [
      item({ category: "news", date: "2026-11-10", image: "", title: L("فتح باب التسجيل للفصل الربيعي في عدد من الجامعات الخاصة", "Spring semester registration opens at several private universities", "Birçok vakıf üniversitesinde bahar dönemi kayıtları açıldı"),
        body: L("أعلنت عدة جامعات خاصة في إسطنبول عن فتح التسجيل للفصل الربيعي. تواصل معنا لمعرفة التخصصات المتاحة والخصومات.", "Several private universities in Istanbul have opened registration for the spring semester. Contact us for available programs and discounts.", "İstanbul'daki birçok vakıf üniversitesi bahar dönemi kayıtlarını açtı. Mevcut programlar ve indirimler için bize ulaşın.") }),
      item({ category: "guide", date: "2026-11-05", image: "", title: L("خطوات التقديم على الجامعات التركية", "How to apply to Turkish universities", "Türk üniversitelerine nasıl başvurulur"),
        body: L("١. اختيار التخصص والجامعة المناسبة لمعدلك وميزانيتك.\n\n٢. تجهيز الأوراق: جواز السفر، الشهادة الثانوية وكشف العلامات مترجمة، صورة شخصية.\n\n٣. التقديم على الجامعة أو على امتحان اليوس إن كانت تطلبه.\n\n٤. استلام القبول ودفع الرسوم.\n\n٥. الحصول على الفيزا ثم الإقامة الطلابية بعد الوصول.", "1. Choose the program and university that fit your grades and budget.\n\n2. Prepare documents: passport, translated high-school diploma and transcript, a photo.\n\n3. Apply to the university, or to its YÖS exam if required.\n\n4. Receive your acceptance and pay the fees.\n\n5. Get your visa, then your student residence permit after arrival.", "1. Not ortalamanıza ve bütçenize uygun bölümü ve üniversiteyi seçin.\n\n2. Belgeleri hazırlayın: pasaport, tercüme edilmiş lise diploması ve transkript, fotoğraf.\n\n3. Üniversiteye ya da gerekiyorsa YÖS sınavına başvurun.\n\n4. Kabul belgenizi alın ve ücreti ödeyin.\n\n5. Vize alın, geldikten sonra öğrenci ikamet izninizi çıkarın.") }),
      item({ category: "guide", date: "2026-11-01", image: "", title: L("الأوراق المطلوبة للإقامة الطلابية", "Documents needed for a student residence permit", "Öğrenci ikamet izni için gerekli belgeler"),
        body: L("تحتاج عادة إلى: جواز سفر ساري، وثيقة طالب من الجامعة، صور شخصية، تأمين صحي، وعنوان سكن مسجل. نتولى عنك حجز الموعد وتجهيز الملف.", "You usually need: a valid passport, a student certificate from your university, photos, health insurance and a registered address. We book the appointment and prepare the file for you.", "Genellikle gerekenler: geçerli pasaport, üniversiteden öğrenci belgesi, fotoğraf, sağlık sigortası ve kayıtlı adres. Randevuyu ve dosyayı sizin için hazırlıyoruz.") }),
      item({ category: "exams", date: "2026-10-28", image: "", title: L("ما هو امتحان اليوس؟", "What is the YÖS exam?", "YÖS sınavı nedir?"),
        body: L("اليوس امتحان تجريه كل جامعة تركية بشكل مستقل لقبول الطلاب الأجانب، ويقيس عادة مهارات الرياضيات والمنطق. بعض الجامعات تقبل السات أو الشهادة الثانوية مباشرة.", "YÖS is an exam held independently by each Turkish university to admit international students, usually testing maths and reasoning. Some universities accept SAT or the high-school diploma directly.", "YÖS, her Türk üniversitesinin yabancı öğrenci kabulü için ayrı yaptığı, genellikle matematik ve mantık ölçen bir sınavdır. Bazı üniversiteler SAT veya lise diplomasını doğrudan kabul eder.") }),
    ],

    faqs: [
      item({ q: L("هل يمكن الدراسة في تركيا باللغة الإنكليزية؟", "Can I study in English in Türkiye?", "Türkiye'de İngilizce okuyabilir miyim?"), a: L("نعم، كثير من الجامعات خاصة الخاصة منها تقدم برامج كاملة بالإنكليزية.", "Yes. Many universities, especially private ones, offer full programs in English.", "Evet. Özellikle vakıf üniversiteleri olmak üzere birçok üniversite tamamen İngilizce programlar sunar.") }),
      item({ q: L("هل خدمة التقديم مجانية؟", "Is the application service free?", "Başvuru hizmeti ücretsiz mi?"), a: L("التقديم على الجامعات الخاصة مجاني غالباً. باقي الخدمات أسعارها موضحة في صفحة الخدمات.", "Applying to private universities is usually free. Prices for other services are listed on the services page.", "Vakıf üniversitelerine başvuru genellikle ücretsizdir. Diğer hizmetlerin fiyatları hizmetler sayfasında yer alır.") }),
      item({ q: L("هل أحتاج لغة تركية؟", "Do I need to speak Turkish?", "Türkçe bilmem gerekiyor mu?"), a: L("للبرامج التركية تحتاج شهادة لغة أو سنة تحضيرية. للبرامج الإنكليزية تحتاج شهادة إنكليزي أو امتحان الجامعة.", "For Turkish-taught programs you need a language certificate or a preparatory year. For English programs you need an English certificate or the university's test.", "Türkçe programlar için dil belgesi veya hazırlık yılı, İngilizce programlar için İngilizce belgesi veya üniversitenin sınavı gerekir.") }),
      item({ q: L("كم يستغرق صدور القبول؟", "How long does acceptance take?", "Kabul ne kadar sürer?"), a: L("في الجامعات الخاصة من يومين إلى أسبوعين عادة، وفي الحكومية حسب موعد المفاضلة.", "Private universities usually take two days to two weeks; public universities depend on their admission round.", "Vakıf üniversitelerinde genellikle iki gün ile iki hafta; devlet üniversitelerinde başvuru dönemine bağlıdır.") }),
    ],
  },

  applications: [],
};

// Extra details shown on each university page (examples, edit them in the admin panel)
const REQ = L(
  "صورة جواز السفر\nالشهادة الثانوية مترجمة ومصدّقة\nكشف العلامات\nصورة شخصية\nنتيجة اليوس أو السات (حسب الجامعة)\nشهادة لغة إن وجدت",
  "Passport copy\nTranslated and certified high-school diploma\nTranscript\nPersonal photo\nYÖS or SAT result (depending on the university)\nLanguage certificate if available",
  "Pasaport fotokopisi\nTercüme ve onaylı lise diploması\nTranskript\nVesikalık fotoğraf\nYÖS veya SAT sonucu (üniversiteye göre)\nVarsa dil belgesi"
);
const PROGRAMS = {
  gov: L("الطب\nطب الأسنان\nالصيدلة\nالهندسة المدنية\nهندسة الحاسوب\nالهندسة الكهربائية\nالعمارة\nإدارة الأعمال\nالاقتصاد\nالحقوق",
    "Medicine\nDentistry\nPharmacy\nCivil Engineering\nComputer Engineering\nElectrical Engineering\nArchitecture\nBusiness Administration\nEconomics\nLaw",
    "Tıp\nDiş Hekimliği\nEczacılık\nİnşaat Mühendisliği\nBilgisayar Mühendisliği\nElektrik Mühendisliği\nMimarlık\nİşletme\nİktisat\nHukuk"),
  private: L("الطب\nطب الأسنان\nالصيدلة\nهندسة الحاسوب\nهندسة البرمجيات\nالعمارة\nإدارة الأعمال\nعلم النفس\nالتمريض",
    "Medicine\nDentistry\nPharmacy\nComputer Engineering\nSoftware Engineering\nArchitecture\nBusiness Administration\nPsychology\nNursing",
    "Tıp\nDiş Hekimliği\nEczacılık\nBilgisayar Mühendisliği\nYazılım Mühendisliği\nMimarlık\nİşletme\nPsikoloji\nHemşirelik"),
};
for (const u of SEED.content.universities) {
  u.requirements = u.requirements || REQ;
  u.programs = u.programs || PROGRAMS[u.type];
  u.teachingLang = u.teachingLang || (u.type === "gov" ? L("التركية – الإنكليزية", "Turkish – English", "Türkçe – İngilizce") : L("الإنكليزية – التركية", "English – Turkish", "İngilizce – Türkçe"));
  u.cover = u.cover || "";
}
