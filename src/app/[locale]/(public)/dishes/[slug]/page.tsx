import dishesAPI from '@/apiRequests/dishes'
import { cn, formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

const unslugifyDish = (slug: string) => {
    const [name, id] = slug.split('-i.');
    return { name, id: parseInt(id) };
}
async function DishDetailPublicPage({ params: { slug } }: { params: { slug: string } }) {
    const {id} = unslugifyDish(slug)
    const data = await dishesAPI.getDishDetail(Number(id))
    //To do : error handling for non-exist dish id
    const dish = data.payload.data
    return (
        <div className='space-y-4'>
            <h1 className='text-2xl lg:text-3xl font-bold'>{dish.name}</h1>
            <span className='text-lg lg:text-xl font-semibold'>Price: {formatCurrency(dish.price)}</span>
            <Image
                src={dish.image}
                alt={dish.name}
                height={700}
                width={700}
                quality={100}
                className={cn('object-cover w-full h-full max-w-3xl max-h-3xl')}
            />
            <p className='text-lg'>{dish.description}</p>

        </div>
    )
}

export default DishDetailPublicPage