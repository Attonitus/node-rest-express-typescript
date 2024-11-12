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

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, rec, options){
        delete rec._id,
        delete rec.password
    }
});

export const UserModel = model('User', userSchema);