import dotenv from 'dotenv';
import connectDB from '../src/db/index.js'
import app from './app.js';

dotenv.config({
    path: "./.env"
});

const startServer = async (retryCount=1) => {
    try {
        await connectDB();
        console.log(`Connected to DB successfully!`);
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server listening on PORT ${PORT}`);
        })
    } 
    catch (error) {
        console.log(error);
        console.log(`DB connection failed. Attempt ${retryCount}`);
        console.log(`Retrying in 5 seconds...`);
        setTimeout(()=>{
            startServer(retryCount+1);
        }, 5000)
    }
}

startServer();