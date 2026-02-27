import { getApps } from '@/lib/data';
import { AppList } from '@/components/app-list';

export default async function Home() {
  const apps = await getApps();

  return (
    <section className="space-y-8">
      <AppList initialApps={apps} />
    </section>
  );
}
