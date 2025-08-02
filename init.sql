-- Todoテーブルの作成
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 初期データの挿入
INSERT INTO todos (text, completed) VALUES 
    ('買い物をする', false),
    ('風呂掃除をする', false),
    ('犬と散歩', false);

-- updated_atを自動更新するためのトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガーの設定
CREATE TRIGGER update_todos_updated_at BEFORE UPDATE
    ON todos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
