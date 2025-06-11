import { EventStats } from '@/core/types';

const demoDate = new Date();

export const demoChartData: EventStats[] = [
  {
    date: demoDate.toISOString().slice(0, 10),
    id: '1',
    responses: 10,
    confirmations: 10,
    refusals: 0,
  },
  {
    date: new Date(demoDate.getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    id: '2',
    responses: 12,
    confirmations: 11,
    refusals: 1,
  },
  {
    date: new Date(demoDate.getTime() + 48 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    id: '3',
    responses: 15,
    confirmations: 13,
    refusals: 2,
  },
  {
    date: new Date(demoDate.getTime() + 72 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    id: '4',
    responses: 7,
    confirmations: 6,
    refusals: 1,
  },
  {
    date: new Date(demoDate.getTime() + 96 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    id: '5',
    responses: 2,
    confirmations: 2,
    refusals: 0,
  },
  {
    date: new Date(demoDate.getTime() + 120 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    id: '6',
    responses: 8,
    confirmations: 8,
    refusals: 0,
  },
];

export const demoGeneralStats = {
  id: 'demo-general-stats',
  responses: 25,
  confirmations: 22,
  refusals: 3,
  date: demoDate.toISOString().slice(0, 10),
};
