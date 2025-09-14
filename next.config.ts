import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3001",
                pathname: "/uploads/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3002",
                pathname: "/uploads/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3002",
                pathname: "/images/**",
            },
            {
                protocol: "http",
                hostname: "192.168.43.50",
                port: "3002",
                pathname: "/images/**",
            },
            {
                protocol: "http",
                hostname: "192.168.43.50",
                port: "3002",
                pathname: "/uploads/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "example.com",
                pathname: "/**",
            },
        ],
        // Allow blob URLs for image previews
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
    },
    async redirects() {
        return [
            // Specific redirects for old routes
            {
                source: "/rent-scooter-in-cameron-highlands",
                destination: "/",
                permanent: true,
            },
            {
                source: "/cameron-highlands-complete-guide",
                destination: "/",
                permanent: true,
            },
            {
                source: "/news/self-scooter-tour",
                destination: "/",
                permanent: true,
            },
            {
                source: "/book-online",
                destination: "/",
                permanent: true,
            },
            {
                source: "/news/oastel%C2%A0co-living",
                destination: "/",
                permanent: true,
            },
            {
                source: "/news/oastel co-living",
                destination: "/",
                permanent: true,
            },
            {
                source: "/updates",
                destination: "/",
                permanent: true,
            },
            // Redirect to tours page
            {
                source: "/book-cameron-highlands-tours",
                destination: "/tours",
                permanent: true,
            },
            // External redirect to booking platform
            {
                source: "/booking",
                destination: "https://booking.exely.com/en/oastel/",
                permanent: true,
            },
            // Redirect old service page to specific tour
            {
                source: "/service-page/full-day-land-rover-road-trip-co-tour",
                destination: "/tours/mossy-forest-highland-discovery",
                permanent: true,
            },
        ];
    },
    /* config options here */
}

export default nextConfig
