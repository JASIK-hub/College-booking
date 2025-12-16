import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek } from "date-fns";
import { ru } from "date-fns/locale";

const locales = { ru };

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay: (date: Date) => date.getDay(),
  locales,
});
