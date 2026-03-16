'use client';
import { useTranslations } from 'next-intl';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type HistoryItem = {
  date: string;
  quantity: number;
  email: string;
};

export function RedemptionHistory({ history }: { history: HistoryItem[] }) {
  const t = useTranslations('redeem.booking');

  if (!history || history.length === 0) return null;

  return (
    <div className="mt-8 border rounded-lg bg-card overflow-hidden">
      <div className="p-4 bg-muted/50 border-b">
        <h3 className="font-semibold text-sm">{t('history')}</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('history_date')}</TableHead>
            <TableHead className="text-right">{t('history_qty')}</TableHead>
            <TableHead className="text-right">{t('history_email')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell className="text-sm font-medium">{new Date(item.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-sm text-right">{item.quantity}</TableCell>
              <TableCell className="text-sm text-right text-muted-foreground">{item.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
