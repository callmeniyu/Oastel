import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable")
}

interface MongooseGlobal {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

// Properly extend global type
declare global {
    var mongooseGlobal: MongooseGlobal | undefined
}

let cached = globalThis.mongooseGlobal

if (!cached) {
    cached = globalThis.mongooseGlobal = { conn: null, promise: null }
}

// Ensure cached is always defined
cached = cached ?? { conn: null, promise: null }
globalThis.mongooseGlobal = cached

async function dbConnect(): Promise<typeof mongoose> {
    if (!cached) {
        throw new Error("Mongoose cache is not initialized")
    }
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            dbName: "oastel",
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts)
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        throw error
    }

    return cached.conn
}

export default dbConnect
