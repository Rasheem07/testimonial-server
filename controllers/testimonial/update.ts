import { Request, Response } from "express";  
import { updateSocialTestimonial, updateTextTestimonial, updateVideoTestimonial } from "../../actions/testimonial/updateTestimonial";

// Update an existing text testimonial
export const handleupdateTestimonial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // Get the testimonial ID from request parameters
      const data = req.body; // Get updated data from request body
      const updatedTestimonial = await updateTextTestimonial(id, data);
      
      if (!updatedTestimonial) {
        return res.status(404).json({ message: "Testimonial not found." });
      }
   
      return res.status(200).json({
        message: "Testimonial updated successfully",
        updatedTestimonial,
      });
    } catch (err) {
      console.error("Error updating testimonial: ", err);
      return res.status(500).json({ message: "Failed to update testimonial." });
    }
  };

  // Update an existing video testimonial
export const handleupdateVideoTestimonial = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params; // Get the testimonial ID from request parameters
      const data = req.body; // Get updated data from request body
      const updatedTestimonial = await updateVideoTestimonial(id, data);
      
      if (!updatedTestimonial) {
        return res.status(404).json({ message: "Video testimonial not found." });
      }
  
      return res.status(200).json({
        message: "Video testimonial updated successfully",
        updatedTestimonial,
      });
    } catch (err) {
      console.error("Error updating video testimonial: ", err);
      return res.status(500).json({ message: "Failed to update video testimonial." });
    }
  };
  
  // Update an existing social testimonial
export const handleupdateSocialTestimonial = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params; // Get the testimonial ID from request parameters
      const data = req.body; // Get updated data from request body
      const updatedTestimonial = await updateSocialTestimonial(id, data);
      
      if (!updatedTestimonial) {
        return res.status(404).json({ message: "Social testimonial not found." });
      }
  
      return res.status(200).json({
        message: "Social testimonial updated successfully",
        updatedTestimonial,
      });
    } catch (err) {
      console.error("Error updating social testimonial: ", err);
      return res.status(500).json({ message: "Failed to update social testimonial." });
    }
  };
  