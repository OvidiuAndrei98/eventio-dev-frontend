import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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
import { EventStats } from '@/core/types';
import { StarOutlined } from '@ant-design/icons';

const AreaCustomChart = ({
  data,
  xAxisKey,
  yAxisKey,
  color,
  title,
  label,
  description,
  isBasicPlan,
}: {
  data: EventStats[];
  xAxisKey: string;
  yAxisKey: string;
  color: string;
  title: string;
  label: string;
  description: string;
  isBasicPlan: boolean;
}) => {
  const chartConfig = {
    [yAxisKey]: {
      label: label,
      color: color,
    },
  } satisfies ChartConfig;

  let chartDataToShow = data;
  if (data.length === 1) {
    // Creează un entry fictiv cu data cu o zi înainte
    const entry = data[0];
    const date = new Date(entry['date']);
    date.setDate(date.getDate() - 1);
    const fakeDate = date.toISOString().slice(0, 10); // format YYYY-MM-DD
    const fakeEntry = {
      id: 'dummy-data',
      confirmations: 0,
      refusals: 0,
      responses: 0,
      [xAxisKey]: fakeDate,
      date: fakeDate,
      [yAxisKey]: 0,
    };
    chartDataToShow = [fakeEntry, entry];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title}
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
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center text-gray-500 ">
            Nu există date suficiente pentru acest grafic.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="max-h-45 w-full">
            <AreaChart
              accessibilityLayer
              data={chartDataToShow}
              margin={{
                left: 12,
                right: 12,
                top: 25,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                type="bump"
                dataKey={yAxisKey}
                fill={`var(--color-${Object.keys(chartConfig)[0]})`}
                fillOpacity={0.4}
                stroke={`var(--color-${Object.keys(chartConfig)[0]})`}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AreaCustomChart;
