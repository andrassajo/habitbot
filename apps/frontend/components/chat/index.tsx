'use server';

import { getMessages } from "@/lib/actions";
import ChatInput from "./chat-input";

export default async function Chat({ category, id }: {
    category: string, id: string
}) {
    const messages = await getMessages(id);

    return (
        <div className="flex flex-col ">
            <ChatInput
                conversation_id={id}
                category={category}
            />
        </div>
    );
}