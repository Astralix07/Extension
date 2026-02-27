import { getAppById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Globe, ArrowLeft } from 'lucide-react';

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
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{app.category}</Badge>
            <Badge variant="outline">Version {app.version}</Badge>
          </div>
        </div>
        
        <p className="text-lg text-muted-foreground">{app.description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button asChild size="lg" className="flex-1">
            <a href={app.downloadUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-5 w-5" />
              Download Now
            </a>
          </Button>
          {app.websiteUrl && (
            <Button asChild size="lg" variant="outline" className="flex-1">
              <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-5 w-5" />
                Visit Website
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
