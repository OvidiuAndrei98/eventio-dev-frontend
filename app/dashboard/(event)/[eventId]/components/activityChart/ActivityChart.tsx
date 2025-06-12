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
import { EventPlan, EventStats } from '@/core/types';
import { useEffect, useState } from 'react';
import { useEventContext } from '@/core/context/EventContext';
import { queryEventsStatisticsPerWeek } from '@/service/event/queryEventsStatistics';
import { StarOutlined } from '@ant-design/icons';

const chartConfig = {
  responses: {
    label: 'Raspunsuri',
    color: 'blue',
  },
  confirmations: {
    label: 'Confirmari',
    color: 'green',
  },
  refusals: {
    label: 'Refuzuri',
    color: 'red',
  },
} satisfies ChartConfig;

const ActivityChart = ({
  showActionButton,
  data,
  isBasicPlan,
}: {
  showActionButton?: boolean;
  isBasicPlan: boolean;
  data?: EventStats[];
}) => {
  const [eventStats, setEventStatistics] = useState<EventStats[]>([]);
  const { eventInstance } = useEventContext();

  const isPremiumOrAbove =
    eventInstance?.eventPlan === EventPlan.premium ||
    eventInstance?.eventPlan === EventPlan.ultimate;

  const queryEventStats = async () => {
    if (!eventInstance?.eventId) {
      console.error('Event ID is not available');
      return;
    }
    const stats = await queryEventsStatisticsPerWeek(eventInstance.eventId);

    setEventStatistics(stats);
  };

  useEffect(() => {
    if (eventInstance?.eventId && !data && isPremiumOrAbove) {
      queryEventStats();
    } else if (data) {
      setEventStatistics(data);
    }
  }, [eventInstance, data]);

  let chartDataToShow = eventStats;
  if (eventStats.length === 1) {
    const entry = eventStats[0];
    const date = new Date(entry['date']);
    date.setDate(date.getDate() - 1);
    const fakeDate = date.toISOString().slice(0, 10); // format YYYY-MM-DD
    const fakeEntry = {
      id: 'dummy-data',
      confirmations: 0,
      refusals: 0,
      responses: 0,
      ['date']: fakeDate,
    };
    chartDataToShow = [fakeEntry, entry];
  }

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center">
            <span>
              Activitate{' '}
              {isBasicPlan && (
                <span style={{ color: '#FFB347', marginLeft: 6 }}>
                  <StarOutlined />
                </span>
              )}
            </span>

            {showActionButton && (
              <Button
                icon={
                  isBasicPlan ? (
                    <span
                      style={{
                        color: '#FFB347',
                        fontSize: '16px',
                      }}
                    >
                      <StarOutlined />
                    </span>
                  ) : null
                }
              >
                Activitate
              </Button>
            )}
          </div>
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
        <CardDescription>Activitatea din ultima saptamana</CardDescription>
      </CardHeader>
      <CardContent className="max-h-100 min-h-[200px]">
        {eventStats.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[200px] text-center text-gray-500">
            Nu exista date suficiente pentru acest grafic.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="max-h-100 w-full">
            <AreaChart
              data={chartDataToShow}
              margin={{
                left: 12,
                right: 12,
                bottom: 0,
                top: 25,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="refusals"
                type="bump"
                fill="var(--color-refusals)"
                fillOpacity={0.4}
                stroke="var(--color-refusals)"
                stackId="a"
              />
              <Area
                dataKey="confirmations"
                type="bump"
                fill="var(--color-confirmations)"
                fillOpacity={0.4}
                stroke="var(--color-confirmations)"
                stackId="a"
              />
              <Area
                dataKey="responses"
                type="bump"
                fill="var(--color-responses)"
                fillOpacity={0.4}
                stroke="var(--color-responses)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
