import type { IconName } from '../components/ui/Icon';

export type ProductId = 'cooling-pack' | 'magnetic-holder' | 'car-vacuum';

export interface ProductOffer {
  quantity: 1 | 2 | 3;
  price: number;
  compareAt?: number;
  label: string;
  sublabel?: string;
  badge?: string;
  perks: string[];
}

export interface TrustBadge {
  icon: IconName;
  title: string;
  subtitle: string;
}

export interface GuaranteeItem {
  icon: IconName;
  title: string;
  subtitle: string;
}

export interface ValueProp {
  icon: IconName;
  title: string;
  text: string;
}

export interface ProductSection {
  eyebrow?: string;
  title: string;
  body: string;
  bullets?: string[];
  imageLabel: string;
  /** Optional section photo override e.g. /images/name.webp */
  image?: string;
}

export interface HowToUseStep {
  title: string;
  body: string;
}

export interface HowToUse {
  title: string;
  steps: HowToUseStep[];
}

export interface Product {
  id: ProductId;
  sku: string;
  slug: string;
  href: string;
  nameAr: string;
  nameEn: string;
  category: string;
  icon: IconName;
  tagline: string;
  metaDescription: string;
  rating: number;
  reviewCount: number;
  unit: string;
  soldText: string;
  scarcityText: string;
  /** How many units remain — shown as urgency indicator in hero */
  stockLeft: number;
  /** Delivery estimate shown in hero e.g. "الجمعة أو السبت" */
  deliveryDays: string;
  checkoutHeadline: string;
  checkoutDescription: string;
  highlights: string[];
  valueProps: ValueProp[];
  trustBadges: TrustBadge[];
  guarantees: GuaranteeItem[];
  offers: ProductOffer[];
  galleryLabels: string[];
  /** Public paths e.g. /images/pack.webp — when set, hero shows a selectable gallery */
  galleryImages?: string[];
  /** Public path e.g. /images/pack.webp */
  image?: string;
  pain: ProductSection;
  logic: ProductSection;
  proof: ProductSection;
  howItWorks: ProductSection;
  howToUse: HowToUse;
  faqs: { q: string; a: string }[];
  reviews: {
    name: string;
    city: string;
    rating: number;
    date: string;
    text: string;
  }[];
}

export const WARRANTY_DAYS = 30;
export const CURRENCY = 'درهم';

export const STORE = {
  nameAr: 'بويا شوب',
  nameEn: 'BOYA SHOP',
  tagline: 'إكسسوارات سيارات مختارة بعناية',
  phone: '+212 6 00 00 00 00',
  whatsapp: '+212600000000',
  email: 'support@boyashop.store',
};

export const STORE_PROOF = {
  customers: '12,000+',
  rating: '4.9',
  reviews: '1,560+',
  delivery: '24–48 ساعة',
  warranty: `${WARRANTY_DAYS} يوم`,
};

/** Card-style trust badges above footer (all pages) */
export const STORE_TRUST_BADGES: TrustBadge[] = [
  { icon: 'truck', title: STORE_PROOF.delivery, subtitle: 'توصيل سريع' },
  { icon: 'star', title: `${STORE_PROOF.rating}/5`, subtitle: `${STORE_PROOF.reviews} تقييم` },
  { icon: 'shield', title: STORE_PROOF.warranty, subtitle: 'ضمان كامل' },
  { icon: 'badge', title: '100% أصلي', subtitle: 'جودة مفحوصة' },
];

/** Simple trust band (product page below CTA) */
export const STORE_TRUST_BAND: { icon: IconName; text: string; sub: string }[] = [
  { icon: 'wallet', text: 'دفع عند الاستلام', sub: 'ما كتخلّص حتى توصلك السلعة' },
  { icon: 'truck', text: 'توصيل 24–48 ساعة', sub: 'لكل مدن المغرب بدون استثناء' },
  { icon: 'refresh', text: `استرجاع ${WARRANTY_DAYS} يوم`, sub: 'فلوسك راجعة بلا أسئلة' },
  { icon: 'shield', text: 'جودة مضمونة', sub: 'كل منتج مفحوص قبل التصيفط' },
];

export const SHARED_GUARANTEES: GuaranteeItem[] = [
  { icon: 'wallet', title: 'الدفع عند الاستلام', subtitle: 'تخلّص ملي توصلك السلعة' },
  { icon: 'truck', title: 'توصيل 24–48 ساعة', subtitle: 'لكل مدن المغرب' },
  { icon: 'refresh', title: `استرجاع ${WARRANTY_DAYS} يوم`, subtitle: 'فلوسك راجعة بلا أسئلة' },
  { icon: 'whatsapp', title: 'دعم بالدارجة', subtitle: 'فريق مغربي قبل وبعد الطلب' },
];

