#!/bin/bash
# 自己署名SSL証明書生成スクリプト（開発環境用）

# 出力ディレクトリを作成
mkdir -p ./certs

# 証明書とキーが既に存在する場合はスキップ
if [ -f "./certs/server.crt" ] && [ -f "./certs/server.key" ]; then
    echo "証明書ファイルが既に存在します。スキップします。"
    exit 0
fi

# 自己署名証明書を生成（有効期限365日）
openssl req -x509 -newkey rsa:2048 -keyout ./certs/server.key -out ./certs/server.crt \
    -days 365 -nodes \
    -subj "/C=JP/ST=Tokyo/L=Tokyo/O=TodoApp/CN=localhost"

echo "SSL証明書を生成しました: ./certs/server.crt, ./certs/server.key"
