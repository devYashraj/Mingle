import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js'

async function connectDB() {
    try {
        await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`);
        console.log("Connected to DB successfully");
    }
    catch (error) {
        console.log("DB connection failed");
        console.log(error);
    }
}

export default connectDB