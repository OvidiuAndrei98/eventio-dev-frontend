export const trackTikTokEvent = (eventName, data = {}) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(eventName, data);
  } else {
    console.warn('TikTok Pixel (ttq) not found on window.');
  }
};
