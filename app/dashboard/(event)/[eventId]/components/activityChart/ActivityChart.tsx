'use client';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from 'antd';

const chartData = [
  { month: 'January', mobile: 186 },
  { month: 'February', mobile: 305 },
  { month: 'March', mobile: 237 },
  { month: 'April', mobile: 73 },
  { month: 'May', mobile: 209 },
  { month: 'June', mobile: 214 },
];
const chartConfig = {
  mobile: {
    label: 'Raspunsuri',
    color: 'blue',
  },
} satisfies ChartConfig;

const ActivityChart = ({
  showActionButton,
}: {
  showActionButton?: boolean;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          Activitate {showActionButton && <Button>Activitate</Button>}
        </CardTitle>
        <CardDescription>Activitatea din ultima saptamana</CardDescription>
      </CardHeader>
      <CardContent className="max-h-100">
        <ChartContainer config={chartConfig} className="max-h-100 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
