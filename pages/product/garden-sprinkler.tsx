import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { createPurchaseEventId, submitOrder } from '../../lib/api/orders';
import { getCheckoutErrorMessage } from '../../lib/api/order-errors';
import { trackInitiateCheckout, trackPurchase } from '../../lib/analytics/track';
import { saveOrderConfirmation } from '../../lib/order-confirmation';
import { pickUpsellProduct } from '../../lib/upsell';
import { getProduct, type Product } from '../../lib/products';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Icon from '../../components/ui/Icon';
import dynamic from 'next/dynamic';
const UpsellPopup = dynamic(() => import('../../components/UpsellPopup'), { ssr: false });

export default function GardenSprinklerPage() {
  const router = useRouter();
  const product = getProduct('garden-sprinkler');
  const upsellCandidate = getProduct('car-vacuum');
  const [selectedOffer, setSelectedOffer] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeUpsell, setActiveUpsell] = useState<Product | null>(null);

  useEffect(() => {
    void router.prefetch('/thank-you');
  }, [router]);

  useEffect(() => {
    const problemSection = document.getElementById('problem-section');
    if (!problemSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowStickyBar(true);
          return;
        }

        // Keep CTA visible after passing the problem section.
        if (entry.boundingClientRect.top > 0) {
          setShowStickyBar(false);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(problemSection);
    return () => observer.disconnect();
  }, []);

  if (!product || !upsellCandidate) return null;

  const currentOffer = product.offers[selectedOffer];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      return;
    }

    const offer = product.offers[selectedOffer];
    const items = [
      {
        id: product.id,
        lineKey: `${product.id}-${offer.quantity}`,
        name: product.nameAr,
        price: offer.price,
        offer: offer.quantity,
        quantity: 1,
      },
    ];
    const total = offer.price;

    setSubmitting(true);
    setSubmitError('');
    trackInitiateCheckout(
      items.map((item) => ({ productId: item.id, name: item.name, price: item.price, quantity: item.quantity })),
      total
    );

    const eventId = createPurchaseEventId();

    try {
      const result = await submitOrder({
        eventId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        items,
        total,
      });

      saveOrderConfirmation({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        items,
        total,
        eventId,
        orderId: result.id,
        publicOrderId: result.public_order_id,
      });

      trackPurchase({
        eventId,
        value: total,
        items: items.map((item) => ({ productId: item.id, name: item.name, price: item.price, quantity: item.quantity })),
      });

      const upsell = pickUpsellProduct([product.id]);
      if (upsell) {
        setActiveUpsell(upsell);
        setShowUpsell(true);
        setSubmitting(false);
        return;
      }

      setShowUpsell(false);
      setSubmitting(false);
      await router.push('/thank-you');
    } catch (error) {
      setSubmitError(getCheckoutErrorMessage(error));
      setSubmitting(false);
    }
  };

  const handleUpsellAdded = async () => {
    setActiveUpsell(null);
    setShowUpsell(false);
    await router.push('/thank-you');
  };

  const handleUpsellClose = async () => {
    setActiveUpsell(null);
    setShowUpsell(false);
    await router.push('/thank-you');
  };

  const scrollToOrderForm = () => {
    const orderForm = document.getElementById('order-form');
    if (!orderForm) return;

    const headerOffset = 96;
    const targetTop = orderForm.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth',
    });
  };
  
  return (
    <>
      <Head>
        <title>رشاش الحديقة الذكي - حوّل حديقتك لخضراء بدون مجهود | بويا شوب</title>
        <meta name="description" content="احصل على حديقة خضراء جميلة بدون تعب يومي. رشاش دوار ذكي 360° يوفر الماء والوقت ويعطيك عشب أخضر طول السنة. دفع عند الاستلام وضمان 30 يوم." />
        <meta property="og:title" content="رشاش الحديقة الذكي - حوّل حديقتك لخضراء" />
        <meta property="og:description" content="سقي أوتوماتيكي ذكي - وفر 40% من الماء واحصل على حديقة خضراء بدون تعب" />
      </Head>



      <div className="bg-white overflow-x-clip">
        <Header />

        {/* Hero Section */}
        <section className="relative nature-gradient py-12 lg:py-20 overflow-x-clip">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-300/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-start" dir="ltr">
              
              {/* Left: Copy */}
              <div className="text-right order-last lg:order-none space-y-6">
                
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  <Icon name="shield" size={16} />
                  <span>جودة مضمونة 100%</span>
                </div>

                {/* Headline - Emotional + Benefit */}
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight">
                  عييتي من حديقة صفراء<br />
                  <span className="text-green-600">وساعات من السقي اليدوي؟</span>
                </h1>

                {/* Subheadline - Transformation Promise */}
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium">
                  سقي أوتوماتيكي دوار 360° — وفر وقتك وماءك واستمتع بعشب أخضر صحي بدون تعب يومي
                </p>

                {/* Social Proof */}
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} name="star" size={18} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">{product.rating}/5</span>
                  <span className="text-gray-600">({product.reviewCount}+ تقييم موثوق)</span>
                </div>

                {/* Key Benefits */}
                <div className="space-y-3 bg-white rounded-2xl p-6 shadow-lg border border-green-100" dir="rtl">
                  {[
                    'سقي متساوي لكل متر — ولا بقعة صفراء',
                    'وفر حتى 40% من الماء — فاتورة أقل',
                    'تركيب فأقل من دقيقتين — بدون أدوات',
                    'مقاوم للشمس والحرارة — يخدم سنين'
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Icon name="check-circle" size={20} className="text-green-600 flex-shrink-0" />
                      <span className="text-gray-900 font-semibold text-base">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Order Form - Inline */}
                <div id="order-form" className="bg-white rounded-3xl shadow-2xl border-2 border-green-100 overflow-hidden">
                  
                  {/* Form Header */}
                  <div className="lawn-gradient px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-2 text-white/90 text-sm font-bold mb-1">
                      <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
                      <span>🔥 باقي {product.stockLeft} قطع فقط بهذا السعر</span>
                    </div>
                    <h3 className="text-2xl font-black text-white">اطلب الآن — الدفع عند الاستلام</h3>
                  </div>

                  <div className="p-6 lg:p-8">
                    {/* Offer Selection */}
                    <div className="space-y-2 mb-6">
                      {product.offers.map((offer, idx) => (
                        <label
                          key={idx}
                          className={`block cursor-pointer rounded-xl border-2 transition-all ${
                            selectedOffer === idx
                              ? 'border-green-600 bg-green-50 ring-2 ring-green-300'
                              : 'border-gray-200 bg-gray-50 hover:border-green-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="offer"
                            checked={selectedOffer === idx}
                            onChange={() => setSelectedOffer(idx)}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-3 p-4" dir="rtl">
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedOffer === idx ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
                              {selectedOffer === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <div className="flex-1">
                              <div className="font-black text-gray-900 text-base">{offer.label}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-green-700 font-black text-lg">{offer.price} درهم</span>
                                {offer.compareAt && (
                                  <span className="text-gray-400 line-through text-sm">{offer.compareAt} درهم</span>
                                )}
                              </div>
                            </div>
                            {offer.badge && (
                              <span className="bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full text-xs font-black flex-shrink-0">
                                {offer.badge}
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Form Fields */}
                    <form className="space-y-3" onSubmit={handleSubmit}>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-600 focus:ring-4 focus:ring-green-100 focus:outline-none text-right text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal"
                        placeholder="الاسم الكامل"
                      />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-600 focus:ring-4 focus:ring-green-100 focus:outline-none text-right text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal"
                        placeholder="رقم الهاتف"
                      />

                      <a
                        href="https://wa.me/0644166834"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-green-600 bg-green-50 px-4 py-3 text-green-700 font-bold transition-all hover:bg-green-100"
                      >
                        <Icon name="whatsapp" size={20} />
                        <span>تواصل واتساب</span>
                      </a>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full lawn-gradient text-white py-5 rounded-xl font-black text-xl shadow-xl hover:shadow-green-600/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <Icon name="check-circle" size={22} />
                        <span>{submitting ? 'جاري الإرسال...' : 'أكّد طلبي'}</span>
                      </button>

                      {submitError && (
                        <p className="text-center text-sm text-red-600" dir="rtl">
                          {submitError}
                        </p>
                      )}

                      {/* Micro-copy risk reversal */}
                      <p className="text-center text-xs text-gray-500 pt-1" dir="rtl">
                        🔒 بدون دفع مسبق &nbsp;·&nbsp; توصيل 24-48 ساعة &nbsp;·&nbsp; ضمان استرداد 30 يوم
                      </p>
                    </form>

                    {/* Social proof footer */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500" dir="rtl">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span>طلب <strong className="text-gray-700">+{product.reviewCount}</strong> شخص هذا المنتج هذا الشهر</span>
                    </div>
                  </div>
                </div>

                {/* Trust Strip */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Icon name="truck" size={24} className="text-green-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-900">توصيل</p>
                    <p className="text-xs text-gray-600">24-48 ساعة</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Icon name="wallet" size={24} className="text-green-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-900">دفع عند</p>
                    <p className="text-xs text-gray-600">الاستلام</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Icon name="refresh" size={24} className="text-green-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-900">ضمان</p>
                    <p className="text-xs text-gray-600">30 يوم</p>
                  </div>
                </div>
              </div>

              {/* Right: Product Image */}
              <div className="order-first lg:order-none lg:sticky lg:top-24">
                <div className="relative">
                  <Image
                    src="/images/garden-sprinkler.webp"
                    alt="رشاش الحديقة الدوار الذكي"
                    width={700}
                    height={700}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="w-full h-auto rounded-2xl shadow-2xl"
                    priority
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="lawn-gradient text-white py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-black mb-1">+{product.reviewCount}</div>
                <div className="text-sm text-green-100">عميل سعيد</div>
              </div>
              <div>
                <div className="text-3xl font-black mb-1">{product.rating}/5</div>
                <div className="text-sm text-green-100">تقييم ممتاز</div>
              </div>
              <div>
                <div className="text-3xl font-black mb-1">40%</div>
                <div className="text-sm text-green-100">توفير ماء</div>
              </div>
              <div>
                <div className="text-3xl font-black mb-1">2 دقيقة</div>
                <div className="text-sm text-green-100">للتركيب</div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section - PAS Formula */}
        <section id="problem-section" className="py-16 lg:py-24 bg-gradient-to-b from-red-50/30 to-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <span className="inline-block bg-red-100 text-red-700 px-5 py-2 rounded-full text-sm font-bold mb-4">
                😰 المشكلة اللي كتعاني منها
              </span>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                المشكلة اللي كتعاني منها<br />كل يوم
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                كل يوم نفس القصة... كتسقي بيديك، كتضيع وقتك، كتخسر فالماء، والنتيجة؟<br />
                <span className="font-bold text-red-600">عشب أصفر ونباتات ميتة</span>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: '🥵',
                  title: 'وقت ومجهود مهدور',
                  pain: 'كل يوم 30-45 دقيقة واقف فالشمس أو البرد كتسقي بيديك',
                  impact: 'حياتك كلها حول سقي الحديقة... ما عندكش وقت لعائلتك'
                },
                {
                  icon: '💸',
                  title: 'فواتير ماء عالية',
                  pain: 'السقي العشوائي كيضيع حتى 60% من الماء بدون فائدة',
                  impact: 'كتخلص أكثر فالماء... والنتيجة ما كتبانش'
                },
                {
                  icon: '🍂',
                  title: 'حديقة محشومة',
                  pain: 'بقع صفراء، نباتات ميتة، مظهر غير محترم قدام الجيران',
                  impact: 'كتحشم تدعي الضيوف... حديقتك ما بقاتش فخر ليك'
                }
              ].map((problem, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100">
                  <div className="text-6xl mb-6">{problem.icon}</div>
                  <h3 className="text-xl font-black text-gray-900 mb-4">{problem.title}</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed font-medium">{problem.pain}</p>
                  <p className="text-red-600 text-sm font-bold leading-relaxed">{problem.impact}</p>
                </div>
              ))}
            </div>

            {/* Agitation */}
            <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-3xl p-8 lg:p-12 text-center shadow-2xl">
              <p className="text-2xl lg:text-3xl font-black mb-4">
                والمشكل الحقيقي؟
              </p>
              <p className="text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
                مهما سقيتي، مهما تعبتي، مهما خسرتي فالماء...<br />
                <span className="font-black text-yellow-300">الطريقة التقليدية ما غاديش تعطيك حديقة خضراء متساوية أبدًا!</span>
              </p>
            </div>
          </div>
        </section>

        {/* Solution Section - Continued in next part due to length */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <span className="inline-block bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-bold mb-4">
                ✨ الحل الذكي
              </span>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                رشاش دوار 360°<br />
                <span className="text-green-600">التكنولوجيا اللي غادي تغير حياتك</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                سقي أوتوماتيكي ذكي كيوصل لكل متر مربع — وفر وقتك، ماءك، وفلوسك
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="order-2 lg:order-1 space-y-6">
                {[
                  {
                    icon: 'fan',
                    title: 'دوران أوتوماتيكي 360 درجة',
                    desc: 'تقنية الدوران الذكية كتوصل الماء لكل زاوية — سقي متساوي بدون بقع صفراء',
                    benefit: 'النتيجة: حديقة خضراء 100% بدون استثناء'
                  },
                  {
                    icon: 'leaf',
                    title: 'توفير ذكي حتى 40% من الماء',
                    desc: 'نظام الرش الدقيق كيوزع الماء بشكل مدروس — ولا قطرة كتضيع',
                    benefit: 'النتيجة: فواتير أقل + نباتات أكثر صحة'
                  },
                  {
                    icon: 'clock',
                    title: 'تركيب فأقل من دقيقتين',
                    desc: 'ربطو بالخرطوم وخلاص — حتى طفل يقدر يركبو بدون أدوات',
                    benefit: 'النتيجة: راحة فورية من أول يوم'
                  },
                  {
                    icon: 'shield',
                    title: 'مقاوم ومتين — يخدم سنين',
                    desc: 'مصنوع من مواد عالية الجودة كتقاوم الشمس والحرارة والضغط',
                    benefit: 'النتيجة: استثمار واحد لسنوات طويلة'
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border-2 border-green-100 hover:border-green-300 transition-all shadow-sm hover:shadow-lg">
                    <div className="flex gap-4 items-start text-right">
                      <div className="bg-green-600 p-3 rounded-xl flex-shrink-0">
                        <Icon name={feature.icon as any} size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-700 text-sm leading-relaxed mb-2">{feature.desc}</p>
                        <p className="text-green-700 text-sm font-bold">{feature.benefit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative">
                  <Image
                    src="/images/sprinkler-solution.webp"
                    alt="رشاش الحديقة أثناء العمل"
                    width={700}
                    height={700}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="lazy"
                    className="w-full rounded-2xl shadow-2xl"
                  />
                  {/* Overlay Stats */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-xl p-3 shadow-xl">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-black text-green-600">360°</div>
                        <div className="text-[10px] text-gray-600">تغطية كاملة</div>
                      </div>
                      <div>
                        <div className="text-lg font-black text-green-600">40%</div>
                        <div className="text-[10px] text-gray-600">توفير ماء</div>
                      </div>
                      <div>
                        <div className="text-lg font-black text-green-600">0</div>
                        <div className="text-[10px] text-gray-600">مجهود منك</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transformation - Before/After */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white" dir="rtl">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4">
                شاهد التحول بعينك
              </h2>
              <p className="text-xl text-gray-600">
                الفرق بين الطريقة القديمة والطريقة الذكية
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 border-4 border-red-300 rounded-3xl p-8 lg:p-10 text-right">
                <div className="bg-red-600 text-white px-6 py-3 rounded-full text-base font-black mb-8 inline-block shadow-lg">
                  ❌ الطريقة القديمة
                </div>
                <ul className="space-y-5 text-right">
                  {[
                    { text: 'سقي غير متساوي', sub: 'بقع صفراء فكل مكان' },
                    { text: 'هدر كبير فالماء', sub: 'حتى 60% من الماء كيضيع' },
                    { text: '30-45 دقيقة يوميًا', sub: 'وقت ثمين مهدور' }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start justify-between gap-3">
                      <div className="text-right flex-1">
                        <div className="text-gray-900 font-bold">{item.text}</div>
                        <div className="text-gray-600 text-sm">{item.sub}</div>
                      </div>
                      <div className="flex-shrink-0 text-2xl">❌</div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-400 rounded-3xl p-8 lg:p-10 relative text-right">
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full text-sm font-black shadow-xl rotate-12">
                  🏆 الحل الذكي
                </div>
                <div className="lawn-gradient text-white px-6 py-3 rounded-full text-base font-black mb-8 inline-block shadow-lg">
                  ✅ مع الرشاش الدوار
                </div>
                <ul className="space-y-5 text-right">
                  {[
                    { text: 'سقي مثالي متساوي', sub: 'حديقة خضراء 100%' },
                    { text: 'توفير 40% من الماء', sub: 'فواتير أقل كل شهر' },
                    { text: 'راحة تامة', sub: 'خليه يخدم وحدو' }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start justify-between gap-3">
                      <div className="text-right flex-1">
                        <div className="text-gray-900 font-bold">{item.text}</div>
                        <div className="text-gray-700 text-sm">{item.sub}</div>
                      </div>
                      <div className="flex-shrink-0 text-2xl">✅</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4">
                كيفاش تستعملو؟
              </h2>
              <p className="text-xl text-gray-600">
                3 خطوات بسيطة — يبدا يخدم فأقل من دقيقتين
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {product.howToUse.steps.map((step, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-green-300">
                  <div className="lawn-gradient text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-lg">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <span className="inline-block bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full text-sm font-bold mb-4">
                ⭐ آراء العملاء
              </span>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4">
                ماذا يقول من جرّبوه؟
              </h2>
              <p className="text-xl text-gray-600">
                أكثر من {product.reviewCount} عميل راضي
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.reviews.map((review, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="star" size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4 text-right italic">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-3 justify-end">
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                      <p className="text-gray-500 text-xs">{review.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantee */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border-4 border-green-200">
              <div className="text-center">
                <div className="inline-block bg-green-600 text-white p-6 rounded-full mb-6 shadow-xl">
                  <Icon name="shield" size={48} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6">
                  ضماننا الحديدي لراحة بالك
                </h2>
                <div className="space-y-4 text-right max-w-2xl mx-auto mb-8">
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="font-bold text-gray-900 mb-1">✅ ضمان 30 يوم استرجاع كامل</p>
                    <p className="text-gray-600 text-sm">إلا ما شفتيش نتيجة، نرجعو ليك فلوسك</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="font-bold text-gray-900 mb-1">✅ دفع آمن عند الاستلام</p>
                    <p className="text-gray-600 text-sm">ما كتخلص حتى توصلك السلعة</p>
                  </div>
                </div>
                <p className="text-lg text-gray-700 font-medium">
                  المخاطرة كاملة علينا. أنت ما عندك ما تخسر! 🌿
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4">
                أسئلة شائعة
              </h2>
            </div>

            <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6" dir="rtl">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-black text-gray-900">كيفاش تطلب؟</h3>
                <span className="inline-flex items-center gap-2 bg-white text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                  <Icon name="truck" size={14} />
                  خطوات الطلب
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { n: '1', icon: 'cart', t: 'عمّر الفورم', b: 'اختار العرض المناسب ودخل بياناتك' },
                  { n: '2', icon: 'phone', t: 'نأكدو معاك', b: 'فريقنا كيتاصل بيك لتأكيد الطلب' },
                  { n: '3', icon: 'truck', t: 'التوصيل والدفع', b: 'كتخلص غير ملي توصلك السلعة' }
                ].map((step) => (
                  <div key={step.n} className="bg-white rounded-xl p-4 border border-green-100 text-right">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-full lawn-gradient text-white text-sm font-black flex items-center justify-center">
                        {step.n}
                      </div>
                      <Icon name={step.icon as any} size={18} className="text-green-700" />
                    </div>
                    <p className="font-bold text-gray-900 mb-1">{step.t}</p>
                    <p className="text-sm text-gray-600">{step.b}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {product.faqs[0].items
                .concat(product.faqs[1].items)
                .concat([
                  {
                    q: 'كيفاش ندير الطلب خطوة بخطوة؟',
                    a: 'اختار العرض، عمر الاسم ورقم الهاتف والمدينة، ومن بعد فريقنا كيتاصل بيك للتأكيد. التوصيل كيكون بين 24 و48 ساعة، وكتخلص غير عند الاستلام.'
                  }
                ])
                .map((faq, idx) => (
                <details
                  key={idx}
                  open={faq.q === 'وإلا ما عجبنيش؟'}
                  className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all border border-gray-200"
                >
                  <summary className="font-bold text-gray-900 cursor-pointer text-right text-lg flex items-center justify-between">
                    <span>{faq.q}</span>
                    <span className="text-green-600 text-2xl">+</span>
                  </summary>
                  <p className="text-gray-600 mt-4 leading-relaxed text-right">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews CTA Section */}
        <section className="py-12 bg-white text-center">
          <button
            type="button"
            onClick={scrollToOrderForm}
            className="inline-flex items-center gap-3 lawn-gradient text-white px-10 py-5 rounded-full font-black text-xl hover:shadow-2xl transition-all shadow-lg transform hover:scale-105"
          >
            <Icon name="cart" size={20} />
            <span>اطلب الآن</span>
          </button>
        </section>

        {/* Sticky Bottom CTA */}
        {showStickyBar && (
          <div className="fixed bottom-0 left-0 right-0 lawn-gradient text-white py-4 px-4 shadow-2xl z-50">
            <div className="container mx-auto flex items-center justify-center">
              <button
                type="button"
                onClick={scrollToOrderForm}
                className="bg-white text-green-700 px-8 py-4 rounded-full font-black text-lg sm:text-xl hover:bg-green-50 transition-all shadow-lg"
              >
                اطلب الآن
              </button>
            </div>
          </div>
        )}

        {showUpsell && activeUpsell && (
          <UpsellPopup
            product={activeUpsell}
            onAdded={handleUpsellAdded}
            onClose={handleUpsellClose}
          />
        )}
        
        <Footer />
      </div>
    </>
  );
}
