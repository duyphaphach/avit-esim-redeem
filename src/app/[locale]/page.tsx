'use client';
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
  {
    title: 'Find your booking email',
    description: 'Use the booking code from your confirmation email to locate your purchase.',
  },
  {
    title: 'Verify your booking details',
    description: 'Review traveler info and remaining eSIM quantity before redeeming.',
  },
  {
    title: 'Choose how many eSIMs to redeem',
    description: 'Redeem only what you need now and keep unused eSIMs for later activation.',
  },
  {
    title: 'Confirm delivery email',
    description: 'We send QR codes to your email so each device can install the eSIM quickly.',
  },
  {
    title: 'Install and activate on your phone',
    description: 'Scan the QR code on the destination device and complete activation steps.',
  },
];

const compatibleDevices = [
  {
    title: 'iPhone',
    models: ['iPhone XR and newer', 'iPhone SE (2nd gen) and newer'],
  },
  {
    title: 'Samsung Galaxy',
    models: ['S20 and newer', 'Z Flip/Fold series', 'Note 20 and newer'],
  },
  {
    title: 'Google Pixel',
    models: ['Pixel 3 and newer'],
  },
  {
    title: 'Other Devices',
    models: ['Many Oppo, Huawei, and Motorola models support eSIM'],
  },
];

const faqItems = [
  {
    question: 'When should I redeem my eSIM?',
    answer: 'Redeem any time before your trip. Install and activate when you are ready to use mobile data.',
  },
  {
    question: 'Can I redeem only part of my order?',
    answer: 'Yes. If your booking has multiple eSIMs, you can redeem only the quantity you need now.',
  },
  {
    question: 'What happens if my booking is already fully redeemed?',
    answer: 'The page will show a fully redeemed state and let you return to start another lookup.',
  },
  {
    question: 'I did not receive the QR email. What should I do?',
    answer: 'Check spam/junk folders first, then retry with the correct email address.',
  },
];

export default function RedeemPage() {
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
            <CardTitle className="text-sm font-semibold">eSIM Help Center</CardTitle>
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
                  Redeem
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
                  Devices
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
                  Activate
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
                  FAQ
                </span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pb-4">
            {activeTab === 'redeem' && (
              <>
                <div className="space-y-3">
                  {redeemSteps.map((step, index) => (
                    <div key={step.title} className="flex gap-3 rounded-md border p-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff7c2a] text-[11px] font-semibold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 rounded-md border border-[#ff7c2a]/40 bg-[#ff7c2a]/10 p-3 text-xs">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ff7c2a]" />
                  <p className="text-muted-foreground">
                    Pro tip: Redeem while connected to stable internet, then install the QR code directly on the device you plan to use.
                  </p>
                </div>
              </>
            )}

            {activeTab === 'devices' && (
              <div className="space-y-3">
                {compatibleDevices.map((device) => (
                  <div key={device.title} className="rounded-md border p-3">
                    <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 text-[#ff7c2a]" />
                      {device.title}
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {device.models.map((model) => (
                        <li key={model}>• {model}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'activate' && (
              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="rounded-md border p-3">
                  <p className="mb-2 text-sm font-medium text-foreground">iPhone</p>
                  <p>Settings → Cellular → Add eSIM → Use QR Code.</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="mb-2 text-sm font-medium text-foreground">Android</p>
                  <p>Settings → Network &amp; Internet → SIMs → Add eSIM → Scan QR Code.</p>
                </div>
                <div className="rounded-md border border-green-600/30 bg-green-500/10 p-3 text-green-900">
                  Turn on Data Roaming for the new eSIM profile after arriving at your destination.
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <Accordion type="single" collapsible>
                {faqItems.map((item, index) => (
                  <AccordionItem key={item.question} value={`faq-${index}`}>
                    <AccordionTrigger className="text-xs">{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs text-muted-foreground">{item.answer}</p>
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
