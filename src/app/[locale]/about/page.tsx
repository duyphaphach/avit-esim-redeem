import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('nav');
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t('about')}</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-muted-foreground mb-6">
          We are dedicated to providing seamless global connectivity for travelers through our premium eSIM solutions.
        </p>
        <p>
          Partnering with the world&apos;s leading Online Travel Agencies (OTAs), we ensure that you can stay connected the moment you land. Our platform allows you to redeem your purchased eSIM vouchers instantly and securely.
        </p>
      </div>
    </div>
  );
}
