export const ANNUAL_NAV: readonly { id: string; label: string }[] = [
  { id: "start", label: "آغاز" },
  { id: "preface", label: "پیش‌گفتار" },
  { id: "glance", label: "یک نگاه" },
  { id: "path", label: "رشد تا پایداری" },
  { id: "csr", label: "همراهی" },
  { id: "users", label: "کاربران" },
  { id: "products", label: "محصولات" },
  { id: "partners", label: "برندها" },
  { id: "ops", label: "عملیات" },
] as const;

export const ANNUAL_HERO = {
  kicker: "گزارش سال ۱۴۰۴ خانومی",
  title: "سال حرکت در مسیر پایداری",
  cta: "شروع مطالعه",
  prefaceLabel: "پیش‌گفتار",
  paragraphs: [
    "وقتی همه‌چیز تو را به توقف فرامی‌خواند، حرکت کردن می‌تواند ملموس‌ترین نشانه حیات باشد؛ اینکه با آهنگی کُند هم بتوانی قدم برداری، از میان انتخاب‌های محدود، اثرگذارترین را برگزینی، اولویت‌هایت را از نو تنظیم کنی، از خودت و دیگران مراقبت کنی و راهی برای ادامه‌دادن پیدا کنی.",
    "۱۴۰۴ از همان زمان‌هایی بود که ما را به فکر کردن درباره همین نشانه‌ها واداشت. در میانه تعلیق و اضطراب، مسئله این نبود که چگونه بی‌وقفه پیش برویم؛ مسئله این بود که چگونه از آنچه در گذر زمان ساخته‌ایم مراقبت کنیم و خود را برای قدم‌برداشتن در فضایی آماده‌تر کنیم که هیچ چیز در آن قابل پیش‌بینی نیست.",
    "اگر سال‌های نخست خانومی، سال‌های ساختن و به بلوغ‌ رسیدن بود، یازده سالگی آن سرآغاز فصل تازه‌ای شد به‌نام فصل پایداری. پایداری نه به معنای ایستادن در برابر تغییر بلکه خلق ظرفیت‌‌هایی پویا برای حفظ ریتم حرکت درجهت سودآوری و بهره‌وری.",
    "این گزارش، روایتی است از قدم‌های خانومی در مسیر پایداری.",
  ],
};

export const GLANCE = {
  title: "خانومی ۱۴۰۴ در یک نگاه",
  kpis: [
    {
      label: "سرمایه انسانی",
      value: "۳۰۰+",
      unit: "نفر",
      icon: "/assets/annual/glance/hr-resources.svg",
    },
    {
      label: "سهم زنان در مدیریت",
      value: "۴۰",
      unit: "درصد",
      icon: "/assets/annual/glance/females-managers.svg",
    },
    {
      label: "تعداد کاربران یکتا",
      value: "۳٬۲۰۰٬۰۰۰+",
      unit: "نفر",
      icon: "/assets/annual/glance/uniqe-employees.svg",
    },
    {
      label: "نرخ رشد تعداد کالاهای فروخته‌شده:",
      value: "۲۳",
      unit: "درصد",
      icon: "/assets/annual/glance/increased-sales.svg",
    },
    {
      label: "تنوع کالایی",
      value: "۵۰٬۰۰۰+",
      unit: "",
      icon: "/assets/annual/glance/product-variations.svg",
    },
    {
      label: "برندها",
      value: "۱٬۴۰۰+",
      unit: "",
      icon: "/assets/annual/glance/brands.svg",
    },
  ],
  salesLead: "نرخ رشد فروش:",
  salesNote: "۸۳ درصد؛ ۳۵ واحد درصد بالاتر از نرخ تورم",
  salesLine: "نرخ رشد فروش: ۸۳ درصد؛ ۳۵ واحد درصد بالاتر از نرخ تورم",
};

