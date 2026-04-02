/** @type {import('next').NextConfig} */
const nextConfig = {
	reactCompiler: true,
	experimental: {
		turbopackFileSystemCacheForDev: true,
	},
};

export default nextConfig;
