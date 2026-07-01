const cache = new Map();

export const getCache = (key) => cache.get(key);

export const setCache = (key, val, ttl = 60000) => {
  cache.set(key, val);
  if (ttl) {
    setTimeout(() => cache.delete(key), ttl);
  }
};

export const clearCache = () => cache.clear();
