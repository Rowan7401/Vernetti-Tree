// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // *** remove basePath for local testing ***
  basePath: '/Family-Trees', // Set this to your repository name 
  trailingSlash: true, // Recommended for GitHub Pages
};

export default nextConfig;
