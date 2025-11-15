---
applyTo: "**/*.test.ts, **/*.test.tsx"
---

# Vitest Best Practices for LLMs (2025)

_Last updated: November 2025_

This document provides authoritative guidelines for writing, structuring, and maintaining tests in the todo-app project using Vitest. It is intended for use by LLMs and developers to ensure test quality, maintainability, and reliability.

---

## 1. Vitest Project Setup & Configuration

### Environment

- **Vitest Version**: ^4.0.8
- **Test Environment**: `jsdom` (browser environment emulation)
- **TypeScript**: strict mode enabled
- **Node.js**: 18+ (pnpm managed)

### Configuration File: `vitest.config.ts`

Key settings:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true, // Automatically import describe, it, expect, etc.
    setupFiles: ["./src/test/setup.ts"], // Global test setup
  },
  resolve: {
    alias: {
      "@": "/src", // Path alias for imports
    },
  },
});
```

**Key Points:**

- `globals: true` — No need for `import { describe, it, expect }` in every test file.
- `jsdom` environment — Full browser DOM API support for React component testing.
- `setupFiles` — Automatically runs `src/test/setup.ts` before all tests.
- Path alias `@` — Enables `import from "@/lib/db"` syntax.

### Setup File: `src/test/setup.ts`

```typescript
import "@testing-library/jest-dom";
```

**Purpose**: Extends Vitest matchers with DOM-specific assertions (`toBeInTheDocument()`, `toHaveClass()`, etc.).

### Test Scripts

```bash
pnpm test              # Watch mode (development)
pnpm test --run        # Single run + coverage report (CI/CD)
```

---

## 2. Core Principles

### User-Centric Testing (Testing Library Philosophy)

- **Test the user experience, not implementation details.**
- Use role-based selectors (`getByRole`, `getByLabel`) that mirror how users interact with the UI.
- Avoid `getByTestId()` unless necessary; prefer semantic HTML and ARIA roles.

**Example:**

```typescript
// ✅ CORRECT: Test what users see
const button = screen.getByRole("button", { name: /add task/i });
await user.click(button);

// ❌ WRONG: Testing implementation details (data-testid)
const button = screen.getByTestId("add-button");
```

### Mock Minimalism

- **Only mock external dependencies** (database, HTTP calls, external libraries).
- **Never mock internal components or functions** you want to test.
- This project mocks only `@/lib/db` (PostgreSQL connection pool).

**Rationale**: Mocking hides bugs and reduces test reliability. Test real implementations when possible.

### Test Independence

- Each test must run independently.
- **No shared state between tests**.
- Use `beforeEach` for common setup, `afterEach` for cleanup.
- Always call `vi.clearAllMocks()` after each test.

### Database Testing Strategy

- **Never connect to a real PostgreSQL database in unit tests.**
- Mock `getDbPool()` in `@/lib/db` to return mock query results.
- Test SQL logic and error handling via mock responses.
- Integration tests (if needed later) can use Docker PostgreSQL.

---

## 3. Testing Library Selector Priority

Always use selectors in this order:

| Priority | Method                   | Example                                 | Use Case                            |
| -------- | ------------------------ | --------------------------------------- | ----------------------------------- |
| 1        | `getByRole()`            | `getByRole("button", { name: /add/i })` | Most tests; accessible by design    |
| 2        | `getByLabelText()`       | `getByLabelText(/task description/i)`   | Form inputs with labels             |
| 3        | `getByPlaceholderText()` | `getByPlaceholderText(/search/i)`       | Input placeholders                  |
| 4        | `getByText()`            | `getByText(/welcome/i)`                 | Text content (headings, paragraphs) |
| 5        | `getByTestId()`          | `getByTestId("todo-item-42")`           | Last resort; avoid when possible    |

**Query Types:**

- `getBy*` — Synchronous, throws if not found. Use for expected elements.
- `queryBy*` — Synchronous, returns null if not found. Use to assert absence.
- `findBy*` — Asynchronous, waits for element. Use for delayed renders.

---

## 4. Common Test Patterns

### Pattern 1: Component with Theme Context Wrapper

Many components use the `useTheme()` hook, which requires `ThemeProvider` wrapping.

```typescript
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/context/themeContext";
import AddTask from "./AddTask";

