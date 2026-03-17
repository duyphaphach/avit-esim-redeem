'use client';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Download, RotateCcw } from 'lucide-react';

export type QRCodeData = {
  id: string;
  qrcode: string;
  iccid: string;
};

export function SuccessView({
  qrCodes,
  email,
  onReset
}: {
  qrCodes: QRCodeData[];
  email: string;
  onReset: () => void;
}) {
  const t = useTranslations('redeem.success');

  const handleDownload = (qrContent: string, iccid: string) => {
    // In a real app we would render a generic canvas and download it.
    // For now we'll just alert or simulate a download.
    alert('Downloading QR Code: ' + iccid);
  };

  return (
    <div className="w-full mx-auto space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-emerald-600">{t('title')}</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">{t('desc')}</p>
        <p className="text-sm border border-[#ff7c2a]/30 bg-[#ff7c2a]/10 text-[#ff7c2a] inline-block px-4 py-2 rounded-full">
          {t('email_sent')} <span className="font-semibold">{email}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {qrCodes.map((qr) => (
          <div key={qr.id} className="bg-card border rounded-2xl p-6 flex flex-col items-center justify-between text-center shadow-sm">
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border">
              <QRCodeSVG value={qr.qrcode} size={180} />
            </div>
            <p className="font-mono text-xs text-muted-foreground mb-4 break-all w-full px-2">
              ICCID: <br/>{qr.iccid}
            </p>
            <Button variant="outline" className="w-full gap-2 border-[#ff7c2a]/40 text-[#ff7c2a] hover:bg-[#ff7c2a]/10 hover:text-[#ff7c2a]" onClick={() => handleDownload(qr.qrcode, qr.iccid)}>
              <Download className="w-4 h-4" />
              {t('download')}
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12 border-t pt-8">
        <Button variant="ghost" onClick={onReset} className="gap-2 text-[#ff7c2a] hover:bg-[#ff7c2a]/10 hover:text-[#ff7c2a]">
          <RotateCcw className="w-4 h-4" />
          {t('redeem_another')}
        </Button>
      </div>
    </div>
  );
}
