export class ExpiringMap<K, V> {
    private map: Map<K, { value: V, expiry: number }>;
    private defaultExpiry: number;
  
    constructor(defaultExpiry: number) {
      this.map = new Map();
      this.defaultExpiry = defaultExpiry;
    }
  
    private pruneExpiredEntries(): void {
      const now = Date.now();
      for (const [key, { expiry }] of this.map) {
        if (expiry <= now) {
          this.map.delete(key);
        }
      }
    }
  
    set(key: K, value: V): void {
      this.pruneExpiredEntries();
      const expiryTime = Date.now() + this.defaultExpiry;
      this.map.set(key, { value, expiry: expiryTime });
    }
  
    get(key: K): V | undefined {
      this.pruneExpiredEntries();
      const entry = this.map.get(key);
      if (entry && entry.expiry > Date.now()) {
        return entry.value;
      } else {
        this.map.delete(key); 
        return undefined;
      }
    }
  }
  
  