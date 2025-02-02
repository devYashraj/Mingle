import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});

export const uploadToCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath)   
            return null;
        
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: 'mingle'
        });
        
        fs.unlinkSync(localFilePath);
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath);
        return null
    }
}

export const deleteFromCloudinary = async (publicId,type) => {

    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: type});
    } catch (error) {
        return null;
    }
}