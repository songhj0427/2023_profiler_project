var express = require("express");
var path = require("path");
var multer = require("multer");
var mysql = require("mysql");
var fs = require("fs");
var readline = require("readline");

app = express();
app.set("port", process.env.PORT || 3000);

//mysql 설정
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "q1w2e3r4q1w2",
  database: "nodejs",
});

//연결 성공시 메시지 출력
connection.connect((err) => {
  if (err) throw err;
  console.log("sql과 연결 성공...");
});

try {
  fs.readdirSync("data");
} catch (err) {
  console.error("data 폴더가 없어 data 폴더를 생성합니다.");
  fs.mkdirSync("data");
}

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
  var caseNumber = 0,
    coreNumber = 0,
    taskNumber = 0;
  var filepath = path.join(__dirname, "/data/", req.file.originalname);
  var reader = readline.createInterface({
    input: fs.createReadStream(filepath),
    output: process.stdout,
  });
  //file을 한 줄씩 읽어서 토큰별로 분리함.
  reader.on("line", (line) => {
    var tokens = line.split("\t");
    if (tokens != undefined && tokens.length > 0) {
      //tokens[1]에 task1이 있을 경우 case의 시작 부분임
      if (tokens[1] == "task1") {
        caseNumber += 1;
        coreNumber = 0;
      } else {
        coreNumber += 1;
        //마지막 부분에 blank값이 저장되어 있음. 그래서 length - 1 전까지 돌아야함.
        for (var i = 1; i < tokens.length - 1; i++) {
          taskNumber = i;
          var sql =
            "INSERT INTO core_stats (case_number, core_number, task_number, data) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE data = ?";
          var values = [
            caseNumber,
            coreNumber,
            taskNumber,
            tokens[i],
            tokens[i],
          ];
          connection.query(sql, values, (err, res) => {
            if (err) {
              console.error("data 저장에 실패했습니다.");
              throw err;
            }
            console.log("data가 성공적으로 저장되었습니다.");
          });
        }
      }
    }
  });
  res.send("파일 받음");
});

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번 포트에서 대기 중...`);
});
