"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
import { Todo } from "@/types/todo.types";
import { useToggleTodo, useDeleteTodo } from "@/hooks/useTodos";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props { todo: Todo }

export function TodoCard({ todo }: Props) {
  const { mutate: toggle, isPending: toggling } = useToggleTodo();
  const { mutate: remove, isPending: deleting } = useDeleteTodo();

  return (
    <Card className={clsx("transition-opacity", todo.isDone && "opacity-60")}>
      <CardContent className="flex items-start gap-3 p-4">
        <Checkbox
          checked={todo.isDone}
          disabled={toggling}
          onCheckedChange={() => toggle({ id: todo.id, isDone: !todo.isDone })}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <p className={clsx("font-medium truncate", todo.isDone && "line-through text-muted-foreground")}>
            {todo.item}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {format(new Date(todo.createdAt), "dd MMM yyyy", { locale: id })}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={todo.isDone ? "secondary" : "default"}>
            {todo.isDone ? "Selesai" : "Pending"}
          </Badge>
          <Button
            size="icon"
            variant="ghost"
            disabled={deleting}
            onClick={() => remove(todo.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}