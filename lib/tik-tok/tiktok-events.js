/**
 * TikTok Pixel Event Tracking
 * This module provides functions to track events and identify users with TikTok Pixel.
 * @param {*} eventName
 * @param {*} data
 */
export const trackTikTokEvent = (eventName, data = {}) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(eventName, data);
  } else {
    console.warn('TikTok Pixel (ttq) not found on window.');
  }
};

/**
 * Identify a TikTok user with custom data.
 * This function can be used to send user data to TikTok for better targeting and analytics.
 * @param {*} userData
 */
export const identifyTikTokUser = (userData = {}) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.identify(userData);
    console.log('TikTok User Identified:', userData); // Pentru debugging
  }
};
