import mongoose ,{ Schema } from "mongoose";

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
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;