'use client'
import React, { FormEvent, useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import useUserProfile from '@/hooks/zustand/use-user-profile';
import { socket } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { SocketEventListener } from '@/constants/socket';
import { toast } from 'sonner';

const ChatBox = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: "reply" },
        { id: 2, text: "Hi! I have a question.", sender: "user" },
        { id: 3, text: "Hello!?", sender: "reply" },
    ]);

    //@ts-ignore
    const { profile } = useUserProfile()
    const [user, setUser] = useState<string>('')
    useEffect(() => {
        if (profile && profile._id) setUser(profile._id == '67a4fd97e57cecea777ed3c3' ? '67a4fd97e57cecea777ed3bb' : '67a4fd97e57cecea777ed3c3')

    }, [profile])
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        socket.connect()
        function onReceivingReply(data: {
            from: string,
            payload: string
        }) {
            setMessages(prev => [...prev, { id: prev.length + 1, text: data.payload, sender: "reply" }])
        }

        socket.on(SocketEventListener.receivePrivateMessage, onReceivingReply);

        return () => {
            socket.off(SocketEventListener.receivePrivateMessage, onReceivingReply);
        };
    }, []);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages(prev => [...prev, { id: prev.length + 1, text: newMessage, sender: "user" }]);
            setNewMessage("");
        }
        const ws = socket.client
        toast.info(user)
        ws.emit('send private message', {
            payload: newMessage,
            to: user
        })

    };

    const isSubmitDisabled = newMessage == ''

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
            {/* Chat header */}
            <div className="bg-primary-foreground border-b p-4">
                <h1 className="text-xl font-bold">Chat Interface</h1>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Message input */}
            <form onSubmit={handleSubmit} className="border-t p-4 bg-primary-foreground">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border p-2 focus:outline-none focus:border-blue-500"
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Send size={20} />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChatBox;