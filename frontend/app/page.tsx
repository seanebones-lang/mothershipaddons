'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Zap, 
  HandHeart, 
  Activity, 
  CheckCircle, 
  Users,
  Brain,
  Shield,
  Heart,
  Globe
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { SermonGenerator } from '@/components/sermon_generator'
import { GenZDashboard } from '@/components/genz_dashboard'
import { MiraclesDashboard } from '@/components/miracles_dashboard'

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(true)
  const [selectedTab, setSelectedTab] = useState('pastor')

  // Fetch agents
  const { data: agents = [], isLoading: agentsLoading, error: agentsError } = useQuery({
    queryKey: ['agents'],
    queryFn: () => apiClient.getAgents(),
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
    retryDelay: 1000,
  })

  // Fetch recent tasks
  const { data: recentTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', 'recent'],
    queryFn: () => apiClient.getRecentTasks(10),
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: 2,
    retryDelay: 1000,
  })

  // Fetch ontology summary
  const { data: ontologySummary } = useQuery({
    queryKey: ['ontology', 'summary'],
    queryFn: () => apiClient.getOntologySummary(),
    refetchInterval: 60000, // Refetch every minute
    retry: 2,
  })

  // Check API health
  const { data: healthStatus, isSuccess, isError } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.readinessCheck(),
    refetchInterval: 30000,
    retry: 3,
    retryDelay: 1000,
  })

  // Update connection status based on query state
  useEffect(() => {
    if (isSuccess) {
      setIsConnected(true)
    } else if (isError) {
      setIsConnected(false)
    }
  }, [isSuccess, isError])

  const activeAgents = agents.filter(agent => agent.status === 'active')
  const completedTasks = recentTasks.filter(task => task.status === 'completed')
  const failedTasks = recentTasks.filter(task => task.status === 'failed')

  // Find specific agents
  const pastoralAgent = agents.find(agent => agent.agent_type === 'pastoral_care')
  const youthAgent = agents.find(agent => agent.agent_type === 'youth_engagement')
  const missionAgent = agents.find(agent => agent.agent_type === 'mission_coordination')

  // Debug logging
  useEffect(() => {
    console.log('Agents loaded:', agents)
    console.log('Pastoral agent:', pastoralAgent)
    console.log('Youth agent:', youthAgent)
    console.log('Mission agent:', missionAgent)
    console.log('Agents error:', agentsError)
  }, [agents, pastoralAgent, youthAgent, missionAgent, agentsError])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold gradient-text">
              ELCA AI Platform
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enterprise AI solutions designed for ELCA congregations with radical hospitality, 
            grace-centered faith, and justice advocacy at the core
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected & Ready' : 'Connecting...'}
              </span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Shield className="h-3 w-3 mr-1" />
              ELCA 2025 AI Guidelines Compliant
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-hover border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{activeAgents.length}</div>
              <p className="text-xs text-muted-foreground">
                {agents.length} total ministry agents
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{completedTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {recentTasks.length} total requests processed
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">
                {recentTasks.length > 0 
                  ? Math.round((completedTasks.length / recentTasks.length) * 100)
                  : 100}%
              </div>
              <p className="text-xs text-muted-foreground">
                ELCA-compliant generation rate
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ELCA Values</CardTitle>
              <Heart className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">
                {ontologySummary?.total_values || 8}
              </div>
              <p className="text-xs text-muted-foreground">
                {ontologySummary?.total_beliefs || 8} guiding beliefs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ELCA Compliance Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            <strong>ELCA 2025 AI Guidelines:</strong> All content generated by these agents is validated against 
            ELCA values including Radical Hospitality, Grace-Centered Faith, Justice & Advocacy, and Human Dignity. 
            Content requires pastoral review before use in ministry contexts.
          </AlertDescription>
        </Alert>

        {/* Main Agent Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger 
              value="pastor" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
            >
              <BookOpen className="h-4 w-4" />
              AI Pastor
            </TabsTrigger>
            <TabsTrigger 
              value="genz" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
            >
              <Zap className="h-4 w-4" />
              Gen-Z Engine
            </TabsTrigger>
            <TabsTrigger 
              value="miracles" 
              className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
            >
              <HandHeart className="h-4 w-4" />
              Miracle Finder
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pastor" className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              {pastoralAgent ? (
                <SermonGenerator agentId={pastoralAgent.id} />
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Pastoral Agent is initializing...</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="genz" className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
              {youthAgent ? (
                <GenZDashboard agentId={youthAgent.id} />
              ) : (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Youth Engagement Agent is initializing...</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="miracles" className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
              {missionAgent ? (
                <MiraclesDashboard agentId={missionAgent.id} />
              ) : (
                <div className="text-center py-12">
                  <HandHeart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Mission Coordination Agent is initializing...</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* ELCA Values Footer */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Heart className="h-5 w-5" />
              ELCA Values Integration
            </CardTitle>
            <CardDescription>
              How our AI agents embody ELCA principles in every interaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <h4 className="font-semibold text-red-700">Radical Hospitality</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Welcoming all people with open hearts and inclusive language
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <h4 className="font-semibold text-blue-700">Grace-Centered Faith</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Grounding all responses in God's unconditional love and forgiveness
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-500" />
                  <h4 className="font-semibold text-green-700">Justice & Advocacy</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Amplifying marginalized voices and promoting equity in all content
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <h4 className="font-semibold text-purple-700">Human Dignity</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Respecting inherent worth while supporting human discernment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>
                ELCA AI Platform • Enterprise Solutions for Lutheran Congregations
              </p>
              <p>
                Powered by advanced AI technology with ELCA 2025 AI Guidelines compliance
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <Badge variant="outline">Enterprise Ready</Badge>
                <Badge variant="outline">ELCA Compliant</Badge>
                <Badge variant="outline">Multi-Provider AI</Badge>
              </div>
            </div>
      </div>
    </div>
  )
}
