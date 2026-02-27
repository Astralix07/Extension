import { AppForm } from '@/components/admin/app-form';
import { getAppById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PageTransition } from '@/components/page-transition';

export default async function EditAppPage({ params }: { params: { id: string } }) {
  const app = await getAppById(params.id);

  if (!app) {
    notFound();
  }

  return (
    <PageTransition>
      <AppForm app={app} />
    </PageTransition>
  );
}
