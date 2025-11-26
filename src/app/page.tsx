import { Suspense } from "react";
import { Todo } from "@/types/type";
import HomeClient from "@/components/HomeClient";
import { getDbPool } from "@/lib/db";

// Cache Components ではデフォルトで動的レンダリングになる
// データ取得は Suspense 境界内のコンポーネントで行い、ブロッキングを防ぐ

// DB から Todo リストを取得する関数
async function fetchTodos(): Promise<Todo[]> {
  try {
    const pool = getDbPool();
    const result = await pool.query(
      "SELECT id, text, completed, created_at FROM todos ORDER BY created_at DESC"
    );

    return result.rows.map((row) => ({
      id: row.id,
      text: row.text,
      completed: row.completed,
      created_at: row.created_at.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

// Todo リストを取得して HomeClient に渡すコンポーネント
async function TodosLoader() {
  const initialTodos = await fetchTodos();
  return <HomeClient initialTodos={initialTodos} />;
}

// 読み込み中のフォールバックコンポーネント
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-lg">読み込み中...</div>
    </div>
  );
}

// メインのページコンポーネント
export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TodosLoader />
    </Suspense>
  );
}
