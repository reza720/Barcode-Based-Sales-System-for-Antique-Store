import * as itemController from "./controller.js";
import upload from "../../config/multer.js";

import express from "express";

const router = express.Router();

router.post("/", itemController.addItem);
router.post("/:itemId/photos", upload.array("photos"), itemController.upload);
//router.patch("/:itemId");

//router.delete("/:itemId/photos/:photoId");
//router.delete("/:itemId");

//router.get("/scan");
//router.get("/:itemId");
//router.get("/");

export default router;