export const PATH = {
  title: "از رشد تا پایداری؛ پنجره‌ای به‌سوی ۱۴۰۲ تا ۱۴۰۴ خانومی",
  years: [
    { year: "۱۴۰۲", title: "Scale-up" },
    { year: "۱۴۰۳", title: "گذار" },
    { year: "۱۴۰۴", title: "در مسیر پایداری" },
  ],
  metrics: [
    {
      label: "حجم فروش:",
      cagr: "۴۰٪",
      value: 40,
      cagrLabel: "نرخ رشد مرکب سالانه:",
      note: "تعداد کالای فروخته‌شده در انتهای این دوره ۲ ساله نزدیک به ۲ برابر شد.",
      icon: "/assets/annual/path/basket.svg",
    },
    {
      label: "وفاداری مشتری:",
      cagr: "۵۷٪",
      value: 57,
      cagrLabel: "میانگین ۳ ساله نرخ بازگشت مشتری:",
      note: "بیش از نیمی از مشتریان دراین دوره ۲ ساله، خرید خود را تکرار کردند.",
      icon: "/assets/annual/path/loyal.svg",
    },
    {
      label: "رشد سودآوری(برمبنای ارزش ریالی مارجین):",
      cagr: "۱۳۰٪",
      value: 130,
      cagrLabel: "نرخ رشد مرکب سالانه:",
      note: "ارزش سودآوری در انتهای این دوره ۲ ساله ۵٫۳ برابر شد.",
      icon: "/assets/annual/path/money.svg",
    },
    {
      label: "فروش:",
      cagr: "۹۰+٪",
      value: 90,
      plus: true,
      cagrLabel: "نرخ رشد مرکب سالانه CAGR:",
      note: "فروش در انتهای این دوره ۲ ساله ۳٫۶ برابر شد.",
      icon: "/assets/annual/path/chart.svg",
    },
  ],
  gender: {
    kicker: "در مسیر ساختن",
    kickerIcon: "/assets/annual/path/inway.svg",
    femaleIcon: "/assets/annual/path/female.svg",
    title: "سهم زنان در مدیریت، بیش از دو برابر میانگین کشور",
    source: "منبع: مرکز آمار ایران؛ سهم زنان از مشاغل مدیریتی کشور در سال‌های اخیر: ۱۵ تا ۱۷٫۸ درصد",
    year: "۱۴۰۴",
    womenPct: 40,
    menPct: 60,
    womenWord: "زن",
    menWord: "مرد",
  },
};

export const CSR = {
  title: "مسئولیت اجتماعی / در مسیر همراهی",
  icon: "/assets/annual/csr/masouliat.svg",
  subtitle: "زنان پیشگام ایران",
  life: {
    title: "زنان پیشگام",
    book: "/assets/annual/csr/life-book-2026.png",
    bookAlt: "کتاب روایت ۵۴ زن پیشگام ایرانی",
    careTitle: "خانومی‌لایف / جایی برای گفت‌وگو",
    careLabel: "مراقبت اجتماعی:",
    careNote: "موضوع پست‌ها: جامعه امن",
    posts: [
      {
        src: "/assets/annual/csr/post-1.jpg",
        alt: "پست اینستاگرام خانومی‌تی‌وی درباره استاندارد دوگانه خشم در محل کار",
      },
      {
        src: "/assets/annual/csr/post-2.jpg",
        alt: "پست اینستاگرام خانومی‌تی‌وی درباره حمایت از قربانیان تجاوز",
      },
      {
        src: "/assets/annual/csr/post-3.jpg",
        alt: "پست اینستاگرام خانومی‌تی‌وی درباره انواع خشونت علیه زنان",
      },
    ],
  },
  business: {
    title: "خانومی بیزینس؛ مرجع صنعت زیبایی",
    bookTitle: "انتشار کتاب «می‌خواهم زیبا بمانم» با همراهی هیدرودرم",
    book: "/assets/annual/csr/biz-book-2026.png",
    bookAlt: "کتاب می‌خواهم زیبا بمانم، راهنمای زیبایی برای زنانی که سرطان دارند",
    reports: [
      {
        lines: ["گزارش ۲۰۲۵", "خاورمیانه"],
        image: "/assets/annual/csr/2024-report.png",
        alt: "گزارش بازار زیبایی خاورمیانه",
      },
      {
        lines: ["گزارش مکنزی"],
        image: "/assets/annual/csr/mckinsey.svg",
        alt: "گزارش مک‌کنزی The State of Fashion: Beauty",
      },
    ],
  },
};

