'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, formatCurrency } from '@/lib/utils'
import useGetDishes from '@/queries/useGetDishes'
import { GuestCreateOrdersBody, GuestCreateOrdersBodyType, GuestGetOrdersResType } from '@/schemaValidations/guest.schema'
import { DishStatus } from '@/constants/type'
import { Badge } from '@/components/ui/badge'
import { socket } from '@/lib/socket'
import { useRouter } from 'next/navigation'
import { UpdateOrderResType } from '@/schemaValidations/order.schema'
import { toast } from 'sonner'

function GuestOrder({orders} : {orders: GuestGetOrdersResType['data']}) {
    const router = useRouter()
    const totalPrice = orders.reduce((total, order) => {
        return total += order.quantity * (order.dishSnapshot.price)
    }  ,0)

    useEffect(() => {
        if(socket.connected){
            onConnect()
        }
        if(socket.disconnected){
            onDisconnect()
        }

        function onConnect() {
            console.log('Connected',socket.id)
        }
        
        function onDisconnect() {
            console.log(socket.id, 'Disconnected')
        }
    
        function onUpdateOrder(data: UpdateOrderResType['data']){
            toast.info(`Món ${data.dishSnapshot.name} (SL: ${data.quantity}) vừa đc cập nhật sang trạng thái ${data.status}`)
            router.refresh()
        }
    
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('update-order', onUpdateOrder);
    
        return () => {
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
          socket.off('update-order', onUpdateOrder);
        };
      }, []);

    return (
        <>
            {orders.map((order) => (
                <div key={order.id} className={cn('flex gap-4')}>
                    <div className='flex-shrink-0'>
                        <Image
                            src={order.dishSnapshot.image}
                            alt={order.dishSnapshot.name}
                            height={100}
                            width={100}
                            quality={100}
                            className={cn('object-cover w-[80px] h-[80px] rounded-md')}
                        />
                    </div>
                    <div className='space-y-1'>
                        <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
                        <p className='text-xs'>{order.dishSnapshot.description}</p>
                        <p className='text-xs font-semibold'>{formatCurrency(order.dishSnapshot.price)} x {order.quantity}</p>
                    </div>
                    <div className='flex-shrink-0 ml-auto flex justify-end items-center'>
                        <Badge variant={'secondary'}>{order.status}</Badge>
                    </div>
                </div>
            ))}
            <div className='sticky bottom-0'>
                <Button className='w-full justify-between'>
                    <span>Giỏ hàng · {orders.length} món</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </Button>
            </div>
        </>

    )
}

export default GuestOrder