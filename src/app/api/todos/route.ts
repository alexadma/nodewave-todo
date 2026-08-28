import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/todos — list todos (with filters)
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const isDoneParam = searchParams.get("isDone");
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const all = searchParams.get("all") === "true" && user.role === "ADMIN";

  const where: any = {};

  // Non-admin users only see their own todos
  if (!all) {
    where.userId = user.id;
  }

  // Filter by isDone
  if (isDoneParam === "true") where.isDone = true;
  if (isDoneParam === "false") where.isDone = false;

  // Search in item
  if (search) {
    where.item = { contains: search, mode: "insensitive" };
  }

  const [entries, totalData] = await Promise.all([
    prisma.todo.findMany({
      where,
      include: { user: { select: { id: true, email: true, fullName: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.todo.count({ where }),
  ]);

  // Map to snake_case is_done to match frontend
  const mapped = entries.map((t) => ({
    id: t.id,
    item: t.item,
    is_done: t.isDone,
    userId: t.userId,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    user: t.user,
  }));

  return NextResponse.json({
    content: {
      entries: mapped,
      totalData,
      totalPage: Math.ceil(totalData / limit),
    },
  });
}

// POST /api/todos — create todo
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { item } = body;

  if (!item || !item.trim()) {
    return NextResponse.json(
      { message: "Todo wajib diisi" },
      { status: 400 }
    );
  }

  const todo = await prisma.todo.create({
    data: { item: item.trim(), userId: user.id },
    include: { user: { select: { id: true, email: true, fullName: true } } },
  });

  return NextResponse.json({
    content: {
      id: todo.id,
      item: todo.item,
      is_done: todo.isDone,
      userId: todo.userId,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
      user: todo.user,
    },
  });
}
