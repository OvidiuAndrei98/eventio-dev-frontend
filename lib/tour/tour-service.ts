export const TourService = {
  isCompleted: (tourId: string): boolean => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(`joyride_done_${tourId}`) === 'true';
  },
  setCompleted: (tourId: string) => {
    localStorage.setItem(`joyride_done_${tourId}`, 'true');
  },
};
