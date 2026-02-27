import { AppForm } from '@/components/admin/app-form';
import { PageTransition } from '@/components/page-transition';

export default function AddAppPage() {
  return (
    <PageTransition>
      <AppForm />
    </PageTransition>
  );
}
