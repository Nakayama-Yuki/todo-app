import { Suspense } from "react";
import { Todo } from "@/types/type";
import HomeClient from "@/components/HomeClient";
import { getDbPool } from "@/lib/db";

/**
 * メモアプリのメインコンポーネント
 * Server Component でPostgreSQLDBからデータを取得する
 */

// データベースからTodoリストを取得する関数
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

// サーバーコンポーネントからクライアントコンポーネントへデータを渡す
export default async function Home() {
  const initialTodos = await fetchTodos();

  return (
    <Suspense>
      <HomeClient initialTodos={initialTodos} />
    </Suspense>
  );
}
