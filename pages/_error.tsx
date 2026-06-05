import type { NextPageContext } from 'next';
import Link from 'next/link';

interface ErrorProps {
  statusCode?: number;
}

export default function ErrorPage({ statusCode }: ErrorProps) {
  const code = statusCode ?? 500;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4" dir="rtl">
      <div className="text-center max-w-md">
        <p className="font-heading text-6xl font-extrabold text-brand mb-3">{code}</p>
        <h1 className="font-heading text-2xl font-bold text-ink mb-2">وقع خطأ</h1>
        <p className="text-ink/60 mb-8">عذراً، وقع مشكل ف تحميل الصفحة. جرّب مرة أخرى.</p>
        <Link href="/" className="btn-primary">
          رجوع للرئيسية
        </Link>
      </div>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};
