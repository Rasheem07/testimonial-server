import { decode } from "base64-arraybuffer";
import { supabase } from "../lib/supabase";
import ffmpeg from 'fluent-ffmpeg';
import ffprobe from 'ffprobe-static';
import getVideoDuration from "../utils/getDuration";

interface FileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export const uploadImageFile = async (bucket: string, file: any): Promise<string> => {
  try {
    console.log('Control reached file upload');
    console.log('File object:', file);

    if (!file.buffer) {
      throw new Error("File buffer is undefined");
    }

    const decodedFile = decode(file.buffer?.toString("base64"));

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(file.originalname, decodedFile, {
        contentType: file.mimetype,
        cacheControl: "3600",
      });

    if (error) {
      console.error("Error uploading file:", error.message);
      throw new Error("Error uploading file");
    }

    // Fetch the public URL of the uploaded file
    const { data: urlData } = await supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    const publicUrl = urlData.publicUrl as string;

    return publicUrl;
  } catch (err) {
    console.error("Error in uploadFile:", err);
    throw err;
  }
};
