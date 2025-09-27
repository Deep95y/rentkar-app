// src/lib/redis.ts
import Redis from 'ioredis';

let redisClient: Redis | null = null;

export function getRedis(): Redis {
	if (redisClient) return redisClient;
	const url = process.env.REDIS_URL || 'redis://localhost:6379';
	console.log('🔗 Connecting to Redis:', url.replace(/:[^:]*@/, ':***@')); // Hide password in logs
	
	// Configure Redis based on URL type
	const isLocalRedis = url.startsWith('redis://') && !url.includes('upstash');
	const options: any = {
		lazyConnect: true, 
		maxRetriesPerRequest: 1,
		enableReadyCheck: false,
		connectTimeout: 10000, // 10 second timeout
		commandTimeout: 5000,  // 5 second command timeout
		retryDelayOnFailover: 100,
	};
	
	// Only use TLS for external Redis (Upstash)
	if (!isLocalRedis) {
		options.tls = {};
	}
	
	redisClient = new Redis(url, options);
	
	// Add connection event handlers
	redisClient.on('connect', () => console.log('✅ Redis connected'));
	redisClient.on('error', (err) => console.log('❌ Redis error:', err.message));
	redisClient.on('close', () => console.log('🔌 Redis connection closed'));
	
	return redisClient;
}

export async function withLock<T>(key: string, ttlMs: number, task: () => Promise<T>): Promise<T> {
	try {
		const redis = getRedis();
		const lockKey = `lock:${key}`;
		const token = Math.random().toString(36).slice(2);
		const acquired = await redis.set(lockKey, token, 'PX', ttlMs, 'NX');
		if (!acquired) {
			throw new Error('LOCK_NOT_ACQUIRED');
		}
		try {
			return await task();
		} finally {
			const releaseScript = `if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end`;
			await redis.eval(releaseScript, 1, lockKey, token);
		}
	} catch (error) {
		// If Redis fails, proceed without lock (not ideal but allows app to work)
		console.warn('Redis lock failed, proceeding without lock:', error);
		return await task();
	}
}

export async function rateLimitAllow(key: string, maxCount: number, windowSec: number): Promise<boolean> {
	try {
		const redis = getRedis();
		const now = Date.now();
		const windowKey = `rl:${key}:${Math.floor(now / (windowSec * 1000))}`;
		const count = await redis.incr(windowKey);
		if (count === 1) {
			await redis.expire(windowKey, windowSec);
		}
		return count <= maxCount;
	} catch (error) {
		// If Redis fails, allow the request (not ideal but allows app to work)
		console.warn('Redis rate limit failed, allowing request:', error);
		return true;
	}
}

export const pubsub = {
	publish: async (channel: string, message: unknown) => {
		try {
			const redis = getRedis();
			await redis.publish(channel, JSON.stringify(message));
		} catch (error) {
			// If Redis fails, log but don't crash
			console.warn('Redis pubsub failed:', error);
		}
	},
};
