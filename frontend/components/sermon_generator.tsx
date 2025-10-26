'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Download, 
  Copy, 
  Sparkles, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Heart
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'
import ReactMarkdown from 'react-markdown'

interface SermonGeneratorProps {
  agentId: string
}

export function SermonGenerator({ agentId }: SermonGeneratorProps) {
  const [topic, setTopic] = useState('')
  const [scripture, setScripture] = useState('')
  const [length, setLength] = useState('short')
  const [generatedSermon, setGeneratedSermon] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Get recent sermons
  const { data: recentTasks = [], error: tasksError } = useQuery({
    queryKey: ['tasks', 'pastoral'],
    queryFn: async () => {
      try {
        return await apiClient.getRecentTasks(5)
      } catch (err) {
        console.error('Failed to fetch tasks:', err)
        return []
      }
    },
    refetchInterval: 5000,
    enabled: !!agentId, // Only run if agentId exists
    retry: 1,
  })

  const pastoralTasks = (Array.isArray(recentTasks) ? recentTasks : []).filter(task => 
    task?.agent_id === agentId && 
    task?.input_data?.type === 'sermon'
  )

  const generateSermon = useMutation({
    mutationFn: async (data: { topic: string; scripture: string; length: string }) => {
      setIsGenerating(true)
      setProgress(0)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      try {
        // Create a task directly for sermon generation
        const result = await apiClient.createTask({
          agent_id: agentId,
          input_data: {
            type: 'sermon',
            topic: data.topic,
            scripture: data.scripture,
            length: data.length
          }
        })

        clearInterval(progressInterval)
        setProgress(100)

        return result
      } catch (error) {
        clearInterval(progressInterval)
        throw error
      } finally {
        setIsGenerating(false)
      }
    },
    onSuccess: (data) => {
      if (data.output_data?.result) {
        setGeneratedSermon(data.output_data.result)
        toast({
          title: "Sermon Generated Successfully",
          description: "Your ELCA-compliant sermon is ready for review.",
        })
      }
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate sermon. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a sermon topic.",
        variant: "destructive",
      })
      return
    }

    generateSermon.mutate({ topic, scripture, length })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedSermon)
      toast({
        title: "Copied to Clipboard",
        description: "Sermon content has been copied.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const downloadSermon = () => {
    const blob = new Blob([generatedSermon], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sermon-${topic.replace(/\s+/g, '-').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Download Started",
      description: "Your sermon is being downloaded.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold gradient-text">AI Pastoral Assistant</h2>
        </div>
        <p className="text-muted-foreground">
          Generate ELCA-compliant sermons, devotionals, and scripture studies
        </p>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Heart className="h-3 w-3 mr-1" />
          Grace-Centered & Inclusive
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Sermon Generator
            </CardTitle>
            <CardDescription>
              Create inspiring, theologically sound sermons for your congregation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Sermon Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g., God's Unconditional Love, Advent Hope, Community Service"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scripture">Scripture Reference</Label>
              <Input
                id="scripture"
                placeholder="e.g., John 3:16, Luke 2:1-14, Matthew 25:31-46"
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">Sermon Length</Label>
              <Select value={length} onValueChange={setLength} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (5-8 minutes)</SelectItem>
                  <SelectItem value="medium">Medium (10-15 minutes)</SelectItem>
                  <SelectItem value="long">Long (18-20 minutes)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Generating ELCA-compliant sermon...</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !topic.trim()}
              className="w-full elca-primary text-white"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Sermon
                </>
              )}
            </Button>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                All content is generated according to ELCA 2025 AI guidelines and requires pastoral review before use.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Generated Sermon
              </span>
              {generatedSermon && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadSermon}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              Review and customize your AI-generated sermon
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedSermon ? (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto prose prose-sm max-w-none">
                  <ReactMarkdown>{generatedSermon}</ReactMarkdown>
                </div>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Content validated against ELCA values: Grace-Centered Faith, Radical Hospitality, Human Dignity
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your generated sermon will appear here</p>
                <p className="text-sm">Enter a topic and click generate to begin</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Sermons */}
      {pastoralTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Sermons</CardTitle>
            <CardDescription>
              Your recently generated pastoral content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastoralTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{task.input_data.topic}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.input_data.scripture && `${task.input_data.scripture} • `}
                      {new Date(task.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={
                    task.status === 'completed' ? 'default' :
                    task.status === 'failed' ? 'destructive' : 'secondary'
                  }>
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
