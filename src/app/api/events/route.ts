// src/app/api/events/route.ts
import Redis from 'ioredis';
import { getRedis } from '@/lib/redis';

export const runtime = 'nodejs';

export async function GET(_req: Request) {
	const stream = new ReadableStream({
		start(controller) {
			const redis = getRedis();
			const sub = new Redis(redis.options);
			const send = (event: string, data: unknown) => {
				controller.enqueue(`event: ${event}\n`);
				controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
			};
			sub.subscribe('booking:confirmed', 'partner:gps');
			sub.on('message', (channel, message) => {
				if (channel === 'booking:confirmed') send('booking-confirmed', JSON.parse(message));
				if (channel === 'partner:gps') send('partner-gps', JSON.parse(message));
			});
			controller.enqueue(`retry: 1000\n\n`);
			return () => {
				sub.disconnect();
			};
		},
	});
	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-transform',
			Connection: 'keep-alive',
		},
	});
}
