let currentControls = null;
const subscribers = new Set();

/**
 * Publish the latest audio controls so floating UI elements can read them.
 * @param {object|null} payload
 */
export const setGlobalAudioControls = (payload) => {
  currentControls = payload;
  subscribers.forEach((listener) => {
    try {
      listener(currentControls);
    } catch (error) {
      console.error('Global audio subscriber error:', error);
    }
  });
};

/**
 * Subscribe to updates. Immediately invokes the listener with the latest payload.
 * @param {(payload: object|null) => void} listener
 * @returns {() => void} unsubscribe function
 */
export const subscribeGlobalAudioControls = (listener) => {
  if (typeof listener !== 'function') {
    return () => {};
  }
  subscribers.add(listener);
  listener(currentControls);
  return () => {
    subscribers.delete(listener);
  };
};

/**
 * Convenience helper to clear controls.
 */
export const clearGlobalAudioControls = () => {
  setGlobalAudioControls(null);
};


