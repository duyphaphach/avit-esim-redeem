import { useTranslations } from 'next-intl';

export default function FAQPage() {
  const t = useTranslations('nav');
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t('faq')}</h1>
      <div className="space-y-6">
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">How do I redeem my eSIM?</h3>
          <p className="text-muted-foreground">Simply navigate to the Redeem page, enter your booking code, and choose how many eSIMs you want to activate. You will receive a QR code immediately.</p>
        </div>
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Can I redeem my codes one by one?</h3>
          <p className="text-muted-foreground">Yes! If your booking includes multiple eSIMs, you can redeem them individually as needed.</p>
        </div>
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">When does my voucher expire?</h3>
          <p className="text-muted-foreground">Your voucher is valid anytime before your stated date of use, and up to 7 days after.</p>
        </div>
      </div>
    </div>
  );
}
