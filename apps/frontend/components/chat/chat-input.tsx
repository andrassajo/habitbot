'use client';

import { sendMessage } from "@/lib/actions";
import { FormState } from "@/lib/types";
import { useActionState, useState } from "react";
import { useRef } from "react";
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

    // Manage input value state as string
    const [inputValue, setInputValue] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setInputValue(e.currentTarget.value);
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
            setInputValue('');
            formRef.current?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
    }

    return (
        <form
            ref={formRef}
            action={action}
            className="p-2 border-t bg-white border-gray-300 rounded-xl w-full md:w-[550px] relative text-xs"
        >
            <textarea
                id="message"
                name="message"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="p-2 text-gray-500 focus:outline-none w-5/6 resize-none overflow-hidden"
                rows={1}
            />
            <button
                type="submit"
                className={`w-[60px] flex items-center justify-center absolute right-2 bottom-2 bg-secondary text-white px-4 py-2 rounded-full font-semibold transition hover:bg-secondary-dark
          ${isPending || !inputValue ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={isPending || !inputValue}
            >
                {isPending ? <Spinner /> : 'Send'}
            </button>
        </form>
    );
}
