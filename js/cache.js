const CACHE = {
  cacheAppName: "giftr-cache",
  cache: null,

  init() {

  },

  put(request, response) {
    return caches.open(CACHE.cacheAppName).then((cache) => {
      return cache.put(request, response);
    }).catch((error) => {
      console.warn('Failed to put item in cache', error);
    });
  },

  openCache() {
    return caches.open(CACHE.cacheAppName);
  },

  getFileNames() {
    return caches.open(CACHE.cacheAppName).then((cache) => {
      return cache.keys();
    });
  },

  deleteFile(file) {
    return caches.open(CACHE.cacheAppName).then((cache) => {
      return cache.delete(file);
    }).catch((error) => {
      console.warn('Failed to delete item from cache', error);
    });
  },  

};

export default CACHE;
