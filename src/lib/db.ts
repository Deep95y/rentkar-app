// src/lib/db.ts
import { MongoClient, Db, Collection, Document } from 'mongodb';

let mongoClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getMongoClient(): Promise<MongoClient> {
	if (mongoClient) return mongoClient;
	const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentkar';
	mongoClient = new MongoClient(uri, { ignoreUndefined: true });
	await mongoClient.connect();
	return mongoClient;
}

export async function getDb(): Promise<Db> {
	if (cachedDb) return cachedDb;
	const client = await getMongoClient();
	const dbName = process.env.MONGODB_DB || 'rentkar';
	cachedDb = client.db(dbName);
	return cachedDb;
}

export async function collection<T extends Document = Document>(name: string): Promise<Collection<T>> {
	const db = await getDb();
	return db.collection<T>(name);
}

export async function ensureIndexes(): Promise<void> {
	const partners = await collection('partners');
	await partners.createIndex({ location: '2dsphere' });
	await partners.createIndex({ status: 1 });
	const bookings = await collection('bookings');
	await bookings.createIndex({ userId: 1 });
	await bookings.createIndex({ packageId: 1 });
}
