import React from 'react'
import { getDatabaseFileHandle } from '@/lib/database'
import {
  AlertDialog,
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
import { CloudUpload, LoaderCircle } from 'lucide-react'

interface UploadDatabaseButtonProps {
  uploading: boolean
  setUploading: (uploading: boolean) => void
}

export const UploadDatabaseButton: React.FC<UploadDatabaseButtonProps> = ({ uploading, setUploading }) => {
  const [uploadToken, setUploadToken] = React.useState('')

  return (
    <AlertDialog open={uploadToken !== ''}>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          onClick={async () => {
            if (uploading) return

            setUploading(true)

            const fileHandle = await getDatabaseFileHandle()
            const file = await fileHandle?.getFile()
            if (!file) {
              // TODO: handle error
              setUploading(false)
              return
            }

            const result = await fetch('/upload', {
              method: 'POST',
              body: file,
            })

            if (!result.ok) {
              // TODO: handle error
            } else {
              const response = (await result.json()) as { token: string }
              setUploadToken(response.token)
            }

            setUploading(false)
          }}
        >
          {uploading ? <LoaderCircle /> : <CloudUpload />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Uploading...</AlertDialogTitle>
          <AlertDialogDescription>
            <ol className="list-decimal pl-5">
              <li>Open your destination's browser</li>
              <li>Click download button</li>
              <li>
                <div className="flex flex-col gap-1">
                  Fill the OTP below
                  <InputOTP maxLength={5} value={uploadToken} disabled={true}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </li>
            </ol>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              // TODO: handle cancel on remote
              setUploadToken('')
            }}
          >Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}