import { PostgresClient } from "../../lib/db"; 
 
export const deleteTestimonialspaceData = async (userId: string, spaceId: string) => {
  const client = await PostgresClient.connect();
  try {
    // Start a transaction
    await client.query("BEGIN");

    // Delete from extra_settings table
    await client.query("DELETE FROM extra_settings WHERE space_id = $1", [spaceId]);

    // Delete from thank_page table
    await client.query("DELETE FROM thank_page WHERE space_id = $1", [spaceId]);

    // Delete from spaces table, verifying the user_id
    const result = await client.query(
      "DELETE FROM spaces WHERE id = $1 AND user_id = $2",
      [spaceId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("Testimonial space not found or unauthorized action.");
    }

    // Commit the transaction if all deletes are successful
    await client.query("COMMIT");
    console.log("Testimonial space deleted successfully.");
  } catch (err) {
    await client.query("ROLLBACK"); // Rollback if there's an error
    console.error("Error deleting data: ", err);
    throw new Error("Failed to delete testimonial space.");
  } finally {
    client.release(); // Release the client
  }
};
