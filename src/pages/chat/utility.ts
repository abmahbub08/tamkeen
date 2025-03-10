import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const saveUserData = async (userId: string, name: string, email: string, refercode: string) => {
    console.log("Saving user data..."+userId+""+name+""+email+""+refercode);
  try {
    const userRef = doc(db, "users", `${userId}`);
    await setDoc(
      userRef,
      {
        id: userId,
        name,
        email,
        refercode,
      },
      { merge: true } // Merge to avoid overwriting existing data
    );
    console.log("User data saved/updated successfully.");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};
