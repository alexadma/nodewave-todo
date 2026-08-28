import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/todos/dates?month=2026-08 — returns dates that have todos
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // "YYYY-MM"
  const all = searchParams.get("all") === "true" && user.role === "ADMIN";

  if (!month) {
    return NextResponse.json({ message: "month param required" }, { status: 400 });
  }

  const start = new Date(month + "-01T00:00:00.000Z");
  // Get last day of month
  const [year, mon] = month.split("-").map(Number);
  const end = new Date(year, mon, 0, 23, 59, 59, 999);

  const where: any = {
    createdAt: { gte: start, lte: end },
  };

  if (!all) {
    where.userId = user.id;
  }

  const todos = await prisma.todo.findMany({
    where,
    select: { createdAt: true },
  });

  // Group by date string
  const dateMap: Record<string, { total: number; done: number }> = {};

  for (const t of todos) {
    const dateKey = t.createdAt.toISOString().split("T")[0]; // "YYYY-MM-DD"
    if (!dateMap[dateKey]) {
      dateMap[dateKey] = { total: 0, done: 0 };
    }
    dateMap[dateKey].total += 1;
  }

  // Count done per date
  const doneTodos = await prisma.todo.findMany({
    where: { ...where, isDone: true },
    select: { createdAt: true },
  });

  for (const t of doneTodos) {
    const dateKey = t.createdAt.toISOString().split("T")[0];
    if (dateMap[dateKey]) {
      dateMap[dateKey].done += 1;
    }
  }

  return NextResponse.json({ dates: dateMap });
}
