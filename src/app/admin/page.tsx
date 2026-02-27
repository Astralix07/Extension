import { getApps } from '@/lib/data';
import { AppsTable } from '@/components/admin/apps-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { PageTransition } from '@/components/page-transition';

export default async function AdminPage() {
  const apps = await getApps();

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New App
            </Link>
          </Button>
        </div>
        <AppsTable apps={apps} />
      </div>
    </PageTransition>
  );
}
