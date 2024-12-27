import React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import { ModeToggle } from '@/components/mode-toggle'
import { DaysSelector } from '@/components/days-selector'
import { CategorySelector } from '@/components/category-selector'
import { PurgeDatabaseButton } from '@/components/purge-database-button'
import { UploadDatabaseButton } from '@/components/upload-database-button'
import { DownloadDatabaseButton } from './components/download-database-button'

import Categories from '@/constants/categories'
import { Trash, CircleHelp, BellDot } from 'lucide-react'

import { fetchItems, insertItem, deleteItem } from '@/lib/database'
import { DateTime } from 'luxon'
import type Item from '@/types/item'
import { useToast } from '@/hooks/use-toast'

function App() {
  const { toast } = useToast()

  const [category, setCategory] = React.useState('beef')
  const [text, setText] = React.useState('')
  const [days, setDays] = React.useState(3)

  const [items, setItems] = React.useState<Item[]>([])

  const [uploading, setUploading] = React.useState(false)
  const [downloading, setDownloading] = React.useState(false)

  const [notificationEnabled, setNotificationEnabled] = React.useState(false)

  React.useEffect(() => {
    fetchItems(setItems)
    // setNotificationEnabled(Notification.permission === 'granted')
  }, [])

  // const requestNotificationPermission = async () => {
  //   const result = await Notification.requestPermission()
  //   setNotificationEnabled(Notification.permission === 'granted')

  //   const title = result !== 'granted'
  //     ? 'You have denied notification permission.'
  //     : 'You have granted notification permission.'
  //   const description = result !== 'granted'
  //     ? 'This will disable expiry date notification feature.'
  //     : 'The website will notify you when an item is reaching its expiry date.'

  //   toast({ title, description })
  // }

  const enableNotification: React.MouseEventHandler<HTMLButtonElement> = async () => {
    // await requestNotificationPermission()
    toast({
      title: 'Notification is not supported',
    })
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (text.length === 0) return

    insertItem({ text, category, days })
      .then(() => fetchItems(setItems))

    setDays(3)
    setText('')
    setCategory('beef')
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="wmf-ui-theme">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
        <div className="flex h-14 items-center px-4">
          <div className="flex gap-2 mr-4">
            <PurgeDatabaseButton setItems={setItems} />
            <UploadDatabaseButton uploading={uploading} setUploading={setUploading} />
            <DownloadDatabaseButton
              downloading={downloading}
              setDownloading={setDownloading}
              onDownloaded={() => fetchItems(setItems)}
            />
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={enableNotification}
              className={notificationEnabled ? 'bg-success text-success-foreground' : ''}
            >
              <BellDot />
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="container py-6 mx-auto w-full min-w-0 max-w-3xl">

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 flex-wrap px-2 lg:px-0">
            <div>
              <CategorySelector category={category} onCategoryChanged={setCategory} />
            </div>
            <DaysSelector days={days} onDaysChanged={setDays} />
            <Input type="text" placeholder="stuff I'm putting into my fridge" onChange={(e) => setText(e.target.value)} value={text} />
          </div>
        </form>

        <div className="flex px-2 lg:px-0 mt-1 justify-end">
          <span className="text-xs text-muted-foreground">Press Enter to submit</span>
        </div>

        <div className="px-2 lg:px-0 mt-6">
          <Table>
            <TableCaption>Check your refrigerator.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Category</TableHead>
                <TableHead></TableHead>
                <TableHead className="w-[150px]">Expire in</TableHead>
                <TableHead className="w-0"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {
                  items.map((t, i) => {
                    const CategoryComponent = Categories.find(cat => cat.name === t.category)?.component ?? CircleHelp
                    return (
                      <TableRow key={i}>
                        <TableCell className="font-medium"><CategoryComponent /></TableCell>
                        <TableCell>{t.title}</TableCell>
                        <TableCell>{Math.round(DateTime.fromSeconds(t.expiry_date).diffNow('days').days)} days</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              deleteItem({ id: t.id })
                              .then(() => fetchItems(setItems))
                            }}
                          >
                            <Trash />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                }
            </TableBody>
          </Table>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
