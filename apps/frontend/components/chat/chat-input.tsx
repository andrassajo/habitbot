'use client';

import { sendMessage } from "@/lib/actions";
import { FormState } from "@/lib/types";
import { useActionState, useState } from "react";
import Spinner from "../spinner";

export default function ChatInput({
    conversation_id,
    category = 'default'
}: {
    conversation_id?: string,
    category?: string
}) {
    const sendMessageWithConversation = (state: FormState, formData: FormData) =>
        sendMessage(state, formData, category, conversation_id);

    const [state, action, isPending] = useActionState(sendMessageWithConversation, undefined);

    // form state managed with useState - for the disabled button
    const [inputValue, setInputValue] = useState(null)
    function handleChange(e: any) {
        setInputValue(e.currentTarget.value)
    }

    return (
        <form action={action} className="p-2 border-t bg-white border-gray-300 rounded-xl w-full md:w-[550px] relative text-xs">
            <input
                id="message"
                name="message"
                type="text"
                onChange={handleChange}
                placeholder="Type your message..."
                className="p-2 text-gray-500 focus:outline-none w-5/6"
            />
            <button
                type="submit"
                className={`w-[60px] flex items-center justify-center absolute right-2 top-1/2 transform -translate-y-1/2 bg-secondary text-white px-4 py-2 rounded-full font-semibold transition hover:bg-secondary-dark
                    ${isPending || !inputValue ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={isPending || !inputValue}
            >
                {isPending ? <Spinner /> : 'Send'}
            </button>
        </form>
    );
}