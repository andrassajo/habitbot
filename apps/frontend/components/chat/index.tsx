'use server';

import { getMessages } from "@/lib/actions";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";

export default async function Chat({ category, id }: {
    category: string, id: string
}) {
    const messages = await getMessages(id);

    return (
        <div className="flex flex-col max-h-[90vh]">
            <ChatMessages messages={messages} />
            <ChatInput
                conversation_id={id}
                category={category}
            />
        </div>
    );
}