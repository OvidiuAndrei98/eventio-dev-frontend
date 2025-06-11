'use client';

import { Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { StarOutlined } from '@ant-design/icons';

export function PieCustomChart({
  data,
  isBasicPlan,
}: {
  data: { type: string; value: number; fill: string }[];
  isBasicPlan: boolean;
}) {
  const chartConfig = {
    refusals: {
      label: 'Refuzuri',
      color: 'hsl(0 100% 50% 31%',
    },
    confirmations: {
      label: 'Confirmari',
      color: 'hsl(0 100% 50% 31%',
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col h-full min-h-[250px]">
      <CardHeader className=" pb-0">
        <CardTitle>
          Confirmari vs Refuzuri{' '}
          {isBasicPlan && (
            <span style={{ color: '#FFB347', marginLeft: 6 }}>
              <StarOutlined />
            </span>
          )}
        </CardTitle>
        {isBasicPlan && (
          <span className="text-[var(--primary-color)] text-xs text-center font-medium response-alert text-left">
            Datele sunt demonstrative, pentru a vedea datele reale este neceasr
            planul{' '}
            <span className="font-bold text-[var(--premium-color)]">
              Premium
            </span>{' '}
            sau <span className="font-bold">Ultimate</span>.
          </span>
        )}
        <CardDescription>Din numarul total de raspunsuri</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {data[0].value === 0 && data[1].value === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            Nu există date suficiente pentru acest grafic.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={data} dataKey="value" nameKey="type" />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
