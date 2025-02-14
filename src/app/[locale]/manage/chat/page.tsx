'use client'

import { Button } from "@/components/ui/button"
import useUserProfile from "@/hooks/zustand/use-user-profile"
import { socket } from "@/lib/socket"
import useGetAccount from "@/queries/useGetAccount"
import { useEffect } from "react"
import ChatBox from "./chatbox"
import { toast } from "sonner"
import { SocketEventListener } from "@/constants/socket"

export default function SocketChat() {
    useEffect(() => {
        function onError(error: any) {
            toast.error('Socket Error: ' + error.data.message)
        }
        socket.on(SocketEventListener.ConnectionError, onError);
        socket.connect()

        return () => {
            socket.off(SocketEventListener.ConnectionError, onError);
        };
    }, []);
    const { data } = useGetAccount()
    //@ts-ignore
    const { setProfile } = useUserProfile()
    const handleClick = () => {
        const ws = socket.client
        ws.emit('hello', 'hello from nextjs')
    }
    useEffect(() => {
        if (data && data.payload.data) {
            setProfile(data.payload.data)
        }
    }, [data])


    return <div>
        {/* <Button onClick={handleClick}>Click</Button> */}
        <ChatBox />
    </div>
}