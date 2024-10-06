'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, formatCurrency } from '@/lib/utils'
import useGetDishes from '@/queries/useGetDishes'
import { GuestCreateOrdersBody, GuestCreateOrdersBodyType, GuestGetOrdersResType } from '@/schemaValidations/guest.schema'
import { DishStatus } from '@/constants/type'
import { Badge } from '@/components/ui/badge'

function GuestOrder({orders} : {orders: GuestGetOrdersResType['data']}) {

    const totalPrice = 0

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
                    <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                        
                        
                    </div>
                </div>
            ))}
            <div className='sticky bottom-0'>
                <Button className='w-full justify-between'>
                    <span>Giỏ hàng · {'orderPayload.length'} món</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </Button>
            </div>
        </>

    )
}

export default GuestOrder