// Helper function to render components with ThemeProvider
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe("AddTask Component", () => {
  it("renders input field", () => {
    renderWithTheme(<AddTask onAdd={vi.fn()} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });
});
```

**When to use**: Any component that calls `useTheme()` or renders child components that do.

### Pattern 2: User Interactions with `userEvent`

Always use `userEvent` (not `fireEvent`) for realistic user simulation.

```typescript
import userEvent from "@testing-library/user-event";

describe("AddTask Component", () => {
  it("submits form with input text", async () => {
    const mockAdd = vi.fn();
    renderWithTheme(<AddTask onAdd={mockAdd} />);

    const user = userEvent.setup(); // Initialize user event
    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /add/i });

    await user.type(input, "New Task");
    await user.click(button);

    expect(mockAdd).toHaveBeenCalledWith("New Task");
  });
});
```

**Key Points:**

- `await userEvent.setup()` — Initializes user event handler.
- `await user.type()`, `await user.click()` — All interactions are awaited.
- Matches real user behavior (keyboard, mouse, focus management).

### Pattern 3: Mocking External Dependencies

Mock database access for API route testing.

```typescript
import { getDbPool } from "@/lib/db";

vi.mock("@/lib/db");

describe("GET /api/todos", () => {
  it("returns all todos", async () => {
    const mockQuery = vi.fn().mockResolvedValue({
      rows: [
        { id: 1, text: "Buy milk", completed: false },
        { id: 2, text: "Read docs", completed: true },
      ],
    });

    vi.mocked(getDbPool).mockReturnValue({
      query: mockQuery,
    } as any);

    const req = new Request("http://localhost:3000/api/todos");
    const res = await GET(req);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(2);
  });
});
```

**Key Points:**

- `vi.mock("@/lib/db")` — Replaces module with auto-generated mock.
- `vi.mocked(getDbPool)` — Type-safe access to mocked function.
- `.mockResolvedValue()` — Returns promise resolving to mock data.
- `.mockReturnValue()` — Returns synchronous value (pool object).

### Pattern 4: Async Operations and `waitFor`

Test async state updates (API calls, re-renders).

```typescript
import { waitFor } from "@testing-library/react";

describe("HomeClient Component", () => {
  it("displays newly added task after creation", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { id: 3, text: "New Task" } }),
    });
    global.fetch = mockFetch;

    const user = userEvent.setup();
    renderWithTheme(<HomeClient initialTodos={[]} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "New Task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Wait for async state update
    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });
  });
});
```

**Key Points:**

- `await waitFor(() => {...})` — Polls assertion until true or timeout (1000ms default).
- Used for API responses, state updates, re-renders.
- Never use `setTimeout` in tests; `waitFor` is the standard approach.

### Pattern 5: Setup and Teardown

Properly initialize and clean up between tests.

```typescript
describe("API Todos", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear all vi.fn() and mocks
  });

  it("test 1", () => {
    // fetch mock is fresh for this test
  });

  it("test 2", () => {
    // fetch mock is fresh for this test (not polluted by test 1)
  });
});
```

**Key Points:**

- `beforeEach` — Runs before each test in the block.
- `afterEach` — Runs after each test; always call `vi.clearAllMocks()`.
- Prevents state leakage between tests.

### Pattern 6: API Route Testing

Test REST endpoints with mock database responses.

```typescript
import { GET, POST, PATCH, DELETE } from "@/app/api/todos/route";

