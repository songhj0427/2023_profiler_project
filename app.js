var express = require("express");
var path = require("path");
var multer = require("multer");
//var mysql = require("mysql");
var fs = require("fs");
var readline = require("readline");

app = express();
app.set("port", process.env.PORT || 3000);

try {
  fs.readdirSync("data");
} catch (err) {
  console.error("data 폴더가 없어 data 폴더를 생성합니다.");
  fs.mkdirSync("data");
}
/*var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "fjdkslvn107!",
  database: "nodejs",
});
connection.connect();*/

var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, done) => {
      done(null, "data/");
    },
    filename: (req, file, done) => {
      var ext = path.extname(file.originalname);
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
  var filepath = path.join(__dirname, "/data/", req.file.originalname);
  var reader = readline.createInterface({
    input: fs.createReadStream(filepath),
    output: process.stdout,
  });
  reader.on("line", (line) => {
    console.log(line);
  });
  res.send("파일 받음");
});

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번 포트에서 대기 중...`);
});
