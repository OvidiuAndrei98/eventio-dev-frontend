'use client';

import { PricingCard } from '@/components/pricingCard/PricingCard';
import { EventContext } from '@/core/context/EventContext';
import { PLANYVITE_EVENT_PLANS } from '@/lib/planyviteEventPlanTiers';
import React, { useContext } from 'react';

const ChosePlanPage: React.FC = () => {
  const { eventInstance } = useContext(EventContext);
  return (
    <div className="flex flex-col w-full h-screen bg-[#F6F6F6]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl text-[var(--secondary-color)] font-bold mb-4 text-center">
          Alege planul potrivit pentru evenimentul tău
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Alege unul dintre planurile noastre pentru a beneficia de
          funcționalități avansate și suport dedicat. Indiferent dacă organizezi
          un eveniment mic sau unul de amploare, avem o opțiune potrivită pentru
          tine!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANYVITE_EVENT_PLANS.map((plan) => (
            <PricingCard
              key={plan.name}
              tier={plan}
              activePlan={eventInstance?.eventPlan}
              showButton={true}
              userId={eventInstance?.userId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChosePlanPage;
