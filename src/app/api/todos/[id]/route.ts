import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// PUT /api/todos/[id] — toggle / update
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  if (todo.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.todo.update({
    where: { id },
    data: { isDone: body.is_done ?? body.isDone ?? todo.isDone },
    include: { user: { select: { id: true, email: true, fullName: true } } },
  });

  return NextResponse.json({
    content: {
      id: updated.id,
      item: updated.item,
      is_done: updated.isDone,
      userId: updated.userId,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      user: updated.user,
    },
  });
}

// DELETE /api/todos/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  if (todo.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await prisma.todo.delete({ where: { id } });

  return NextResponse.json({ message: "Todo deleted" });
}
