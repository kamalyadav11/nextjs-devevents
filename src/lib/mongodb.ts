import mongoose, { type Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

console.log('MONGODB_URI:', MONGODB_URI); // Debugging line to check the value of MONGODB_URI

if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable.');
}

interface MongooseCache {
	conn: Mongoose | null; //the finished database connection, or null if not connected yet
	promise: Promise<Mongoose> | null; //the in-flight connection promise, or null if no connection attempt is in progress
}

declare global {
	// Preserve the connection across hot reloads in development.
	// This avoids opening a new connection on every module refresh.
	var mongooseCache: MongooseCache | undefined;
}

const globalWithMongoose = global as typeof globalThis & {
	mongooseCache?: MongooseCache;
};

const cached = globalWithMongoose.mongooseCache ?? {
	conn: null,
	promise: null,
};

globalWithMongoose.mongooseCache = cached;

export default async function connectToDatabase(): Promise<Mongoose> {
	// Reuse the existing connection when one is already available.
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const options = {
			bufferCommands: false, //This tells Mongoose not to queue operations while disconnected.
		};

		// If not already connecting, create a new connection promise and cache it.
		cached.promise = mongoose.connect(MONGODB_URI, options);
	}

	try {
		cached.conn = await cached.promise;
	} catch (error) {
		cached.promise = null;
		throw error;
	}

	return cached.conn;
}
