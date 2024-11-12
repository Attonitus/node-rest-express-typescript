import {v2 as cloudinary, UploadApiResponse} from 'cloudinary';

interface Props{
    cloud_name: string,
    api_key: string,
    api_secret: string
}

export const initializeImageService = ({cloud_name, api_key, api_secret}:Props) => {
    cloudinary.config({
        cloud_name: cloud_name,
        api_key: api_key,
        api_secret: api_secret
    });
}

export const uploadImage = async(file_path: string, folder: string) : Promise<[string?, UploadApiResponse?]> => {
    try {
        const uploadResult = await cloudinary.uploader.upload(file_path, {
            folder
        })
        return [undefined, uploadResult]
    } catch (error) {
        return ["Error uploading image"];
    }
}

export const deleteImage = async(public_id: string) : Promise<[string?, UploadApiResponse?]> => {
    try {
        const deleteImage = await cloudinary.uploader.destroy(public_id);
        return [undefined, deleteImage]
    } catch (error) {
        return ["Error uploading image"];
    }
}