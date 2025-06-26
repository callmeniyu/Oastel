// components/Loader.tsx
export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary_green text-white font-poppins">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>

      {/* Loading Text */}
      <h2 className="text-lg animate-pulse tracking-widest uppercase">Loading Oastel...</h2>
    </div>
  );
}
