export default function InfoSkeleton() {
  return (
    <div className="flex flex-col items-center justify-around h-full w-full">
      <div className="flex items-center gap-2 text-gray-200 animate-pulse">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-32 h-4 bg-gray-300 rounded" />
      </div>

      <div className="flex flex-col items-center justify-center text-center gap-5 shadow-2xl p-10 rounded-xl animate-pulse">
        <div className="h-48 w-48 rounded-full overflow-hidden bg-gray-300" />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-40 h-6 bg-gray-300 rounded" />
          <div className="w-64 h-4 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
}
