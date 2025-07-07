# ⚡ Panduan Optimasi Performance

## Strategi Optimasi Database

### 1. **Indexing Strategy** 📊
```sql
-- Index yang sudah diimplementasikan
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_kode_unit ON users(kode_unit);
CREATE INDEX idx_role ON users(role);
CREATE INDEX idx_user_id ON event_permissions(user_id);
CREATE INDEX idx_verified_at ON event_permissions(verified_at);
CREATE INDEX idx_created_at ON event_permissions(created_at);
CREATE INDEX idx_nama_acara ON event_permissions(nama_acara);
CREATE INDEX idx_tanggal_mulai ON event_permissions(tanggal_mulai);
CREATE INDEX idx_provinsi_kota ON event_permissions(provinsi_id, kota_id);
```

### 2. **Connection Pooling** 🏊‍♂️
```javascript
// Konfigurasi di src/db/index.js
const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
  multipleStatements: true,
  // Pool settings untuk performance
  connectionLimit: 10,      // Max 10 concurrent connections
  queueLimit: 0,           // No limit pada antrian
  acquireTimeout: 60000,   // 60 detik timeout
  timeout: 60000,          // 60 detik query timeout
  reconnect: true,         // Auto reconnect
  idleTimeout: 300000,     // 5 menit idle timeout
});
```

### 3. **Query Optimization** 🔍
```javascript
// Contoh optimized query dengan Drizzle
// BEFORE: N+1 query problem
const events = await db.select().from(event_permissions);
for (const event of events) {
  event.provinsi = await db.select().from(provinsi).where(eq(provinsi.id, event.provinsi_id));
}

// AFTER: Single query dengan join
const events = await db
  .select({
    event: event_permissions,
    provinsi: provinsi,
    kota: kota,
    kategori: kategori_acara
  })
  .from(event_permissions)
  .leftJoin(provinsi, eq(event_permissions.provinsi_id, provinsi.id))
  .leftJoin(kota, eq(event_permissions.kota_id, kota.id))
  .leftJoin(kategori_acara, eq(event_permissions.kategori_acara_id, kategori_acara.id));
```

## Caching Strategy

### 1. **Apollo Server Cache** 📦
```javascript
// Di src/graphql/index.js
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: 'bounded', // Bounded cache untuk memory efficiency
  plugins: [
    // Cache control plugin
    ApolloServerPluginCacheControl({
      defaultMaxAge: 300, // 5 menit default cache
    }),
  ],
});
```

### 2. **Query-Level Caching** 🎯
```javascript
// Di resolvers, tambahkan cache hints
const resolvers = {
  Query: {
    getProvinsi: async (_, __, { dataSources, cache }) => {
      // Cache provinsi data selama 1 jam (jarang berubah)
      const cacheKey = 'all_provinsi';
      const cached = await cache.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }
      
      const result = await dataSources.referenceAPI.getProvinsi();
      await cache.set(cacheKey, JSON.stringify(result), { ttl: 3600 });
      
      return result;
    },
  },
};
```

### 3. **Redis Cache (Advanced)** 🔴
```javascript
// Install: npm install redis
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// Cache implementation
class CacheService {
  async get(key) {
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      await client.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
}
```

## GraphQL Performance

### 1. **Query Complexity Analysis** 🧮
```javascript
// Install: npm install graphql-query-complexity
const costAnalysis = require('graphql-query-complexity').costAnalysisFromGlobalMaximum;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    costAnalysis({
      maximumCost: 1000, // Max complexity score
      onComplete: (complexity) => {
        console.log('Query complexity:', complexity);
      },
    }),
  ],
});
```

### 2. **DataLoader untuk Batch Loading** 📥
```javascript
// Install: npm install dataloader
const DataLoader = require('dataloader');

// Di data sources
class EventPermissionAPI {
  constructor() {
    this.provinsiLoader = new DataLoader(this.batchGetProvinsi.bind(this));
  }

  async batchGetProvinsi(provinsiIds) {
    // Batch load multiple provinsi in single query
    const provinsiList = await db
      .select()
      .from(provinsi)
      .where(inArray(provinsi.id, provinsiIds));
    
    // Return dalam order yang sama dengan input
    return provinsiIds.map(id => 
      provinsiList.find(p => p.id === id) || null
    );
  }

  async getProvinsi(id) {
    return this.provinsiLoader.load(id);
  }
}
```

