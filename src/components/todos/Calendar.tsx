"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { todoService, TodoDateInfo } from "@/services/todo.service";
import { useAuthStore } from "@/store/authStore";
import clsx from "clsx";

interface Props {
  selectedDate: Date | null;
  onSelect: (date: Date | null) => void;
}

export function Calendar({ selectedDate, onSelect }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN";

  const monthKey = format(currentMonth, "yyyy-MM");

  const { data: datesData } = useQuery({
    queryKey: ["todo-dates", monthKey, isAdmin],
    queryFn: () => todoService.getDates(monthKey, isAdmin),
  });

  const dates: Record<string, TodoDateInfo> = datesData?.dates ?? {};

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const weekDays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-sm font-semibold text-gray-800 capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: id })}
        </h3>
        <button
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Today button */}
      <div className="flex justify-center mb-2">
        <button
          onClick={() => {
            setCurrentMonth(new Date());
            onSelect(new Date());
          }}
          className={clsx(
            "text-xs px-3 py-1 rounded-full transition font-medium",
            isToday(selectedDate ?? new Date()) && selectedDate
              ? "bg-indigo-500 text-white"
              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          )}
        >
          Hari Ini
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-medium text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const dayData = dates[dateKey];
          const hasTodos = !!dayData;
          const allDone = dayData && dayData.total > 0 && dayData.done === dayData.total;

          return (
            <button
              key={dateKey}
              onClick={() =>
                onSelect(isSelected ? null : day)
              }
              className={clsx(
                "relative flex flex-col items-center justify-center py-1.5 rounded-lg text-xs transition-all duration-150",
                !inMonth && "text-gray-300",
                inMonth && !isSelected && "text-gray-700 hover:bg-gray-50",
                isSelected && "bg-indigo-500 text-white shadow-md shadow-indigo-200",
                today && !isSelected && "ring-1 ring-indigo-300 font-bold"
              )}
            >
              <span>{format(day, "d")}</span>
              {/* Dots for todos */}
              {hasTodos && inMonth && (
                <div className="flex gap-0.5 mt-0.5">
                  {allDone ? (
                    <span
                      className={clsx(
                        "w-1 h-1 rounded-full",
                        isSelected ? "bg-white/80" : "bg-green-400"
                      )}
                    />
                  ) : (
                    <>
                      <span
                        className={clsx(
                          "w-1 h-1 rounded-full",
                          isSelected ? "bg-white/80" : "bg-indigo-400"
                        )}
                      />
                      {dayData!.total > 1 && (
                        <span
                          className={clsx(
                            "w-1 h-1 rounded-full",
                            isSelected ? "bg-white/60" : "bg-indigo-200"
                          )}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date info */}
      {selectedDate && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })}
            </p>
            {dates[format(selectedDate, "yyyy-MM-dd")] && (
              <p className="text-xs text-gray-400">
                {dates[format(selectedDate, "yyyy-MM-dd")].done}/
                {dates[format(selectedDate, "yyyy-MM-dd")].total} selesai
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
