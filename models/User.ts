import { UserType } from '@/common.types';
import mongoose, { Document, Model } from 'mongoose'

const userSchema:mongoose.Schema = new mongoose.Schema<UserType>({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    avatarUrl: {
        type: String,
    },
    description: {
        type: String,
        minlength: 2,
        maxlength: 1000,
    },
    githubUrl: {
        type: String,
    },
    linkedinUrl:  {type: String },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
})

interface UserModel extends UserType, Document {}


// let User
// try {
//     User = mongoose.model('User');
// } catch {
//     User = mongoose.model('User', userSchema);
// }

const User = mongoose.models?.User || mongoose.model('User', userSchema)

export default User