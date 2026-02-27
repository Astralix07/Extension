import { getApps } from '@/lib/data';
import { AppList } from '@/components/app-list';
import { PageTransition } from '@/components/page-transition';

export default async function Home() {
  const apps = await getApps();

  return (
    <PageTransition>
      <section className="space-y-8">
        <AppList initialApps={apps} />
      </section>
    </PageTransition>
  );
}
