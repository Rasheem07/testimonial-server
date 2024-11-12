export interface SpaceData {
    user: number;
    space_name: string;
    logo: string;
    header_title: string;
    custom_message: string;
    questions: {
      question: string;
      order_no: number;
    }[];
    collect_extra: {
      email: boolean;
      title_company: boolean;
      social_link: boolean;
      address: boolean;
    };
    collection_type: string;
    collect_star_ratings: boolean;
    allow_custom_btn_color: boolean;
    custom_btn_color: string;
    language: string;
  }
  
  export interface ThankYouData {
    image: string;
    title: string;
    message: string;
    allow_social: boolean;
    redirect_url: string | null;
    reward_video: boolean;
  }
  
  export interface ExtraSettingsData {
    max_duration: number;
    max_char: number;
    video_btn_text: string;
    text_btn_text: string;
    consent_display: string;
    consent_statement: string;
    text_submission_title: string;
    questions_label: string;
    default_text_testimonial_avatar: string | null;
    affiliate_link: string | null;
    third_party: {
      name: string;
      link: string | null;
    };
    auto_populate_testimonials_to_the_wall_of_love: boolean;
    disable_video_recording_for_iphone_users: boolean;
    allow_search_engines_to_index_your_page: boolean;
  }
  