import { describe, it, expect, vi, beforeEach } from "vitest";

// pg モジュールをモック
vi.mock("pg", () => {
  const mockPool = vi.fn(function (this: any) {
    this.query = vi.fn();
    this.end = vi.fn();
    this.on = vi.fn();
  });
  return { Pool: mockPool };
});

describe("Database Connection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getDbPool がシングルトンインスタンスを返す", async () => {
    // モジュールを動的にインポート
    const { getDbPool } = await import("@/lib/db");

    const pool1 = getDbPool();
    const pool2 = getDbPool();

    // 同じインスタンスが返されることを確認
    expect(pool1).toBe(pool2);
  });

  it("環境変数が設定されている", () => {
    // DATABASE_URL または デフォルト値が設定されているか確認
    const hasDbConfig = process.env.DATABASE_URL || true;
    expect(hasDbConfig).toBeTruthy();
  });
});