export const USERS = {
  title: "کاربران / در مسیر انتخاب",
  icon: "/assets/annual/users/karbaran.svg",
  growthLead: "نیم‌میلیون نفر",
  growthNote: "به جمع کاربران خانومی اضافه شد.",
  circles: [
    { value: 3_200_995, time: "۱۴۰۴", label: "نفر", color: "#B10069" },
    { value: 2_743_999, time: "۱۴۰۳", label: "نفر", color: "#EC078D" },
    { value: 1_947_279, time: "۱۴۰۲", label: "نفر", color: "#F174AD" },
  ],
  years: [
    { year: "۱۴۰۲", value: "۱٬۹۴۷٬۲۷۹ نفر" },
    { year: "۱۴۰۳", value: "۲٬۷۴۳٬۹۹۹ نفر" },
    { year: "۱۴۰۴", value: "۳٬۲۰۰٬۹۹۵ نفر" },
  ],
  ageTitle: "ترکیب سنی مشتریان",
  ageLead: "از هر ۱۰ کاربر خانومی\nنزدیک به ۸ کاربر\n۲۵ تا ۴۴ ساله هستند.",
  ageFans: [
    { value: 45.6, label: "۲۵–۳۴ سال", percentage: 45.6, color: "#EC078D" },
    { value: 32.1, label: "۳۵ تا ۴۴ سال", percentage: 32.1, color: "#EF5DA2" },
    { value: 12.6, label: "۱۸ تا ۲۴ سال", percentage: 12.6, color: "#F288B7" },
    { value: 7.1, label: "۴۵ تا ۵۴ سال", percentage: 7.1, color: "#F6AECD" },
    { value: 1.9, label: "۵۵ تا ۶۴ سال", percentage: 1.9, color: "#FAD5E6" },
  ],
  ages: [
    { label: "۲۵–۳۴ سال", value: 45.6 },
    { label: "۳۵ تا ۴۴ سال", value: 32.1 },
    { label: "۱۸ تا ۲۴ سال", value: 12.6 },
    { label: "۴۵ تا ۵۴ سال", value: 7.1 },
    { label: "۵۵ تا ۶۴ سال", value: 1.9 },
  ],
  demoNote:
    "۴۱ درصد از جمعیت ایران ۲۵ تا ۴۴ ساله هستند؛ گروهی با سه ویژگی مشترک: درآمد، هویت مصرفی شکل‌گرفته و بیشترین حضور در فضای دیجیتال.",
  demoTitle: "بازار زیبایی آنلاین ایران آیینه هرم جمعیتی کشور",
  golden: {
    title: "روز طلایی ۱۴۰۴ خانومی در یک نگاه",
    date: "۷ آذر",
    photo: "/assets/annual/users/golden-photo.jpg",
    photoAlt: "سه زن در سبد بالن خانومی با جعبه‌های سفارش",
    logo: "/assets/annual/users/black-beauty.png",
    logoAlt: "بلک بیوتی",
    calendarIcon: "/assets/annual/users/calendar-black.svg",
    sales: {
      date: "۷ آذر",
      lead: "فروش",
      value: "۱۴۰",
      unit: "میلیارد تومان",
      tail: "در یک روز",
    },
    best: {
      label: "پرفروش‌ترین روز سال",
      years: [
        { year: "۱۴۰۳", day: "۹ آذر" },
        { year: "۱۴۰۴", day: "۷ آذر" },
      ],
    },
    pieces: {
      lead: "فروش",
      value: "۱٫۵",
      unit: "میلیون",
      tail: "قطعه کالا",
    },
    growth: {
      value: "۱۲۰",
      unit: "درصد",
      label: "رشد فروش",
    },
    campaignLines: ["روزهای کمپین", "بلک بیوتی:"],
    stats: [
      "فروش ۱۴۰ میلیارد تومان در یک روز",
      "فروش ۱٫۵ میلیون قطعه کالا",
      "۱۲۰ درصد رشد فروش",
    ],
    campaign: "روزهای کمپین بلک بیوتی: پرفروش‌ترین روز سال",
    compare: "۱۴۰۳: ۹ آذر  |  ۱۴۰۴: ۷ آذر",
  },
  time: {
    title: "توسعه زمانی بازار",
    lead: "بازار آنلاین، تنها دسترسی مکانی را توسعه نداده؛ زمان دسترسی به بازار را نیز گسترش داده است.",
    peakLabel: "پرفروش‌ترین روز هفته:",
    peakBefore: "از ",
    peakFrom: "دوشنبه‌ها",
    peakMid: " رسید به ",
    peakTo: "جمعه‌ها",
    peakNote: "اوج خرید در خانومی روزهای جمعه است و ۲۱ تا ۰۰ شب.",
    winter: "وقتی اسفند شبیه اسفند نبود.",
    newspaper: "/assets/annual/users/newspaper-mockup.png",
    newspaperAlt: "روزنامه شرق با عنوان سه روزی که خاورمیانه لرزید",
    calendarIcon: "/assets/annual/users/calendar.svg",
    peakCalendarIcon: "/assets/annual/users/calendar-frosh.svg",
    womanIcon: "/assets/annual/users/woman.svg",
    quietLabel: "کم‌فروش‌ترین روز سال:",
    quietDays: [
      { year: "۱۴۰۳", day: "۱ فروردین" },
      { year: "۱۴۰۴", day: "۱۰ اسفند" },
    ],
    winterNote: "زمستان، بخشی از سهم هرساله‌اش را از دست داد.",
    peak: "پرفروش‌ترین روز هفته: از دوشنبه‌ها رسید به جمعه‌ها",
    quiet: "کم‌فروش‌ترین روز سال: ۱۴۰۳: ۱ فروردین  |  ۱۴۰۴: ۱۰ اسفند",
  },
  geo: {
    title: "تمرکز تقاضا",
    note: "از هر هزار سفارش بیش از ۶۰۰ سفارش راهی استان‌های غیر از تهران شد.",
    otherLabel: "سهم سایر استان‌ها",
    tehranLabel: "سهم تهران",
    otherColor: "#a60062",
    tehranColor: "#EDEDED",
    years: [
      { year: "۱۴۰۳", tehran: 40, other: 60 },
      { year: "۱۴۰۴", tehran: 38, other: 62 },
    ],
    y1403: { tehran: 40, other: 60 },
    y1404: { tehran: 38, other: 62 },
  },
};

