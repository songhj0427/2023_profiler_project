var express = require("express");
var path = require("path");
var multer = require("multer");
var fs = require("fs");

app = express();
const PORT = process.env.PORT || 3000;

var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "uploads/");
    },
    filename: (req, file, callback) => {
      callback(
        null,
        `${path.basename(file.originalname) + path.extname(file.originalname)}`
      );
    },
  }),
});

app.post("/uploadFile", upload.single("dataFile"), (req, res) => {
  const file = req.file;
  res.send("파일 받음");
});

app.listen(PORT, () => {
  console.log("3000포트에서 대기 중");
});
