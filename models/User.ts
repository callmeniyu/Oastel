import mongoose, { Document, Schema, Types } from "mongoose"

export interface IUser extends Document {
    name: string
    email: string
    passwordHash?: string
    image?: string
    location?: string
    bio?: string
    address?: {
        whatsapp?: string
        phone?: string
        pickupAddresses?: string[]
    }
    cartId?: Types.ObjectId
    bookings: Types.ObjectId[]
    provider?: string
    googleId?: string
    createdAt: Date
    updatedAt: Date
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String },
        image: { type: String, default: "" },
        location: { type: String, default: "" },
        bio: { type: String, default: "" },
        address: {
            type: {
                whatsapp: { type: String, default: "" },
                phone: { type: String, default: "" },
                pickupAddresses: { type: [String], default: [] },
            },
            default: {},
        },
        cartId: { type: Schema.Types.ObjectId, ref: "Cart" },
        bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
        provider: { type: String },
        googleId: { type: String },
    },
    { timestamps: true }
)

// Check if the model already exists to prevent recompilation
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema)

export default User
