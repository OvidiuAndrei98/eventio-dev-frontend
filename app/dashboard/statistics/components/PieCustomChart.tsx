'use client'

import { Pie, PieChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
const chartData = [
  { browser: 'chrome', visitors: 175, fill: '#ff0000' },
  { browser: 'safari', visitors: 270, fill: '#67ff676b' },
]

export function PieCustomChart() {
  const chartConfig = {
    chrome: {
      label: 'Refuzuri',
      color: 'hsl(0 100% 50% 31%',
    },
    safari: {
      label: 'Confirmari',
      color: 'hsl(0 100% 50% 31%',
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className=" pb-0">
        <CardTitle>Confirmari vs Refuzuri</CardTitle>
        <CardDescription>Numar total raspunsuri</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
