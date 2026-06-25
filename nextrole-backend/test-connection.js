const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");

const uri = "mongodb://sankethmundas3_db_user:nextrole2026@ac-va9impo-shard-00-00.csrj0j0.mongodb.net:27017,ac-va9impo-shard-00-01.csrj0j0.mongodb.net:27017,ac-va9impo-shard-00-02.csrj0j0.mongodb.net:27017/nextrole?ssl=true&replicaSet=atlas-lkph4e-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

console.log("Testing connection...");

mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 15000 })
.then(() => {
    console.log("✅ MongoDB connected successfully!");
    process.exit(0);
})
.catch((err) => {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
});
