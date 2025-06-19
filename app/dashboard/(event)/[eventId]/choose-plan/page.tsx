'use client';

import { PricingCard } from '@/components/pricingCard/PricingCard';
import { EventContext } from '@/core/context/EventContext';
import { PLANYVITE_EVENT_PLANS } from '@/lib/planyviteEventPlanTiers';
import React, { useContext, useEffect, useState } from 'react';

const ChosePlanPage: React.FC = () => {
  const [shrinkElement, setShrinkElement] = useState(false);
  const { eventInstance } = useContext(EventContext);

  useEffect(() => {
    const element = document.querySelector('.pricing-container');
    if (element) {
      const observer = new ResizeObserver((entries) => {
        const e = entries[0]; // should be only one
        if (e.contentRect.width < 1048) {
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
    <div className="pricing-container w-full h-screen bg-[#F6F6F6] overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col shrink">
        <h1 className="text-4xl text-[var(--secondary-color)] font-bold mb-4 text-center">
          Alege planul potrivit pentru evenimentul tău
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Alege unul dintre planurile noastre pentru a beneficia de
          funcționalități avansate și suport dedicat. Indiferent dacă organizezi
          un eveniment mic sau unul de amploare, avem o opțiune potrivită pentru
          tine!
        </p>
        <div
          className={`flex ${shrinkElement ? 'flex-col' : 'flex-row'} gap-6`}
        >
          {PLANYVITE_EVENT_PLANS.map((plan) => {
            if (
              (plan.id === 'ultimate' &&
                eventInstance?.eventPlan === 'premium') ||
              (plan.id === 'ultimate_upgrade' &&
                (eventInstance?.eventPlan === 'basic' ||
                  eventInstance?.eventPlan === 'ultimate'))
            ) {
              return null; // Skip rendering for this plan if conditions are met
            }
            return (
              <PricingCard
                key={plan.name}
                tier={plan}
                activePlan={eventInstance?.eventPlan}
                showButton={true}
                userId={eventInstance?.userId}
                eventId={eventInstance?.eventId}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChosePlanPage;
