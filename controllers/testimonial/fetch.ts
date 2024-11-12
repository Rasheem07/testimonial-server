import { Request, Response } from "express";
import { fetchAllSocialTestimonials, fetchAllTestimonials, fetchAllTextTestimonials, fetchAllVideoTestimonials } from "../../actions/testimonial/fetchtestimonial";

// Fetch a text testimonial by ID
export const getTestimonial = async (req: Request, res: Response) => {
    try {
      const { name } = req.params; // Get the testimonial ID from request parameters
      const testimonial = await fetchAllTextTestimonials(name);
      
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found." });
      }
  
      return res.status(200).json(testimonial);
    } catch (err) {
      console.error("Error fetching testimonial: ", err);
      return res.status(500).json({ message: "Failed to fetch testimonial." });
    }
  };

export const getAllTestimonial = async (req: Request, res: Response) => {
    try {
      const { name } = req.params; // Get the testimonial ID from request parameters
      const testimonial = await fetchAllTestimonials(name);
      
      if (!testimonial) {
        res.status(404).json({ message: "Testimonials not found." });
        return [];
      }
  
      return res.status(200).json(testimonial);
    } catch (err) {
      console.error("Error fetching testimonial: ", err);
      return res.status(500).json({ message: "Failed to fetch testimonial." });
    }
  };
  

  // Fetch a video testimonial by ID
export const handleGetVideoTestimonial = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name } = req.params; // Get the testimonial ID from request parameters
      const testimonial = await fetchAllVideoTestimonials(name);
      
      if (!testimonial) {
        return res.status(404).json({ message: "Video testimonial not found." });
      }
  
      return res.status(200).json(testimonial);
    } catch (err) {
      console.error("Error fetching video testimonial: ", err);
      return res.status(500).json({ message: "Failed to fetch video testimonial." });
    } 
  };

  // Fetch a social testimonial by ID
export const getSocialTestimonial = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params; // Get the testimonial ID from request parameters
      const testimonial = await fetchAllSocialTestimonials(id);
      
      if (!testimonial) {
        return res.status(404).json({ message: "Social testimonial not found." });
      }
  
      return res.status(200).json(testimonial);
    } catch (err) {
      console.error("Error fetching social testimonial: ", err);
      return res.status(500).json({ message: "Failed to fetch social testimonial." });
    }
  };
  
  