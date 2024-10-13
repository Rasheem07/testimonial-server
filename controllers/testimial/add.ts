// import { Request, Response } from "express";
// import { AuthenticatedRequest } from "../../types/user";
// import testimonialCollection from "../../models/testimonial";

// export async function handleAddTestimonial(req: AuthenticatedRequest, res: Response) {
//     const id = req?.user?.id;
//     const {testimonialInput} = req.body;

//     const testimonial = await testimonialCollection.create({
//         user: id,
//         testimonial: testimonialInput 
//     });

//     testimonial.save();

//     res.json({testimonial});
// }

// export async function handleFetchTestimonials(req: AuthenticatedRequest, res: Response) {
//     const id = req?.user?.id;

//     const testimonial = await testimonialCollection.find({
//         user: id
//     });

//     res.json({testimonial});
// }