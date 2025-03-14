export default function ConversationsSkeleton() {
  const placeholders = Array.from({ length: 5 });

  return (
    <div className="flex flex-col h-full w-full items-center">
      <h2 className="text-lg font-bold">Previous conversations</h2>
      <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full custom-scrollbar rounded-2xl w-full">
        {placeholders.map((_, i) => (
          <div
            key={i}
            className="relative flex flex-row items-center gap-4 p-4 rounded-lg shadow-2xl bg-gray-200 animate-pulse"
          >
            <div className="flex flex-col gap-2 w-full">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            </div>
            <div className="absolute right-4 bottom-4">
              <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
