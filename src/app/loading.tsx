export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-600 via-blue-500 to-purple-500 animate-spin" style={{ animationDuration: '2s' }}>
            <div className="absolute inset-1.5 rounded-full bg-white dark:bg-gray-900" />
          </div>
          {/* Inner pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary-600 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-tight">Loading</p>
          <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-[0.2em]">Just a moment</p>
        </div>
      </div>
    </div>
  );
}
