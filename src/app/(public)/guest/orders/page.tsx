import { GuestGetOrdersResType } from '@/schemaValidations/guest.schema'
import GuestOrder from './guest-order'
import guestAPI from '@/apiRequests/guest'
import orderAPI from '@/apiRequests/order'
import { handleApiError } from '@/lib/utils'

export default async function GuestOrderPage() {
  let orders : GuestGetOrdersResType['data'] = []
  try {
    const data = await orderAPI.guestGetOrder()
    orders = data.payload.data
  } catch(error) {
    handleApiError(error)
  }
  return (
    <div className='max-w-[400px] mx-auto space-y-4'>
      <h1 className='text-center text-xl font-bold'>Đơn hàng</h1>
      <GuestOrder orders={orders}/>
    </div>
  )
}
