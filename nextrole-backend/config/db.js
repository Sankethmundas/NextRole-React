const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use the OS DNS resolver instead of its built-in c-ares resolver.
// c-ares often fails SRV lookups on home/router DNS servers (192.168.x.x).
dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4, // Force IPv4 — avoids IPv6 DNS resolution issues
            serverSelectionTimeoutMS: 10000, // Wait up to 10s for server selection
        });

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;