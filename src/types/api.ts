export interface TranslatableText {
  en?: string;
  ar?: string;
  ku?: string;
}

export interface ApiImage {
  id: number;
  url: string; // Enforced single source of truth for the image URL
  is_primary?: boolean;
}

export interface ApiCategory {
  id: number;
  name: TranslatableText;
  slug: string;
  description?: TranslatableText;
  image?: string;
  parent_id?: number | null;
  parent?: ApiCategory;
  children?: ApiCategory[];
}

export interface ApiBrand {
  id: number;
  name: string;
  logo?: string;
}

export interface ApiFeature {
  feature_text: TranslatableText;
  sort_order?: number;
}

export interface ApiProduct {
  id: number;
  name: TranslatableText;
  slug: string;
  model_number: string;
  origin_country?: TranslatableText;
  description?: TranslatableText;
  is_active: boolean;
  category: ApiCategory;
  brand?: ApiBrand;
  images: ApiImage[];
  specifications?: Record<string, Array<{ key: string; value: string }>>;
  features?: string[];
  attributes?: Array<{ type: string; value: string }>;
  created_at?: string;
  updated_at?: string;
}

export interface ApiStoreSettings {
  email?: string;
  phone?: string | string[];
  whatsapp?: string; // Changed from whatsapp_number to whatsapp
  tiktok?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  address?: TranslatableText;
}

export interface ApiMaintenanceCenter {
  id: number;
  name: TranslatableText;
  city: TranslatableText;
  address: TranslatableText;
  phone: string | string[];
  working_hours?: TranslatableText;
  location_link?: string;
}

export interface ApiVideo {
  id: number;
  title: TranslatableText;
  youtube_id: string;
}

export interface ApiDownload {
  id: number;
  title: TranslatableText;
  file_url: string;
  file_size?: string;
}

export interface ApiHomeSection {
  id: number;
  title: TranslatableText;
  type: string;
  sort_order: number;
  is_active: boolean;
  products: ApiProduct[];
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
  meta?: any;
}
