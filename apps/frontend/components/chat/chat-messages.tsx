'use client';

import { Message } from "@shared/types";
import Markdown from "react-markdown";

export default function ChatMessages({
    messages
}: {
    messages: Message[]
}) {
    return (
        <div className="flex flex-col flex-1 overflow-y-auto gap-4 text-xs p-4 custom-scrollbar">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`prose  p-4 rounded-xl max-w-xs ${msg.role === 'user'
                        ? 'bg-primary text-white self-end'
                        : 'bg-tertiary text-white self-start'
                        }`}
                >
                    <Markdown>{msg.content}</Markdown>
                </div>
            ))}
        </div>
    );
}