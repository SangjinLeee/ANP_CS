// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="admin-layout">
        <header className="bg-blue-500 text-white p-4">Admin Header</header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white p-4">Admin Footer</footer>
      </div>
    );
  }
  