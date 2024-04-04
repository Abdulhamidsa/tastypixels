/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "dtaceicn1",
    NEXT_PUBLIC_CLOUDINARY_PRESET_NAME: "ovbbddop",
    DB_PASSWORD: "UNBFqjTpLgeUMQkl",
    DB_USERNAME: "aboood",
    DB_NAME: "tastypixels",
    DB_CLUSTER_URL: "cluster0.bn3dcrh.mongodb.net",
    MONGODB_URI: "mongodb+srv://aboood:UNBFqjTpLgeUMQkl@cluster0.bn3dcrh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