### 3. **Pagination Optimization** 📄
```javascript
// Cursor-based pagination (lebih efficient untuk large datasets)
const getEventPermissionList = async (_, { pagination }) => {
  const { take = 10, cursor, sort = 'created_at', sortDirection = 'desc' } = pagination;
  
  let query = db.select().from(event_permissions);
  
  // Cursor-based pagination
  if (cursor) {
    query = query.where(
      sortDirection === 'desc' 
        ? lt(event_permissions[sort], cursor)
        : gt(event_permissions[sort], cursor)
    );
  }
  
  query = query
    .orderBy(sortDirection === 'desc' 
      ? desc(event_permissions[sort]) 
      : asc(event_permissions[sort])
    )
    .limit(take + 1); // +1 untuk check hasNextPage
  
  const results = await query;
  const hasNextPage = results.length > take;
  const edges = hasNextPage ? results.slice(0, -1) : results;
  
  return {
    data: edges,
    pageInfo: {
      hasNextPage,
      endCursor: edges.length > 0 ? edges[edges.length - 1][sort] : null,
    },
  };
};
```

## Server Optimization

### 1. **Memory Management** 💾
```javascript
// Monitor memory usage
setInterval(() => {
  const used = process.memoryUsage();
  console.log('Memory usage:', {
    rss: Math.round(used.rss / 1024 / 1024) + ' MB',
    heapTotal: Math.round(used.heapTotal / 1024 / 1024) + ' MB',
    heapUsed: Math.round(used.heapUsed / 1024 / 1024) + ' MB',
    external: Math.round(used.external / 1024 / 1024) + ' MB',
  });
}, 30000); // Log setiap 30 detik
```

### 2. **Response Compression** 🗜️
```javascript
// Install: npm install compression
const compression = require('compression');

app.use(compression({
  level: 6,    // Compression level (1-9)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));
```

### 3. **Process Clustering** 👥
```javascript
// cluster.js
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart worker
  });
} else {
  // Worker process
  require('./server.js');
  console.log(`Worker ${process.pid} started`);
}
```

## Monitoring Performance

### 1. **Performance Metrics** 📈
```javascript
// Install: npm install express-status-monitor
const monitor = require('express-status-monitor');

app.use(monitor({
  title: 'Event Permission API Status',
  path: '/status',
  spans: [{
    interval: 1,     // Every second
    retention: 60    // Keep 60 seconds
  }, {
    interval: 5,     // Every 5 seconds
    retention: 60    // Keep 5 minutes
  }],
}));
```

### 2. **Query Performance Tracking** ⏱️
```javascript
// Middleware untuk track query performance
const queryPerformance = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    if (duration > 1000) { // Log slow queries (>1s)
      console.warn('Slow query detected:', {
        url: req.originalUrl,
        method: req.method,
        duration: `${duration}ms`,
        query: req.body?.query?.substring(0, 100),
      });
    }
  });
  
  next();
};
```

## Performance Testing

### 1. **Load Testing dengan Artillery** 🎯
```yaml
# artillery-config.yml
config:
  target: 'http://localhost:4000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "GraphQL queries"
    requests:
      - post:
          url: "/graphql"
          json:
            query: "{ getProvinsi { id nama } }"
```

```bash
# Install artillery
npm install -g artillery

# Run load test
artillery run artillery-config.yml
```

### 2. **Memory Leak Detection** 🔍
```javascript
// Install: npm install clinic
// Run dengan clinic doctor untuk detect issues
npx clinic doctor -- node server.js

// Run dengan clinic bubbleprof untuk analyze async operations
npx clinic bubbleprof -- node server.js
```

## Performance Checklist

- [ ] Database indexes optimized
- [ ] Connection pooling configured
- [ ] Query N+1 problems eliminated
- [ ] Caching strategy implemented
- [ ] GraphQL query complexity limits
- [ ] DataLoader untuk batch operations
- [ ] Pagination implemented correctly
- [ ] Response compression enabled
- [ ] Memory usage monitored
- [ ] Slow query detection
- [ ] Load testing performed
- [ ] Error rate monitoring
- [ ] Resource usage alerts
