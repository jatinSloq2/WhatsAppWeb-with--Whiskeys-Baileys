const timestamp = () => new Date().toISOString();

export const logger = {
  log: (...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[LOG - ${timestamp()}]`, ...args);
    }
  },

  error: (...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[ERROR - ${timestamp()}]`, ...args);
    }
  },

  warn: (...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[WARN - ${timestamp()}]`, ...args);
    }
  }
};