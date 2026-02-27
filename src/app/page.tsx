import { getApps, getCategories } from '@/lib/data';
import { AppList } from '@/components/app-list';

export default async function Home() {
  const apps = await getApps();
  const categories = await getCategories();

  return (
    <section className="space-y-8">
      <AppList initialApps={apps} categories={categories} />
    </section>
  );
}
