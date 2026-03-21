import { MetadataRoute } from 'next';
import { getCalculators, getGuides } from '@/lib/content';

const BASE_URL = 'https://calcforgetools.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapURLs: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/en`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/pt`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/en/calculators`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/pt/calculators`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];

  const langs = ['en', 'pt'];

  for (const lang of langs) {
    const calculators = await getCalculators(lang);
    calculators.forEach((calc: any) => {
      sitemapURLs.push({
        url: `${BASE_URL}/${lang}/calculators/${calc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8
      });
    });

    const guides = await getGuides(lang);
    guides.forEach((guide: any) => {
      sitemapURLs.push({
        url: `${BASE_URL}/${lang}/guides/${guide.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7
      });
    });
  }

  return sitemapURLs;
}
