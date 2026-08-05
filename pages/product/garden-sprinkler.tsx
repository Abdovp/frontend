import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { getProduct } from '../../lib/products';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Icon from '../../components/ui/Icon';

export default function GardenSprinklerPage() {
  const product = getProduct('garden-sprinkler');
  const [selectedOffer, setSelectedOffer] = useState(1); // Default to best-seller offer
  const [formData, setFormData] = useState({ name: '', phone: '' });

  if (!product) return null;

  const currentOffer = product.offers[selectedOffer];
  
  return (
    <>
      <Head>
        <title>{product.nameAr} | بويا شوب</title>
        <meta name="description" content={product.metaDescription} />
      </Head>

      <div className="bg-white">
        <Header />

        {/* Hero Section - Clean Luxury Design */}
        <section className="relative bg-gradient-to-b from-green-50/30 via-white to-white py-8 lg:py-20">
          <div className="container-custom">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 lg:gap-12 xl:gap-16 items-start">
                
                {/* Left: Product Image */}
                <div className="order-1 xl:sticky xl:top-28">
                  <div className="relative xl:max-w-[560px]">
                    <div className="relative rounded-2xl xl:rounded-[2rem] overflow-hidden shadow-xl xl:shadow-[0_30px_80px_-32px_rgba(17,24,39,0.45)] border-4 border-white">
                      <Image
                        src="/images/garden-sprinkler.webp"
                        alt={product.nameAr}
                        width={800}
                        height={800}
                        className="w-full h-auto"
                        priority
                      />
                      
                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-full text-sm font-black shadow-lg">
                        ✓ جودة مضمونة 100%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Product Info & CTA */}
                <div className="order-2 space-y-6 xl:space-y-7">
                  
                  {/* Trust Badge */}
                  <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                    <Icon name="shield" className="w-4 h-4" />
                    <span>منتج أصلي من بويا شوب</span>
                  </div>

                  {/* Main Headline - Benefit Driven */}
                  <h1 className="text-3xl lg:text-5xl xl:text-[3.5rem] font-black text-gray-900 leading-tight xl:leading-[1.08] text-right">
                    خَلّي حديقتك ديما خضراء<br />
                    بلا ما توقف تسقي 🌿
                  </h1>

                  {/* Subheadline */}
                  <p className="text-lg lg:text-xl text-gray-700 leading-relaxed text-right max-w-2xl">
                    رشاش دوار 360° — سقي أوتوماتيكي ذكي كيوفر ليك الوقت والماء ويعطيك حديقة خضراء طول العام
                  </p>

                  <div className="w-full max-w-2xl" dir="rtl">
                    <div className="flex flex-row-reverse items-center justify-end gap-2 text-sm text-gray-500 text-right">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Icon key={i} name="star" className="w-3.5 h-3.5 text-amber-400 fill-current" />
                        ))}
                      </div>
                      <span className="font-black text-gray-900">{product.rating}/5</span>
                      <span>أكثر من {product.reviewCount} تقييم</span>
                    </div>
                    <div className="mt-2 text-sm font-black text-red-600 text-right">
                      🔥 عرض لفترة محدودة
                    </div>
                  </div>

                  {/* Main benefits list */}
                  <div className="w-full max-w-2xl" dir="rtl">
                    <ul className="space-y-2 text-sm text-gray-700 font-medium">
                      <li className="flex items-start gap-2 text-right">
                        <Icon name="check" className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          سقي متساوي بزاوية <span dir="ltr" className="inline-block">360°</span> حتى لآخر شبر
                        </span>
                      </li>
                      {[
                        'يوفر الماء والوقت كل يوم',
                        'تركيب سهل فـ دقائق قليلة',
                        'مقاوم للحرارة والشمس ويخدم طويلًا'
                      ].map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-right">
                          <Icon name="check" className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Order Form - Inline */}
                  <div id="order-form" className="bg-white rounded-2xl xl:rounded-[2rem] p-6 lg:p-8 shadow-xl xl:shadow-[0_24px_80px_-32px_rgba(17,24,39,0.35)] border-2 border-gray-200 w-full max-w-2xl mx-auto">
                    {/* Offer Selection */}
                    <div className="mb-6">
                      <h3 className="text-gray-900 font-black text-lg mb-4 text-right">
                        اختار العرض المناسب:
                      </h3>
                      <div className="space-y-3 xl:space-y-4">
                        {product.offers.map((offer, idx) => (
                          <label
                            key={idx}
                            className={`block relative cursor-pointer ${
                              selectedOffer === idx
                                ? 'ring-2 ring-green-600 bg-green-50'
                                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                            } rounded-xl xl:rounded-2xl p-4 xl:p-5 transition-all`}
                          >
                            <input
                              type="radio"
                              name="offer"
                              checked={selectedOffer === idx}
                              onChange={() => setSelectedOffer(idx)}
                              className="sr-only"
                            />
                            
                            <div className="flex items-center justify-between gap-4">
                              <div className="text-right flex-1">
                                <div className="font-black text-xl text-gray-900 mb-1">
                                  {offer.price} درهم
                                  {offer.compareAt && (
                                    <span className="text-sm text-gray-400 line-through mr-2">
                                      {offer.compareAt} درهم
                                    </span>
                                  )}
                                </div>
                                <div className="text-gray-600 font-bold text-sm">
                                  {offer.quantity} {offer.quantity === 1 ? 'قطعة' : 'قطع'}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {offer.badge && (
                                  <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 px-2 py-1 rounded-full text-xs font-black">
                                    {offer.badge}
                                  </span>
                                )}
                                {offer.compareAt && (
                                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    وفر {offer.compareAt - offer.price} DH
                                  </span>
                                )}
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedOffer === idx
                                    ? 'border-green-600 bg-green-600'
                                    : 'border-gray-300'
                                }`}>
                                  {selectedOffer === idx && (
                                    <Icon name="check" className="w-3 h-3 text-white" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-gray-900 font-bold mb-2 text-right text-sm">
                          الاسم الكامل *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-green-600 focus:outline-none text-right text-gray-900 font-semibold"
                          placeholder="مثال: محمد العلمي"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-900 font-bold mb-2 text-right text-sm">
                          رقم الهاتف *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-green-600 focus:outline-none text-right text-gray-900 font-semibold"
                          placeholder="مثال: 0612345678"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-5 rounded-xl font-black text-lg shadow-2xl hover:shadow-green-600/50 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
                    >
                      <Icon name="check" className="w-5 h-5" />
                      <span>أكّد طلبك الآن — {currentOffer.price} درهم</span>
                    </button>

                    {/* Trust Message */}
                    <div className="flex items-center justify-center xl:justify-between gap-4 text-xs text-gray-600 mt-4 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Icon name="truck" className="w-4 h-4 text-green-600" />
                        <span>توصيل 24-48h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="wallet" className="w-4 h-4 text-green-600" />
                        <span>دفع عند الاستلام</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="shield" className="w-4 h-4 text-green-600" />
                        <span>ضمان 30 يوم</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value Props Grid - Below Hero */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
                {product.valueProps?.slice(0, 4).map((prop, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:shadow-lg transition-shadow">
                    <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon name={prop.icon as any} className="w-7 h-7 text-green-700" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{prop.title}</h4>
                    <p className="text-sm text-gray-600">{prop.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Strip */}
        <section className="bg-green-600 text-white py-4">
          <div className="container-custom">
            <div className="flex items-center justify-center gap-8 text-center flex-wrap">
              <div>
                <div className="text-2xl font-black">+{product.reviewCount}</div>
                <div className="text-sm text-green-100">عميل راضي</div>
              </div>
              <div className="hidden lg:block w-px h-10 bg-white/20"></div>
              <div>
                <div className="text-2xl font-black">{product.rating}/5</div>
                <div className="text-sm text-green-100">تقييم ممتاز</div>
              </div>
              <div className="hidden lg:block w-px h-10 bg-white/20"></div>
              <div>
                <div className="text-2xl font-black">24-48h</div>
                <div className="text-sm text-green-100">توصيل سريع</div>
              </div>
              <div className="hidden lg:block w-px h-10 bg-white/20"></div>
              <div>
                <div className="text-2xl font-black">30 يوم</div>
                <div className="text-sm text-green-100">ضمان استرجاع</div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section - Softer Design */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container-custom max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-bold mb-4">
                تعبتي من هاد المشاكل؟
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                واش باقي كتسقي حديقتك بالطريقة التقليدية؟
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                كتضيع وقتك وفلوسك... والنتيجة؟ عشب أصفر ونباتات ميتة
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '😫',
                  title: 'تهنى من التعب اليومي',
                  desc: 'كل يوم خاصك تخرج تسقي بيديك... 30 دقيقة أو أكثر فالحر والبرد'
                },
                {
                  icon: '💸',
                  title: 'كتخسر فالماء والفلوس',
                  desc: 'السقي العشوائي كيضيع حتى 60% من الماء — فواتير عالية بدون نتيجة'
                },
                {
                  icon: '🍂',
                  title: 'حديقة مخربة ومحشومة',
                  desc: 'بقع صفراء، نباتات ميتة، مظهر غير متساوي... حشومة قدام الضيوف'
                }
              ].map((problem, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="text-5xl mb-4">{problem.icon}</div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">{problem.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section - Clean White */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container-custom max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold mb-4">
                ✨ الحل الذكي
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                رشاش دوار 360° — حديقة خضراء بلا مجهود
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                تقنية ذكية كتسقي كل متر مربع بدقة... وفر وقتك، ماءك، وفلوسك
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="space-y-6">
                  {[
                    {
                      icon: 'settings',
                      title: 'سقي موحّد 360 درجة',
                      desc: 'الدوران الأوتوماتيكي كيوصل الماء لكل بقعة — ولا شبر كيتفوت'
                    },
                    {
                      icon: 'droplets',
                      title: 'توفير ذكي فالماء',
                      desc: 'تقنية الرش الدقيق كتوفر حتى 40% من الماء مقارنة بالسقي العادي'
                    },
                    {
                      icon: 'zap',
                      title: 'تركيب فثواني',
                      desc: 'ربطو فالخرطوم وخلاص — حتى طفل صغير يقدر يركبو'
                    },
                    {
                      icon: 'anchor',
                      title: 'ثابت وقوي',
                      desc: 'قاعدة متينة ما كتحركش حتى فأقوى ضغط ماء'
                    }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex gap-4 items-start bg-gray-50 rounded-xl p-5 border border-gray-200">
                      <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                        <Icon name={feature.icon as any} className="w-6 h-6 text-green-700" />
                      </div>
                      <div className="text-right flex-1">
                        <h3 className="font-black text-lg mb-1 text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/sprinkler-solution.webp"
                    alt="Garden Sprinkler in Action"
                    width={600}
                    height={600}
                    className="w-full rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold mb-4">
                سهولة الاستخدام
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                كيفاش تستعملو؟ 3 خطوات بسيطة
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {product.howToUse.steps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-shadow h-full border border-gray-200">
                    <div className="bg-gradient-to-br from-green-600 to-green-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-lg">
                      {idx + 1}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.body}</p>
                  </div>
                  
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -left-4 transform -translate-y-1/2 text-green-600 text-3xl">
                      ←
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before/After Comparison */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                الفرق واضح — شوف بعينك 👀
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold mb-6 inline-block">
                  ❌ بدون الرشاش
                </div>
                <ul className="space-y-4 text-right">
                  {[
                    'سقي غير متساوي — بقع صفراء وبقع خضراء',
                    'استهلاك كبير فالماء — فواتير عالية',
                    'وقت ومجهود يومي',
                    'نباتات ميتة فالأماكن البعيدة',
                    'مظهر غير محترف لحديقتك'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 justify-end">
                      <span className="text-gray-700">{item}</span>
                      <span className="text-red-500 flex-shrink-0 text-xl">✗</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8">
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold mb-6 inline-block">
                  ✅ مع الرشاش الدوار
                </div>
                <ul className="space-y-4 text-right">
                  {[
                    'سقي مثالي ومتساوي — حديقة خضراء 100%',
                    'توفير 40% من الماء — فواتير أقل',
                    'راحة تامة — خليه يخدم وحدو',
                    'نمو صحي ومتناسق لكل النباتات',
                    'حديقة بمظهر احترافي كالمنتزهات'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 justify-end">
                      <span className="text-gray-700">{item}</span>
                      <span className="text-green-600 flex-shrink-0 text-xl">✓</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to Order Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold mb-4">
                📝 كيفاش تكوماندي؟
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                الطلب سهل وبسيط — 4 خطوات فقط
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                ما خاصكش تخلص حتى توصلك السلعة — دفع آمن 100%
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  number: '1',
                  icon: '📋',
                  title: 'عمّر الفورم',
                  desc: 'دير الاسم ديالك ورقم التيليفون فالفورم لتحت',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  number: '2',
                  icon: '📞',
                  title: 'التأكيد',
                  desc: 'فريقنا غيتصل بيك فأقل من ساعة باش يأكد الطلب',
                  color: 'from-green-500 to-green-600'
                },
                {
                  number: '3',
                  icon: '🚚',
                  title: 'التوصيل',
                  desc: 'كنوصلو ليك المنتج لباب الدار ف24-48 ساعة',
                  color: 'from-orange-500 to-orange-600'
                },
                {
                  number: '4',
                  icon: '💰',
                  title: 'الخلاص',
                  desc: 'تخلص غير ملي توصلك السلعة — ما كتخاطرش بوالو',
                  color: 'from-purple-500 to-purple-600'
                }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-gray-50 rounded-2xl p-6 text-center h-full border-2 border-gray-200 hover:border-green-500 transition-all hover:shadow-xl">
                    {/* Number Badge */}
                    <div className={`bg-gradient-to-r ${step.color} text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4 shadow-lg`}>
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className="text-5xl mb-4">{step.icon}</div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-black text-gray-900 mb-3">{step.title}</h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                  
                  {/* Arrow between steps */}
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -left-3 transform -translate-y-1/2 text-gray-300 text-2xl z-10">
                      ←
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Trust Reassurance */}
            <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-right">
                <div className="flex items-center gap-4">
                  <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg mb-1">دفع عند الاستلام</h4>
                    <p className="text-gray-600 text-sm">ما كتخلصش حتى توصلك السلعة وتشوفها بعينك</p>
                  </div>
                </div>
                
                <div className="hidden md:block w-px h-12 bg-gray-300"></div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg">
                    🔒
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg mb-1">بياناتك محمية 100%</h4>
                    <p className="text-gray-600 text-sm">ما كنشاركوش المعلومات ديالك مع حتى واحد</p>
                  </div>
                </div>
                
                <div className="hidden md:block w-px h-12 bg-gray-300"></div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg">
                    ↩️
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg mb-1">ضمان الاسترجاع</h4>
                    <p className="text-gray-600 text-sm">إلا ما عجبكش المنتج، فلوسك راجعة ف30 يوم</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-10">
              <a 
                href="#order-form"
                className="inline-block bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-12 py-5 rounded-xl text-xl font-black shadow-2xl hover:shadow-green-600/50 transition-all duration-300 transform hover:scale-[1.05]"
              >
                🛒 اطلب دابا — توصيل مجاني
              </a>
              <p className="text-gray-500 text-sm mt-4">
                ⏰ العرض صالح لفترة محدودة — اطلب دابا قبل ما يسالي
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof - Reviews */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container-custom max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-bold mb-4">
                ⭐ آراء العملاء
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                شوف آش قالو اللي جربوه
              </h2>
              <div className="flex items-center justify-center gap-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="star" className="w-8 h-8 text-amber-400 fill-current" />
                  ))}
                </div>
                <div className="text-right">
                  <div className="font-black text-2xl text-gray-900">{product.rating}/5</div>
                  <div className="text-sm text-gray-600">من +{product.reviewCount} تقييم</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {product.reviews.slice(0, 6).map((review, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-shadow">
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="star" className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed text-right">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-3 justify-end border-t border-gray-100 pt-4">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{review.name}</div>
                      <div className="text-sm text-gray-500">{review.city}</div>
                    </div>
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scarcity & Urgency */}
        <section className="py-8 bg-gradient-to-r from-red-600 to-orange-600 text-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
              <div className="flex-1">
                <div className="text-sm font-bold mb-2">⏰ المخزون محدود جداً</div>
                <div className="text-2xl lg:text-3xl font-black">
                  باقي غير {product.stockLeft} قطعة — اطلب دابا قبل ما يساليو
                </div>
              </div>
              <a 
                href="#order-form"
                className="bg-white text-red-600 px-10 py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition-colors shadow-2xl whitespace-nowrap"
              >
                احصل عليه الآن 🔥
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold mb-4">
                ❓ أسئلة شائعة
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
                إجابات على كل الأسئلة
              </h2>
            </div>

            <div className="space-y-6">
              {product.faqs.map((group, groupIdx) => (
                <div key={groupIdx}>
                  <h3 className="text-xl font-black text-gray-900 mb-4 text-right">{group.title}</h3>
                  <div className="space-y-4">
                    {group.items.map((faq, idx) => (
                      <details key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group">
                        <summary className="font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                          <span className="text-right flex-1">{faq.q}</span>
                          <span className="text-green-600 text-2xl transform group-open:rotate-180 transition-transform flex-shrink-0 mr-4">
                            ▼
                          </span>
                        </summary>
                        <p className="mt-4 text-gray-600 leading-relaxed text-right border-t border-gray-200 pt-4">
                          {faq.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Guarantees */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: '🔒',
                  title: 'دفع آمن 100%',
                  desc: 'الخلاص عند الاستلام — ما كتخلصش حتى توصلك'
                },
                {
                  icon: '🚚',
                  title: 'توصيل سريع',
                  desc: 'كنوصلو لكل مدن المغرب ف24-48 ساعة'
                },
                {
                  icon: '✅',
                  title: 'ضمان 30 يوم',
                  desc: 'فلوسك راجعة إلا ما عجبكش — بلا أسئلة'
                },
                {
                  icon: '📞',
                  title: 'دعم محترف',
                  desc: 'فريقنا ديما فخدمتك — اتصل فأي وقت'
                }
              ].map((item, idx) => (
                <div key={idx} className="text-center p-6 bg-white border border-gray-200 rounded-xl">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="font-black text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
