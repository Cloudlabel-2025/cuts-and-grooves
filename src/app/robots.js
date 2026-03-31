export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
      },
      {
        userAgent: 'Googlebot',
        disallow: '/',
      },
    ],
    sitemap: null,
  }
}
