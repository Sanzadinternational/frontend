
// "use client";

// import * as React from "react";
// import { addMonths, format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { DateRange } from "react-day-picker";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// export function DatePicker({
//   className,
//   value,        // Accept value
//   onChange,     // Accept onChange
// }: React.HTMLAttributes<HTMLDivElement> & {
//   value?: DateRange;
//   onChange?: (date: DateRange | undefined) => void;
// }) {
//   const [date, setDate] = React.useState<DateRange | undefined>(value); // Use external value

//   return (
//     <div className={cn("grid gap-2", className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant={"outline"}
//             className={cn(
//               "w-[300px] justify-start text-left font-normal",
//               !date && "text-muted-foreground"
//             )}
//           >
//             <CalendarIcon />
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {format(date.from, "LLL dd, y")} -{" "}
//                   {format(date.to, "LLL dd, y")}
//                 </>
//               ) : (
//                 format(date.from, "LLL dd, y")
//               )
//             ) : (
//               <span>Pick a date</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={date?.from || new Date()}
//             selected={date}
//             onSelect={(newDate) => {
//               setDate(newDate);
//               onChange?.(newDate); // Call onChange when user selects a date
//             }}
//             numberOfMonths={2}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }



"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  className,
  value,        // Accept value from parent
  onChange,     // Accept onChange from parent
}: React.HTMLAttributes<HTMLDivElement> & {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from || new Date()}
            selected={value}
            onSelect={onChange} // Directly call onChange from parent
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
