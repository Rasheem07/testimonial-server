import multer from "multer";

// Set up storage configuration for Multer
const storage = multer.memoryStorage(); // Store files in memory (you can also use diskStorage)

const upload = multer({ storage });

export default upload;
