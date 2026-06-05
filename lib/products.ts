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
  { icon: 'wallet', text: 'دفع عند الاستلام', sub: 'كتخلّص ملي توصلك' },
  { icon: 'truck', text: 'توصيل 24–48 ساعة', sub: 'لكل المغرب' },
  { icon: 'refresh', text: `استرجاع ${WARRANTY_DAYS} يوم`, sub: 'فلوسك راجعة' },
  { icon: 'shield', text: 'جودة مضمونة', sub: 'مفحوص قبل التصيفط' },
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
    tagline: 'مروحة + مظلة — برد طوموبيلك من أول دقيقة.',
    metaDescription:
      'باك الحماية من سخونة السيارة: مروحة و مظلة ف باك واحد. تركيب سهل، توصيل سريع، دفع عند الاستلام. من 199 درهم.',
    rating: 4.9,
    reviewCount: 920,
    unit: 'باك',
    soldText: 'تباع +2,400 باك هاد الشهر',
    scarcityText: 'بقاو غير 9 وحدات بالسعر الحالي',
    stockLeft: 9,
    deliveryDays: 'الجمعة أو السبت',
    checkoutHeadline: 'طوموبيلك سخونة؟ هاد الباك يخدم',
    checkoutDescription: 'مروحة و مظلة ف باك واحد. تركيب سهل والفرق واضح من أول مرة.',
    highlights: [
      'الحرارة كتهبط ف دقائق',
      'تركيب ف أقل من دقيقة',
      'كيحمي الدركسيون والجلد',
      'مروحة + مظلة ف باك واحد',
    ],
    valueProps: [
      { icon: 'fan', title: 'تبريد سريع', text: 'مروحة كتطرد الهواء السخون' },
      { icon: 'shield', title: 'حجب الشمس', text: 'المظلة كترجع الحرارة قبل ما تدخل' },
      { icon: 'clock', title: 'تركيب سهل', text: 'جاهز ف ثواني بلا ورشة' },
      { icon: 'leaf', title: 'بنزين أقل', text: 'المكيف كيخدم بخفة' },
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
        sublabel: 'لطوموبيل واحدة',
        perks: ['مروحة + مظلة', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
      {
        quantity: 2,
        price: 279,
        compareAt: 398,
        label: 'باكان',
        sublabel: 'واحد ليك وواحد لعائلتك',
        badge: 'الأكثر مبيعاً',
        perks: ['باكان كاملين', 'توفير 119 درهم', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
      {
        quantity: 3,
        price: 349,
        compareAt: 597,
        label: '3 باكات',
        sublabel: 'للعائلة أو للهدايا',
        badge: 'أقصى توفير',
        perks: ['3 باكات كاملين', 'توفير 248 درهم', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
    ],
    galleryLabels: ['الباك كامل', 'المروحة المزدوجة', 'المظلة الحرارية', 'التركيب', 'داخل الطوموبيل'],
    image: '/images/pack.webp',
    howToUse: {
      title: 'كيفاش تستعمل الباك',
      steps: [
        {
          title: 'ركّب المظلة على الزجاج',
          body: 'ثبّت المظلة من الداخل. كترجع الشمس قبل ما تدخل للسيارة.',
        },
        {
          title: 'شبّك المروحة بـ USB',
          body: 'ركّبها فوق التابلو ووصّلها بـ USB. كتخدم مباشرة.',
        },
        {
          title: 'شغّل المروحة و سوق',
          body: 'شغّلها قبل ما تركب بـ دقيقتين. تحس الفرق مباشرة.',
        },
      ],
    },
    pain: {
      eyebrow: 'المشكل',
      title: 'السيارة كتولي فرن ف الصيف',
      body: 'تفتح الباب و الدركسيون كيحرق. الريحة تخنق والمكيف كيخدم بقوة. كل يوم نفس المعاناة.',
      bullets: [
        'حرارة من أول ما تفتح الباب',
        'الدركسيون والجلد كيتلفو',
        'المكيف ما كيكفيش',
      ],
      imageLabel: 'حرارة الطوموبيل ف الصيف',
    },
    logic: {
      eyebrow: 'الحل',
      title: 'مروحة + مظلة = حرارة أقل',
      body: 'المروحة كتطرد الهواء السخون. المظلة كترجع الشمس. بجوج كيخفّفو الحرارة بسرعة.',
      bullets: [
        'فرق واضح من أول استعمال',
        'كيحمي الجلد والبلاستيك',
        'المكيف كيخدم بخفة',
      ],
      imageLabel: 'الباك أثناء الاستعمال',
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
        q: 'واش كيناسب كل السيارات؟',
        a: 'إيه. كيناسب السيارات الصغيرة والكبيرة. المظلة قابلة للتعديل.',
      },
      {
        q: 'شحال كياخد التوصيل؟',
        a: '24–48 ساعة ف المدن الكبرى. كنقولو ليك التاريخ ف المكالمة.',
      },
      {
        q: 'واش خاصني نخلّص قبل؟',
        a: 'لا. كتخلّص غير ملي توصلك السلعة.',
      },
      {
        q: 'وإلا ما عجبنيش؟',
        a: `عندك ${WARRANTY_DAYS} يوم. راسلنا وكنرجعو ليك الفلوس.`,
      },
      {
        q: 'واش نقدر نتبع الطرد؟',
        a: 'إيه. كنبعثو ليك رابط التتبع ف الواتساب.',
      },
      {
        q: 'واش المنتج أصلي؟',
        a: 'إيه. أصلي ومفحوص قبل ما يتصيفط.',
      },
      {
        q: 'إلا ما كنتش ف الدار؟',
        a: 'الساعي كيتصل بيك قبل. كنعاودو المحاولة أو كنتفاهمو ف الواتساب.',
      },
    ],
    reviews: [
      {
        name: 'يوسف بنعلي',
        city: 'الدار البيضاء',
        rating: 5,
        date: 'منذ 5 أيام',
        text: 'من بعد ما ركبت الباك، الحرارة نقصات بزاف. التوصيل كان سريع.',
      },
      {
        name: 'سناء العمراني',
        city: 'طنجة',
        rating: 5,
        date: 'منذ أسبوع',
        text: 'المروحة قوية والمظلة صلبة. نصحت بيها صحابي.',
      },
      {
        name: 'رشيد الكتاني',
        city: 'مراكش',
        rating: 5,
        date: 'منذ أسبوعين',
        text: 'جربت حلول بزاف. هاد الباك هو اللي خدم معايا ف عز النهار.',
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
    tagline: 'تلفونك ثابت — عينيك على الطريق.',
    metaDescription:
      'حامل هاتف مغناطيسي للسيارة: ثبات قوي وتركيب ف ثواني. توصيل سريع، دفع عند الاستلام. من 120 درهم.',
    rating: 4.8,
    reviewCount: 640,
    unit: 'حامل',
    soldText: 'تباع +1,800 حامل هاد الشهر',
    scarcityText: 'بقاو غير 12 وحدة بالسعر الحالي',
    stockLeft: 12,
    deliveryDays: 'الخميس أو الجمعة',
    checkoutHeadline: 'تلفونك ثابت — سياقة آمنة',
    checkoutDescription: 'مغناطيس قوي كيمسك التلفون. تركيب ف 30 ثانية بلا أدوات.',
    highlights: [
      'ثابت حتى ف المطبات',
      'تركيب وإزالة ف ثواني',
      'كيناسب كل التلفونات',
      'ما كيطيحش ف الطريق',
    ],
    valueProps: [
      { icon: 'lock', title: 'ثبات قوي', text: 'التلفون ما كيتحركش' },
      { icon: 'shield', title: 'سياقة آمنة', text: 'عينيك على الطريق' },
      { icon: 'clock', title: 'تركيب سهل', text: 'ف ثواني بلا أدوات' },
      { icon: 'check-circle', title: 'كيناسب الكل', text: 'تلفونات كبيرة وصغيرة' },
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
        sublabel: 'لسيارة واحدة',
        perks: ['مغناطيس قوي', 'تركيب سهل', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
      {
        quantity: 2,
        price: 199,
        compareAt: 240,
        label: 'حاملان',
        sublabel: 'واحد ليك وواحد هدية',
        badge: 'الأكثر مبيعاً',
        perks: ['حامل ثاني بثمن مخفّض', 'توفير 41 درهم', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
      {
        quantity: 3,
        price: 269,
        compareAt: 360,
        label: '3 حوامل',
        sublabel: 'للعائلة',
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
          title: 'لصّق القاعدة',
          body: 'نظّف المكان وثبّت القاعدة ف التابلو أو التهوية.',
        },
        {
          title: 'لصّق الصفيحة على التلفون',
          body: 'حطّها تحت الكفاية أو على ظهر التلفون. ما كتضرّش التلفون.',
        },
        {
          title: 'قرّب التلفون',
          body: 'كيثبت لوحدو. نقرة وحدة باش تحيدو.',
        },
      ],
    },
    pain: {
      eyebrow: 'المشكل',
      title: 'التلفون كيطيح و كيضيع التركيز',
      body: 'حامل ضعيف = تلفون كيهتز و كيطيح. GPS كيتقطع ف اللحظة اللي محتاجو فيها.',
      bullets: [
        'كيطيح ف كل فرملة',
        'GPS كيتقطع ف أسوأ وقت',
        'الحاملات الرخيصة ما كتدومش',
      ],
      imageLabel: 'التلفون يطيح ف السيارة',
    },
    logic: {
      eyebrow: 'الحل',
      title: 'مغناطيس قوي — ثبات بلا تعقيد',
      body: 'قرّب التلفون و كيثبت. مغناطيس قوي حتى ف المطبات. تركيب ف 30 ثانية.',
      bullets: [
        'ثابت ف المطبات',
        'تركيب ف 30 ثانية',
        'كيناسب كل التلفونات',
      ],
      imageLabel: 'الحامل أثناء الاستعمال',
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
        a: 'إيه. ثبات قوي حتى مع التلفونات الكبيرة.',
      },
      {
        q: 'واش كيضر التلفون؟',
        a: 'لا. الصفيحة آمنة وما كتضرّش التلفون.',
      },
      {
        q: 'شحال كياخد التوصيل؟',
        a: '24–48 ساعة. الدفع عند الاستلام فقط.',
      },
      {
        q: 'وإلا ما عجبنيش؟',
        a: `عندك ${WARRANTY_DAYS} يوم. راسلنا وكنرجعو ليك الفلوس.`,
      },
      {
        q: 'واش نقدر نتبع الطرد؟',
        a: 'إيه. كنبعثو ليك رابط التتبع ف الواتساب.',
      },
      {
        q: 'واش المنتج أصلي؟',
        a: 'إيه. أصلي ومفحوص قبل ما يتصيفط.',
      },
      {
        q: 'إلا ما كنتش ف الدار؟',
        a: 'الساعي كيتصل بيك قبل. كنعاودو المحاولة أو كنتفاهمو ف الواتساب.',
      },
    ],
    reviews: [
      {
        name: 'أمين الحراق',
        city: 'الرباط',
        rating: 5,
        date: 'منذ 3 أيام',
        text: 'ثابت بزاف حتى ف الطريق الوعر. ما كيتحركش.',
      },
      {
        name: 'نادية بوزيد',
        city: 'فاس',
        rating: 5,
        date: 'منذ 10 أيام',
        text: 'خديت جوج — واحد ليا وواحد هدية. وصلني نهار الجمعة.',
      },
      {
        name: 'كريم الإدريسي',
        city: 'أكادير',
        rating: 5,
        date: 'منذ شهر',
        text: 'أحسن حامل جربت. الفريق كيجاوب بسرعة ف الواتساب.',
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
    tagline: 'شفط، نفخ، وتنظيف — 6 رؤوس و شحن USB.',
    metaDescription:
      'مكنسة سيارة 3 في 1: شفط و نفخ و 6 رؤوس. خفيفة و شحن USB. توصيل سريع، دفع عند الاستلام. من 199 درهم.',
    rating: 4.7,
    reviewCount: 310,
    unit: 'مكنسة',
    soldText: 'تباع +800 مكنسة هاد الشهر',
    scarcityText: 'بقاو غير 6 وحدات بالسعر الحالي',
    stockLeft: 6,
    deliveryDays: 'الخميس أو الجمعة',
    checkoutHeadline: 'طوموبيلك نظيفة ف 10 دقائق',
    checkoutDescription: 'شفط و نفخ و 6 رؤوس. خفيفة، شحن USB، دايماً ف الطوموبيل.',
    highlights: [
      '3 في 1: شفط + نفخ + تنظيف',
      '6 رؤوس لكل زاوية',
      'شحن USB ف السيارة',
      'خفيفة — تخزّنها ف الطوموبيل',
    ],
    valueProps: [
      { icon: 'spark', title: '3 في 1', text: 'شفط و نفخ و تنظيف' },
      { icon: 'leaf', title: '6 رؤوس', text: 'لكل زاوية ف السيارة' },
      { icon: 'clock', title: 'شحن USB', text: 'تشحن ف أي مكان' },
      { icon: 'shield', title: 'خفيفة', text: 'سهلة ف الاستعمال' },
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
        sublabel: '6 رؤوس + شاحن USB',
        perks: ['6 رؤوس', 'شحن USB', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
      {
        quantity: 2,
        price: 349,
        compareAt: 398,
        label: 'جوج مكانس',
        sublabel: 'واحدة ليك وواحدة هدية',
        badge: 'الأكثر مبيعاً',
        perks: ['مكنسة ثانية بثمن مخفّض', 'توفير 49 درهم', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
      {
        quantity: 3,
        price: 479,
        compareAt: 597,
        label: '3 مكانس',
        sublabel: 'للعائلة',
        badge: 'أقصى توفير',
        perks: ['3 مكانس كاملين', 'توفير 118 درهم', 'توصيل مجاني', `ضمان ${WARRANTY_DAYS} يوم`],
      },
    ],
    galleryLabels: ['المكنسة كاملة', '6 رؤوس', 'وضع الشفط', 'وضع النفخ', 'الشحن USB'],
    image: '/images/car-vacuum.webp',
    howToUse: {
      title: 'كيفاش تستعمل المكنسة',
      steps: [
        {
          title: 'اختار الرأس',
          body: 'رأس طويل للشقوق، رأس عريض للسجادة. ركّبه و شغّل.',
        },
        {
          title: 'اشفط أو انفخ',
          body: 'الشفط للتراب. النفخ للأماكن الضيقة.',
        },
        {
          title: 'شحّن و خزّن',
          body: 'شحّنها بـ USB و خلّيها ف الطوموبيل. دايماً جاهزة.',
        },
      ],
    },
    pain: {
      eyebrow: 'المشكل',
      title: 'الزوايا ما كتوصلهاش',
      body: 'التراب كيتجمع ف الشقوق. المكانس الكبيرة ما كتدخلش. السيارة كتبقى وسخة حتى من بعد التنظيف.',
      bullets: [
        'التراب ف الزوايا والشقوق',
        'المكانس الكبيرة ما كتناسبش',
        'التنظيف باليد بطيء',
      ],
      imageLabel: 'داخل السيارة قبل التنظيف',
    },
    logic: {
      eyebrow: 'الحل',
      title: '3 وظائف + 6 رؤوس',
      body: 'تشفط، تنفخ، و توصل لكل زاوية. 6 رؤوس و شحن USB. خفيفة و دايماً ف الطوموبيل.',
      bullets: [
        'رأس لكل سطح',
        'النفخ للزوايا الضيقة',
        'خفيفة — تخزّنها ف الطوموبيل',
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
        q: 'واش الشفط قوي؟',
        a: 'إيه. كافي لشفط التراب من السجادة والمقاعد.',
      },
      {
        q: 'شحال كيدوم الشحن؟',
        a: 'ساعة شحن تقريباً. كيكفي لجلسة تنظيف كاملة.',
      },
      {
        q: 'واش 6 رؤوس ف الصندوق؟',
        a: 'إيه. المكنسة + 6 رؤوس + كابل USB.',
      },
      {
        q: 'شحال كياخد التوصيل؟',
        a: '24–48 ساعة. الدفع عند الاستلام فقط.',
      },
      {
        q: 'واش نقدر نتبع الطرد؟',
        a: 'إيه. كنبعثو ليك رابط التتبع ف الواتساب.',
      },
      {
        q: 'واش المنتج أصلي؟',
        a: 'إيه. أصلي ومفحوص قبل ما يتصيفط.',
      },
      {
        q: 'وإلا ما عجبنيش؟',
        a: `عندك ${WARRANTY_DAYS} يوم. راسلنا وكنرجعو ليك الفلوس.`,
      },
    ],
    reviews: [
      {
        name: 'إلياس بنعبدالله',
        city: 'الدار البيضاء',
        rating: 5,
        date: 'منذ 4 أيام',
        text: 'وصلتني كاملة مع 6 رؤوس. نظفت السيارة ف 10 دقائق.',
      },
      {
        name: 'سلمى الرحموني',
        city: 'مراكش',
        rating: 5,
        date: 'منذ أسبوع',
        text: 'هدية لزوجي و عجبتو. الرؤوس عملية والتوصيل سريع.',
      },
      {
        name: 'عمر الشرقي',
        city: 'طنجة',
        rating: 4,
        date: 'منذ أسبوعين',
        text: 'رأس الزوايا كيوصل لأماكن ما كنت نقدر نوصلها.',
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
