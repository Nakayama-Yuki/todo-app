import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { Todo, ApiResponse, UpdateTodoRequest } from "@/types/type";

/**
 * PUT /api/todos/[id] - Todoを更新
 */
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<Todo>>> {
  const params = await props.params;
  try {
    const todoId = parseInt(params.id);

    // IDのバリデーション
    if (isNaN(todoId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid todo ID",
        },
        { status: 400 },
      );
    }

    const body: UpdateTodoRequest = await request.json();
    const pool = getDbPool();

    // 既存のTodoをチェック
    const existingResult = await pool.query(
      "SELECT id FROM todos WHERE id = $1",
      [todoId],
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Todo not found",
        },
        { status: 404 },
      );
    }

    // 更新クエリを動的に構築
    const updateFields: string[] = [];
    const updateValues: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (body.text !== undefined) {
      updateFields.push(`text = $${paramIndex}`);
      updateValues.push(body.text.trim());
      paramIndex++;
    }

    if (body.completed !== undefined) {
      updateFields.push(`completed = $${paramIndex}`);
      updateValues.push(body.completed);
      paramIndex++;
    }

    // updated_atを自動更新
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(todoId);

    const query = `
      UPDATE todos 
      SET ${updateFields.join(", ")} 
      WHERE id = $${paramIndex}
      RETURNING id, text, completed, created_at, updated_at
    `;

    const result = await pool.query(query, updateValues);
    const updatedTodo: Todo = result.rows[0];

    return NextResponse.json({
      success: true,
      data: updatedTodo,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update todo",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/todos/[id] - Todoを削除
 */
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<null>>> {
  const params = await props.params;
  try {
    const todoId = parseInt(params.id);

    // IDのバリデーション
    if (isNaN(todoId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid todo ID",
        },
        { status: 400 },
      );
    }

    const pool = getDbPool();

    // Todoを削除
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING id",
      [todoId],
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Todo not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: null,
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete todo",
      },
      { status: 500 },
    );
  }
}