export const PRODUCTS = {
  title: "محصولات / در مسیر انتخاب",
  icon: "/assets/annual/products/mahsoulat-fasl.svg",
  mixTitle: "سهم از فروش ریالی هر گروه کالایی",
  mixLead: "ترکیب انتخاب‌ها",
  careNote: "مراقبتی = بهداشتی + سلامت",
  careShare: "۷۷ درصد سهم بازار در دست مراقبتی‌هاست.",
  weightTitle: "وزن بازار ۱۴۰۴",
  mix: {
    lead: "ترکیب انتخاب‌ها",
    caption: "سهم از فروش ریالی هر گروه کالایی",
    careNote: "مراقبتی = بهداشتی + سلامت",
    careIcon: "/assets/annual/products/marks/behdasht-va-salamt.svg",
    careTrend: [
      { year: "۱۴۰۲", value: 72.5 },
      { year: "۱۴۰۳", value: 75.7 },
      { year: "۱۴۰۴", value: 77.2 },
    ],
    weightTitle: "وزن بازار:",
    weightHighlight: "۷۷ درصد",
    weightMid: " سهم بازار در دست ",
    weightCare: "مراقبتی",
    weightTail: "‌هاست.",
    weightYear: "۱۴۰۴",
    weightSlices: [
      {
        id: "care",
        label: "بهداشتی و مراقبتی",
        shortLabel: "مراقبتی",
        value: 77.2,
        color: "#c2186a",
        rim: "#7a0048",
        iconTone: "white",
        icon: "/assets/annual/products/marks/care-combo.svg",
      },
      {
        id: "makeup",
        label: "آرایشی",
        value: 12.7,
        color: "#EC078D",
        rim: "#b00068",
        iconTone: "white",
        icon: "/assets/annual/products/marks/makeup.svg",
      },
      {
        id: "perfume",
        label: "عطر",
        value: 4,
        color: "#f48fb1",
        rim: "#e91e8c",
        iconTone: "pink",
        icon: "/assets/annual/products/marks/perfume.svg",
      },
      {
        id: "electric",
        label: "برقی",
        value: 3.9,
        color: "#f8b8d4",
        rim: "#f06292",
        iconTone: "pink",
        icon: "/assets/annual/products/marks/electric.svg",
      },
      {
        id: "gold",
        label: "طلا",
        value: 1.28,
        color: "#fce4ec",
        rim: "#f48fb1",
        iconTone: "pink",
        icon: "/assets/annual/products/marks/gold.svg",
      },
    ] as const,
    categories: {
      makeup: {
        label: "آرایشی",
        icon: "/assets/annual/products/marks/makeup.svg",
        values: [23.2, 15.1, 12.7] as const,
      },
      hygiene: {
        label: "بهداشتی",
        icon: "/assets/annual/products/marks/hygiene.svg",
        values: [72.4, 65.4, 54] as const,
      },
      electric: {
        label: "برقی",
        icon: "/assets/annual/products/marks/electric.svg",
        values: [0.2, 4.7, 3.9] as const,
      },
      health: {
        label: "سلامت",
        icon: "/assets/annual/products/marks/health.svg",
        values: [0.1, 10.7, 23.2] as const,
      },
      perfume: {
        label: "عطر",
        icon: "/assets/annual/products/marks/perfume.svg",
        values: [4.1, 4.1, 4] as const,
      },
      gold: {
        label: "طلا",
        icon: "/assets/annual/products/marks/gold.svg",
        single: { year: "۱۴۰۴", value: 1.28 },
      },
    },
  },
  skin: {
    title: "سهم مراقبت پوست از بازار زیبایی: ایران، کره و خاورمیانه",
    insight: "زنان بیش از تغییرات ظاهری، روی زیبایی ماندگار سرمایه‌گذاری کردند.",
    rows: [
      { market: "کره جنوبی", share: 46.8, rank: "سهم اول بازار" },
      { market: "ایران (جامعه آماری کاربران خانومی)", share: 41.0, rank: "سهم اول بازار" },
      { market: "خاورمیانه و شمال آفریقا", share: 23.6, rank: "سهم سوم بازار" },
    ],
  },
  spend: {
    title: "اولویت هزینه‌کردها در خانومی",
    lead: "زنان بیش از تغییرات ظاهری، روی زیبایی ماندگار سرمایه‌گذاری کردند.",
    items: [
      {
        rank: "۱",
        title: "محافظت",
        text: "ضدآفتاب در رتبه یک فروش",
        icon: "/assets/annual/products/spend/protect.svg",
      },
      {
        rank: "۲",
        title: "مراقبت",
        text: "آبرسان در رتبه دوم فروش؛ شوینده صورت در رتبه سوم فروش",
        icon: "/assets/annual/products/spend/care.svg",
      },
      {
        rank: "۳",
        title: "تقویت",
        text: "مکمل پوست، ناخن و مو در رتبه چهارم فروش",
        icon: "/assets/annual/products/spend/boost.svg",
      },
      {
        rank: "۴",
        title: "ترمیم",
        text: "ماسک مو در رتبه ۱۰ فروش",
        icon: "/assets/annual/products/spend/repair.svg",
      },
      {
        rank: "۵",
        title: "آرایش",
        text: "ریمل در رتبه ۱۲ فروش",
        icon: "/assets/annual/products/spend/makeup.svg",
      },
    ],
    footnote: "*سایر رتبه‌ها در میان ۱۲ دسته کالایی پرفروش مربوط به دیگر محصولات گروه سلامت است.",
    sunIcon: "/assets/annual/products/spend/sunscreen.svg",
    sunTitle: "نفوذ مصرفی",
    sunStats: [
      { label: "بزرگ‌ترین سهم از فروش ریالی", value: "دسته ضدآفتاب‌ها" },
      { label: "سهم از کل فروش ریالی", value: "۱۱ درصد" },
      { label: "سهم از کل دسته مراقبت صورت", value: "۴۲ درصد" },
    ],
    sunNote:
      "ضدآفتاب دیگر فقط یک محصول فصلی نیست، تبدیل به عادت مصرفی شده: از هر ۱۰ تومان هزینه‌کرد برای مراقبت از پوست، بیش از ۴ تومان به ضدآفتاب اختصاص داشت.",
  },
  makeup: {
    title: "اولویت‌های آرایشی در ایران (جامعه آماری کاربران خانومی)",
    subtitle: "پرفروش‌ترین محصولات آرایشی در خانومی:",
    iran: [
      { label: "ریمل", icon: "/assets/annual/products/makeup-icons/mascara.svg" },
      { label: "رژ لب", icon: "/assets/annual/products/makeup-icons/lipstick.svg" },
      { label: "مداد و خط چشم", icon: "/assets/annual/products/makeup-icons/eyeliner.svg" },
      { label: "کرم پودر", icon: "/assets/annual/products/makeup-icons/foundation.svg" },
      { label: "صابون و ژل ابرو", icon: "/assets/annual/products/makeup-icons/brows.svg" },
    ],
    koreaTitle: "پرفروش‌ترین آرایشی‌های کره جنوبی (K-Beauty) ۲۰۲۵",
    korea: ["رژ لب tint (سبک MLBB)", "کرم‌پودر cushion", "رژ گونه", "ریمل و خط چشم", "محصولات ابرو"],
    menaTitle: "پرفروش‌ترین آرایشی‌های خاورمیانه ۲۰۲۵",
    mena: ["محصولات چشم (خط چشم، سایه، ریمل)", "رژ لب", "کرم‌پودر", "رژ گونه و هایلایتر", "محصولات ابرو"],
    compare:
      "هر سه بازار محصولات چشم و لب را در صدر اولویت قرار داده‌اند، اما ایران و کره به سمت ظاهر طبیعی‌تر حرکت کرده‌اند و خاورمیانه تأکید بیشتری روی آرایش چشم و رنگ دارد.",
  },
  pay: {
    title: "محبوب‌ترین روش پرداخت: الان بخر، بعداً پرداخت کن.",
    note: "مجموع سفارش‌ها با سرویس پرداخت قسطی نسبت به سال قبل ۲۵ درصد بیشتر شد.",
    icon: "/assets/annual/products/pay/badan.svg",
    noteIcon: "/assets/annual/products/pay/roshd-frosh.svg",
  },
  basket: {
    title: "عمق سبد خرید",
    lead: "هزینه‌ها بیشتر شد؛ سبد مراقبت کوچک‌تر نشد.",
    rows: [
      {
        label: "میانگین ارزش هر سفارش",
        icon: "order",
        bars: { y1403: 69, y1404: 100 },
        growthValue: "۵۴+٪",
        growthKind: "percent",
      },
      {
        label: "میانگین ارزش هر قلم کالا",
        icon: "item",
        bars: { y1403: 65, y1404: 100 },
        growthValue: "۳۹+٪",
        growthKind: "percent",
      },
      {
        label: "میانگین تعداد کالا در هر سفارش",
        icon: "count",
        bars: { y1403: 84, y1404: 100 },
        growthValue: "تقریباً یک قلم کالا بیشتر",
        growthKind: "text",
      },
    ] as const,
  },
};

