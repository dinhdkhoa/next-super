'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, formatCurrency, getVietnameseDishStatus, getVietnameseOrderStatus } from '@/lib/utils'
import useGetDishes from '@/queries/useGetDishes'
import { GuestCreateOrdersBody, GuestCreateOrdersBodyType, GuestGetOrdersResType } from '@/schemaValidations/guest.schema'
import { DishStatus } from '@/constants/type'
import { Badge } from '@/components/ui/badge'
import { socket } from '@/lib/socket'
import { useRouter } from 'next/navigation'
import { UpdateOrderResType } from '@/schemaValidations/order.schema'
import { toast } from 'sonner'

function GuestOrder({ orders }: { orders: GuestGetOrdersResType['data'] }) {
    const router = useRouter()
    const { paidOrders, unpaidOrders } = useMemo(() => orders.reduce((result, order) => {
        if (order.status === 'Paid') {
            return {
                ...result,
                paidOrders: {
                    price: result.paidOrders.price + order.quantity * order.dishSnapshot.price,
                    quantity: result.paidOrders.quantity + order.quantity
                }
            };
        } else if (order.status !== 'Rejected') {
            return {
                ...result,
                unpaidOrders: {
                    price: result.unpaidOrders.price + order.quantity * order.dishSnapshot.price,
                    quantity: result.unpaidOrders.quantity + order.quantity
                }
            };
        }
        return result
    }, {
        paidOrders: {
            price: 0,
            quantity: 0
        },
        unpaidOrders: {
            price: 0,
            quantity: 0
        }
    }), [orders])

    useEffect(() => {
        if (socket.connected) {
            onConnect()
        }
        if (socket.disconnected) {
            onDisconnect()
        }

        function onConnect() {
            console.log('Connected', socket.id)
        }

        function onDisconnect() {
            console.log(socket.id, 'Disconnected')
        }

        function onUpdateOrder(data: UpdateOrderResType['data']) {
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
                        <Badge variant={'secondary'}>{getVietnameseOrderStatus(order.status)}</Badge>
                    </div>
                </div>
            ))}
            {paidOrders.quantity > 0 && <div className='sticky bottom-0'>
                <Button className='w-full justify-between' variant={'outline'}>
                    <span>Đã thanh toán · {paidOrders.quantity} món</span>
                    <span>{formatCurrency(paidOrders.price)}</span>
                </Button>
            </div>}
            <div className='sticky bottom-0'>
                <Button className='w-full justify-between'>
                    <span>Đơn hàng · {unpaidOrders.quantity} món</span>
                    <span>{formatCurrency(unpaidOrders.price)}</span>
                </Button>
            </div>
        </>

    )
}

export default GuestOrder