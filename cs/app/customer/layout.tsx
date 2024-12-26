// app/customer/layout.tsx
export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="customer-layout">
        <header className="bg-green-500 text-white p-4">Customer Header</header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white p-4">Customer Footer</footer>
      </div>
    );
  }
  
  