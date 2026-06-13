export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  session: {
    get: <T>(key: string, defaultValue?: T): T | null => {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      } catch (error) {
        console.error('Error getting from sessionStorage:', error);
        return defaultValue || null;
      }
    },

    set: <T>(key: string, value: T): void => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error setting to sessionStorage:', error);
      }
    },

    remove: (key: string): void => {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from sessionStorage:', error);
      }
    },
  },
};
