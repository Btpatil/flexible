/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com']
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['cloudinary', 'graphql-request', 'mongoose']
  },
  webpack: config => {
    Object.assign(config.resolve.alias, {
      '@mongodb-js/zstd': false,
      '@aws-sdk/credential-providers': false,
      'snappy': false,
      'aws4': false,
      'mongodb-client-encryption': false,
      'kerberos': false,
      'supports-color': false
    });
    return config;
  },
}

module.exports = nextConfig
