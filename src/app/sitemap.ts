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
    const productsRes = await fetchApi<any>('/api/site/products');
    const products: ApiProduct[] = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];
    
    const productEntries = products.map((p) => ({
      url: `${baseUrl}/products/${p.id}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Categories
    const categoriesRes = await fetchApi<any>('/api/site/categories');
    const categories: ApiCategory[] = Array.isArray(categoriesRes) ? categoriesRes : categoriesRes?.data || [];

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
