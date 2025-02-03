import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js'

async function connectDB() {
    try {
        await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`);
    }
    catch (error) {
        throw error;
    }
}

export default connectDB