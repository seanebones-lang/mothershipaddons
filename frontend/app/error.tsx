'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <CardTitle className="text-red-600">Something Went Wrong</CardTitle>
          </div>
          <CardDescription>
            An unexpected error occurred in the ELCA Blockbusters application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-mono">
              {error.message || 'Unknown error'}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This error has been logged. You can try the following:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Refresh the page</li>
              <li>Clear your browser cache</li>
              <li>Check your internet connection</li>
              <li>Verify the backend is running on port 8000</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={reset}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

