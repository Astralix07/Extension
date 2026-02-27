import type { App } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ArrowRight } from 'lucide-react';

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
      <CardHeader>
        <div className="aspect-[3/2] relative mb-4">
        </div>
        <CardTitle className="text-xl font-headline">{app.name}</CardTitle>
        <CardDescription className="line-clamp-3 h-[60px]">
          {app.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center space-x-2">
            <Badge variant="secondary">{app.category}</Badge>
            <Badge variant="outline">v{app.version}</Badge>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button asChild variant="outline">
          <Link href={`/apps/${app.id}`}>
            Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild>
          <a href={app.downloadUrl} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
