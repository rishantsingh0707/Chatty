import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
    },
    profilePic: {
        type: String,
        default: '',
    },
    friends: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    uniqueCode: {
        type: String,
        unique: true,
        required: true
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;