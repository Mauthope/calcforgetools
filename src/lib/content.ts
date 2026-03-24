import fs from 'fs';
import path from 'path';

// Base directory for content
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

export async function getCalculators(lang: string) {
  const dir = path.join(CONTENT_DIR, lang, 'calculators');
  try {
    const files = fs.readdirSync(dir);
    const calculators = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const fullPath = path.join(dir, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
      });
    return calculators;
  } catch (err) {
    console.error(`Error reading ${lang} calculators`, err);
    return [];
  }
}

export async function getCalculatorBySlug(lang: string, slug: string) {
  const calculators = await getCalculators(lang);
  return calculators.find((c: any) => c.slug === slug) || null;
}

export async function getGuides(lang: string) {
  const dir = path.join(CONTENT_DIR, lang, 'guides');
  try {
    const files = fs.readdirSync(dir);
    const guides = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const fullPath = path.join(dir, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
      });
    return guides;
  } catch (err) {
    console.error(`Error reading ${lang} guides`, err);
    return [];
  }
}

export async function getGuideBySlug(lang: string, slug: string) {
  const guides = await getGuides(lang);
  return guides.find((g: any) => g.slug === slug) || null;
}

export async function getCalculatorsByCategory(lang: string, category: string) {
  const calculators = await getCalculators(lang);
  return calculators.filter((c: any) => c.category === category);
}
