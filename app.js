let ejs = require("ejs");
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let fs = require("fs");

// エンジンにEJSを設定
app.engine("ejs", ejs.renderFile);
// staticフォルダ以下に静的なファイル置く
app.use(express.static(__dirname+"/static"));
// req.body.某を配列として扱う
app.use(bodyParser.urlencoded({ extended: true }));
// ついでにリクエストをJSONで扱う
app.use(bodyParser.json());

// メモの置き場
let memo_path = (__dirname+"/memo");

// 描画処理
function rendering(res){

    // リポジトリを走査
    fs.readdir(memo_path, function(err, file_list){

        if(err){
            // 読み込めなかったときなんかする（あとで考える）
        } else {
            
            // .getkeepはjogaiしとく
            file_list = file_list.filter(function(item){return item.match(/^[^\.].*$/);})

            // テンプレ表示
            res.render("index.ejs",{
                list_memo: file_list    // メモ一覧渡す
            });
        }
    });
}

// POST
app.post("/", function(req,res){
    // postされた情報で処理を分岐（ごりおし）
    if(req.body.isdelete == undefined){
        console.log("new memo file is '" + req.body.memoname+"'");
        // メモ書き込み
        fs.writeFile(memo_path+"/"+req.body.memoname, req.body.memotext, function(err){
            if(err){
                // エラーだったらなんかする
            }

            // レンダリング
            rendering(res);            
        });
    } else {
        // 指定のファイルを削除
        console.log("delete memo file is '" + req.body.isdelete+"'");
        // メモ削除
        fs.unlink(memo_path+"/"+req.body.isdelete, function(err){
            if(err){
                // エラーだったらなんかする    
            }

            // レンダリング
            rendering(res);
        });
    }
});
// GET
app.get("/", function(req,res){
    // レンダリング
    rendering(res);
});

// memo以下のリクエストはテキストとして取得(ajaxアクセス用)
app.get("/memo/:filename", function(req,res){
    // param[0]に入ってるファイル名を取り出す
    let param = req.params;
    // メモを読み込み
    fs.readFile(memo_path+"/"+param["filename"], "utf-8", function(err, data){
        if(err){
            // なんかエラーハンドル
        } else {
            // 読み込んだデータを送る
            res.send(data);
        }
    });
});

// 1234番ポートで待ち受け
let server = app.listen(1234, function(){
    console.log("Server is started.");
});