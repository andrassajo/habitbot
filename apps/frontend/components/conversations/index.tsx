import { getConversationsByUser } from "@/lib/actions";
import { Conversation } from "@shared/types";
import Link from "next/link";

export default async function Conversations() {
  const conversations = await getConversationsByUser();

  return (
    <div className="flex flex-col h-full w-full items-center">
      <h2 className="text-lg font-bold">Previous conversations</h2>
      <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full custom-scrollbar rounded-2xl">
        {conversations.map((conversation: Pick<Conversation, 'id' | 'title'> & { categoryname: string, categorykey: string }) => (
          <Link href={`/${conversation.categorykey}/${conversation.id}`} key={conversation.id} className="relative flex flex-row items-center gap-4 p-4 rounded-lg shadow-2xl">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold">{conversation.title}</h3>
              <p className="text-gray-300 text-xs">#{conversation.categoryname}</p>
              <svg className="absolute right-4 bottom-4" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M3 21V3h7.09v2H5v14h14v-5.09h2V21zm7.586-9l7-7H13V3h8v8h-2V6.414l-7 7z" /></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}