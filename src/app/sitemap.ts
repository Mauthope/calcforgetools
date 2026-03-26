import { MetadataRoute } from 'next';
import { getCalculators, getGuides } from '@/lib/content';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://calcforgetools.com';

  const [enCalculators, ptCalculators, enGuides, ptGuides] = await Promise.all([
    getCalculators('en'),
    getCalculators('pt'),
    getGuides('en'),
    getGuides('pt')
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    // Root
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    // Home pages
    { url: `${baseUrl}/en`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/pt`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    // Calculator index
    { url: `${baseUrl}/en/calculators`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/pt/calculators`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    // Guide index
    { url: `${baseUrl}/en/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pt/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    // Category pages
    { url: `${baseUrl}/en/calculators/category/financial`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pt/calculators/category/financeira`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/en/calculators/category/mathematical`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pt/calculators/category/matematica`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/en/calculators/category/labor`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pt/calculators/category/trabalhista`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    // About
    { url: `${baseUrl}/en/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/pt/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    // Privacy & Terms
    { url: `${baseUrl}/en/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/pt/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/en/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/pt/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    // Templates
    { url: `${baseUrl}/en/templates`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/pt/templates`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // English Calculators
  enCalculators.forEach((calc: any) => {
    dynamicRoutes.push({
      url: `${baseUrl}/en/calculators/${calc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  // Portuguese Calculators
  ptCalculators.forEach((calc: any) => {
    dynamicRoutes.push({
      url: `${baseUrl}/pt/calculators/${calc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  // English Guides
  enGuides.forEach((guide: any) => {
    dynamicRoutes.push({
      url: `${baseUrl}/en/guides/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // Portuguese Guides
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
