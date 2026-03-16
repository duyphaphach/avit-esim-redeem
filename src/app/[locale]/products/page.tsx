import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { Globe } from 'lucide-react';

export default function ProductsPage() {
  const t = useTranslations('nav');
  
  const products = [
    { title: "Japan 10GB/15 Days", region: "Asia", price: "$19.99" },
    { title: "Europe 30GB/30 Days", region: "Europe", price: "$34.99" },
    { title: "USA Unlimited/7 Days", region: "North America", price: "$24.99" },
    { title: "Global 5GB/30 Days", region: "Worldwide", price: "$29.99" },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('products')}</h1>
        <p className="text-xl text-muted-foreground">Explore our popular eSIM packages for your next trip.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p, idx) => (
          <Card key={idx} className="flex flex-col h-full hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="p-3 bg-primary/10 w-fit rounded-lg text-primary mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.region}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-end">
              <div className="flex items-center justify-between mt-auto">
                <span className="text-2xl font-bold">{p.price}</span>
                <Link href="/redeem">
                  <Button variant="outline">Redeem</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