export const products: Record<ProductId, Product> = {
  'cooling-pack': {
    id: 'cooling-pack',
    sku: 'BOYA-CP-2847',
    slug: 'pack',
    href: '/product/pack',
    nameAr: 'باك الحماية من سخونة السيارة',
    nameEn: 'Car Heat Protection Pack',
    category: 'تبريد وحماية',
    icon: 'fan',
    tagline: 'مروحة مزدوجة + مظلة حرارية — برّد طوموبيلك بلا ما تحرق يديك.',
    metaDescription:
      'باك الحماية من سخونة السيارة من بويا شوب: مروحة مزدوجة قوية + مظلة حرارية. برّد طوموبيلك ف دقائق. دفع عند الاستلام، ضمان 30 يوم، توصيل سريع. من 199 درهم.',
    rating: 4.9,
    reviewCount: 920,
    unit: 'باك',
    soldText: 'تباع +2,400 باك هاد الشهر',
    scarcityText: 'بقات غير 12 الحبة في المخزون',
    stockLeft: 9,
    deliveryDays: 'الجمعة أو السبت',
    checkoutHeadline: 'طوموبيلتك كتسخن فالصيف؟ الباك هو الحل!',
    checkoutDescription: 'اكتشف "باك الانتعاش المزدوج" لسيارة باردة ومحمية من أول دقيقة',
    highlights: [
      'حرارة السيارة كتهبط بشكل ملحوظ',
      'تركيب سهل و سريع',
      'مروحة مزدوجة + مظلة حرارية ف باك واحد',
    ],
    valueProps: [
      { icon: 'fan', title: 'تبريد سريع', text: 'مروحة مزدوجة كتجدّد الهواء بسرعة' },
      { icon: 'shield', title: 'حجب حراري', text: 'المظلة كترجع الشمس قبل ما تسخّن' },
      { icon: 'clock', title: 'تركيب فوري', text: 'جاهز للاستعمال ف ثواني' },
      { icon: 'leaf', title: 'راحة دائمة', text: 'أقل ضغط على المكيف والبنزين' },
    ],
    trustBadges: [
      { icon: 'badge', title: 'أصلي 100%', subtitle: 'جودة مفحوصة' },
      { icon: 'shield', title: `${WARRANTY_DAYS} يوم`, subtitle: 'ضمان كامل' },
      { icon: 'star', title: '4.9/5', subtitle: '920+ تقييم' },
      { icon: 'truck', title: '24–48 ساعة', subtitle: 'توصيل سريع' },
    ],
    guarantees: SHARED_GUARANTEES,
    offers: [
      {
        quantity: 1,
        price: 199,
        label: 'باك واحد',
        sublabel: 'تجربة الحماية لطوموبيل واحدة',
        perks: ['مروحة مزدوجة + مظلة حرارية', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
      {
        quantity: 2,
        price: 279,
        compareAt: 398,
        label: 'باكان',
        sublabel: 'وحدة ليك ووحدة لعائلتك',
        badge: 'الأكثر مبيعاً',
        perks: ['مروحتان + مظلتان', 'توفير 119 درهم', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
      {
        quantity: 3,
        price: 349,
        compareAt: 597,
        label: '3 باكات',
        sublabel: 'الأفضل للعائلة وللهدايا',
        badge: 'أقصى توفير',
        perks: ['3 باكات كاملة', 'توفير 248 درهم', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
    ],
    galleryLabels: ['الباك كامل', 'المروحة المزدوجة', 'المظلة الحرارية', 'التركيب', 'داخل الطوموبيل'],
    image: '/images/pack.webp',
    howToUse: {
      title: 'كيفاش تستعمل الباك',
      steps: [
        {
          title: 'ركّب المظلة على الزجاج الأمامي',
          body: 'افتح المظلة الحرارية وثبّتها على الزجاج من الداخل. كتعكس الشمس قبل ما تدخل للسيارة.',
        },
        {
          title: 'وصّل المروحة لـ USB السيارة',
          body: 'ركّب المروحة المزدوجة فوق التابلو أو على زجاج النافذة وشبّكها بـ USB. كتشتغل مباشرة.',
        },
        {
          title: 'شغّل المروحة وركّب',
          body: 'قبل ما تركب بـ 2-3 دقائق شغّل المروحة. توصل، تحس الفرق مباشرة — جو مريح بلا انتظار.',
        },
      ],
    },
    pain: {
      eyebrow: 'المشكل',
      title: 'كتحل الباب وكتضربك السخونية لوجهك؟',
      body: 'تخيّل راسك باغي تخرج، كتحل باب الطوموبيل وكتضربك واحد السخونية كتمحق. الغيدون كيحرق، والريحة كتخنق، والمكيف واخا عاطيه \'الماكس\' والو.. كتحس براسك غارق في العرق قبل ما تبدا نهارك. كل صيف نفس الفيلم كيتعاود.. واش ما عييتيش من هاد العذاب؟',
      bullets: [
        'السخونية كتضرب وجهك مع كتحل الباب',
        'الغيدون كيحرق يديك قبل ما تسوق',
        'الجلد والبلاستيك كيدوبو بصمت ف كل صيف',
        'المكيف بوحدو ما كافيش',
      ],
      imageLabel: 'حرارة الطوموبيل ف الصيف',
      image: '/images/pack-pain.webp',
    },
    logic: {
      eyebrow: 'الحل',
      title: 'مروحة + مظلة = حرارة أقل ف دقائق',
      body: 'المروحة كتطرد الهواء الساخن. المظلة كتحجب الشمس قبل ما تدخل. بجوج كيخدمو مع بعضياتهم — نتيجة فورية بدون تعقيد.',
      bullets: [
        'فرق ملحوظ ف الحرارة من أول استعمال',
        'حماية الجلد والبلاستيك من التلف',
        'سيارة باردة مع استهلاك أقل',
      ],
      imageLabel: 'الباك أثناء الاستعمال',
      image: '/images/pack-solution.webp',
    },
    proof: {
      eyebrow: 'إثبات',
      title: 'سائقين مغاربة جربوه وعاودو طلبوه',
      body: 'مئات التقييمات الموثقة وصور قبل/بعد من زبناء ف الدار البيضاء، طنجة، مراكش وأكثر. بويا شوب متخصص ف إكسسوارات السيارات — ماشي متجر عام كيبيع أي شي.',
      bullets: ['تقييم 4.9 من 5', '920+ مراجعة موثقة', 'دفع عند الاستلام', `ضمان ${WARRANTY_DAYS} يوم`],
      imageLabel: 'تجارب الزبناء',
    },
    howItWorks: {
      eyebrow: 'كيفاش كيخدم',
      title: '3 خطوات وطوموبيلك محمي',
      body: 'طلب ف دقيقة، تأكيد بالهاتف من فريق مغربي، وتوصيل لباب الدار. ما كتخلّص حتى توصلك السلعة وتعاينها.',
      bullets: [
        'اختار العرض المناسب وعمّر معلوماتك',
        'كنأكدو الطلب معاك بالهاتف/واتساب',
        'توصيل + دفع عند الاستلام',
      ],
      imageLabel: 'خطوات الطلب والتوصيل',
    },
    faqs: [
      {
        q: 'واش كيناسب جميع السيارات؟',
        a: 'إيه. الباك مصمم للسيارات الصغيرة والكبيرة، والمظلة قابلة للتعديل باش تلائم أغلب الزجاج الأمامي.',
      },
      {
        q: 'شحال كياخد التوصيل؟',
        a: 'عادةً 24 إلى 48 ساعة ف المدن الكبرى، ومن 1 إلى 3 أيام لباقي المدن. كنأكدو ليك التاريخ ف المكالمة.',
      },
      {
        q: 'واش خاصني نخلّص قبل ما يوصلني؟',
        a: 'لا. الدفع عند الاستلام فقط — كتخلّص غير ملي توصلك السلعة وتعاينها بيدك.',
      },
      {
        q: 'وإلا ما عجبنيش المنتج؟',
        a: `عندك ${WARRANTY_DAYS} يوم. إلا ما عجبكش لأي سبب، تواصل معانا وكنرجعو ليك الفلوس بلا تعقيد.`,
      },
      {
        q: 'واش كيمكن نتبع الطرد ديالي؟',
        a: 'إيه، من بعد ما نأكدو الطلب معاك، كنبعثو ليك رابط التتبع ف الواتساب باش تشوف وين وصل طردك ف أي وقت.',
      },
      {
        q: 'واش المنتج أصلي ولا تقليد؟',
        a: 'أصلي 100% ومفحوص قبل ما يتصيفط. بويا شوب متجر متخصص ف إكسسوارات السيارات — ماشي سوق عشوائي.',
      },
      {
        q: 'إلا ما كنتش موجود وقت التوصيل؟',
        a: 'الساعي كيتصل بيك قبل. إلا ما ردّيتيش، كيحاول مرة أخرى أو كيخلي الطرد عند الجار. كنتفاهمو معاك بالواتساب.',
      },
    ],
    reviews: [
      {
        name: 'يوسف بنعلي',
        city: 'الدار البيضاء',
        rating: 5,
        date: 'منذ 5 أيام',
        text: 'من بعد ما ركبت الباك، الطوموبيل ما بقاتش كتسخن بحال قبل. التوصيل كان سريع والتأكيد بالواتساب محترف بزاف.',
      },
      {
        name: 'سناء العمراني',
        city: 'طنجة',
        rating: 5,
        date: 'منذ أسبوع',
        text: 'منتج فعلي وخدمة زوينة. المروحة قوية والمظلة كتبان صلبة. نصحت بيها بزاف ديال صحابي.',
      },
      {
        name: 'رشيد الكتاني',
        city: 'مراكش',
        rating: 5,
        date: 'منذ أسبوعين',
        text: 'التوصيل تأخر شوية عليا، لكن الباك يستاهل. من أول ما ركبتو حسيت فرق كبير ف الحرارة — منتج مزيان بصح.',
      },
      {
        name: 'هشام الزروالي',
        city: 'فاس',
        rating: 5,
        date: 'منذ 3 أيام',
        text: 'خدت 3 باكات للعائلة. كل واحد ركّب الباك ديالو بوحدو. جودة ممتازة والثمن معقول مقارنة بالنتيجة.',
      },
      {
        name: 'فاطمة أيت سعيد',
        city: 'أكادير',
        rating: 5,
        date: 'منذ 6 أيام',
        text: 'كنت خايفة نطلب أونلاين لكن الدفع عند الاستلام خلاني نجرب. وصلتني نهار الثاني ومنتج ممتاز بلا مبالغة.',
      },
      {
        name: 'محمد الوزاني',
        city: 'الرباط',
        rating: 4,
        date: 'منذ شهر',
        text: 'تركيب سهل وفرق ملموس ف الحرارة. الوحيدة خصنا نتعلمو كيفاش نركبو المظلة صح، لكن الفريق شرح لينا ف الواتساب.',
      },
    ],
  },
  'magnetic-holder': {
    id: 'magnetic-holder',
    sku: 'BOYA-MH-9153',
    slug: 'magnetic-holder',
    href: '/product/magnetic-holder',
    nameAr: 'حامل الهاتف المغناطيسي للسيارة',
    nameEn: 'Magnetic Car Phone Holder',
    category: 'راحة وسلامة',
    icon: 'pin',
    tagline: 'ثابت ف الطريق، بلا اهتزاز وبلا خطر — تلفونك دائماً قدامك.',
    metaDescription:
      'حامل هاتف مغناطيسي قوي للسيارة من بويا شوب: ثبات تام بلا اهتزاز. تركيب ف ثواني. دفع عند الاستلام، ضمان 30 يوم. من 120 درهم.',
    rating: 4.8,
    reviewCount: 640,
    unit: 'حامل',
    soldText: 'تباع +1,800 حامل هاد الشهر',
    scarcityText: 'بقات غير 12 الحبة في المخزون',
    stockLeft: 12,
    deliveryDays: 'الخميس أو الجمعة',
    checkoutHeadline: 'هاتفك في أمان — تركيزك على الطريق',
    checkoutDescription:
      'وداعاً لقلق سقوط الهاتف! مغناطيس خارق يمسك الهاتف في أي اتجاه. ركّبه في 30 ثانية فقط.',
    highlights: [
      'مصمم ليناسب جميع الهواتف بجميع أحجامها (الكبيرة والصغيرة)',
      'مغناطيس قوي — هاتفك آمن وثابت 100%',
      'ثبات تام حتى ف الطرق الصعبة والمطبات',
      'تركيب وإزالة ف ثواني بلا أثر',
    ],
    valueProps: [
      { icon: 'lock', title: 'ثبات قوي', text: 'مغناطيس ما كيخليش التلفون يتحرك' },
      { icon: 'shield', title: 'سياقة آمنة', text: 'عينيك على الطريق ماشي على التلفون' },
      { icon: 'clock', title: 'نقرة وحدة', text: 'تثبيت وإزالة ف ثواني' },
      { icon: 'check-circle', title: 'يناسب الكل', text: 'متوافق مع جميع الهواتف' },
    ],
    trustBadges: [
      { icon: 'badge', title: 'أصلي 100%', subtitle: 'جودة مفحوصة' },
      { icon: 'shield', title: `${WARRANTY_DAYS} يوم`, subtitle: 'ضمان كامل' },
      { icon: 'star', title: '4.8/5', subtitle: '640+ تقييم' },
      { icon: 'truck', title: '24–48 ساعة', subtitle: 'توصيل سريع' },
    ],
    guarantees: SHARED_GUARANTEES,
    offers: [
      {
        quantity: 1,
        price: 120,
        label: 'حامل واحد',
        sublabel: 'لسيارة وحدة',
        perks: ['مغناطيس قوي', 'تركيب ف ثواني', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
      {
        quantity: 2,
        price: 199,
        compareAt: 240,
        label: 'حاملان',
        sublabel: 'وحدة ليك ووحدة هدية',
        badge: 'الأكثر مبيعاً',
        perks: ['حامل ثاني بثمن مخفّض', 'توفير 41 درهم', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
      {
        quantity: 3,
        price: 269,
        compareAt: 360,
        label: '3 حوامل',
        sublabel: 'للعائلة وللسيارات',
        badge: 'أقصى توفير',
        perks: ['3 حوامل', 'توفير 91 درهم', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
    ],
    galleryLabels: ['الحامل المغناطيسي', 'المغناطيس القوي', 'القاعدة الصلبة', 'مركب ف الطوموبيل', 'مع الهاتف'],
    image: '/images/magnetic-holder.webp',
    howToUse: {
      title: 'كيفاش تركّب الحامل',
      steps: [
        {
          title: 'لصّق القاعدة على التابلو أو المرآة',
          body: 'نظّف المكان مزيان وثبّت القاعدة. القاعدة تدوم سنين بلا ما تعيد التركيب.',
        },
        {
          title: 'لصّق الصفيحة المعدنية على التلفون',
          body: 'الصفيحة رقيقة وما تضرّش التلفون. تحطّها على ظهر الهاتف مباشرة.',
        },
        {
          title: 'قرّب التلفون للمغناطيس',
          body: 'مجرّد ما تقرّب التلفون كيثبت لوحدو. نقرة وحدة باش تحيدو — ثبات تام وسهولة تامة.',
        },
      ],
    },
    pain: {
      eyebrow: 'المشكل',
      title: 'الأمان ديالك ف الطريق كيبدا من تفاصيل صغيرة...',
      body: 'فرملة مفاجئة حيت التلفون طاح؟ هادي ماشي غير لقطة عصبية، هادي خطورة حقيقية كتعاود كل نهار ف شوارع المغرب. الحوامل الرخيصة كتفشل ف أول مطب، كضيع ليك الـ GPS فاش كتحتاجو، وكتأثر بالحرارة.',
      bullets: [
        'كتسوق وأنت حاضي التلفون لا يطيح',
        'GPS كيتقطع ف اللحظة اللي محتاجو أكثر',
        'خدوش وكسور ف الشاشة بسبب كثرة السقوط',
        'حاملات رخيصة كتأثر بسخونية الصيف',
      ],
      imageLabel: 'التلفون يطيح ف السيارة',
      image: '/images/holder-pain.gif',
    },
    logic: {
      eyebrow: 'الحل',
      title: 'مغناطيس قوي — ثبات تام بلا تعقيد',
      body: 'نقرة واحدة ومغناطيس قوي كيثبت تلفونك ف أصعب الطرق. تركيب سريع بدون تعب!',
      bullets: [
        'ثابت ف المطبات والمنعطفات',
        'تركيب فأقل من 30 ثانية',
        'يناسب جميع الهواتف الكبيرة والصغيرة',
      ],
      imageLabel: 'الحامل أثناء الاستعمال',
      image: '/images/magnetic-holder-gallery-2.webp',
    },
    proof: {
      eyebrow: 'إثبات',
      title: 'السائقين كيختاروه للأمان والراحة',
      body: 'منتج سيارات حقيقي من بويا شوب — نفس فريق الدعم، نفس التوصيل، ونفس الضمان اللي كيعتمدو عليه آلاف الزبناء.',
      bullets: ['640+ تقييم موثق', 'دفع عند الاستلام', `ضمان ${WARRANTY_DAYS} يوم`, 'دعم واتساب'],
      imageLabel: 'تقييمات الزبناء',
    },
    howItWorks: {
      eyebrow: 'كيفاش كيخدم',
      title: 'طلب سريع وتأكيد قبل التوصيل',
      body: 'كنصيفطو ليك التفاصيل بالواتساب باش تكون مطمئن قبل ما يخرج الطرد، وما كتخلّص حتى يوصلك.',
      bullets: ['اختار العرض وعمّر معلوماتك', 'تأكيد المدينة والهاتف معاك', 'توصيل + دفع عند الاستلام'],
      imageLabel: 'خطوات الطلب والتوصيل',
    },
    faqs: [
      {
        q: 'واش كيمسك التلفون مزيان؟',
        a: 'إيه، المغناطيس مصمم لثبات قوي حتى مع التلفونات الكبيرة. كافي تركب الحامل ف مكان ما كيعيقش الرؤية.',
      },
      {
        q: 'واش كيضر الشاشة ولا التلفون؟',
        a: 'لا. مع الصفيحة المعدنية الرقيقة أو اللاصقة الآمنة المرفقة، الاستعمال العادي ما كيأثرش على التلفون.',
      },
      {
        q: 'شحال كياخد التوصيل والدفع؟',
        a: 'توصيل 24–48 ساعة ف المدن الكبرى، والدفع عند الاستلام فقط — ما كتخلّص والو قبل.',
      },
      {
        q: 'وإلا ما عجبنيش؟',
        a: `عندك ${WARRANTY_DAYS} يوم لاسترجاع المنتج وفلوسك إلا ما عجبكش.`,
      },
      {
        q: 'واش كيمكن نتبع الطرد؟',
        a: 'إيه. من بعد التأكيد كنبعثو ليك رابط تتبع ف الواتساب باش تشوف وين وصل طردك.',
      },
      {
        q: 'واش المنتج أصلي؟',
        a: 'أصلي 100%. بويا شوب متجر متخصص كيفحص كل منتج قبل ما يصيفطو. ما كاين لا تقليد لا غش.',
      },
      {
        q: 'إلا ما كنتش موجود وقت التوصيل؟',
        a: 'الساعي كيتصل بيك قبل الوصول. إلا ما ردّيتيش كيعاود يحاول. كنتواصلو معاك ف الواتساب باش نتفاهمو.',
      },
    ],
    reviews: [
      {
        name: 'أمين الحراق',
        city: 'الرباط',
        rating: 5,
        date: 'منذ 3 أيام',
        text: 'ثابت بزاف حتى ف الطريق لسلا، ما كيتحركش بالمرة. الثمن مناسب والجودة فوق التوقعات.',
      },
      {
        name: 'نادية بوزيد',
        city: 'فاس',
        rating: 5,
        date: 'منذ 10 أيام',
        text: 'خديت جوج باش نهدي وحدة لخويا. التوصيل وصلني نهار الجمعة والتأكيد كان سريع.',
      },
      {
        name: 'كريم الإدريسي',
        city: 'أكادير',
        rating: 5,
        date: 'منذ شهر',
        text: 'أحسن حامل جربت ف حياتي. وبويا شوب كيجاوبو بسرعة ف الواتساب على أي سؤال.',
      },
      {
        name: 'ليلى الحسناوي',
        city: 'الدار البيضاء',
        rating: 5,
        date: 'منذ أسبوع',
        text: 'كنت خايفة يطيح التلفون ف الطريق، دابا ثابت ومريح. التأكيد بالهاتف خلاني نثق كثر.',
      },
      {
        name: 'طارق الشرايبي',
        city: 'مراكش',
        rating: 5,
        date: 'منذ 4 أيام',
        text: 'سهل التركيب ومزيان. كنستعملو للـ GPS ف كل مكان. نصحت بيه 3 صحابي وكلهم طلبوه.',
      },
      {
        name: 'سمية بلعيد',
        city: 'طنجة',
        rating: 4,
        date: 'منذ 3 أسابيع',
        text: 'منتج زوين والمغناطيس قوي. الدفع عند الاستلام هو اللي خلاني نجرب بدون خوف. راضية بيه.',
      },
    ],
  },
  'car-vacuum': {
    id: 'car-vacuum',
    sku: 'BOYA-CV-4471',
    slug: 'car-vacuum',
    href: '/product/car-vacuum',
    nameAr: 'مكنسة السيارة 3 في 1',
    nameEn: 'Car Vacuum Cleaner 3-in-1',
    category: 'عناية وتنظيف',
    icon: 'vacuum',
    tagline: 'شفط، نفخ، وتنظيف عميق — 6 رؤوس قابلة للتبديل، شحن USB.',
    metaDescription:
      'مكنسة سيارة 3 في 1 من بويا شوب: تشفط، تنفخ، وتنظف بعمق. 6 رؤوس قابلة للتبديل، شحن USB. دفع عند الاستلام، ضمان 30 يوم. من 199 درهم.',
    rating: 4.7,
    reviewCount: 310,
    unit: 'مكنسة',
    soldText: 'تباع +800 مكنسة هاد الشهر',
    scarcityText: 'بقات غير 12 الحبة في المخزون',
    stockLeft: 6,
    deliveryDays: 'الخميس أو الجمعة',
    checkoutHeadline: 'طوموبيلك نظيفة ف 10 دقائق',
    checkoutDescription:
      'شفط + نفخ + 6 رؤوس لكل زاوية. خفيفة، شحن USB، تخزّنها ف الطوموبيل دايماً.',
    highlights: [
      '3 في 1: شفط + نفخ + رؤوس متعددة للتنظيف العميق',
      '6 رؤوس قابلة للتبديل لكل زاوية وسطح',
      'شحن USB — تشحن ف السيارة أو من أي مكان',
      'خفيفة وصغيرة — تحتفظ بها ف الطوموبيل دايماً',
    ],
    valueProps: [
      { icon: 'spark', title: '3 في 1', text: 'شفط ونفخ وتنظيف بجهاز وحدة' },
      { icon: 'leaf', title: '6 رؤوس', text: 'لكل سطح وزاوية ف السيارة' },
      { icon: 'clock', title: 'شحن USB', text: 'تشحن ف أي مكان بسرعة' },
      { icon: 'shield', title: 'قوي وخفيف', text: 'سهل الحمل والاستعمال اليومي' },
    ],
    trustBadges: [
      { icon: 'badge', title: 'أصلي 100%', subtitle: 'جودة مفحوصة' },
      { icon: 'shield', title: `${WARRANTY_DAYS} يوم`, subtitle: 'ضمان كامل' },
      { icon: 'star', title: '4.7/5', subtitle: '310+ تقييم' },
      { icon: 'truck', title: '24–48 ساعة', subtitle: 'توصيل سريع' },
    ],
    guarantees: SHARED_GUARANTEES,
    offers: [
      {
        quantity: 1,
        price: 199,
        label: 'مكنسة وحدة',
        sublabel: 'مع 6 رؤوس + شاحن USB',
        perks: ['6 رؤوس متعددة', 'شحن USB', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
      {
        quantity: 2,
        price: 349,
        compareAt: 398,
        label: 'جوج مكانس',
        sublabel: 'وحدة ليك ووحدة هدية',
        badge: 'الأكثر مبيعاً',
        perks: ['مكنسة ثانية بثمن مخفّض', 'توفير 49 درهم', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
      {
        quantity: 3,
        price: 479,
        compareAt: 597,
        label: '3 مكانس',
        sublabel: 'للعائلة وكهدية مميزة',
        badge: 'أقصى توفير',
        perks: ['3 مكانس كاملة', 'توفير 118 درهم', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
    ],
    galleryLabels: ['المكنسة كاملة', '6 رؤوس', 'وضع الشفط', 'وضع النفخ', 'الشحن USB'],
    image: '/images/car-vacuum.webp',
    howToUse: {
      title: 'كيفاش تستعمل المكنسة',
      steps: [
        {
          title: 'اختار الرأس المناسب',
          body: 'رأس طويل للشقوق والزوايا، رأس عريض للمقاعد والسجادة، رأس ناعم للأسطح الحساسة. ركّبه وشغّل.',
        },
        {
          title: 'اشفط أو انفخ حسب الحاجة',
          body: 'وضع الشفط للتراب والفتات. وضع النفخ للتهوية والأماكن الضيقة اللي ما يدخلهاش الرأس.',
        },
        {
          title: 'شحّن بـ USB وخزّن ف الطوموبيل',
          body: 'من بعد ما تكمل، شحّن المكنسة ف منفذ USB ديال السيارة. دايماً جاهزة للاستعمال.',
        },
      ],
    },
    pain: {
      eyebrow: 'المشكل',
      title: 'كتنظّف الطوموبيل وتبقى وسخة — وهاد الإحساس مؤلم',
      body: 'ساعة كاملة وركبتيك تؤلموك، خرجتي التراب بالخرقة، وكتشوف السيارة بقات كما هي. الزوايا، تحت المقاعد، بين الشقوق — أماكن ما توصلهاش أبداً. وكل مرة راكب يدخل يحتشم من الوساخة. هاد الإحساس ما خصكش تعيشو.',
      bullets: [
        'تراب وفتات متراكمين ف أماكن ما توصلهاش',
        'تنظّف ساعة وتبقى الزوايا وسخة',
        'المكانس الكبيرة ما كتدخلش للسيارة',
        'الخرقة كتنشر التراب بدل ما تشيلو',
      ],
      imageLabel: 'داخل السيارة قبل التنظيف',
    },
    logic: {
      eyebrow: 'الحل',
      title: '3 وظائف + 6 رؤوس — تنظيف شامل ف أقل وقت',
      body: 'تشفط، تنفخ، وتوصل لكل زاوية. 6 رؤوس متخصصة لكل سطح. خفيفة وشحن USB — دايماً جاهزة ف الطوموبيل.',
      bullets: [
        'رأس للسجادة، آخر للشقوق، آخر للأسطح',
        'وضع النفخ للزوايا الصعبة والتهوية',
        'خفيفة — تخزّنها ف الطوموبيل دايماً',
      ],
      imageLabel: 'المكنسة أثناء الاستعمال',
    },
    proof: {
      eyebrow: 'إثبات',
      title: 'سائقون مغاربة كيستعملوها يومياً',
      body: 'من بويا شوب — نفس الجودة المفحوصة، نفس التوصيل، ونفس الضمان اللي كيعتمدو عليه آلاف الزبناء.',
      bullets: ['310+ تقييم موثق', 'دفع عند الاستلام', `ضمان ${WARRANTY_DAYS} يوم`, 'دعم واتساب'],
      imageLabel: 'تقييمات الزبناء',
    },
    howItWorks: {
      eyebrow: 'كيفاش كيخدم',
      title: '3 خطوات لطوموبيل نظيف',
      body: 'طلب ف دقيقة، تأكيد بالهاتف، وتوصيل لبابك — ما كتخلّص حتى توصلك السلعة.',
      bullets: ['اختار العرض وعمّر معلوماتك', 'كنأكدو معاك بالواتساب', 'توصيل + دفع عند الاستلام'],
      imageLabel: 'خطوات الطلب والتوصيل',
    },
    faqs: [
      {
        q: 'واش الشفط قوي بما يكفي؟',
        a: 'إيه، مصممة خصيصاً لتنظيف السيارة: قوة كافية لشفط التراب والفتات والشعر من السجادة والمقاعد.',
      },
      {
        q: 'شحال كيدوم الشحن؟',
        a: 'الشحن عبر USB كياخد قريباً ساعة، والبطارية كتكفي لجلسة تنظيف كاملة للسيارة.',
      },
      {
        q: 'واش 6 رؤوس كلها موجودة ف الصندوق؟',
        a: 'إيه، الصندوق كيتضمن المكنسة الرئيسية + 6 رؤوس متخصصة + كابل USB للشحن.',
      },
      {
        q: 'شحال كياخد التوصيل والدفع؟',
        a: 'توصيل 24–48 ساعة ف المدن الكبرى، والدفع عند الاستلام فقط — ما كتخلّص والو قبل.',
      },
      {
        q: 'واش كيمكن نتبع الطرد ديالي؟',
        a: 'إيه. من بعد التأكيد كنبعثو ليك رابط تتبع ف الواتساب باش تشوف وين وصل طردك.',
      },
      {
        q: 'واش المنتج أصلي ولا تقليد؟',
        a: 'أصلي 100% ومفحوص قبل ما يتصيفط. بويا شوب متجر متخصص ف إكسسوارات السيارات — كل منتج كنفحصوه.',
      },
      {
        q: 'وإلا ما عجبنيش بعد ما وصل؟',
        a: `عندك ${WARRANTY_DAYS} يوم كاملة. إلا ما عجبكش لأي سبب، تواصل معانا وكنرجعو ليك فلوسك بلا سؤال.`,
      },
    ],
    reviews: [
      {
        name: 'إلياس بنعبدالله',
        city: 'الدار البيضاء',
        rating: 5,
        date: 'منذ 4 أيام',
        text: 'مكنسة خايبة بالمعنى الإيجابي! وصلتني كاملة مع الرؤوس الستة والشاحن. نظفت الطوموبيل ف أقل من 10 دقائق.',
      },
      {
        name: 'سلمى الرحموني',
        city: 'مراكش',
        rating: 5,
        date: 'منذ أسبوع',
        text: 'خديتها هدية لزوجي وعجبتو بزاف. جودة ممتازة والرؤوس تثبت مزيان. التوصيل كان سريع.',
      },
      {
        name: 'عمر الشرقي',
        city: 'طنجة',
        rating: 4,
        date: 'منذ أسبوعين',
        text: 'كنت متردد أول مرة بسبب الثمن لكن بعد ما جربت مريت. خصوصاً رأس الزوايا — كيوصل لأماكن ما كنت نتخيلش.',
      },
      {
        name: 'حنان الناصري',
        city: 'الرباط',
        rating: 5,
        date: 'منذ 5 أيام',
        text: 'الدفع عند الاستلام خلاني نجرب بلا خوف. وصلت بسرعة ومنتج ممتاز. السيارة كتولّي نظيفة ف دقائق.',
      },
      {
        name: 'يحيى الفاسي',
        city: 'فاس',
        rating: 5,
        date: 'منذ أسبوعين',
        text: 'شريتها لتنظيف العربية كل أسبوع. البطارية كتكفي لجلسة كاملة والرؤوس عملية بزاف.',
      },
      {
        name: 'رجاء المرابط',
        city: 'أكادير',
        rating: 5,
        date: 'منذ 8 أيام',
        text: 'فريق بويا شوب محترف. جاوبوني ف الواتساب قبل الطلب وشرحو ليا. المنتج وصل كما قالو بالضبط.',
      },
    ],
  },
};

export const productList: Product[] = Object.values(products);

export function getProduct(id: ProductId): Product {
  return products[id];
}

/** Single-unit / first listed offer — used for sticky CTA and default selection. */
export function getFirstOffer(product: Product): ProductOffer {
  return product.offers.find((offer) => offer.quantity === 1) ?? product.offers[0];
}

export function getProductSku(id: ProductId | string): string {
  const product = products[id as ProductId];
  return product?.sku ?? `BOYA-UNK-${String(id).replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}
