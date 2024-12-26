import React from 'react';

// Table 컴포넌트
export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>;
}

// TableHeader 컴포넌트
export function TableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <thead className={`bg-gray-50 ${className}`}>{children}</thead>;
}

// TableBody 컴포넌트
export function TableBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tbody className={`divide-y divide-gray-200 ${className}`}>{children}</tbody>;
}

// TableRow 컴포넌트
export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={className}>{children}</tr>;
}

// TableHead 컴포넌트
export function TableHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>{children}</th>;
}

// TableCell 컴포넌트
export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>;
}
