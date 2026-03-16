'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { RedeemForm } from '@/components/redeem/RedeemForm';
import { BookingCard, BookingData } from '@/components/redeem/BookingCard';
import { SuccessView, QRCodeData } from '@/components/redeem/SuccessView';
import { ErrorView } from '@/components/redeem/ErrorView';
import axios from 'axios';

type UIState = 'entry' | 'found' | 'success' | 'not_found' | 'expired' | 'fully_redeemed' | 'api_error' | 'rate_limited';

export default function RedeemPage() {
  const t = useTranslations('redeem');
  
  const [uiState, setUiState] = useState<UIState>('entry');
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [confirmedEmail, setConfirmedEmail] = useState('');

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
    } catch (error: any) {
      if (error.response?.status === 404) {
        setUiState('not_found');
      } else if (error.response?.status === 410) { // 410 Gone / Expired
        setUiState('expired');
      } else if (error.response?.status === 429) {
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
    } catch (error: any) {
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
    <div className="container mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center">
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

      {(uiState === 'not_found' || uiState === 'expired' || uiState === 'fully_redeemed' || uiState === 'api_error' || uiState === 'rate_limited') && (
        <ErrorView type={uiState as any} onRetry={handleReset} />
      )}
    </div>
  );
}
