import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Overview">
      <div className="admin-panel text-center text-sm text-admin-muted py-10">
        Overview is disabled.
      </div>
    </AdminLayout>
  );
}
