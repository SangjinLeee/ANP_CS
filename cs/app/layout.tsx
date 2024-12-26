// app/layout.tsx
export const metadata = {
    title: 'ANPCS',
    description: 'Customer Complaint System',
  };
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body className="min-h-screen bg-gray-50">
          {children}
        </body>
      </html>
    );
  }
  