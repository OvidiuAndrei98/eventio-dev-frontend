'use client';

import './Statistics.css';
import ActivityChart from '../components/activityChart/ActivityChart';
import AreaCustomChart from './components/AreaCustomChart';
import { PieCustomChart } from './components/PieCustomChart';
import { useContext, useEffect, useState } from 'react';
import { EventStats } from '@/core/types';
import {
  queryEventGeneralStatistics,
  queryEventsStatisticsPerWeek,
} from '@/service/event/queryEventsStatistics';
import { EventContext } from '@/core/context/EventContext';
import { demoChartData, demoGeneralStats } from '@/lib/demoStatsData';
import { AnimatedCounter } from '@/components/incrementingText/incrementingText';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StarOutlined } from '@ant-design/icons';
import { Progress } from 'antd';

const StatisticsPage = () => {
  const { eventInstance } = useContext(EventContext);
  const [shrinkElement, setShrinkElement] = useState(false);
  const [eventStats, setEventStatistics] = useState<EventStats[]>([]);
  const [generalStats, setGeneralStatistics] = useState<EventStats>(
    {} as EventStats
  );

  const isPremiumOrAbove =
    eventInstance?.eventPlan === 'premium' ||
    eventInstance?.eventPlan === 'ultimate';

  const queryEventStats = async () => {
    if (!eventInstance?.eventId) {
      console.error('Event ID is not available');
      return;
    }
    const stats = await queryEventsStatisticsPerWeek(eventInstance.eventId);
    const genStats = await queryEventGeneralStatistics(eventInstance.eventId);

    setEventStatistics(stats);
    setGeneralStatistics(genStats);
  };

  useEffect(() => {
    if (eventInstance?.eventId && isPremiumOrAbove) {
      queryEventStats();
    } else if (eventInstance?.eventId && !isPremiumOrAbove) {
      setEventStatistics(demoChartData);
      setGeneralStatistics(demoGeneralStats);
    }
  }, [eventInstance]);

  useEffect(() => {
    const element = document.querySelector('.dashboard-statistics-container');
    if (element) {
      const observer = new ResizeObserver((entries) => {
        const e = entries[0]; // should be only one
        if (e.contentRect.width < 1024) {
          setShrinkElement(true);
        } else {
          setShrinkElement(false);
        }
      });

      // start listening for size changes
      observer.observe(element);
    }
  }, []);

  return (
    <div className="dashboard-statistics-container">
      <div
        className={`flex w-full gap-4 flex-${shrinkElement ? 'col' : 'row'}`}
      >
        <div className="w-full">
          <AreaCustomChart
            data={eventStats}
            xAxisKey={'date'}
            yAxisKey={'responses'}
            color="blue"
            label="Raspunsuri"
            title="Raspunsuri"
            description="Raspunsuri pe ultima saptamana"
            isBasicPlan={!isPremiumOrAbove}
          />
        </div>
        <div className="w-full">
          <AreaCustomChart
            data={eventStats}
            xAxisKey={'date'}
            yAxisKey={'confirmations'}
            color="green"
            label="Confirmari"
            title="Confirmari"
            description="Confirmari pe ultima saptamana"
            isBasicPlan={!isPremiumOrAbove}
          />
        </div>
        <div className="w-full">
          <AreaCustomChart
            data={eventStats}
            xAxisKey={'date'}
            yAxisKey={'refusals'}
            color="red"
            label="Refuzuri"
            title="Refuzuri"
            description="Refuzuri pe ultima saptamana"
            isBasicPlan={!isPremiumOrAbove}
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 lg:flex-row  ">
        <div className="w-full lg:w-1/2">
          <PieCustomChart
            data={[
              {
                type: 'confirmations',
                value: generalStats.confirmations || 0,
                fill: '#4CAF50',
              },
              {
                type: 'refusals',
                value: generalStats.refusals || 0,
                fill: '#F44336',
              },
            ]}
            isBasicPlan={!isPremiumOrAbove}
          />
        </div>
        <div className="w-full grid grid-cols-2 gap-4 lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>
                {'Raspunsuri'}
                {!isPremiumOrAbove && (
                  <span style={{ color: '#FFB347', marginLeft: 6 }}>
                    <StarOutlined />
                  </span>
                )}
              </CardTitle>
              <CardDescription>Numarul total de raspunsuri</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedCounter
                color="blue"
                from={0}
                to={generalStats.responses}
                duration={2}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {'Confirmari'}
                {!isPremiumOrAbove && (
                  <span style={{ color: '#FFB347', marginLeft: 6 }}>
                    <StarOutlined />
                  </span>
                )}
              </CardTitle>
              <CardDescription>Numarul total de confirmari</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedCounter
                color="#4CAF50"
                from={0}
                to={generalStats.confirmations ?? 0}
                duration={2}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {'Refuzuri'}
                {!isPremiumOrAbove && (
                  <span style={{ color: '#FFB347', marginLeft: 6 }}>
                    <StarOutlined />
                  </span>
                )}
              </CardTitle>
              <CardDescription>Numarul total de refuzuri</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedCounter
                color="red"
                from={0}
                to={generalStats.refusals ?? 0}
                duration={2}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {'Rata de raspuns'}
                {!isPremiumOrAbove && (
                  <span style={{ color: '#FFB347', marginLeft: 6 }}>
                    <StarOutlined />
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Din totalul de invitati, cate raspunsuri au fost primite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                type="circle"
                size={100}
                format={() => {
                  return (
                    <span className="text-[16px] font-semibold">
                      {`${generalStats.responses ?? 0}/${
                        eventInstance?.eventGuestCount ?? 0
                      }`}
                    </span>
                  );
                }}
                percent={
                  generalStats.responses && eventInstance?.eventGuestCount
                    ? (generalStats.responses / eventInstance.eventGuestCount) *
                      100
                    : 0
                }
                steps={{ count: 10, gap: 2 }}
                trailColor="rgba(0, 0, 0, 0.06)"
                strokeWidth={20}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <ActivityChart data={eventStats} isBasicPlan={!isPremiumOrAbove} />
    </div>
  );
};

export default StatisticsPage;
