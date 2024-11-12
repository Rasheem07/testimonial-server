import { Request, Response } from "express";
import { fetchTestimonialspaceData } from "../../actions/space/fetchspaceData";
import { AuthenticatedRequest } from "../../types/user";
import { fetchAllTestimonialspace } from "../../actions/space/fetchallSpace";
import { PostgresClient } from "../../lib/db";
 
export async function handleFetchTestimonialspace(req: AuthenticatedRequest, res: Response) {
  const { space_name } = req.params;
  const user_id = req.user?.id;

  if((req as any).space == 1) {
    res.json({type: "error", error: "space does not exists!"})
  }

  try {
    const data = await fetchTestimonialspaceData(space_name);
    // if (!data) {
    //   res.status(404).json({ message: "Testimonial space not found" });
    //   return []
    // }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function handleFetchAllTestimonialspace(req: AuthenticatedRequest, res: Response) {
  const user_id = req.user?.id;

  try { 
    const data = await fetchAllTestimonialspace(user_id);

    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function handleFetchAllSpace(req: Request, res: Response) {
  try {
    const client = await PostgresClient.connect();

    const spaces = await client.query('SELECT * from spaces');

    res.json(spaces.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
