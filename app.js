let ejs = require("ejs");
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let fs = require("fs");

app.engine("ejs", ejs.renderFile);

app.use(express.static(__dirname+"/static"));
app.use(bodyParser.urlencoded({
    extended: true
}));

let memo_path = (__dirname+"/memo");

function rendering(res){

    // リポジトリ読み終わったら実行
    fs.readdir(memo_path, function(err, file_list){
        if(err){
            // 読み込めなかったときなんかする（あとで考える）
        } else {
            
            // .getkeepはjogaiしとく
            file_list = file_list.filter(function(item){return item.match(/^[^\.].*$/);})

            res.render("index.ejs",{
                list_memo: file_list
            });
        }
    });
}

app.post("/", function(req,res){
    console.log("new memo file is '" + req.body.memoname+"'");

    // メモ書き込み
    fs.writeFile(memo_path+"/"+req.body.memoname, req.body.memotext);

    // レンダリング
    rendering(res);
});
app.get("/", function(req,res){
    // レンダリング
    rendering(res);
});

// テキストとして取得
app.get("/memo/*", function(req,res){
    let param = req.params;
    // メモ読み込み
    fs.readFile(memo_path+"/"+param[0], "utf-8", function(err, data){
        if(err){

        } else {
            res.send(data);
        }
    });
});

let server = app.listen(1234, function(){
    console.log("Server is started.");
});