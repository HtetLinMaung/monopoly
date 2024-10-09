import { PurrApplication } from "purrts";
import express from "express";
import { publicFolderPath } from "./constants";
import fs from "fs";
import cluster from "cluster";

const app = PurrApplication.create();

if (cluster.isPrimary && !fs.existsSync(publicFolderPath)) {
  fs.mkdirSync(publicFolderPath);
}
app.use("/monopoly", express.static(publicFolderPath));

export default app;
