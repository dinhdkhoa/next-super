'use client'
import React, { FormEvent, useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import useUserProfile from '@/hooks/zustand/use-user-profile';
import { socket } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { SocketEventListener } from '@/constants/socket';
import { useQuery } from '@tanstack/react-query';
import conversationAPI from '@/apiRequests/conversation';

interface Conversation {
    content: string,
    receiver_id: string,
    sender_id: string,
    _id?: string
}

const ChatBox = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);

    //@ts-ignore
    const { profile } = useUserProfile()
    const [receiverId, setReceiverId] = useState<string>('')
    useEffect(() => {
        if (profile && profile._id) setReceiverId(profile._id == '67a4fd97e57cecea777ed3c3' ? '67a4fd97e57cecea777ed3bb' : '67a4fd97e57cecea777ed3c3')

    }, [profile])
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        socket.connect()
        function onReceivingReply(data: Conversation) {
            setConversations(prev => [...prev, data])
        }

        socket.on(SocketEventListener.receivePrivateMessage, onReceivingReply);

        return () => {
            socket.off(SocketEventListener.receivePrivateMessage, onReceivingReply);
        };
    }, []);

    const { data } = useQuery({
        queryKey: ['getConversation', profile],
        queryFn: () => conversationAPI.getConversation({ receiverId }),
        enabled: Boolean(profile) && Boolean(receiverId)
    })

    useEffect(() => {
        if (data && data?.payload && (data.payload as any).result.conversations.length > 0) {
            const { conversations } = (data.payload as any).result
            setConversations(conversations)
        }
    }, [data]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        if (!(profile && profile._id)) return
        e.preventDefault();
        if (!newMessage.trim()) return

        const newConvo: Conversation = {
            content: newMessage,
            receiver_id: receiverId, sender_id: profile._id
        }
        setConversations(prev => [...prev, { ...newConvo, _id: new Date().getTime().toString(), }]);
        setNewMessage("");
        const ws = socket.client
        ws.emit('send_private_message', newConvo)

    };

    const isSubmitDisabled = newMessage == ''
    const isSender = (id: string) => (profile && profile._id) && id == profile._id

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
            {/* Chat header */}
            <div className="bg-primary-foreground border-b p-4">
                <h1 className="text-xl font-bold">Chat Interface</h1>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversations.map((conversation) => (
                    <div
                        key={conversation._id}
                        className={`flex ${isSender(conversation.sender_id) ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${isSender(conversation.sender_id)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            {conversation.content}
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