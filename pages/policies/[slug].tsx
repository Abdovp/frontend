import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Icon from '../../components/ui/Icon';
import { policies, policyLinks, type PolicySlug } from '../../lib/navigation';

const slugs = Object.keys(policies) as PolicySlug[];

export default function PolicyPage() {
  const router = useRouter();
  const slug = router.query.slug as PolicySlug;
  const policy = slug ? policies[slug] : null;

  if (!policy) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`${policy.title} | بويا شوب`}</title>
        <meta name="description" content={policy.summary} />
      </Head>
      <Header />
      <main>
        <section className="bg-brand text-white relative overflow-hidden">
          <div className="absolute inset-0 hero-grid-bg opacity-60" />
          <div className="relative container-wide py-14 md:py-16 max-w-3xl">
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 text-sm hover:text-white mb-4">
              <Icon name="arrow-right" size={16} /> الرئيسية
            </Link>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold">{policy.title}</h1>
            <p className="text-white/75 mt-3 text-lg">{policy.summary}</p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-wide max-w-3xl">
            <div className="space-y-8">
              {policy.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="font-heading text-xl font-extrabold text-ink mb-3">{section.heading}</h2>
                  <p className="text-ink/65 leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-ink/[0.08]">
              <p className="font-heading font-bold text-ink mb-4">سياسات أخرى</p>
              <div className="flex flex-wrap gap-2">
                {policyLinks
                  .filter((l) => !l.href.endsWith(slug))
                  .map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="pill-soft hover:bg-brand hover:text-white hover:border-brand transition"
                    >
                      {link.label}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }: { params: { slug: PolicySlug } }) {
  return { props: {} };
}
