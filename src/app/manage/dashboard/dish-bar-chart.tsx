'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { DashboardIndicatorResType } from '@/schemaValidations/indicator.schema'

const colors = [
  'var(--color-chrome)',
  'var(--color-safari)',
  'var(--color-firefox)',
  'var(--color-edge)',
  'var(--color-other)'
]

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))'
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))'
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))'
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))'
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig

export function DishBarChart({chartData} : {chartData: DashboardIndicatorResType['data']['dishIndicator']}) {
  const chartDataEx = chartData?.map((item, index) => {
    const {name, successOrders} = item
    const number = index % colors.length; // Use modulo to cycle through colors
    return {name, successOrders, fill: colors[number]}
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Xếp hạng món ăn</CardTitle>
        <CardDescription>Được gọi nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartDataEx}
            layout='vertical'
            margin={{
              left: 0
            }}
          >
            <YAxis
              dataKey='name'
              type='category'
              tickLine={false}
              tickMargin={2}
              axisLine={false}
              tickFormatter={(value) => {
                return value

                // return chartConfig[value as keyof typeof chartConfig]?.label
              }}
            />
            <XAxis dataKey='successOrders' type='number' hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey='successOrders' name={`Đơn thanh toán:\u00A0`}  layout='vertical' radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        {/* <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div> */}
        {/* <div className='leading-none text-muted-foreground'>
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  )
}
