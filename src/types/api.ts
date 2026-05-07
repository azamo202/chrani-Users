export interface TranslatableText {
  en?: string;
  ar?: string;
  ku?: string;
}

export interface ApiImage {
  id: number;
  url: string;
  is_primary: boolean;
}

export interface ApiCategory {
  id: number;
  name: TranslatableText;
  slug: string;
  description?: TranslatableText;
  image?: string;
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
}

export interface ApiStoreSettings {
  email?: string;
  phone?: string;
  whatsapp?: string; // Changed from whatsapp_number to whatsapp
  tiktok?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  address?: TranslatableText;
}

export interface ApiMaintenanceCenter {
  id: number;
  city: TranslatableText;
  address: TranslatableText;
  phone: string;
  working_hours?: TranslatableText;
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
