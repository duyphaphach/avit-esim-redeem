import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plane, ShieldCheck, Zap } from 'lucide-react';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'home'});
  return {
    title: `${t('title')} | eSIM Hub`
  };
}

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-40 bg-gradient-to-b from-primary/10 via-background to-background overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-8 z-10 relative">
          <div className="space-y-4 max-w-[800px]">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {t('title')}
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
            <Link href="/redeem" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 text-lg px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all gap-2 group">
                {t('cta')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Steps Section */}
      <section className="w-full py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12 sm:text-4xl">
            {t('steps.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card rounded-2xl shadow-sm border">
              <div className="p-4 bg-primary/10 rounded-full text-primary mb-2">
                <Plane className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">{t('steps.step1.title')}</h3>
              <p className="text-muted-foreground">{t('steps.step1.desc')}</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card rounded-2xl shadow-sm border">
              <div className="p-4 bg-primary/10 rounded-full text-primary mb-2">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">{t('steps.step2.title')}</h3>
              <p className="text-muted-foreground">{t('steps.step2.desc')}</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card rounded-2xl shadow-sm border relative">
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce">
                Instant
              </div>
              <div className="p-4 bg-primary/10 rounded-full text-primary mb-2">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">{t('steps.step3.title')}</h3>
              <p className="text-muted-foreground">{t('steps.step3.desc')}</p>
            </div>

          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="w-full py-16">
        <div className="container px-4 md:px-6 mx-auto text-center space-y-8">
          <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            {t('partners')}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-2xl font-bold">Booking.com</div>
            <div className="text-2xl font-bold">Klook</div>
            <div className="text-2xl font-bold">Agoda</div>
            <div className="text-2xl font-bold">Expedia</div>
          </div>
        </div>
      </section>
    </div>
  );
}
