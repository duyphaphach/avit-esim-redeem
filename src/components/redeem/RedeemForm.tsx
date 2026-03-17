'use client';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function RedeemForm({ onSubmit, isLoading }: { onSubmit: (code: string) => void, isLoading: boolean }) {
  const t = useTranslations('redeem');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) onSubmit(code.trim());
  };

  return (
    <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm mx-auto w-full">
      <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
      <p className="text-muted-foreground mb-6">{t('subtitle')}</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="booking-code">{t('code_label')}</Label>
          <Input 
            id="booking-code" 
            placeholder={t('code_placeholder')}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="h-12 text-lg uppercase"
          />
        </div>
        
        <Button typeof="submit" className="w-full h-12 text-lg font-medium bg-[#ff7c2a] hover:bg-[#e67300]" disabled={isLoading || !code.trim()}>
          {isLoading && <Loader2 className="mr-2 w-5 h-5 animate-spin" />}
          {t('submit')}
        </Button>
      </form>
    </div>
  );
}
