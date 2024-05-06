"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { es } from "date-fns/locale"

type Props = {
  filteredDate: Date | undefined
  setFilteredDate: (date: Date) => void
  label: string
}
export function DatePickerToFilter({ filteredDate, setFilteredDate, label }: Props) {

    function handleDateChange(date: Date | undefined) {
        if (date) {
            setFilteredDate(date)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[250px] justify-start text-left font-normal",
                        filteredDate && "text-black dark:text-white"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filteredDate ? format(filteredDate, "PPP", {locale: es}) : <span>{label}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                mode="single"
                selected={filteredDate}
                onSelect={handleDateChange}
                initialFocus
                locale={es}
                />
            </PopoverContent>
        </Popover>
    )
}
