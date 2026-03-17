'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { RedeemForm } from '@/components/redeem/RedeemForm';
import { BookingCard, BookingData } from '@/components/redeem/BookingCard';
import { SuccessView, QRCodeData } from '@/components/redeem/SuccessView';
import { ErrorView } from '@/components/redeem/ErrorView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertCircle, CheckCircle2, HelpCircle, Power, QrCode, Smartphone } from 'lucide-react';
import axios from 'axios';

type UIState = 'entry' | 'found' | 'success' | 'not_found' | 'expired' | 'fully_redeemed' | 'api_error' | 'rate_limited';
type ErrorUIState = 'not_found' | 'expired' | 'fully_redeemed' | 'api_error' | 'rate_limited';

const redeemSteps = [
  { titleKey: 'guide.redeem.step1.title', descriptionKey: 'guide.redeem.step1.description' },
  { titleKey: 'guide.redeem.step2.title', descriptionKey: 'guide.redeem.step2.description' },
  { titleKey: 'guide.redeem.step3.title', descriptionKey: 'guide.redeem.step3.description' },
  { titleKey: 'guide.redeem.step4.title', descriptionKey: 'guide.redeem.step4.description' },
  { titleKey: 'guide.redeem.step5.title', descriptionKey: 'guide.redeem.step5.description' },
];

const compatibleDevices = [
  {
    titleKey: 'guide.devices.iphone.title',
    models: ['guide.devices.iphone.model1', 'guide.devices.iphone.model2'],
  },
  {
    titleKey: 'guide.devices.samsung.title',
    models: ['guide.devices.samsung.model1', 'guide.devices.samsung.model2', 'guide.devices.samsung.model3'],
  },
  {
    titleKey: 'guide.devices.google.title',
    models: ['guide.devices.google.model1'],
  },
  {
    titleKey: 'guide.devices.other.title',
    models: ['guide.devices.other.model1'],
  },
];

const faqItems = [
  { questionKey: 'guide.faq.q1.question', answerKey: 'guide.faq.q1.answer' },
  { questionKey: 'guide.faq.q2.question', answerKey: 'guide.faq.q2.answer' },
  { questionKey: 'guide.faq.q3.question', answerKey: 'guide.faq.q3.answer' },
  { questionKey: 'guide.faq.q4.question', answerKey: 'guide.faq.q4.answer' },
];

export default function RedeemPage() {
  const t = useTranslations('redeem');
  const accentTabClass = 'border-[#ff7c2a] bg-[#ff7c2a]/10 text-[#ff7c2a]';
  const [activeTab, setActiveTab] = useState<'redeem' | 'devices' | 'activate' | 'faq'>('redeem');
  const [uiState, setUiState] = useState<UIState>('entry');
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [confirmedEmail, setConfirmedEmail] = useState('');

  const errorState: ErrorUIState | null =
    uiState === 'not_found' ||
    uiState === 'expired' ||
    uiState === 'fully_redeemed' ||
    uiState === 'api_error' ||
    uiState === 'rate_limited'
      ? uiState
      : null;

  const handleLookupBooking = async (code: string) => {
    setIsLoading(true);
    try {
      // Proxy call through our Next.js API route
      const response = await axios.get(`/api/booking?code=${encodeURIComponent(code)}`);
      setBooking(response.data);
      
      if (response.data.remaining === 0) {
        setUiState('fully_redeemed');
      } else {
        setUiState('found');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setUiState('not_found');
      } else if (axios.isAxiosError(error) && error.response?.status === 410) { // 410 Gone / Expired
        setUiState('expired');
      } else if (axios.isAxiosError(error) && error.response?.status === 429) {
        setUiState('rate_limited');
      } else {
        setUiState('api_error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async (quantity: number, email: string) => {
    if (!booking) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/redeem', {
        code: booking.code,
        quantity,
        email
      });
      
      setQrCodes(response.data.qrCodes);
      setConfirmedEmail(email);
      setUiState('success');
    } catch {
      setUiState('api_error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBooking(null);
    setQrCodes([]);
    setConfirmedEmail('');
    setUiState('entry');
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start">
        <div className="flex min-w-0 justify-center">
          {uiState === 'entry' && (
            <RedeemForm onSubmit={handleLookupBooking} isLoading={isLoading} />
          )}

          {uiState === 'found' && booking && (
            <BookingCard
              booking={booking}
              onConfirm={handleRedeem}
              isLoading={isLoading}
            />
          )}

          {uiState === 'success' && (
            <SuccessView
              qrCodes={qrCodes}
              email={confirmedEmail}
              onReset={handleReset}
            />
          )}

          {errorState && (
            <ErrorView type={errorState} onRetry={handleReset} />
          )}
        </div>

        <Card className="h-fit">
          <CardHeader className="border-b">
            <CardTitle className="text-sm font-semibold">{t('guide.help_center')}</CardTitle>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('redeem')}
                className={`rounded-md border px-3 py-2 text-left text-xs font-medium transition ${
                  activeTab === 'redeem' ? accentTabClass : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  {t('guide.tabs.redeem')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('devices')}
                className={`rounded-md border px-3 py-2 text-left text-xs font-medium transition ${
                  activeTab === 'devices' ? accentTabClass : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  {t('guide.tabs.devices')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('activate')}
                className={`rounded-md border px-3 py-2 text-left text-xs font-medium transition ${
                  activeTab === 'activate' ? accentTabClass : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Power className="h-4 w-4" />
                  {t('guide.tabs.activate')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('faq')}
                className={`rounded-md border px-3 py-2 text-left text-xs font-medium transition ${
                  activeTab === 'faq' ? accentTabClass : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  {t('guide.tabs.faq')}
                </span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pb-4">
            {activeTab === 'redeem' && (
              <>
                <div className="space-y-3">
                  {redeemSteps.map((step, index) => (
                    <div key={step.titleKey} className="flex gap-3 rounded-md border p-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff7c2a] text-[11px] font-semibold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{t(step.titleKey)}</p>
                        <p className="text-xs text-muted-foreground">{t(step.descriptionKey)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 rounded-md border border-[#ff7c2a]/40 bg-[#ff7c2a]/10 p-3 text-xs">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ff7c2a]" />
                  <p className="text-muted-foreground">
                    {t('guide.redeem.tip')}
                  </p>
                </div>
              </>
            )}

            {activeTab === 'devices' && (
              <div className="space-y-3">
                {compatibleDevices.map((device) => (
                  <div key={device.titleKey} className="rounded-md border p-3">
                    <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 text-[#ff7c2a]" />
                      {t(device.titleKey)}
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {device.models.map((model) => (
                        <li key={model}>• {t(model)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'activate' && (
              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="rounded-md border p-3">
                  <p className="mb-2 text-sm font-medium text-foreground">{t('guide.activate.iphone.title')}</p>
                  <p>{t('guide.activate.iphone.steps')}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="mb-2 text-sm font-medium text-foreground">{t('guide.activate.android.title')}</p>
                  <p>{t('guide.activate.android.steps')}</p>
                </div>
                <div className="rounded-md border border-green-600/30 bg-green-500/10 p-3 text-green-900">
                  {t('guide.activate.roaming_note')}
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <Accordion type="single" collapsible>
                {faqItems.map((item, index) => (
                  <AccordionItem key={item.questionKey} value={`faq-${index}`}>
                    <AccordionTrigger className="text-xs">{t(item.questionKey)}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs text-muted-foreground">{t(item.answerKey)}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
