'use client';

import { useState } from 'react';

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { text: 'Hi there! How can I help you today?', incoming: true },
        { text: "I'm looking for some information on modern design trends.", incoming: false },
        { text: 'Sure, let me pull that up for you.', incoming: true },
    ]);
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, { text: input, incoming: false }]);
        setInput('');
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col w-full max-w-md rounded-lg overflow-hidden">
                {/* Chat Messages */}
                <div id="chat" className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.incoming ? 'items-start' : 'items-end justify-end'}`}
                        >
                            <div
                                className={`p-2 rounded-lg max-w-xs ${msg.incoming ? 'bg-gray-200 text-gray-900' : 'bg-indigo-600 text-white'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Input Area */}
                <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSubmit} className="flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 rounded-r-lg hover:bg-indigo-700 transition"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
