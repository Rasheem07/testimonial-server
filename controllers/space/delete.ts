import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../types/user"; // Import the AuthenticatedRequest type
import { deleteTestimonialspaceData } from "../../actions/space/deletespace"; // Import the action to delete data

export async function handleDeleteTestimonialspace(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id; // Get the user ID from the authenticated request
  const spaceId = req.params.spaceId; // Get the space ID from the URL parameters

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. User not found." }); // Handle unauthorized access
  }

  try {
    // Call the action to delete the testimonial space data
    await deleteTestimonialspaceData(userId, spaceId);
    res.json({ message: "Testimonial space deleted successfully!" }); // Success response
  } catch (error: any) {
    console.error("Error deleting testimonial space: ", error);
    res.status(500).json({ error: error.message }); // Error response
  }
}
