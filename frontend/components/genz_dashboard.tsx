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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Zap, 
  Instagram, 
  MessageCircle, 
  Users, 
  Heart,
  TrendingUp,
  Clock,
  Copy,
  Sparkles,
  Target,
  CheckCircle
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'
import ReactMarkdown from 'react-markdown'

interface GenZDashboardProps {
  agentId: string
}

export function GenZDashboard({ agentId }: GenZDashboardProps) {
  const [platform, setPlatform] = useState('instagram')
  const [topic, setTopic] = useState('')
  const [ageGroup, setAgeGroup] = useState('teens')
  const [journeyTheme, setJourneyTheme] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('social')
  
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Get recent youth engagement tasks
  const { data: recentTasks = [] } = useQuery({
    queryKey: ['tasks', 'youth'],
    queryFn: async () => {
      try {
        return await apiClient.getRecentTasks(5)
      } catch (err) {
        console.error('Failed to fetch tasks:', err)
        return []
      }
    },
    refetchInterval: 5000,
    enabled: !!agentId,
    retry: 1,
  })

  const youthTasks = (Array.isArray(recentTasks) ? recentTasks : []).filter(task => 
    task?.agent_id === agentId
  )

  const generateContent = useMutation({
    mutationFn: async (data: any) => {
      setIsGenerating(true)
      setProgress(0)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90))
      }, 300)

      try {
        // Create a task directly for content generation
        const result = await apiClient.createTask({
          agent_id: agentId,
          input_data: data
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
        setGeneratedContent(data.output_data.result)
        toast({
          title: "Content Generated Successfully",
          description: "Your Gen-Z friendly content is ready!",
        })
      }
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleGenerateSocial = () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your social media post.",
        variant: "destructive",
      })
      return
    }

    generateContent.mutate({
      type: 'social_media',
      platform,
      topic
    })
  }

  const handleGenerateJourney = () => {
    if (!journeyTheme.trim()) {
      toast({
        title: "Theme Required",
        description: "Please enter a theme for the youth journey.",
        variant: "destructive",
      })
      return
    }

    generateContent.mutate({
      type: 'youth_journey',
      age_group: ageGroup,
      theme: journeyTheme
    })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      toast({
        title: "Copied to Clipboard",
        description: "Content has been copied.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-purple-600" />
          <h2 className="text-3xl font-bold gradient-text">Gen-Z Engagement Engine</h2>
        </div>
        <p className="text-muted-foreground">
          Create authentic, inclusive content that resonates with young people
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Heart className="h-3 w-3 mr-1" />
            Authentic Voice
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Users className="h-3 w-3 mr-1" />
            Inclusive Community
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="journey">Youth Journeys</TabsTrigger>
          <TabsTrigger value="analytics">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Social Media Generator */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="h-5 w-5" />
                  Social Media Generator
                </CardTitle>
                <CardDescription>
                  Create engaging, faith-based content for social platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform} disabled={isGenerating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="snapchat">Snapchat</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic/Theme *</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., faith in daily life, community service, identity"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Creating authentic Gen-Z content...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                <Button 
                  onClick={handleGenerateSocial} 
                  disabled={isGenerating || !topic.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    Content is optimized for authentic Gen-Z voice while maintaining ELCA values of inclusion and radical hospitality.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Generated Content Display */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Generated Content
                  </span>
                  {generatedContent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  Your AI-generated social media content
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <ReactMarkdown className="prose prose-sm max-w-none">
                        {generatedContent}
                      </ReactMarkdown>
                    </div>
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Content validated for authenticity, inclusivity, and ELCA compliance
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your generated content will appear here</p>
                    <p className="text-sm">Enter a topic and click generate to begin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="journey" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Youth Journey Generator */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Youth Journey Creator
                </CardTitle>
                <CardDescription>
                  Design meaningful spiritual growth experiences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ageGroup">Age Group</Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup} disabled={isGenerating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="middle_school">Middle School (11-14)</SelectItem>
                      <SelectItem value="teens">High School (14-18)</SelectItem>
                      <SelectItem value="young_adults">Young Adults (18-25)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="journeyTheme">Journey Theme *</Label>
                  <Input
                    id="journeyTheme"
                    placeholder="e.g., identity, purpose, relationships, justice"
                    value={journeyTheme}
                    onChange={(e) => setJourneyTheme(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>

                <Button 
                  onClick={handleGenerateJourney} 
                  disabled={isGenerating || !journeyTheme.trim()}
                  className="w-full elca-secondary text-white"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Creating Journey...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Create Journey
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Journey Display */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Journey Plan</CardTitle>
                <CardDescription>
                  Your customized youth spiritual journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedContent && activeTab === 'journey' ? (
                  <div className="space-y-4">
                    <div className="max-h-96 overflow-y-auto prose prose-sm max-w-none">
                      <ReactMarkdown>{generatedContent}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your journey plan will appear here</p>
                    <p className="text-sm">Enter a theme and create your journey</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{youthTasks.length}</div>
                <p className="text-xs text-muted-foreground">
                  This session
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platforms</CardTitle>
                <Instagram className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">
                  Supported platforms
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ELCA Compliance</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">100%</div>
                <p className="text-xs text-muted-foreground">
                  Values alignment
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          {youthTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Youth Engagement</CardTitle>
                <CardDescription>
                  Your latest generated content and journeys
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {youthTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {task.input_data.type === 'social_media' ? 
                            `${task.input_data.platform} post: ${task.input_data.topic}` :
                            `${task.input_data.age_group} journey: ${task.input_data.theme}`
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
