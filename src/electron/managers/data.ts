import { getAppDataFolder } from "../pathResolver.js";
import fs from "fs";

export function loadAppData(): string {
  const path = getAppDataFolder();

  // make the directory if it doesn't exist
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  // open the file or create it if it doesn't exist
  const filePath = path + "/data.txt";

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "default data");
  }

  // read the file
  const data = fs.readFileSync(filePath, "utf8");

  return data;
}

// export function loadFile(path: string) {
//   console.log("loadFile", path);

//   // fake a response:
//   return {
//     success: true,
//     data: "fake data",
//   };
// }
