import { getApps, getCategories } from '@/lib/data';
import { AppList } from '@/components/app-list';

export default async function Home() {
  const apps = await getApps();
  const categories = await getCategories();

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">
          Discover Your Essential Apps
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A curated collection of utilities and tools, all in one place.
        </p>
      </div>
      <AppList initialApps={apps} categories={categories} />
    </section>
  );
}
