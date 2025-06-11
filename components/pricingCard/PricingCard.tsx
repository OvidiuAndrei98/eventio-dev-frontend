import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BadgeCheck } from 'lucide-react';
import { PricingTier } from '@/core/types';
import { PLANYVITE_EVENT_PLANS } from '@/lib/planyviteEventPlanTiers';
import { planUpgradeCheckout } from '@/service/stripe/planUpgradeCheckout';

export const PricingCard = ({
  tier,
  activePlan,
  showButton,
  userId,
  eventId,
}: {
  tier: PricingTier;
  activePlan?: string;
  showButton?: boolean;
  userId?: string;
  eventId?: string;
}) => {
  const price = tier.price;
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;
  let isCurrent = false;
  let isBelow = false;
  let isCurrentOrBelow = false;

  if (activePlan && showButton) {
    // Găsește ordinea planului activ
    const activePlanOrder =
      typeof activePlan === 'string'
        ? PLANYVITE_EVENT_PLANS.find((p) => p.id === activePlan)?.order ?? 0
        : 0;

    // Disable dacă planul curent sau inferior
    isCurrent = activePlan === tier.id;
    isBelow = typeof tier.order === 'number' && activePlanOrder > tier.order;
    isCurrentOrBelow = isCurrent || isBelow;
  }

  return (
    <div
      className={cn(
        'relative flex flex-col gap-8 overflow-hidden rounded-2xl border p-6 shadow',
        isHighlighted
          ? 'bg-[#fdf6fe99] text-[var(--secondary-color)]'
          : 'bg-[#fdf6fe99] text-[var(--secondary-color)]',
        isPopular && 'outline outline-[#b46acb]'
      )}
    >
      {/* Card Header */}
      <h2 className="flex items-center gap-3 text-xl font-medium capitalize">
        {tier.name}
        {isPopular && (
          <Badge className="mt-1 bg-[#b46acb] px-1 py-0 text-white hover:bg-[#b46acb]">
            🔥 Most Popular
          </Badge>
        )}
      </h2>

      {/* Price Section */}
      <div className="relative h-12">
        {typeof price === 'number' ? (
          <>
            <span className="text-4xl font-medium">
              {}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'RON',
              }).format(price)}
            </span>
            {tier.oldPrice && (
              <span className="text-lg font-medium text-gray-400 line-through">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'RON',
                }).format(tier.oldPrice)}
              </span>
            )}
          </>
        ) : (
          <h1 className="text-4xl font-medium">{price}</h1>
        )}
      </div>

      {/* Features */}
      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-medium">{tier.description}</h3>
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                'flex items-center gap-2 text-sm font-medium',
                'text-[var(--secondary-color)]'
              )}
            >
              <BadgeCheck strokeWidth={1} size={16} />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Call to Action Button */}
      {showButton && (
        <Button
          className={cn(
            'h-fit w-full rounded-lg font-semibold cursor-pointer transition-all duration-200',
            isCurrent
              ? 'bg-green-100/60 text-green-700 border border-green-500 cursor-not-allowed shadow-md ring-1 ring-green-400'
              : 'bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white'
          )}
          disabled={isCurrent || isBelow}
          onClick={() => {
            if (!isCurrent && !isBelow && tier?.priceId && userId && eventId) {
              planUpgradeCheckout(userId, tier.priceId, eventId, tier.type);
            }
          }}
        >
          {isCurrent ? 'Planul curent' : tier.cta}
        </Button>
      )}
    </div>
  );
};
