var express = require("express");
var path = require("path");
var multer = require("multer");
var fs = require("fs");

app = express();
app.set("port", process.env.PORT || 3000);

var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, done) => {
      done(null, "data/");
    },
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + ext);
    },
  }),
});

//get요청이 들어오면 시작화면을 보여줌
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

//받은 파일을 multer에 지정된 디렉터리위치에 filename으로 저장함.
app.post("/uploadFile", upload.single("dataFile"), (req, res) => {
  const file = req.file;
  res.send("파일 받음");
});

app.listen(app.get("port"), () => {
  console.log("3000포트에서 대기 중");
});
