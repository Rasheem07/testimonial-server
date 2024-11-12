import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../types/user";
import { updateTestimonialspaceData } from "../../actions/space/updatespaceData";
import { SpaceData, ThankYouData, ExtraSettingsData } from "../../types/testimonial";

export async function handleUpdateTestimonialspace(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const spaceId = req.params.spaceId;

  // Extract fields to update from the request body
  const spaceData = req.body.spaceData;
  const thankYouData = req.body.thankYouData;
  const extraSettingsData = req.body.extraSettingsData;

  if((req as any).space == 1) { 
    res.json({type: "error", error: "space does not exists!"})
  }
  
  try {
    // Call the update action
    await updateTestimonialspaceData(userId, spaceId, spaceData, thankYouData, extraSettingsData);

    res.json({ message: "Testimonial space updated successfully!" });
  } catch (error: any) {
    console.error("Error updating testimonial space: ", error);
    res.status(500).json({ error: error.message });
  }
}
