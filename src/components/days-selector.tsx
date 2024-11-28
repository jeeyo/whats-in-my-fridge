import * as React from 'react'
import { ChevronsUpDown, Calendar } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DaysSelectorProps {
  days: number
  onDaysChanged: (days: number) => void
}

export const DaysSelector: React.FC<DaysSelectorProps> = ({ days, onDaysChanged }) => {
  const [open, setOpen] = React.useState(false)
  const [dayInput, setDayInput] = React.useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {`${days} days`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[160px] p-0">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">

          <div className="flex items-center border-b px-3">
            <Calendar className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 h-9"
              type="number"
              value={dayInput}
              onChange={(e) => setDayInput(e.target.value)}
            />
          </div>

          {dayInput.length > 0 && (
              <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
              <div className="overflow-hidden p-1 text-foreground">
                <div
                  className="relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                  onClick={() => {
                    onDaysChanged(Number(dayInput))
                    setDayInput('')
                    setOpen(false)
                  }}
                >
                  {`${dayInput} days`}
                </div>

                <div
                  className="relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                  onClick={() => {
                    onDaysChanged(Number(dayInput) * 7)
                    setDayInput('')
                    setOpen(false)
                  }}
                >
                  {`${dayInput} weeks`}
                </div>

                <div
                  className="relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                  onClick={() => {
                    onDaysChanged(Number(dayInput) * 30)
                    setDayInput('')
                    setOpen(false)
                  }}
                >
                  {`${dayInput} months`}
                </div>
              </div>
            </div>
          )}

          {/* <CommandList>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    onDaysChanged(currentValue === value ? DEFAULT_VALUE : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList> */}
        </div>
      </PopoverContent>
    </Popover>
  )
}
