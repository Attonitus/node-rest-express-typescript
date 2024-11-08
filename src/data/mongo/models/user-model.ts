import { model, Schema } from "mongoose";


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    emailValidated: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img: String,
    role: {
        type: [String],
        default: 'USER',
        enum: ['ADMIN', 'USER']
    }
});

export const UserModel = model('User', userSchema);