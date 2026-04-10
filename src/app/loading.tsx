export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <div className="absolute inset-0 w-14 h-14 border-4 border-transparent border-b-primary-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Loading</p>
          <p className="text-xs text-gray-400 mt-0.5">Please wait...</p>
        </div>
      </div>
    </div>
  );
}
