'use client';

import { sendMessage } from "@/lib/actions";
import { FormState } from "@/lib/types";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export default function ChatInput({
    conversation_id,
    category = 'default'
}: {
    conversation_id?: string,
    category?: string
}) {
    const sendMessageWithConversation = (state: FormState, formData: FormData) =>
        sendMessage(state, formData, category, conversation_id);

    const [state, action] = useActionState(sendMessageWithConversation, undefined)

    const { pending } = useFormStatus();

    return (
        <form action={action} className="p-2 border-t bg-white border-gray-300 rounded-full w-[400px] relative text-xs">
            <input
                id="message"
                name="message"
                type="text"
                placeholder="Type your message..."
                className="p-2 text-black focus:outline-none w-5/6"
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-secondary text-white px-4 py-2 rounded-full cursor-pointer font-semibold transition hover:bg-secondary-dark"
                aria-disabled={pending}
            >
                Send
            </button>
        </form>
    );
}