import {
  ResponsiveOverrides,
  ResponsiveProperties,
  TemplateElement,
} from '@/core/types';

// Define breakpoints (maximum limits included)
export const BREAKPOINTS = {
  mobile: 430, // Max width for mobile
  tablet: 778, // Max width for tablet
  desktop: 1200, // Max width for desktop
};

// Helper function to get the name of the active breakpoint
export const getBreakpointName = (
  width: number
): keyof typeof BREAKPOINTS | 'desktop' => {
  if (width <= BREAKPOINTS.mobile) {
    return 'mobile';
  } else if (width <= BREAKPOINTS.tablet) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

// Helper function to compare the order of breakpoints (useful for sorting or cascading)
// Defines an explicit order
export const BREAKPOINT_ORDER: (keyof typeof BREAKPOINTS | 'desktop')[] = [
  'mobile',
  'tablet',
  'desktop',
];

// Function to compare two breakpoints based on their order
// Returns a negative number if bp1 < bp2, zero if they are equal, and a positive number if bp1 > bp2
export const compareBreakpoints = (
  bp1: keyof typeof BREAKPOINTS | 'desktop',
  bp2: keyof typeof BREAKPOINTS | 'desktop'
): number => {
  const index1 = BREAKPOINT_ORDER.indexOf(bp1);
  const index2 = BREAKPOINT_ORDER.indexOf(bp2);
  return index1 - index2;
};

/**
 * Function to merge responsive properties with default properties
 * @param defaultProps  Default properties of the element (without responsive)
 * @param responsiveOverrides Responsive overrides for different breakpoints
 * @param activeBreakpointName Breakpoint name to apply overrides for
 * @returns Responsive properties merged with default properties
 * @template T Type of the element (should have a responsive property)
 */
export const mergeResponsiveProperties = <
  T extends { responsive?: TemplateElement['responsive'] } // Tipul generic pentru a accepta orice tip de element care are proprietatea responsive
>(
  defaultProps: Omit<T, 'responsive'>,
  responsiveOverrides?: ResponsiveOverrides,
  activeBreakpointName?: keyof typeof BREAKPOINTS | 'desktop'
): Omit<T, 'responsive'> & ResponsiveProperties => {
  // Start with default properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalProps: any = { ...defaultProps };

  if (!responsiveOverrides || !activeBreakpointName) {
    return finalProps; // Return default properties if no overrides or active breakpoint is provided
  }

  // Get the active breakpoint's responsive properties
  const activeOverride = responsiveOverrides[activeBreakpointName];

  // Merge the default properties with the overrides from the active breakpoint
  // The properties from the breakpoint override the default ones
  if (activeOverride) {
    if (activeOverride.position !== undefined) {
      finalProps.position = activeOverride.position;
    }

    if (activeOverride.display !== undefined) {
      finalProps.display = activeOverride.display;
    }

    if (activeOverride.borderStyles !== undefined) {
      finalProps.borderStyles = activeOverride.borderStyles;
    }

    // Combine styles: breakpoint styles override default styles
    if (activeOverride.style) {
      finalProps.style = {
        ...(finalProps.style || {}),
        ...activeOverride.style,
      };
    }
  }

  return finalProps as Omit<T, 'responsive'> & ResponsiveProperties; // Returneaza setul final de proprietati
};
