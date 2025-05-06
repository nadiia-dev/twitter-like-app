import { storage } from "../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const handleFileChange = async ({
  file,
  folder,
}: {
  file: File;
  folder: string;
}) => {
  try {
    const uniqueName = `${Date.now()}_${file.name}`;
    console.log(uniqueName);
    const storageRef = ref(storage, `${folder}/${uniqueName}`);

    const snapshot = await uploadBytesResumable(storageRef, file);

    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File available at", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Upload failed", error);
    return undefined;
  }
};
