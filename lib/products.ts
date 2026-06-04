import type { IconName } from '../components/ui/Icon';

export type ProductId = 'cooling-pack' | 'magnetic-holder';

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
  checkoutHeadline: string;
  checkoutDescription: string;
  highlights: string[];
  valueProps: ValueProp[];
  trustBadges: TrustBadge[];
  guarantees: GuaranteeItem[];
  offers: ProductOffer[];
  galleryLabels: string[];
  /** Public path e.g. /images/pack.png */
  image?: string;
  pain: ProductSection;
  logic: ProductSection;
  proof: ProductSection;
  howItWorks: ProductSection;
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
    scarcityText: 'الشحن مجاني ف آخر 48 ساعة هاد الأسبوع',
    checkoutHeadline: 'برّد طوموبيلك ف دقائق — بلا ما تحرق يديك ف الدركسيون',
    checkoutDescription:
      'مروحة مزدوجة كتطرد الهواء السخون، ومظلة حرارية كتحجب الشمس قبل ما تدخل. النتيجة: جو مريح من أول ما تركب، وحماية للجلد والديكور من التلف.',
    highlights: [
      'حرارة الداخل كتهبط بشكل ملموس ف دقائق',
      'تركيب ف أقل من دقيقة — بلا ورشة',
      'حماية الجلد والبلاستيك من التشقق',
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
    image: '/images/pack.png',
    pain: {
      eyebrow: 'المشكل',
      title: 'الطوموبيل كتولّي فرن، والجلد كيحرق يديك',
      body: 'ف صيف المغرب، الحرارة داخل الطوموبيل كتفوت 60 درجة. كتحرق يديك ف الدركسيون، الريحة كتخنق، والبلاستيك والجلد كيبداو يتشققو. كل مرة تركب، كتعيش نفس المعاناة.',
      bullets: [
        'حرارة خانقة كتخليك ما تقدرش تسوق مباشرة',
        'الجلد والديكور كيتلفو مع الوقت',
        'المكيف وحدو ما كافيش وكيزيد ف البنزين',
      ],
      imageLabel: 'حرارة الطوموبيل ف الصيف',
    },
    logic: {
      eyebrow: 'الحل بالمنطق',
      title: 'تهوية نشطة + حجب حراري = حماية مزدوجة',
      body: 'المروحة المزدوجة كتطرد الهواء السخون وتجدّد الجو بسرعة. المظلة الحرارية كتعكس أشعة الشمس قبل ما توصل للزجاج. بجوج، كتنقص الحرارة بزاف وتخفف على المكيف.',
      bullets: [
        'انخفاض ملموس ف حرارة الداخل ف دقائق',
        'حماية مستمرة للجلد والبلاستيك',
        'استهلاك أقل للبنزين ف الطريق الطويل',
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
        text: 'جربت بزاف ديال الحلول، هاد الباك هو الوحيد اللي بان ليا منطقي: حرارة أقل بكثير ف عز النهار.',
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
    scarcityText: 'الشحن مجاني ف آخر 48 ساعة هاد الأسبوع',
    checkoutHeadline: 'تلفونك ثابت قدامك — بلا ما يطيح وبلا ما تشيح بصرك على الطريق',
    checkoutDescription:
      'مغناطيس قوي وقاعدة صلبة كيخليو التلفون ثابت حتى ف المطبات والمنعطفات. تشوف الـ GPS والمكالمات بأمان، وتثبت أو تحيد التلفون بنقرة وحدة.',
    highlights: [
      'ثبات تام حتى ف الطرق الوعرة والمطبات',
      'تركيب وإزالة ف ثواني بلا أثر',
      'متوافق مع جميع التلفونات الكبيرة والصغيرة',
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
    image: '/images/magnetic-holder.png',
    pain: {
      eyebrow: 'المشكل',
      title: 'التلفون كيطيح، الـ GPS كيتقطع، والتركيز كيضيع',
      body: 'حامل ضعيف معناه خطر ف الطريق. كتقلب على التلفون، كتفوتك مكالمات مهمة، والخريطة كتقطع ف اللحظة اللي محتاجها. والحاملات الرخيصة كتفكّ من الحرارة.',
      bullets: [
        'اهتزاز ووقوع التلفون ف كل فرملة',
        'تشتيت وخطر حقيقي ف السياقة',
        'حاملات رخيصة كتطيح من سخانة الصيف',
      ],
      imageLabel: 'التلفون يطيح ف السيارة',
    },
    logic: {
      eyebrow: 'الحل بالمنطق',
      title: 'مغناطيس قوي + قاعدة صلبة = ثبات 24/7',
      body: 'المغناطيس قوي بزاف وكيمسك التلفون بثبات حتى ف الطرق الوعرة. تثبيت بنقرة، دوران سهل لأي زاوية، وإزالة بلا ما يخلي أثر على التابلو.',
      bullets: [
        'ثبات تام ف المطبات والمنعطفات',
        'تركيب ف 30 ثانية بلا أدوات',
        'متوافق مع التلفونات الكبيرة',
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
