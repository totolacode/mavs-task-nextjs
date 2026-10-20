# メモアプリ（Next.js + Express.js）

1日課題で作成した、ログイン機能付きのメモアプリです。
ログインしたユーザーが、自分のメモを一覧・作成・編集・削除できます。

## 実装した機能

- メールアドレス・パスワードでログイン
- ログイン中ユーザーのメモ一覧表示・削除
- メモの新規作成・編集（タイトル・本文）
- リロードしてもログイン状態を保持
- 入力チェック、エラー表示、画面デザインの整備

## ドキュメント

- [画面仕様書](docs/screen-spec.md)
- [開発のまとめ](docs/development.md)（開発の進め方・工夫した点・つまずいた点・振り返り）



## 環境構築方法

Node のバージョンは 24.2.0 です。  
mise をインストールしている場合は、ルートディレクトリで `mise install` を実行するとバージョンが切り替わります。

### リポジトリの取得

```
git clone https://github.com/totolacode/mavs-task-nextjs.git
```

### パッケージインストール

フロントエンドのパッケージインストール&環境変数追加

```
cd frontend
npm install
cp .env.example .env
```

バックエンドのパッケージインストール

```
cd ../
cd backend
npm install
```

### Docker を起動（ルートディレクトリで実行）

Docker Desktop を起動しておきます。

```
cd ../
docker compose up --build
```

ターミナルにこのように表示されていれば問題なく動作しています。
<img width="1231" alt="スクリーンショット 2024-11-22 9 02 44" src="https://github.com/user-attachments/assets/951a337c-1cb7-4337-ab4f-856c43898f57">

※postgresql には初期構築時にテストデータが投入されます。

### 動作確認

http://localhost:3000

このように表示できていれば ok です！

<img width="721" alt="スクリーンショット 2024-11-22 9 08 34" src="https://github.com/user-attachments/assets/f3c8b95d-3b82-43c2-b74c-888c7a8d16ce">

## ログイン機能について

| メールアドレス  | パスワード |
| --------------- | ---------- |
| sample@test.com | password   |

http://localhost:3000/signin にアクセスし、  
上記のメールアドレス、パスワードを入力しログインボタンクリック  
右上にメールアドレスが表示されていればログイン処理が正常に動作しています！

https://github.com/user-attachments/assets/6abafe98-e804-42a7-a56e-20314db0a519

## データベースクライアントツール

pgAdmin を使用してテーブルを見ることができます。

### アクセス方法

http://localhost

| メールアドレス | パスワード |
| -------------- | ---------- |
| root@test.com  | root       |

### データベース登録

Create Server から下記内容を設定する
| タブ | 設定項目 | 設定値 |
| ---------- | -------------------- | -------- |
| General | Name | postgres |
| Connection | Host | postgres |
| | Port | 5432 |
| | Maintenance Database | postgres |
| | Username | root |
| | Password | root |
