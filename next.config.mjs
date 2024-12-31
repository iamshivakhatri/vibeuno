// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//       remotePatterns: [
//         {
//           protocol: 'https',
//           hostname: 'source.unsplash.com',
//           port: '', // Leave blank if no port is required
//           pathname: '/featured/**', // Adjust the path if needed
//         },
//       ],
//     },
//   };
  
//   export default nextConfig;
  

  /** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // Allow any host
        },
      ],
    },
  };
  
  export default nextConfig;
  