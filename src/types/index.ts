export interface ShortUrl {
  id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
  user_id?: string;
  title?: string;
  is_custom?: boolean;
  expiration_date?: string;
}

export interface CreateShortUrlInput {
  original_url: string;
  custom_code?: string;
  title?: string;
  expiration_date?: string;
} 