'use client';

import { Message } from "@shared/types";

export default function ChatMessages({
    messages
}: {
    messages: Message[]
}) {
    console.log("messages", messages)

    return (
        <div>asd</div>
    );
}