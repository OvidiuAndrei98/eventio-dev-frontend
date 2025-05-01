'use client';

import React, { useState, ReactNode, useEffect } from 'react';
import { EventContext } from '@/core/context/EventContext';
import { EventInstance } from '@/core/types';

interface EventProviderProps {
  children: ReactNode;
  initialEvent?: EventInstance | null;
  initialLoading?: boolean;
}

export function EventProvider({
  children,
  initialEvent = null,
  initialLoading = true,
}: EventProviderProps) {
  const [eventInstance, setEventInstance] = useState<EventInstance | null>(
    initialEvent
  );
  const [queryEventLoading, setQueryEventLoading] = useState(initialLoading);
  const [queryEventError, setQueryEventError] = useState(null);

  useEffect(() => {
    setEventInstance(initialEvent);
    setQueryEventLoading(initialLoading);
    setQueryEventError(null);
  }, [initialEvent]);

  return (
    <EventContext.Provider
      value={{
        eventInstance,
        setEventInstance,
        queryEventLoading,
        queryEventError,
        setQueryEventLoading,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
