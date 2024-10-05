'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import useGetDishes from '@/queries/useGetDishes'
import { GuestCreateOrdersBody, GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'

function MenuOrder() {
    const dataQuery = useGetDishes()
    const dishes = dataQuery.data?.payload.data ?? []
    const [orderPayload, setOrderPayload] = useState<GuestCreateOrdersBodyType>([])

    const totalPrice = orderPayload.reduce((total, dish) => {
        const price = dishes.find(item => item.id == dish.dishId)?.price ?? 0
        return total += dish.quantity * price
    }  ,0)

    const handleChangeQuantity = (dishId: number, quantity: number) => {
        setOrderPayload(prev => {
            if(quantity == 0) return prev.filter(order => order.dishId !== dishId)
            
            const dishIndex = prev.findIndex(item => item.dishId == dishId)
            if(dishIndex == -1){
                return [...prev, {dishId, quantity}]
            }
            prev[dishIndex].quantity = quantity
            return [...prev]
        })
    }
    return (
        <>
            {dishes.map((dish) => (
                <div key={dish.id} className='flex gap-4'>
                    <div className='flex-shrink-0'>
                        <Image
                            src={dish.image}
                            alt={dish.name}
                            height={100}
                            width={100}
                            quality={100}
                            className='object-cover w-[80px] h-[80px] rounded-md'
                        />
                    </div>
                    <div className='space-y-1'>
                        <h3 className='text-sm'>{dish.name}</h3>
                        <p className='text-xs'>{dish.description}</p>
                        <p className='text-xs font-semibold'>{formatCurrency(dish.price)}</p>
                    </div>
                    <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                        <QuantityControl onChange={(quantity) => handleChangeQuantity(dish.id, quantity)} quantity={orderPayload.find(item => item.dishId == dish.id)?.quantity ?? 0}/>
                    </div>
                </div>
            ))}
            <div className='sticky bottom-0'>
                <Button className='w-full justify-between'>
                    <span>Giỏ hàng · {orderPayload.length} món</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </Button>
            </div>
        </>

    )
}

const QuantityControl = (props: {onChange : (quantity: number) => void, quantity: number}) => {
    const {onChange, quantity } = props

    return <div className='flex gap-1 '>
    <Button className='h-6 w-6 p-0' disabled={! (quantity && quantity !== 0)} onClick={e => {
        onChange(quantity - 1)
    }}>
        <Minus className='w-3 h-3'/>
    </Button>
    <Input type='text' className='h-6 p-1 w-8 text-center' inputMode='numeric' pattern='[0-9]*' value={quantity} onChange={e => {
        const newValue = Number(e.target.value)
        if(isNaN(newValue)) return
        onChange(newValue)
    }}/>
    <Button className='h-6 w-6 p-0' onClick={e => {
        onChange(quantity + 1)
    }}>
        <Plus className='w-3 h-3' />
    </Button>
</div>
}

export default MenuOrder