describe("POST /api/todos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new todo and returns 201", async () => {
    const mockQuery = vi.fn().mockResolvedValue({
      rows: [{ id: 1, text: "New Task", completed: false }],
    });

    vi.mocked(getDbPool).mockReturnValue({
      query: mockQuery,
    } as any);

    const req = new Request("http://localhost:3000/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: "New Task" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.text).toBe("New Task");
  });

  it("returns 400 for empty text", async () => {
    const req = new Request("http://localhost:3000/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: "" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });
});
```

**API Testing Checklist:**

- ✅ Test success path (201/200 with correct data).
- ✅ Test validation errors (400 for invalid input).
- ✅ Test not-found errors (404 for missing resources).
- ✅ Test server errors (500 for database failures).
- ✅ Test correct HTTP status codes.
- ✅ Mock database responses; never connect to real DB.

---

## 5. Naming Conventions & File Organization

### Test File Placement

- **Location**: Place test files **in the same directory** as the source file.
- **Naming**: Use `.test.ts` or `.test.tsx` extension.

**Examples:**

```
src/
  components/
    AddTask.tsx          ← Component source
    AddTask.test.tsx     ← Component test
  app/
    api/
      todos/
        route.ts         ← API route source
        route.test.ts    ← API route test
  lib/
    db.ts                ← Utility source
    db.test.ts           ← Utility test
```

### Test Naming Conventions

```typescript
describe("AddTask Component", () => {
  // ✅ CORRECT: Clear, action-oriented
  it("renders input field and add button", () => {});
  it("submits form when button is clicked", () => {});
  it("clears input after successful submission", () => {});

  // ❌ WRONG: Vague or implementation-focused
  it("works", () => {});
  it("test AddTask", () => {});
  it("state updates correctly", () => {});
});
```

**Guidelines:**

- `describe()` block name = component/function name.
- `it()` description = user-visible behavior or expected outcome.
- Start with verb: "renders", "displays", "submits", "calls", "throws", etc.
- Write in plain English; be specific.

---

## 6. Test Strategy & Coverage Priorities

### Priority Ranking

| Priority   | Component                                            | Coverage Focus                                    | Est. Tests |
| ---------- | ---------------------------------------------------- | ------------------------------------------------- | ---------- |
| **High**   | API Routes (`route.ts`)                              | CRUD, validation, error cases, HTTP status        | 8–12       |
| **High**   | Main Component (`HomeClient.tsx`)                    | Initial render, add/edit/delete, API calls, state | 10–15      |
| **Medium** | UI Components (`TaskList`, `AddTask`, `ChangeTheme`) | Props, events, user interactions                  | 5–8 each   |
| **Medium** | Custom Hooks (`useTheme`)                            | Context integration, state management             | 2–3        |
| **Low**    | Utilities (`db.ts`)                                  | Config, error handling                            | 1–2        |

### Coverage Goals

- **Target**: 80% code coverage across the project.
- **API Routes**: 100% (critical business logic).
- **Components**: 70–80% (UI interactions).
- **Utilities**: 60–70% (configuration rarely changes).

Run coverage report:

```bash
pnpm test --run --coverage
```

---

## 7. Best Practices & Common Pitfalls

### ✅ DO

- Use `waitFor()` for async operations.
- Import and use `userEvent` for all user interactions.
- Wrap components with `ThemeProvider` if they use `useTheme()`.
- Mock only external dependencies (database, HTTP, external libs).
- Call `vi.clearAllMocks()` in `afterEach`.
- Test edge cases: empty inputs, long strings, special characters.
- Use role-based selectors; avoid test IDs when possible.
- Test error scenarios (400, 404, 500 HTTP codes).

### ❌ DON'T

- Use `fireEvent` (use `userEvent` instead).
- Use `setTimeout` or hard-coded delays (use `waitFor` instead).
- Mock internal components (test real implementations).
- Connect to a real PostgreSQL database in tests.
- Forget to `await` async operations.
- Leave mocks or global state between tests (use `afterEach`).
- Test implementation details (internal state); test only outputs and behavior.
- Use `getByTestId()` as first choice (use semantic selectors).

---

## 8. CI/CD Integration

### GitHub Actions Workflow

Tests are automatically run on:

- **Triggers**: Push to `main`/`develop`, pull requests, merge groups.
- **Environment**: GitHub-provided Ubuntu runner.
- **Database**: PostgreSQL 17-alpine service container (started for test duration).
- **Command**: `pnpm test --run` (single run with coverage).

**GitHub Secrets Required** (for database setup):

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

### Local CI Simulation

To verify tests pass locally before pushing:

```bash
# Run tests once (mimics CI behavior)
pnpm test --run

# Check for linting issues
pnpm lint

# Build Next.js (verify no build errors)
pnpm build
```

---

## 9. Debugging Tests

### Run Specific Test File

```bash
pnpm test AddTask.test.tsx
```

### Run Tests Matching Pattern

```bash
pnpm test --grep "submits form"
```

### Watch Mode with UI (Vitest UI)

```bash
pnpm test --ui
```

Opens interactive test dashboard at `http://localhost:51204/__vitest__/`.

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

Press `F5` to debug with breakpoints.

---

## 10. Example: Complete Test Suite for a Component

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/context/themeContext";
import TaskList from "./TaskList";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe("TaskList Component", () => {
  const mockTasks = [
    { id: 1, text: "Buy milk", completed: false },
    { id: 2, text: "Read docs", completed: true },
  ];

  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onToggle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders all tasks", () => {
    renderWithTheme(<TaskList tasks={mockTasks} {...mockHandlers} />);
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Read docs")).toBeInTheDocument();
  });

  it("displays tasks with correct completed state", () => {
    renderWithTheme(<TaskList tasks={mockTasks} {...mockHandlers} />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TaskList tasks={mockTasks} {...mockHandlers} />);

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(1);
  });

  it("calls onToggle when checkbox is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TaskList tasks={mockTasks} {...mockHandlers} />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(mockHandlers.onToggle).toHaveBeenCalledWith(1);
  });

  it("renders empty state when no tasks", () => {
    renderWithTheme(<TaskList tasks={[]} {...mockHandlers} />);
    expect(screen.getByText(/no tasks/i)).toBeInTheDocument();
  });
});
```

---

## 11. Troubleshooting

### Common Issues

| Issue                     | Solution                                               |
| ------------------------- | ------------------------------------------------------ |
| `Element not found`       | Use `findBy*` (async) instead of `getBy*`.             |
| `act()` warning           | Wrap async operations with `waitFor()`.                |
| Mock not working          | Ensure `vi.mock()` is at top of file, before imports.  |
| Database connection error | Mocks are required; never connect to real DB in tests. |
| `useTheme()` error        | Wrap component with `ThemeProvider` in tests.          |
| Test timeout              | Increase default: `test.testTimeout: 10000` in config. |

### Useful Testing Library Utilities

- `screen.debug()` — Print current DOM to console for inspection.
- `screen.logTestingPlaygroundURL()` — Generate Testing Playground URL.
- `within(element).getByRole()` — Query within a scoped element.
- `within().queryBy*()` — Assert element absence.

---

## Checklist for New Tests

Before committing test code, ensure:

- ✅ Tests use role-based selectors (`getByRole`, `getByLabel`).
- ✅ `userEvent.setup()` is called and all interactions are awaited.
- ✅ `beforeEach` / `afterEach` properly initialize and clean up.
- ✅ Async operations use `waitFor()`, not `setTimeout`.
- ✅ Components using `useTheme()` are wrapped with `ThemeProvider`.
- ✅ Database/HTTP calls are mocked (never connect to real services).
- ✅ Test descriptions are clear and action-oriented.
- ✅ Mock handlers are reset between tests.
- ✅ Edge cases and error scenarios are tested.
- ✅ Coverage report shows 70%+ for tested files.
