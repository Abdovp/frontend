import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
  firmName: string;
  whatsapp: string;
  phone: string;
}

export default function ContactPopup({ isOpen, onClose, firmName, whatsapp, phone }: ContactPopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: "", phone: "", service: "", message: "" });
      onClose();
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="إغلاق"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">تم إرسال طلبك بنجاح!</h3>
              <p className="text-gray-600">سيتواصل معك فريقنا القانوني في أقرب وقت ممكن</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-navy-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">H</span>
                </div>
                <h2 className="text-2xl font-bold text-navy-900 mb-2">استشارة قانونية مجانية</h2>
                <p className="text-gray-600">املأ بياناتك وسنتواصل معك خلال 24 ساعة</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
                    placeholder="+971 50 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    نوع الخدمة *
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">اختر نوع الخدمة</option>
                    <option value="family">مسائل الأسرة والزواج والطلاق</option>
                    <option value="labor">قانون العمل</option>
                    <option value="realestate">المنازعات العقارية</option>
                    <option value="debt">تحصيل الديون</option>
                    <option value="criminal">الجرائم والجنح</option>
                    <option value="notary">كاتب العدل</option>
                    <option value="other">خدمات أخرى</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    وصف موجز للحالة
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all resize-none"
                    placeholder="اكتب وصفاً مختصراً عن حالتك القانونية..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-l from-navy-600 to-navy-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جاري الإرسال..." : "احجز استشارتك المجانية"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600 mb-3">أو تواصل معنا مباشرة:</p>
                <div className="flex justify-center gap-4">
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-2 text-navy-600 hover:text-navy-800 font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    اتصل الآن
                  </a>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    واتساب
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
