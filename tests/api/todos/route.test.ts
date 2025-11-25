import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GET, POST } from "@/app/api/todos/route";
import { PUT, DELETE } from "@/app/api/todos/[id]/route";
import type { Todo, ApiResponse } from "@/types/type";
import { NextRequest } from "next/server";

// データベース接続のモック
vi.mock("@/lib/db", () => ({
  getDbPool: vi.fn(() => ({
    query: vi.fn(),
  })),
}));

describe("GET /api/todos", () => {
  it("全てのTodoを取得できる", async () => {
    const { getDbPool } = await import("@/lib/db");
    const mockQuery = vi.fn().mockResolvedValue({
      rows: [
        { id: 1, text: "Test Todo 1", completed: false },
        { id: 2, text: "Test Todo 2", completed: true },
      ],
    });

    vi.mocked(getDbPool).mockReturnValue({
      query: mockQuery,
    } as any);

    const response = await GET();
    const data: ApiResponse<Todo[]> = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(2);
    expect(data.data?.[0].text).toBe("Test Todo 1");
  });

  it("データベースエラー時に適切なエラーレスポンスを返す", async () => {
    const { getDbPool } = await import("@/lib/db");
    const mockQuery = vi.fn().mockRejectedValue(new Error("Database error"));

    vi.mocked(getDbPool).mockReturnValue({
      query: mockQuery,
    } as any);

    const response = await GET();
    const data: ApiResponse<Todo[]> = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });
});

describe("POST /api/todos", () => {
  it("新しいTodoを作成できる", async () => {
    const { getDbPool } = await import("@/lib/db");
    const mockQuery = vi.fn().mockResolvedValue({
      rows: [{ id: 1, text: "New Todo", completed: false }],
    });

    vi.mocked(getDbPool).mockReturnValue({
      query: mockQuery,
    } as any);

    const request = new NextRequest("http://localhost:3000/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: "New Todo" }),
    });

    const response = await POST(request);
    const data: ApiResponse<Todo> = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.text).toBe("New Todo");
  });

  it("text が空の場合はエラーを返す", async () => {
    const request = new NextRequest("http://localhost:3000/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: "" }),
    });

    const response = await POST(request);
    const data: ApiResponse<Todo> = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("text");
  });
});

describe("PUT /api/todos/[id]", () => {
  it("Todoを更新できる", async () => {
    const { getDbPool } = await import("@/lib/db");
    const mockQuery = vi.fn().mockResolvedValue({
      rows: [{ id: 1, text: "Updated Todo", completed: true }],
    });

    vi.mocked(getDbPool).mockReturnValue({
      query: mockQuery,
    } as any);

    const request = new NextRequest("http://localhost:3000/api/todos/1", {
      method: "PUT",
      body: JSON.stringify({ text: "Updated Todo", completed: true }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });
    const data: ApiResponse<Todo> = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.text).toBe("Updated Todo");
  });

  it("存在しないTodoの更新時は404を返す", async () => {
    const { getDbPool } = await import("@/lib/db");
    const mockQuery = vi.fn().mockResolvedValue({
      rows: [],
    });

    vi.mocked(getDbPool).mockReturnValue({
      query: mockQuery,
    } as any);

    const request = new NextRequest("http://localhost:3000/api/todos/999", {
      method: "PUT",
      body: JSON.stringify({ text: "Updated Todo" }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "999" }),
    });
    const data: ApiResponse<Todo> = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
  });
});

describe("DELETE /api/todos/[id]", () => {
  it("Todoを削除できる", async () => {
    const { getDbPool } = await import("@/lib/db");
    const mockQuery = vi.fn().mockResolvedValue({
      rows: [{ id: 1 }],
    });

    vi.mocked(getDbPool).mockReturnValue({
      query: mockQuery,
    } as any);

    const response = await DELETE(
      new NextRequest("http://localhost:3000/api/todos/1"),
      { params: Promise.resolve({ id: "1" }) }
    );
    const data: ApiResponse<null> = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBe(null);
  });

  it("存在しないTodoの削除時は404を返す", async () => {
    const { getDbPool } = await import("@/lib/db");
    const mockQuery = vi.fn().mockResolvedValue({
      rows: [],
    });

    vi.mocked(getDbPool).mockReturnValue({
      query: mockQuery,
    } as any);

    const response = await DELETE(
      new NextRequest("http://localhost:3000/api/todos/999"),
      { params: Promise.resolve({ id: "999" }) }
    );
    const data: ApiResponse<null> = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
  });
});
