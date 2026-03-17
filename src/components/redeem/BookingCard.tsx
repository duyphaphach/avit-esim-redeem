'use client';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Loader2, Plus, Minus } from 'lucide-react';
import { RedemptionHistory, HistoryItem } from './RedemptionHistory';

export type BookingData = {
  code: string;
  productName: string;
  dateOfUse: string;
  total: number;
  redeemed: number;
  remaining: number;
  history?: HistoryItem[];
};

export function BookingCard({ 
  booking, 
  onConfirm, 
  isLoading 
}: { 
  booking: BookingData;
  onConfirm: (quantity: number, email: string) => void;
  isLoading: boolean;
}) {
  const t = useTranslations('redeem.booking');
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');

  const adjustQty = (amount: number) => {
    const newQty = quantity + amount;
    if (newQty >= 1 && newQty <= booking.remaining) {
      setQuantity(newQty);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > 0 && email.trim()) {
      onConfirm(quantity, email.trim());
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
        
        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-y-4 mb-8">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t('product')}</p>
            <p className="font-semibold">{booking.productName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t('date')}</p>
            <p className="font-medium">{new Date(booking.dateOfUse).toLocaleDateString()}</p>
          </div>
          <div className="col-span-2 grid grid-cols-3 bg-muted/30 p-4 rounded-lg mt-2">
            <div className="text-center border-r">
              <p className="text-xs text-muted-foreground uppercase">{t('total')}</p>
              <p className="text-xl font-bold mt-1">{booking.total}</p>
            </div>
            <div className="text-center border-r">
              <p className="text-xs text-muted-foreground uppercase">{t('redeemed')}</p>
              <p className="text-xl font-bold text-muted-foreground mt-1">{booking.redeemed}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#ff7c2a] font-semibold uppercase">{t('remaining')}</p>
              <p className="text-xl flex font-bold text-[#ff7c2a] mt-1 justify-center">{booking.remaining}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        {booking.remaining > 0 && (
          <form onSubmit={handleSubmit} className="space-y-6 border-t pt-6">
            <div className="space-y-2">
              <Label>{t('quantity_label')}</Label>
              <div className="flex items-center space-x-4">
                <Button type="button" variant="outline" size="icon" onClick={() => adjustQty(-1)} disabled={quantity <= 1}>
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-16 h-10 flex items-center justify-center font-bold text-lg border rounded-md">
                  {quantity}
                </div>
                <Button type="button" variant="outline" size="icon" onClick={() => adjustQty(1)} disabled={quantity >= booking.remaining}>
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">/ {booking.remaining} available</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('email_label')}</Label>
              <Input 
                id="email" 
                type="email"
                placeholder={t('email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button typeof="submit" className="w-full h-12 text-lg bg-[#ff7c2a] hover:bg-[#e67300]" disabled={isLoading || !email.trim() || quantity < 1}>
              {isLoading && <Loader2 className="mr-2 w-5 h-5 animate-spin" />}
              {t('confirm')}
            </Button>
          </form>
        )}
      </div>

      {booking.history && booking.history.length > 0 && (
        <RedemptionHistory history={booking.history} />
      )}
    </div>
  );
}
