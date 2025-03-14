import { getConversationsByUser } from "@/lib/actions";
import { Conversation } from "@shared/types";
import Link from "next/link";

export default async function Conversations() {
  const conversations = await getConversationsByUser();

  return (
    <div className="flex flex-col h-5/6 lg:h-full w-5/6 lg:w-full items-center bg-primary lg:bg-transparent rounded-xl lg:rounded-none py-3 lg:py-0">
      <h2 className="text-lg font-bold">Previous conversations</h2>
      <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full custom-scrollbar rounded-2xl">
        {conversations?.length > 0 ? conversations.map((conversation: Pick<Conversation, 'id' | 'title'> & { categoryname: string, categorykey: string }) => (
          <Link href={`/${conversation.categorykey}/${conversation.id}`} key={conversation.id} className="relative flex flex-row items-center gap-4 p-4 rounded-lg shadow-xl bg-secondary lg:bg-transparent">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold">{conversation.title}</h3>
              <p className="text-gray-300 text-xs">#{conversation.categoryname}</p>
              <svg className="absolute right-2 bottom-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 21V3h7.09v2H5v14h14v-5.09h2V21zm7.586-9l7-7H13V3h8v8h-2V6.414l-7 7z" /></svg>
            </div>
          </Link>
        )) : (
          <p className="text-gray-300 text-sm">No conversations yet</p>
        )}
      </div>
    </div>
  );
}