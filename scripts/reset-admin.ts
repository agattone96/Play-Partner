import "dotenv/config";
import { storage } from "../server/storage";
import bcrypt from "bcryptjs";

async function resetAdmin() {
  try {
    const email = "allisongattone@gmail.com";
    const newPassword = "BadPenny7";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log(`Resetting password for ${email}...`);
    
    // Check if user exists first
    let user = await storage.getUserByEmail(email);
    
    if (!user) {
      console.log("User not found, creating...");
      user = await storage.createUser({
        email,
        password: hashedPassword,
        role: "admin",
        isPasswordResetRequired: true,
        firstName: "Allison",
        lastName: "Gattone",
      });
    } else {
      console.log("User found, updating...");
      await storage.updateUser(user.id, {
        password: hashedPassword,
        isPasswordResetRequired: true, // Force them to reset it on login
      });
    }

    console.log("✅ Admin password reset to 'BadPenny7'. Login should now work.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to reset admin:", error);
    process.exit(1);
  }
}

resetAdmin();
