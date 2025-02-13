'use client'

import { Button } from "@/components/ui/button"
import useUserProfile from "@/hooks/zustand/use-user-profile"
import { socket } from "@/lib/socket"
import useGetAccount from "@/queries/useGetAccount"
import { useEffect } from "react"
import ChatBox from "./chatbox"
import { toast } from "sonner"

export default function SocketChat() {

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