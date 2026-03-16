import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Rocket, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background/95">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">{t('company')}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Experience seamless global connectivity with our premium travel eSIM solutions.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4">{t('links')}</h3>
            <ul className="space-y-3 nav-links text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">{tNav('home')}</Link></li>
              <li><Link href="/products" className="hover:text-foreground transition-colors">{tNav('products')}</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">{tNav('about')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4">{t('support')}</h3>
            <ul className="space-y-3 nav-links text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-foreground transition-colors">{tNav('faq')}</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">{tNav('contact')}</Link></li>
              <li><Link href="/redeem" className="hover:text-foreground transition-colors font-medium text-primary">{tNav('redeem')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4">{tNav('contact')}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@esimhub.example.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (800) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {t('company')}. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
