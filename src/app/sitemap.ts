import { MetadataRoute } from 'next';
import { getCalculators, getGuides } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://calcforgetools.com';

  const [enCalculators, ptCalculators, enGuides, ptGuides] = await Promise.all([
    getCalculators('en'),
    getCalculators('pt'),
    getGuides('en'),
    getGuides('pt')
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pt`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/calculators`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pt/calculators`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // Map English Calculators
  enCalculators.forEach((calc: any) => {
    dynamicRoutes.push({
      url: `${baseUrl}/en/calculators/${calc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  // Map Portuguese Calculators
  ptCalculators.forEach((calc: any) => {
    dynamicRoutes.push({
      url: `${baseUrl}/pt/calculators/${calc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  // Map English Guides
  enGuides.forEach((guide: any) => {
    dynamicRoutes.push({
      url: `${baseUrl}/en/guides/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // Map Portuguese Guides
  ptGuides.forEach((guide: any) => {
    dynamicRoutes.push({
      url: `${baseUrl}/pt/guides/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  return [...staticRoutes, ...dynamicRoutes];
}
