import { IProject } from '@/common.types';
import mongoose from 'mongoose'

const projectSchema:mongoose.Schema = new mongoose.Schema<IProject>({
    title: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true },
    image: { type: String, required: true },
    liveSiteUrl: { type: String, required: true },
    githubUrl: { type: String, required: true },
    category: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
})

// let Project
// try {
//     Project = mongoose.model('Project');
// } catch {
// }

const Project = mongoose.models?.Project || mongoose.model('Project', projectSchema);

export default Project