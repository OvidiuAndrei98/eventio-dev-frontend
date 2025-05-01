import { createContext, useContext } from 'react';
import { EventInstance } from '@/core/types';

interface EventContextType {
  eventInstance: EventInstance | null;
  setEventInstance: (event: EventInstance | null) => void;
  queryEventLoading: boolean;
  queryEventError: any;
  setQueryEventLoading: (loading: boolean) => void;
}

export const EventContext = createContext<EventContextType>({
  eventInstance: null,
  setEventInstance: () => {},
  queryEventLoading: true,
  queryEventError: null,
  setQueryEventLoading: () => {},
});

export const useEventContext = () => useContext(EventContext);
