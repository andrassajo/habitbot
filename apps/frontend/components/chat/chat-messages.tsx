'use client';

import { Message } from "@shared/types";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import io, { Socket } from 'socket.io-client';

let socket: Socket;

export default function ChatMessages({
    messages
}: {
    messages: Message[]
}) {
    const [allMessages, setAllMessages] = useState<Message[]>(messages);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket = io('http://localhost:8000');

        socket.on('connect', () => {
            console.log('Connected with id:', socket.id);
        });

        socket.on('chat message', (msg: Message) => {
            setAllMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Scroll to bottom when new message is added
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [allMessages]);

    // Check if the last message is from the user
    const lastMessage = allMessages[allMessages.length - 1];
    const showLoading = lastMessage && lastMessage.role === 'user';

    return (
        <div className="flex flex-col flex-1 overflow-y-auto gap-4 text-xs p-4 custom-scrollbar">
            {allMessages.map((msg) => (
                <div
                    key={msg.id}
                    className={`prose p-4 rounded-xl max-w-xs ${msg.role === 'user'
                        ? 'bg-primary text-white self-end'
                        : 'bg-tertiary text-white self-start'
                        }`}
                >
                    <Markdown>{msg.content}</Markdown>
                </div>
            ))}
            {/* Render a loading bubble if the last message is from the user */}
            {showLoading && (
                <div className="prose p-4 rounded-xl max-w-xs bg-tertiary text-white self-start flex items-center gap-2">
                    <span>Assistant is thinking...</span>
                    {/* You can also add a spinner icon here if desired */}
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                </div>
            )}
            {/* Dummy div to scroll into view */}
            <div ref={bottomRef} />
        </div>
    );
}
