'use server';

import ChatInput from "./chat-input";

export default async function Chat() {
    return (
        <div className="flex flex-col ">
            {/* Chat Window */}
            {/* <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((msg: any, index: any) => (
                    <div
                        key={index}
                        className={`mb-2 p-2 rounded-lg max-w-xs ${msg.sender === 'user'
                            ? 'bg-blue-500 text-white self-end'
                            : 'bg-gray-300 text-black self-start'
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div> */}
            {/* Input Area */}
            <ChatInput />
        </div>
    );
}