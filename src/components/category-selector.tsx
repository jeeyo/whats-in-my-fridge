import React from 'react'
import { CircleHelp } from 'lucide-react'
import Categories from '@/constants/categories'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface CategorySelectorProps {
  category: string
  onCategoryChanged: (category: string) => void
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ category, onCategoryChanged }) => {
  const CurrentCategoryComponent = Categories.find(cat => cat.name === category)?.component ?? CircleHelp

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <CurrentCategoryComponent />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-36">
        <div className="grid grid-cols-3 gap-1">
          {Categories.map((cat) => (
            <div key={cat.name}>
              <Button variant="outline" size="icon" onClick={() => onCategoryChanged(cat.name)}>
                <cat.component />
              </Button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
