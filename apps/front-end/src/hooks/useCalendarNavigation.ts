import { useState, useCallback } from "react";
import { addDays, subDays, startOfWeek, format } from "date-fns";
import { ru } from "date-fns/locale";
import type { View } from "react-big-calendar";

export function useCalendarNavigation(initialView: View = "week") {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(initialView);

  const goToToday = useCallback(() => setDate(new Date()), []);

  const goPrev = useCallback(() => {
    setDate((prev) =>
      view === "month"
        ? subDays(prev, 30)
        : view === "week"
          ? subDays(prev, 7)
          : subDays(prev, 1)
    );
  }, [view]);

  const goNext = useCallback(() => {
    setDate((prev) =>
      view === "month"
        ? addDays(prev, 30)
        : view === "week"
          ? addDays(prev, 7)
          : addDays(prev, 1)
    );
  }, [view]);

  const getHeaderTitle = useCallback(() => {
    if (view === "month") return format(date, "LLLL yyyy", { locale: ru });

    if (view === "week") {
      const start = startOfWeek(date, { locale: ru });
      const end = addDays(start, 6);
      return `${format(start, "d MMMM", { locale: ru })} — ${format(
        end,
        "d MMMM yyyy",
        { locale: ru }
      )}`;
    }

    return format(date, "dd MMMM yyyy", { locale: ru });
  }, [date, view]);

  return {
    date,
    view,
    setView,
    setDate,
    goPrev,
    goNext,
    goToToday,
    getHeaderTitle,
  };
}
