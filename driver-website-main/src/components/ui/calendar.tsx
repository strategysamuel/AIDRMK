import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, useNavigation } from "react-day-picker";
import { format, setMonth, setYear } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-card rounded-2xl shadow-xl border border-border/50", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-6",
        caption: "flex justify-center pt-2 relative items-center px-10 mb-2",
        caption_label: "text-sm font-semibold text-foreground",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-background p-0 opacity-70 hover:opacity-100 hover:bg-accent transition-all duration-200 rounded-lg border-border/50"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-2",
        head_row: "flex mb-2",
        head_cell: "text-muted-foreground rounded-md w-10 font-medium text-[0.75rem] uppercase tracking-tighter",
        row: "flex w-full mt-1",
        cell: cn(
          "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 transition-all duration-200",
          "[&:has([aria-selected].day-range-end)]:rounded-r-xl",
          "[&:has([aria-selected].day-outside)]:bg-accent/30",
          "[&:has([aria-selected])]:bg-accent/50",
          "first:[&:has([aria-selected])]:rounded-l-xl",
          "last:[&:has([aria-selected])]:rounded-r-xl"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-lg shadow-primary/30",
        day_today: "bg-secondary text-secondary-foreground font-bold",
        day_outside:
          "day-outside text-muted-foreground opacity-30 aria-selected:bg-accent/30 aria-selected:text-muted-foreground aria-selected:opacity-20",
        day_disabled: "text-muted-foreground opacity-20",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-5 w-5" />,
        Caption: ({ displayMonth }) => {
          const { goToMonth, nextMonth, previousMonth } = useNavigation();

          const months = Array.from({ length: 12 }, (_, i) => ({
            value: i.toString(),
            label: format(new Date(0, i), "MMMM"),
          }));

          const currentYear = new Date().getFullYear();
          const years = Array.from({ length: 101 }, (_, i) => ({
            value: (currentYear - 80 + i).toString(),
            label: (currentYear - 80 + i).toString(),
          }));

          return (
            <div className="flex items-center justify-between w-full gap-2 px-1">
              <div className="flex gap-2 flex-1 justify-center">
                <Select
                  value={displayMonth.getMonth().toString()}
                  onValueChange={(value) => {
                    const newMonth = setMonth(displayMonth, parseInt(value));
                    goToMonth(newMonth);
                  }}
                >
                  <SelectTrigger className="h-9 w-[120px] bg-background border-border/50 text-xs font-semibold focus:ring-primary/20">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value} className="text-xs">
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={displayMonth.getFullYear().toString()}
                  onValueChange={(value) => {
                    const newYear = setYear(displayMonth, parseInt(value));
                    goToMonth(newYear);
                  }}
                >
                  <SelectTrigger className="h-9 w-[90px] bg-background border-border/50 text-xs font-semibold focus:ring-primary/20">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {years.map((year) => (
                      <SelectItem key={year.value} value={year.value} className="text-xs">
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => previousMonth && goToMonth(previousMonth)}
                  disabled={!previousMonth}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 bg-background p-0 opacity-70 hover:opacity-100 hover:bg-accent rounded-lg border-border/50 disabled:opacity-30"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => nextMonth && goToMonth(nextMonth)}
                  disabled={!nextMonth}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 bg-background p-0 opacity-70 hover:opacity-100 hover:bg-accent rounded-lg border-border/50 disabled:opacity-30"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
