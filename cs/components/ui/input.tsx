export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
      <input
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${className}`}
        {...props}
      />
    );
  }
  