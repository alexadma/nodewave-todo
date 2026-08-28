"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { createTodoSchema, CreateTodoFormValues } from "@/schemas/todo.schema";
import { useCreateTodo } from "@/hooks/useTodos";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function CreateTodoDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: create, isPending } = useCreateTodo();

  const form = useForm<CreateTodoFormValues>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { item: "" },
  });

  const onSubmit = (values: CreateTodoFormValues) => {
    create(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Todo Baru</DialogTitle>
          <DialogDescription className="sr-only">Form untuk membuat todo baru</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="item"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Todo</FormLabel>
                  <FormControl><Input placeholder="Apa yang ingin kamu lakukan?" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}