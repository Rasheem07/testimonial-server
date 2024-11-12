import { Request, Response } from "express";
import {
  insertSocialTestimonial,
  insertTextTestimonial,
  insertVideoTestimonial,
} from "../../actions/testimonial/insertTestimonial";

// Insert a new text testimonial
export const handlecreateTestimonial = async (req: Request, res: Response) => { 
  try {
    const data = req.body; // Assuming the request body contains the testimonial data


    console.log('testimonial data:', data);
    //@ts-ignore
    const image_src = req.files?.image_src[0];
    //@ts-ignore
    const user_photo = req.files?.user_photo[0];

   await insertTextTestimonial(image_src, user_photo, data);

    return res.status(201).json({
      message: "Testimonial created successfully"
    });
  } catch (err) {
    console.error("Error creating testimonial: ", err);
    return res.status(500).json({ message: "Failed to create testimonial." });
  }
};

// Insert a new video testimonial
export const createVideoTestimonial = async (req: Request, res: Response) => {
  try {
    const data = req.body; // Assuming the request body contains the video testimonial data
    const video = req.file;

    if(data.duration > 120){
      return res.status(404).json({message: "video must be less than 2 minutes!"})
    }

    console.log('video: ', video);
    await insertVideoTestimonial(video, data);
    return res.status(201).json({
      message: "Video testimonial created successfully",
    });
  } catch (err) {
    console.error("Error creating video testimonial: ", err);
    return res
      .status(500)
      .json({ message: "Failed to create video testimonial." });
  }
};

// Insert a new social testimonial
export const createSocialTestimonial = async (req: Request, res: Response) => {
  try {
    const data = req.body; // Assuming the request body contains the social testimonial data
    const testimonial = await insertSocialTestimonial(data);
    return res.status(201).json({
      message: "Social testimonial created successfully",
      testimonial,
    });
  } catch (err) {
    console.error("Error creating social testimonial: ", err);
    return res
      .status(500)
      .json({ message: "Failed to create social testimonial." });
  }
};
