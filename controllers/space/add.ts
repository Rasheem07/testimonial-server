import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../types/user"; // Import the correct type
import { insertTestimonialspaceData } from "../../actions/space/InsertTestimonialspace";

export async function handleAddTestimonialspace(
  req: AuthenticatedRequest,
  res: Response
) {
  const user_id = req.user?.id;
  const { spaces, thank_page, extra_settings } = req.body;

  // Check if there is a file uploaded

  try {
    const file = req.file; // for the file

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Insert testimonial space data
    await insertTestimonialspaceData(
      user_id,
      file,
      JSON.parse(spaces),
      JSON.parse(thank_page),
      JSON.parse(extra_settings)
    );
    return res.json({ message: "Successfully created a space!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
