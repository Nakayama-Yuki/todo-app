import { Todo, ApiResponse } from "@/types/type";
import HomeClient from "@/components/HomeClient";
import { unstable_noStore } from "next/cache";

/**
 * メモアプリのメインコンポーネント
 * Server Component でサーバー側からデータを取得
 * PostgreSQLデータベースと連携するバージョン
 * Next.js 16, React 19環境で動作
 */

// データベースからTodoリストを取得する関数
async function fetchTodos(): Promise<Todo[]> {
  try {
    unstable_noStore(); // 動的レンダリング: キャッシュしない

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/todos`, {
      cache: "no-store", // フェッチごとにリクエスト
    });

    const result: ApiResponse<Todo[]> = await response.json();

    if (result.success && result.data) {
      return result.data;
    } else {
      console.error("Failed to fetch todos:", result.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

// メインのHomeコンポーネント
export default async function Home() {
  const initialTodos = await fetchTodos();

  return <HomeClient initialTodos={initialTodos} />;
}
