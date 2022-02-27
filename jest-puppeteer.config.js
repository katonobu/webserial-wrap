const config = {
  launch: {
    headless: false /* ヘッドレスモードで起動するかどうか。デバッグ段階では false を設定することで動きを目視で確認できる */,
    slowMo: 10 /* 各操作の前に入れる遅延(ms)を設定 */,
    defaultViewport: {
      width: 1920,
      height: 1080
      //        width: 1200,
      //        height: 900,
    },
    //        timeout: 3000, /* ブラウザの開始を待つ最長時間(ms)を設定。タイムアウトを無効にする場合 0 を設定*/
    product: 'chrome'
  },
  browserContext: 'default'
  /*
    server: {
        command: 'npm run start:serve',
        port: 8080,
    },
    */
}

module.exports = config
