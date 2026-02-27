import { getAppById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';

interface AppDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AppDetailPage({ params }: AppDetailPageProps) {
  const app = await getAppById(params.id);

  if (!app) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Apps
        </Link>
      </Button>

      <div className="space-y-6">
        <div className="space-y-2 border-b pb-4">
          <h1 className="text-4xl font-bold tracking-tight font-headline">{app.name}</h1>
        </div>
        
        <p className="text-lg text-muted-foreground">{app.description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button asChild size="lg" className="flex-1">
            <a href={app.url} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-5 w-5" />
              Download Now
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
