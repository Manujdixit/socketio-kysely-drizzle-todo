import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MiniCalendar: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getDaysArray = () => {
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  if (isCollapsed) {
    return (
      <div className="px-2 py-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-sm">
          {today.getDate()}
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-4">
      <div className="bg-[var(--card)] rounded-xl p-3 border border-[var(--border)] shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goToPreviousMonth}
            className="p-1 hover:bg-[var(--muted)] rounded-full transition"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="text-xs font-semibold text-[var(--foreground)]">
            {monthNames[currentMonth].slice(0, 3)} {currentYear}
          </div>
          <button
            onClick={goToNextMonth}
            className="p-1 hover:bg-[var(--muted)] rounded-full transition"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-xs font-medium text-[var(--muted-foreground)] text-center h-6 flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysArray().map((day, index) => (
            <div
              key={index}
              className={`
                h-6 flex items-center justify-center text-xs rounded cursor-pointer transition
                ${day === null ? "invisible" : ""}
                ${
                  isToday(day!)
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold"
                    : "hover:bg-[var(--muted)] text-[var(--foreground)]"
                }
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
