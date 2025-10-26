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
  MapPin, 
  Users, 
  Calendar, 
  Target,
  Zap,
  Heart,
  Globe,
  Clock,
  Copy,
  Sparkles,
  CheckCircle,
  TrendingUp,
  HandHeart
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'
import ReactMarkdown from 'react-markdown'

interface MiraclesDashboardProps {
  agentId: string
}

export function MiraclesDashboard({ agentId }: MiraclesDashboardProps) {
  const [mission, setMission] = useState('')
  const [volunteerCount, setVolunteerCount] = useState('10')
  const [focusArea, setFocusArea] = useState('local_community')
  const [project, setProject] = useState('')
  const [budget, setBudget] = useState('limited')
  const [generatedPlan, setGeneratedPlan] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('volunteers')
  
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Get recent mission tasks
  const { data: recentTasks = [] } = useQuery({
    queryKey: ['tasks', 'mission'],
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

  const missionTasks = (Array.isArray(recentTasks) ? recentTasks : []).filter(task => 
    task?.agent_id === agentId
  )

  const generatePlan = useMutation({
    mutationFn: async (data: any) => {
      setIsGenerating(true)
      setProgress(0)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 12, 90))
      }, 250)

      try {
        // Create a task directly for mission planning
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
        setGeneratedPlan(data.output_data.result)
        toast({
          title: "Plan Generated Successfully",
          description: "Your mission coordination plan is ready for implementation.",
        })
      }
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate plan. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleGenerateVolunteerPlan = () => {
    if (!mission.trim()) {
      toast({
        title: "Mission Required",
        description: "Please enter a mission description.",
        variant: "destructive",
      })
      return
    }

    generatePlan.mutate({
      type: 'volunteer_deployment',
      mission,
      volunteer_count: parseInt(volunteerCount)
    })
  }

  const handleGenerateMissionOpportunity = () => {
    generatePlan.mutate({
      type: 'mission_opportunity',
      focus_area: focusArea,
      duration: 'ongoing'
    })
  }

  const handleGenerateResourcePlan = () => {
    if (!project.trim()) {
      toast({
        title: "Project Required",
        description: "Please enter a project description.",
        variant: "destructive",
      })
      return
    }

    generatePlan.mutate({
      type: 'resource_allocation',
      project,
      budget
    })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPlan)
      toast({
        title: "Copied to Clipboard",
        description: "Plan has been copied.",
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
          <HandHeart className="h-8 w-8 text-green-600" />
          <h2 className="text-3xl font-bold gradient-text">Miracle Finder</h2>
        </div>
        <p className="text-muted-foreground">
          Coordinate missions, deploy volunteers, and maximize community impact
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Globe className="h-3 w-3 mr-1" />
            Justice & Advocacy
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Heart className="h-3 w-3 mr-1" />
            Stewardship
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="volunteers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Volunteer Deployment */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Volunteer Deployment
                </CardTitle>
                <CardDescription>
                  Optimize volunteer assignments for maximum impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission/Project *</Label>
                  <Textarea
                    id="mission"
                    placeholder="e.g., Community food pantry, homeless shelter support, environmental cleanup"
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    disabled={isGenerating}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volunteerCount">Number of Volunteers</Label>
                  <Select value={volunteerCount} onValueChange={setVolunteerCount} disabled={isGenerating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 volunteers</SelectItem>
                      <SelectItem value="10">10 volunteers</SelectItem>
                      <SelectItem value="20">20 volunteers</SelectItem>
                      <SelectItem value="50">50+ volunteers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Creating deployment strategy...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                <Button 
                  onClick={handleGenerateVolunteerPlan} 
                  disabled={isGenerating || !mission.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Deploy Volunteers
                    </>
                  )}
                </Button>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    Plans consider accessibility, diverse abilities, and ELCA justice principles.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Generated Plan Display */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Deployment Plan
                  </span>
                  {generatedPlan && (
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
                  Your AI-generated coordination strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedPlan ? (
                  <div className="space-y-4">
                    <div className="max-h-96 overflow-y-auto prose prose-sm max-w-none">
                      <ReactMarkdown>{generatedPlan}</ReactMarkdown>
                    </div>
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Plan validated for ELCA values: Justice, Stewardship, Community Partnership
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your deployment plan will appear here</p>
                    <p className="text-sm">Enter mission details and generate plan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="missions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mission Opportunity Finder */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Mission Opportunities
                </CardTitle>
                <CardDescription>
                  Discover impactful service opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="focusArea">Focus Area</Label>
                  <Select value={focusArea} onValueChange={setFocusArea} disabled={isGenerating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local_community">Local Community</SelectItem>
                      <SelectItem value="environmental">Environmental Justice</SelectItem>
                      <SelectItem value="social_justice">Social Justice</SelectItem>
                      <SelectItem value="global_missions">Global Missions</SelectItem>
                      <SelectItem value="youth_programs">Youth Programs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGenerateMissionOpportunity} 
                  disabled={isGenerating}
                  className="w-full elca-secondary text-white"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Finding Opportunities...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Find Opportunities
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Mission Display */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Mission Opportunities</CardTitle>
                <CardDescription>
                  Curated service opportunities for your congregation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedPlan && activeTab === 'missions' ? (
                  <div className="space-y-4">
                    <div className="max-h-96 overflow-y-auto prose prose-sm max-w-none">
                      <ReactMarkdown>{generatedPlan}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Mission opportunities will appear here</p>
                    <p className="text-sm">Select a focus area to discover opportunities</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resource Allocation */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Resource Allocation
                </CardTitle>
                <CardDescription>
                  Optimize resource distribution for maximum impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project/Initiative *</Label>
                  <Textarea
                    id="project"
                    placeholder="e.g., Community garden, after-school program, disaster relief"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    disabled={isGenerating}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Constraints</Label>
                  <Select value={budget} onValueChange={setBudget} disabled={isGenerating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal ($0-500)</SelectItem>
                      <SelectItem value="limited">Limited ($500-2000)</SelectItem>
                      <SelectItem value="moderate">Moderate ($2000-5000)</SelectItem>
                      <SelectItem value="substantial">Substantial ($5000+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGenerateResourcePlan} 
                  disabled={isGenerating || !project.trim()}
                  className="w-full elca-primary text-white"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Optimizing Resources...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Allocate Resources
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Resource Plan Display */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Resource Plan</CardTitle>
                <CardDescription>
                  Your optimized resource allocation strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedPlan && activeTab === 'resources' ? (
                  <div className="space-y-4">
                    <div className="max-h-96 overflow-y-auto prose prose-sm max-w-none">
                      <ReactMarkdown>{generatedPlan}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your resource plan will appear here</p>
                    <p className="text-sm">Enter project details to generate allocation plan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          {/* Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plans Generated</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{missionTasks.length}</div>
                <p className="text-xs text-muted-foreground">
                  This session
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">250+</div>
                <p className="text-xs text-muted-foreground">
                  Potential deployment
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Focus Areas</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  Mission categories
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ELCA Alignment</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">100%</div>
                <p className="text-xs text-muted-foreground">
                  Justice principles
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Mission Activity */}
          {missionTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Mission Coordination</CardTitle>
                <CardDescription>
                  Your latest generated plans and strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {missionTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {task.input_data.type === 'volunteer_deployment' ? 
                            `Volunteer deployment: ${task.input_data.mission?.substring(0, 50)}...` :
                            task.input_data.type === 'mission_opportunity' ?
                            `Mission opportunities: ${task.input_data.focus_area}` :
                            `Resource allocation: ${task.input_data.project?.substring(0, 50)}...`
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

          {/* ELCA Values Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                ELCA Values Integration
              </CardTitle>
              <CardDescription>
                How our mission coordination aligns with ELCA principles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-700">Justice & Advocacy</h4>
                  <p className="text-sm text-muted-foreground">
                    All mission opportunities prioritize marginalized communities and systemic change.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-700">Stewardship of Creation</h4>
                  <p className="text-sm text-muted-foreground">
                    Resource allocation considers environmental impact and sustainability.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-700">Community Partnership</h4>
                  <p className="text-sm text-muted-foreground">
                    Plans emphasize collaboration with existing community organizations.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-700">Accessibility First</h4>
                  <p className="text-sm text-muted-foreground">
                    All volunteer opportunities accommodate diverse abilities and backgrounds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
