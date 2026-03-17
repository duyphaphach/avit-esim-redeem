'use client';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, Phone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from '@/i18n/routing';

type ErrorType = 'not_found' | 'expired' | 'fully_redeemed' | 'api_error' | 'rate_limited';

export function ErrorView({ type, onRetry }: { type: ErrorType, onRetry: () => void }) {
  const t = useTranslations('redeem.errors');

  const getErrorContent = () => {
    switch (type) {
      case 'not_found':
        return { icon: <AlertCircle className="w-5 h-5 text-destructive" />, title: 'Booking Not Found', desc: t('not_found'), variant: 'destructive' as const };
      case 'expired':
        return { icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, title: 'Voucher Expired', desc: t('expired'), variant: 'default' as const };
      case 'fully_redeemed':
        return { icon: <AlertCircle className="w-5 h-5 text-blue-500" />, title: 'Fully Redeemed', desc: t('fully_redeemed'), variant: 'default' as const };
      case 'api_error':
        return { icon: <AlertTriangle className="w-5 h-5 text-destructive" />, title: 'System Error', desc: t('api_error'), variant: 'destructive' as const };
      case 'rate_limited':
        return { icon: <AlertTriangle className="w-5 h-5 text-destructive" />, title: 'Too Many Attempts', desc: t('rate_limited'), variant: 'destructive' as const };
    }
  };

  const content = getErrorContent();

  return (
    <div className="space-y-6 max-w-md mx-auto w-full">
      <Alert variant={content.variant} className={content.variant === 'default' ? 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900' : ''}>
        {content.icon}
        <AlertTitle className="ml-2 font-semibold">{content.title}</AlertTitle>
        <AlertDescription className="ml-2 mt-2 leading-relaxed">
          {content.desc}
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1 border-[#ff7c2a]/40 text-[#ff7c2a] hover:bg-[#ff7c2a]/10 hover:text-[#ff7c2a]" onClick={onRetry}>
          Try Another Code
        </Button>
        <Link href="/contact" className="flex-1">
          <Button variant="default" className="w-full gap-2 bg-[#ff7c2a] hover:bg-[#e67300]">
            <Phone className="w-4 h-4" />
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  );
}
