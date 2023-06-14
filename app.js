/*
PCRATCHサーバー起動スクリプト

★概要
pcratchサーバーは、nodejs+expressで動作するWebアプリ
プロジェクトとバックパックのクラウド管理を担当する

~/jcode-dev/pcratch: pcratchサーバー本体
~/LLK/scratch-www/debug: pcratch本体(debug版)
/datadrive/pcratch/assets/ : データ保存領域

※ 参照--> G:\マイドライブ\開発\LLK\readme.txt

★テスト起動方法
#PCRATCH server test
cd ~/jcode-dev/pcratch
pm2 start pm2.json
    or
node app.js

pm2 list <== 見る
pm2 kill <== 終わる

# Client
http://192.168.0.10:8333

★本番環境 nginx
# デプロイ（開発マシンからAzureへ）
cd ~/LLK/scratch-www
rsync -auvz build/ koichii@j-code.org:/home/koichii/LLK/scratch-www/build/

★起動
pm2 start pm2.json --env production
sudo pm2 restart pm2.json --env production

    or
NODE_ENV='production' node app.js

★passport Google Strategy
kito@j-code.org で Google Cloud Console の Pcratch プロジェクトに入る
https://console.cloud.google.com/welcome?project=pcratch
APIとサービス --> 認証情報 --> OAuth 2.0 クライアント ID --> pcratch.j-code.org
以下登録済み：
    http://pcratch.j-code.org/google/callback   <-- ログイン
    http://pcratch.j-code.org/google/register   <-- 既存ユーザーに紐づけ
    http://pcratch.j-code.org/google/newuser    <-- 新規ユーザー


    <a href="./accounts/newuser/">  <-- ディゼーブル

★データバックアップ
bash ~/jcode-dev/jcode-server/config/mongodb.sh

*/

const express = require('express');
const path = require('path');
//const cookieParser = require('cookie-parser');
//const flash = require('connect-flash');
//const expressSession = require('express-session');
//const mongoose = require('mongoose');
//const config = require('config');

console.log('NODE_NEV:', process.env.NODE_ENV);
// Connect to DB
/// Start express app
var app = express();
// app use
app.use(express.json({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
//app.use(cookieParser());
// CORSを許可する

// set the view engine to ejs
/// conifure passport module
//require('./passport/index.js')(app);
// pcratch app
//app.use('/', require('./pcratch-server/api_host.js')); // Scratch Server APIs
//app.use('/', require('./pcratch-server/accounts.js')); // Scratch Server APIs

// static page
app.use('/', express.static(path.join(__dirname, './build')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err)
});

// error handler
app.use(function(err, req, res, next) {
    console.log("ERROR!!!!:", err.message)
    console.log(req.url)
    res.status(err.status || 500).send(err.message);
});

// Start listening
var port = process.env.PORT || 8333;
app.listen(port, function () {
    console.log('Server listening on port: ', port);
});
