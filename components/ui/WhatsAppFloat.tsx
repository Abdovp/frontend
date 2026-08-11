import Icon from './Icon';
import { STORE } from '../../lib/products';

export default function WhatsAppFloat() {
  const number = STORE.whatsapp.replace(/\D/g, '');
  const message = encodeURIComponent('مرحبا! بويا شوب سترد على جميع أسئلتك. كيف يمكنني أساعدك؟');
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا ف الواتساب"
      className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1ebe59] active:scale-95 transition-all duration-200"
    >
      <Icon name="whatsapp" size={22} />
    </a>
  );
}