export const PARTNERS = {
  title: "تولیدکنندگان / در مسیر رشد مشترک",
  brandsNote: {
    before: "اضافه شدن ",
    highlight: "۲۶۵",
    after: " برند جدید",
  },
  brands: [
    { year: "۱۴۰۲", count: 995 },
    { year: "۱۴۰۳", count: 1150 },
    { year: "۱۴۰۴", count: 1415 },
  ],
  ads: {
    title: "Beauty Ads",
    body: "Beauty Ads آژانس تبلیغات هدفمند خانومی است که به برندها کمک می‌کند فروش، جذب مشتری و اثربخشی کمپین‌های خود را افزایش دهند.",
    engine: "تبلیغات، به موتور رشد برندها تبدیل شد.",
    roi: "بازگشت سرمایه (ROI): ۲۳۰٪",
    spend:
      "هر ۱۰۰ میلیون تومان سرمایه‌گذاری تبلیغاتی، به‌طور متوسط ۲۳۰ میلیون تومان فروش بیشتر ایجاد کرد.",
    stats: [
      {
        value: "۵۰+٪",
        label: "رشد مشتری",
        detail:
          "برندهای مشارکت‌کننده در کمپین‌ها، به‌طور متوسط ۵۷ درصد رشد در جذب مشتری را تجربه کردند.",
        icon: "/assets/annual/partners/costumer.svg",
      },
      {
        value: "۱۲۱+٪",
        label: "رشد فروش محصول",
        detail:
          "فروش تعدادی محصولات برندهای مشارکت‌کننده، در طول کمپین‌ها به‌طور متوسط ۱۲۱ درصد افزایش یافت.",
        icon: "/assets/annual/partners/mahsol.svg",
      },
    ],
  },
  local: {
    title: "برندهای ایرانی، به گزینه‌های اصلی انتخاب مشتریان تبدیل شدند.",
    careTitle: "۵ برند محبوب مراقبتی",
    care: ["یورویتال", "پرایم", "ویتالایر", "هیدرودرم", "سریتا"],
    makeupTitle: "۵ برند محبوب آرایشی",
    makeup: ["کالیستا", "کامفیز", "دیفکتو", "مای", "سریتا"],
  },
};

