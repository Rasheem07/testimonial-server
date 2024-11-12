import { Request, Response } from "express";
import { deleteSocialTestimonial, deleteTextTestimonial, deleteVideoTestimonial } from "../../actions/testimonial/deletetestimonial";

// Delete a text testimonial
export const deleteTestimonial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // Get the testimonial ID from request parameters
      const deletedTestimonial = await deleteTextTestimonial(id);
      
      if (!deletedTestimonial) {
        return res.status(404).json({ message: "Testimonial not found." });
      }
  
      return res.status(200).json({
        message: "Testimonial deleted successfully",
        deletedTestimonial,
      });
    } catch (err) {
      console.error("Error deleting testimonial: ", err);
      return res.status(500).json({ message: "Failed to delete testimonial." });
    }
  };

  // Delete a video testimonial
export const handledeleteVideoTestimonial = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params; // Get the testimonial ID from request parameters
      const deletedTestimonial = await deleteVideoTestimonial(id);
      
      if (!deletedTestimonial) {
        return res.status(404).json({ message: "Video testimonial not found." });
      }
  
      return res.status(200).json({
        message: "Video testimonial deleted successfully",
        deletedTestimonial,
      });
    } catch (err) {
      console.error("Error deleting video testimonial: ", err);
      return res.status(500).json({ message: "Failed to delete video testimonial." });
    }
  };
  
  // Delete a social testimonial
export const handledeleteSocialTestimonial = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params; // Get the testimonial ID from request parameters
      const deletedTestimonial = await deleteSocialTestimonial(id);
      
      if (!deletedTestimonial) {
        return res.status(404).json({ message: "Social testimonial not found." });
      }
  
      return res.status(200).json({
        message: "Social testimonial deleted successfully",
        deletedTestimonial,
      });
    } catch (err) {
      console.error("Error deleting social testimonial: ", err);
      return res.status(500).json({ message: "Failed to delete social testimonial." });
    }
  };
  