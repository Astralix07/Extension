'use client';

import { useState, useMemo } from 'react';
import type { App } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface AppListProps {
  initialApps: App[];
}

export function AppList({ initialApps }: AppListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = useMemo(() => {
    return initialApps
      .filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [initialApps, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for an app..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {filteredApps.length > 0 ? (
        <div className="border rounded-lg">
          <ul className="divide-y divide-border">
            {filteredApps.map(app => (
              <li key={app.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-grow">
                  <Link href={`/apps/${app.id}`} className="hover:underline">
                    <h3 className="text-lg font-semibold font-headline">{app.name}</h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{app.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">{app.category}</Badge>
                    <Badge variant="outline">v{app.version}</Badge>
                  </div>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <Button asChild className="w-full sm:w-auto">
                    <a href={app.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No applications found.</p>
          <p className="text-sm text-muted-foreground/80">Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}
