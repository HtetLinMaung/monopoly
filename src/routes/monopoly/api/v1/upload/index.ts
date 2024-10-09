import { Handler } from "express";
import { IRouteMetadata } from "purrts/lib/types";
import upload from "../../../../../middlewares/upload.middleware";

export const handler: Handler = async (req, res) => {
  if (req.file) {
    res.json({
      code: 200,
      message: "File uploaded successfully",
      data: `/monopoly/${req.file.filename}`,
    });
  } else {
    res.status(400).send("No file uploaded");
  }
};

export const metadata: IRouteMetadata = {
  method: "post",
  middlewares: [upload.single("file")],
};
