'use server';

import { getCategoryByKey, getMessages } from "@/lib/actions";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";

export default async function Chat({ category, id }: {
    category: string, id: string
}) {
    const messages = await getMessages(id);

    const { name, welcome } = await getCategoryByKey(category);

    return (
        <div className="flex flex-col h-full w-full">
            <ChatMessages
                messages={messages}
                assistantName={name}
                welcome={welcome}
                conversation_id={id}
            />
            <ChatInput
                conversation_id={id}
                category={category}
            />
        </div>
    );
}