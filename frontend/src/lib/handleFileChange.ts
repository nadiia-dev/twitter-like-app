import { auth, storage } from "../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const handleFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const user = auth.currentUser;
  if (!user) {
    console.error("User is not authenticated.");
    return;
  }

  try {
    const storageRef = ref(storage, `userPhotos/${user.uid}/${file.name}`);

    const snapshot = await uploadBytesResumable(storageRef, file);

    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File available at", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Upload failed", error);
    return undefined;
  }
};
