import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon, { type IconName } from '../components/ui/Icon';
import { STORE } from '../lib/products';
import { useState } from 'react';

const channels: { icon: IconName; title: string; lines: string[] }[] = [
  { icon: 'phone', title: 'الهاتف', lines: [STORE.phone] },
  { icon: 'whatsapp', title: 'واتساب', lines: [STORE.phone, 'جواب سريع بالدارجة'] },
  { icon: 'mail', title: 'البريد الإلكتروني', lines: [STORE.email] },
  { icon: 'clock', title: 'ساعات العمل', lines: ['متاحون 7/7', 'من 9 صباحاً حتى 10 ليلاً'] },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <>
      <Head>
        <title>اتصل بنا | بويا شوب</title>
        <meta name="description" content="تواصل مع فريق بويا شوب — كنجاوبو على جميع أسئلتك بالدارجة قبل وبعد الطلب." />
      </Head>
      <Header />
      <main className="section-padding bg-cream">
        <div className="container-wide max-w-5xl">
          <div className="text-center mb-12">
            <span className="eyebrow mb-4 justify-center">
              <span className="w-6 h-px bg-current opacity-60" /> تواصل معنا
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-ink">واجدين نعاونوك</h1>
            <p className="text-ink mt-4 text-lg">أي سؤال على منتج ولا طلب؟ الفريق ديالنا قريب منك.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="grid sm:grid-cols-2 gap-4 content-start">
              {channels.map((c) => (
                <div key={c.title} className="card-flat p-5">
                  <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-brand text-white shadow-brand mb-3">
                    <Icon name={c.icon} size={22} className="text-accent" />
                  </span>
                  <p className="font-heading font-bold text-ink mb-1">{c.title}</p>
                  {c.lines.map((l) => (
                    <p key={l} className="text-sm text-ink/55">{l}</p>
                  ))}
                </div>
              ))}
            </div>

            <div className="card-elevated p-6 sm:p-8">
              {sent ? (
                <div className="text-center py-10">
                  <span className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600">
                    <Icon name="check-circle" size={30} />
                  </span>
                  <h2 className="font-heading text-2xl font-extrabold text-ink mb-2">توصلنا برسالتك!</h2>
                  <p className="text-ink">غادي نردو عليك ف أقرب وقت. شكراً على تواصلك.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="field-label">الاسم الكامل</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="field-input"
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="field-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label">رقم الهاتف</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="field-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">رسالتك</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="field-input resize-none"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    <Icon name="arrow-left" size={18} />
                    إرسال الرسالة
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
