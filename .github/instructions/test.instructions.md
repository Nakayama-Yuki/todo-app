# テストドキュメント

## テスト概要

このプロジェクトは、Vitest と React Testing Library を使用した包括的なテストスイートを備えています。

## セットアップ

テストフレームワーク:

- **Vitest**: 高速な単体テストフレームワーク
- **@testing-library/react**: React コンポーネントテスト用
- **@testing-library/user-event**: ユーザーインタラクションのシミュレーション
- **jsdom**: ブラウザ環境のシミュレーション

## テストカバレッジ

### 1. API エンドポイントテスト (`route.test.ts`)

#### GET /api/todos

- ✅ 全ての Todo を取得できる
- ✅ データベースエラー時に適切なエラーレスポンスを返す

#### POST /api/todos

- ✅ 新しい Todo を作成できる
- ✅ text が空の場合はエラーを返す
- ⏭️ text が 255 文字を超える場合はエラーを返す (スキップ - 未実装)

#### PUT /api/todos/[id]

- ✅ Todo を更新できる
- ✅ 存在しない Todo の更新時は 404 を返す

#### DELETE /api/todos/[id]

- ✅ Todo を削除できる
- ✅ 存在しない Todo の削除時は 404 を返す

### 2. コンポーネントテスト

#### AddTask コンポーネント (`AddTask.test.tsx`)

- ✅ 入力フィールドとボタンが表示される
- ✅ 入力値が変更されると setInput が呼ばれる
- ✅ 追加ボタンをクリックすると addTodo が呼ばれる
- ✅ input props の値が表示される

#### TaskList コンポーネント (`TaskList.test.tsx`)

- ✅ 全ての Todo が表示される
- ✅ 完了済みの Todo にチェックが入っている
- ✅ チェックボックスをクリックすると toggleTodo が呼ばれる
- ✅ 削除ボタンをクリックすると deleteTodo が呼ばれる
- ✅ 編集ボタンをクリックすると編集モードになる
- ✅ 編集して保存すると updateTodo が呼ばれる
- ✅ Todo がない場合は何も表示されない

#### ChangeTheme コンポーネント (`ChangeTheme.test.tsx`)

- ✅ テーマ切り替えボタンが表示される
- ✅ ボタンをクリックすると toggleTheme が呼ばれる

### 3. ユニットテスト

#### データベース接続 (`db.test.ts`)

- ✅ getDbPool がシングルトンインスタンスを返す
- ✅ 環境変数が設定されている

## テストの実行方法

```bash
# 全テストを実行
pnpm test --run

# ウォッチモードで実行
pnpm test

# カバレッジレポート生成
pnpm test:coverage
```

## モッキング戦略

### データベースモッキング

API テストでは、`@/lib/db` モジュールの `getDbPool()` 関数をモックして、実際のデータベース接続なしでテストを実行しています。

```typescript
vi.mock("@/lib/db", () => ({
  getDbPool: vi.fn(() => ({
    query: vi.fn(),
  })),
}));
```

### コンポーネントモッキング

コンポーネントテストでは、ThemeProvider でラップすることで、テーマコンテキストを提供しています。

```typescript
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};
```

## CI/CD 統合

GitHub Actions ワークフローに組み込まれており、PR やプッシュ時に自動実行されます。

```yaml
- name: Run tests
  run: pnpm test --run
```

## 今後の改善点

1. **カバレッジ目標**: 80% 以上のコードカバレッジを目指す
2. **E2E テスト**: Playwright を使用したエンドツーエンドテストの追加
3. **バリデーション**: 255 文字制限のバリデーションを実装してテストを有効化
4. **統合テスト**: 実際のデータベースを使用した統合テストの追加

## デバッグ

テストが失敗した場合:

1. エラーメッセージを確認
2. `screen.debug()` を使用して DOM の状態を確認
3. モックが正しく設定されているか確認
4. 実際のコンポーネントのテキストやプロパティ名を確認

## ベストプラクティス

- ✅ ユーザーの視点でテストを書く（Testing Library の哲学）
- ✅ 実装の詳細ではなく、動作をテストする
- ✅ テストは独立して実行可能にする
- ✅ わかりやすいテスト名を使用する
- ✅ モックは最小限に抑える
