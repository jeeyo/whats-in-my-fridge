import React from 'react'
import { getDatabaseFileHandle, purgeDatabase } from '@/lib/database'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { CloudDownload, LoaderCircle } from 'lucide-react'

interface DownloadDatabaseButtonProps {
  downloading: boolean
  setDownloading: (uploading: boolean) => void
  onDownloaded: () => void
}

export const DownloadDatabaseButton: React.FC<DownloadDatabaseButtonProps> = ({ downloading, setDownloading, onDownloaded }) => {
  const [downloadToken, setDownloadToken] = React.useState('')

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="icon">
          {downloading ? <LoaderCircle /> : <CloudDownload />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Downloading...</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col items-center gap-2">
              <div>Fill the OTP</div>
              <div>
                <InputOTP maxLength={5} value={downloadToken} onChange={(token) => setDownloadToken(token)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              // TODO: handle cancel on remote
              setDownloadToken('')
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={downloadToken.length < 5 || downloading}
            onClick={async () => {
              if (downloadToken.length < 5) return
              if (downloading) return

              setDownloading(true)

              // TODO: multipart for big file?
              const result = await fetch(`/download/${downloadToken}`, {
                method: 'GET',
              })

              if (!result.ok) {
                // TODO: handle error
                setDownloadToken('')
                setDownloading(false)
                return
              }

              await purgeDatabase()

              const fileHandle = await getDatabaseFileHandle()
              const writable = await fileHandle.createWritable()

              const blob = await result.blob()
              await writable.write(blob)
              await writable.close()

              onDownloaded()

              setDownloadToken('')
              setDownloading(false)
            }}
          >
            Download
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