export const OPS = {
  title: "عملیات و پشتیبانی / در مسیر رسیدن",
  waiting: {
    title: "بسته در انتظار حرکت",
    lead: "پشت انتخاب‌ها، جایی برای ۱۰ میلیون کالا وجود داشت.",
    stats: [
      { value: "۱۰ میلیون کالا", label: "تعداد کالاهای پردازش‌شده سال" },
      { value: "۲ میلیون", label: "سفارش پردازش‌شده" },
      { value: "۸ ساعت", label: "عملیات روزانه" },
      { value: "۳۱۲ روز", label: "کاری" },
    ],
    minute: "در هر یک دقیقه سال به‌طور میانگین ۱۳ سفارش پردازش شد.",
    far: "دورترین مقصد: نیک‌شهر، سیستان و بلوچستان — ۱٬۶۶۰ کیلومتر از مرکز پردازش",
  },
  shipping: {
    title: "بسته در راه",
    returnsTitle: "نرخ مرجوعی کالا",
    returnsNote: "از هر ۱۰ هزار کالا، فقط ۷ کالا برگشت خورد",
    locker: "گنجه‌های خانومی به شبکه تحویل سفارش‌ها اضافه شدند",
    lockerStats: [
      "۴۲ گنجه و گنجه‌دار فعال در تهران",
      "۲۰,۳۱۰ سفارش تحویل‌شده",
    ],
    otdTitle: "شاخص ارسال به‌موقع (OTD)",
    otdNote: "از هر ۱۰۰ سفارش ۹۵ سفارش به‌موقع رسید",
    otd1403: "۹۲٪",
    otd1404: "۹۵٪",
  },
  special: {
    title: "همراه با گزارش ویژه «۲ جنگ و یک اینترنت خاموش»",
    cta: "مطالعه گزارش جنگ",
    href: "/war",
  },
};

export const ANNUAL_FOOTER = {
  brand: "خانومی",
  line: "گزارش سال ۱۴۰۴ — سال حرکت در مسیر پایداری",
};
