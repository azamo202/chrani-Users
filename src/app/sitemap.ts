import { MetadataRoute } from 'next';
import { fetchApi } from '@/lib/api';
import { ApiProduct, ApiCategory } from '@/types/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://chrani.com';

  // Basic pages
  const routes = ['', '/products', '/about', '/support', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Products
    const products = await fetchApi<ApiProduct[]>('/api/site/products');
    const productEntries = products.map((p) => ({
      url: `${baseUrl}/products/${p.id}`,
      lastModified: new Date(p.updated_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Categories
    const categories = await fetchApi<ApiCategory[]>('/api/site/categories');
    const categoryEntries = categories.map((c) => ({
      url: `${baseUrl}/products?category_slug=${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...productEntries, ...categoryEntries];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return routes;
  }
}
