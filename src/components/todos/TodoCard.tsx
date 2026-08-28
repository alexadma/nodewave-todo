"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
import { Todo } from "@/types/todo.types";
import { useToggleTodo, useDeleteTodo } from "@/hooks/useTodos";

interface Props {
  todo: Todo;
  isAdmin?: boolean;
}

export function TodoCard({ todo, isAdmin }: Props) {
  const { mutate: toggle, isPending: toggling } = useToggleTodo();
  const { mutate: remove, isPending: deleting } = useDeleteTodo();

  return (
    <div
      className={clsx(
        "group flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100",
        "bg-white hover:border-gray-200 hover:-translate-y-px transition-all duration-150",
        todo.isDone && "opacity-60"
      )}
    >
      {/* Checkbox */}
      {!isAdmin && (
        <button
          disabled={toggling}
          onClick={() =>
            toggle({ id: todo.id, isDone: !todo.isDone })
          }
          className={clsx(
            "w-4 h-4 rounded border flex items-center justify-center transition",
            todo.isDone
              ? "bg-indigo-500 border-indigo-500"
              : "border-gray-300 hover:border-indigo-400"
          )}
        >
          {todo.isDone && (
            <svg width="9" height="7" viewBox="0 0 9 7">
              <path
                d="M1 3.5L3.5 6L8 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            "text-sm text-gray-800 truncate",
            todo.isDone && "line-through text-gray-400"
          )}
        >
          {todo.item}
        </p>

        {isAdmin && todo.user && (
          <p className="text-xs text-indigo-400 mt-0.5">
            {todo.user.fullName} · {todo.user.email}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-0.5">
          {format(new Date(todo.createdAt), "d MMM yyyy", {
            locale: id,
          })}
        </p>
      </div>

      {/* Badge */}
      <span
        className={clsx(
          "text-xs px-2.5 py-0.5 rounded-full",
          todo.isDone
            ? "bg-green-50 text-green-700"
            : "bg-indigo-50 text-indigo-600"
        )}
      >
        {todo.isDone ? "Done" : "Pending"}
      </span>

      {/* Delete */}
      {!isAdmin && (
        <button
          disabled={deleting}
          onClick={() => remove(todo.id)}
          className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}