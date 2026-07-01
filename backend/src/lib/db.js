import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Backfill unique usernames for existing database users to avoid unique index collision
    const User = (await import("../models/user.model.js")).default;
    const usersWithoutUsername = await User.find({ 
      $or: [
        { username: { $exists: false } },
        { username: "" },
        { username: null }
      ]
    });

    if (usersWithoutUsername.length > 0) {
      console.log(`Backfilling usernames for ${usersWithoutUsername.length} existing users...`);
      for (const user of usersWithoutUsername) {
        const emailPrefix = user.email ? user.email.split("@")[0] : "user";
        const baseUsername = emailPrefix.toLowerCase().replace(/[^a-z0-9_.]/g, "") || "user";
        
        let uniqueUsername = baseUsername;
        let counter = 1;
        while (await User.findOne({ username: uniqueUsername })) {
          uniqueUsername = `${baseUsername}${counter}`;
          counter++;
        }
        user.username = uniqueUsername;
        if (!user.bio) user.bio = "";
        await user.save();
      }
      console.log("Username backfill complete.");
    }
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};
