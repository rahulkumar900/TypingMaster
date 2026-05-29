import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://centerville-typing.vercel.app', // Update when deploying to production
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}
