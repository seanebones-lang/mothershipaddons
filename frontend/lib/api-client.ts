/**
 * API client for ELCA Blockbusters backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Agent {
  id: string
  name: string
  agent_type: string
  capabilities: Record<string, any>
  status: 'active' | 'inactive' | 'busy' | 'error'
  last_heartbeat: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string | null
  agent_id: string
  input_data: Record<string, any>
  output_data: Record<string, any> | null
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
  error_message: string | null
  created_at: string
  completed_at: string | null
}

export interface Value {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface Belief {
  id: string
  name: string
  description: string
  related_values: string[]
  created_at: string
  updated_at: string
}

class APIClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Agent endpoints
  async getAgents(): Promise<Agent[]> {
    return this.request<Agent[]>('/api/agents')
  }

  async getAgent(id: string): Promise<Agent> {
    return this.request<Agent>(`/api/agents/${id}`)
  }

  // Task endpoints
  async createTask(taskData: {
    user_id?: string
    agent_id: string
    input_data: Record<string, any>
  }): Promise<Task> {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  }

  async getRecentTasks(limit: number = 10): Promise<Task[]> {
    return this.request<Task[]>(`/api/tasks/recent?limit=${limit}`)
  }

  // Ontology endpoints
  async getValues(): Promise<Value[]> {
    return this.request<Value[]>('/api/ontology/values')
  }

  async getBeliefs(): Promise<Belief[]> {
    return this.request<Belief[]>('/api/ontology/beliefs')
  }

  async getOntologySummary(): Promise<{
    total_values: number
    total_beliefs: number
  }> {
    return this.request('/api/ontology/summary')
  }

  // AI status
  async getAIStatus(): Promise<{
    providers: Record<string, string>
    usage: Record<string, any>
    available_providers: string[]
  }> {
    return this.request('/api/ai/status')
  }

  // Health checks
  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request('/health')
  }

  async readinessCheck(): Promise<{
    status: string
    service: string
    ai_providers?: Record<string, string>
  }> {
    return this.request('/ready')
  }
}

export const apiClient = new APIClient()