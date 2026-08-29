import fs from "node:fs/promises";

async function deleteFile(path){
    await fs.unlink(path);
}

export default deleteFile;
