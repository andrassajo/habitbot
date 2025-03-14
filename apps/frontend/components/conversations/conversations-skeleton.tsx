import { Conversation } from "@shared/types";

export default async function ConversationsSkeleton() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-row items-center justify-between p-4">
        <h2 className="text-md font-bold">Previous conversations</h2>
      </div>
      {/* <div className="flex flex-col gap-4 p-4">
        {conversations.map((conversation: Conversation & { category: string }) => (
          <div key={conversation.id} className="flex flex-row items-center gap-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold">{conversation.title}</h3>
              <p className="text-gray-500">{conversation.category}</p>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}