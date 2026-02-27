export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Admin Panel
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your application listings.
        </p>
      </div>
      {children}
    </div>
  );
}
