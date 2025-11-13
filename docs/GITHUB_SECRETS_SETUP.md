# GitHub Secrets セットアップガイド

このドキュメントでは、GitHub Actions で CI/CD パイプラインを実行するために必要な Secrets の設定方法を説明します。

## 🔐 なぜ GitHub Secrets を使用するのか?

- **セキュリティ**: 機密情報(パスワード、API キーなど)をコードから分離
- **暗号化**: Secrets は暗号化されて保存され、ログに出力されない
- **柔軟性**: 環境ごとに異なる値を設定可能
- **ベストプラクティス**: 業界標準のセキュリティ慣行に準拠

## 📋 必要な Secrets 一覧

以下の Secrets を GitHub リポジトリに設定する必要があります:

| Secret 名           | 説明                        | 例                                                      |
| ------------------- | --------------------------- | ------------------------------------------------------- |
| `POSTGRES_DB`       | PostgreSQL のデータベース名 | `todoapp`                                               |
| `POSTGRES_USER`     | PostgreSQL のユーザー名     | `todouser`                                              |
| `POSTGRES_PASSWORD` | PostgreSQL のパスワード     | `todopass`                                              |
| `DATABASE_URL`      | 完全なデータベース接続 URL  | `postgresql://todouser:todopass@localhost:5432/todoapp` |

## 🛠️ セットアップ手順

### ステップ 1: GitHub リポジトリの設定ページを開く

1. GitHub でリポジトリ (`Nakayama-Yuki/todo-app`) を開く
2. 上部メニューの **Settings** タブをクリック

### ステップ 2: Secrets 設定ページに移動

1. 左サイドバーの **Security** セクションを展開
2. **Secrets and variables** → **Actions** をクリック

### ステップ 3: Secrets を追加

各 Secret について以下の手順を繰り返します:

1. **New repository secret** ボタンをクリック
2. **Name** フィールドに Secret 名を入力
3. **Secret** フィールドに値を入力
4. **Add secret** ボタンをクリック

#### 追加する Secrets:

```
Name: POSTGRES_DB
Secret: todoapp
```

```
Name: POSTGRES_USER
Secret: todouser
```

```
Name: POSTGRES_PASSWORD
Secret: todopass
```

```
Name: DATABASE_URL
Secret: postgresql://todouser:todopass@localhost:5432/todoapp
```

### ステップ 4: 設定の確認

すべての Secrets を追加したら、Secrets 一覧に以下の 4 つが表示されることを確認します:

- ✅ POSTGRES_DB
- ✅ POSTGRES_USER
- ✅ POSTGRES_PASSWORD
- ✅ DATABASE_URL

## 🔄 GitHub Actions での使用方法

ワークフローファイル (`.github/workflows/node.js.yml`) では、以下の構文で Secrets にアクセスします:

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

または、サービスコンテナで:

```yaml
services:
  postgres:
    env:
      POSTGRES_DB: ${{ secrets.POSTGRES_DB }}
      POSTGRES_USER: ${{ secrets.POSTGRES_USER }}
      POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
```

## 🌍 環境別の Secrets (オプション)

本番環境と開発環境で異なる値を使用したい場合、**Environments**を使用できます:

### Environment Secrets の設定:

1. **Settings** → **Environments**
2. 環境を作成 (例: `production`, `staging`)
3. 各環境に固有の Secrets を追加

### ワークフローでの使用:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production # 環境を指定
    steps:
      - name: Deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }} # 環境固有のSecretを使用
```

## 🔒 セキュリティのベストプラクティス

1. **最小権限の原則**: 必要な権限のみを付与
2. **定期的なローテーション**: パスワードや API キーを定期的に変更
3. **Secret の分離**: 環境ごとに異なる Secrets を使用
4. **ログの確認**: Secrets がログに出力されていないことを確認
5. **.env.local の除外**: `.gitignore`に`.env.local`が含まれていることを確認

## ⚠️ 注意事項

- Secrets は一度追加すると値を表示できません(更新のみ可能)
- Secrets の値は暗号化されますが、ワークフローのログには表示されないよう注意
- Pull Request からフォークしたリポジトリでは Secrets にアクセスできません(セキュリティ対策)

## 🧪 動作確認

Secrets を設定したら、以下の方法で動作を確認できます:

1. GitHub Actions のワークフローをトリガーして CI が成功することを確認
2. ワークフローのログで環境変数が正しく設定されているか確認(値は`***`で隠される)

## 📚 参考リンク

- [GitHub Actions Secrets 公式ドキュメント](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [環境の使用](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [ワークフローでの Secrets の使用](https://docs.github.com/en/actions/security-guides/encrypted-secrets#using-encrypted-secrets-in-a-workflow)
