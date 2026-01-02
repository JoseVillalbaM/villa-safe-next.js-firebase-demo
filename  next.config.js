const test = require('node:test')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.postimg.cc'],
    webpack(config){
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack']
      })
    }
  },
  // Tus otras configuraciones existentes...
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig