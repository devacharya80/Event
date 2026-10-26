import "dotenv/config"; // must stay the first import
import mongoose from "mongoose";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB(process.env.MONGODB_URI);
  const server = app.listen(PORT, () => console.log(`API running on :${PORT}`));

  const shutdown = async () => {
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((err) => {
  console.error("Startup failed:", err.message);
  process.exit(1);
});