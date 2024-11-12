const textTestimonialSchema = `
CREATE TABLE IF NOT EXISTS text_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spacename VARCHAR(255) NOT NULL REFERENCES spaces(space_name),
  image_only BOOL DEFAULT false,
  image_src VARCHAR(1200),
  ratings INT CHECK (ratings BETWEEN 1 AND 5),  -- Ratings between 1 and 5
  content VARCHAR(3000),
  name VARCHAR(255),
  user_photo VARCHAR(1200),
  is_liked BOOLEAN DEFAULT true NOT NULL,            -- Indicates if the testimonial is liked
  is_archived BOOLEAN DEFAULT false,
  date DATE DEFAULT CURRENT_DATE,  -- Using CURRENT_DATE for date
  CHECK (image_only = false OR image_src IS NOT NULL),
  CHECK (image_only = true OR content IS NOT NULL),
  CHECK (image_only = true OR name IS NOT NULL)
); 
`;

const videoTestimonialSchema = `
CREATE TABLE IF NOT EXISTS video_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spacename VARCHAR(255) NOT NULL REFERENCES spaces(space_name),
  video_url VARCHAR(255) NOT NULL,         
  thumbnail_url VARCHAR(255),        
  ratings INT CHECK (ratings BETWEEN 1 AND 5),  -- Ratings between 1 and 5
  duration FLOAT CHECK (duration < 120),                    
  is_liked BOOLEAN DEFAULT true,            -- Indicates if the testimonial is liked
  is_archived BOOLEAN DEFAULT false,         -- Indicates if the testimonial is archived 
  name VARCHAR(255) NOT NULL,                -- Name of the person giving the testimonial
  date DATE DEFAULT CURRENT_DATE              -- Date of the testimonial
);
`;

const socialTestimonialSchema = `
CREATE TABLE IF NOT EXISTS social_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spacename VARCHAR(255) NOT NULL REFERENCES spaces(space_name),
  socialId VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  content VARCHAR(255) NOT NULL,
  social_provider VARCHAR(255) NOT NULL,
  date DATE DEFAULT CURRENT_DATE              -- Date of the testimonial
);
`
export {textTestimonialSchema, videoTestimonialSchema, socialTestimonialSchema};