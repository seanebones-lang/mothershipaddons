# ELCA Blockbusters - Mobile App API Reference

**REST API endpoints for mobile app integration**

---

## Base URLs

### Local Development
```
http://localhost:8000
```

### Production
```
https://elca-blockbusters-api.onrender.com
```

---

## API Endpoints for Mobile App

### 1. Pastoral Agent API (Sermon Generation)

**Create Sermon Task**
```http
POST /api/tasks
Content-Type: application/json

{
  "agent_id": "pastoral_agent_id",
  "user_id": "mobile_user_123",
  "input_data": {
    "type": "sermon",
    "topic": "God's Unconditional Love",
    "scripture": "John 3:16",
    "length": "short"
  }
}

Response: Task object with generated sermon in output_data
```

**Get Sermon Agent**
```http
GET /api/agents?agent_type=pastoral_care
Response: Array of pastoral agents
```

---

### 2. Youth Engagement API (Social Media)

**Create Social Media Task**
```http
POST /api/tasks
Content-Type: application/json

{
  "agent_id": "youth_agent_id",
  "input_data": {
    "type": "social_media",
    "platform": "instagram",
    "topic": "Faith in daily life"
  }
}

Response: Generated social media content
```

**Create Youth Journey**
```http
POST /api/tasks
Content-Type: application/json

{
  "agent_id": "youth_agent_id",
  "input_data": {
    "type": "youth_journey",
    "age_group": "teens",
    "theme": "Identity and belonging"
  }
}
```

---

### 3. Mission Coordination API (Volunteer Deployment)

**Create Volunteer Deployment Plan**
```http
POST /api/tasks
Content-Type: application/json

{
  "agent_id": "mission_agent_id",
  "input_data": {
    "type": "volunteer_deployment",
    "mission": "Community food pantry",
    "volunteer_count": 10
  }
}

Response: Volunteer deployment plan
```

**Find Mission Opportunities**
```http
POST /api/tasks
Content-Type: application/json

{
  "agent_id": "mission_agent_id",
  "input_data": {
    "type": "mission_opportunity",
    "focus_area": "local_community",
    "duration": "ongoing"
  }
}
```

---

## Supporting APIs (For Mobile App Features)

### 4. Get All Agents
```http
GET /api/agents

Response: [
  {
    "id": "agent_id_1",
    "name": "Pastoral Agent",
    "agent_type": "pastoral_care",
    "capabilities": {...},
    "status": "active"
  },
  ...
]
```

### 5. Get Specific Agent
```http
GET /api/agents/{agent_id}

Response: Single agent object
```

### 6. Get Recent Tasks (History)
```http
GET /api/tasks/recent?limit=20

Response: Array of recent tasks with generated content
```

### 7. Get ELCA Values
```http
GET /api/ontology/values

Response: [
  {
    "id": "value_id",
    "name": "Radical Hospitality",
    "description": "Welcome all people...",
    "created_at": "..."
  },
  ...
]
```

### 8. Get ELCA Beliefs
```http
GET /api/ontology/beliefs

Response: Array of 8 ELCA operational beliefs
```

### 9. Health Check
```http
GET /health

Response: {"status":"healthy","service":"elca-blockbusters"}
```

### 10. Readiness Check
```http
GET /ready

Response: {
  "status": "ready",
  "service": "elca-blockbusters",
  "ai_providers": {...}
}
```

### 11. AI Provider Status
```http
GET /api/ai/status

Response: {
  "providers": {...},
  "usage": {...},
  "available_providers": [...]
}
```

---

## Mobile App Integration Example (React Native)

```typescript
// api.ts
const API_BASE_URL = 'https://elca-blockbusters-api.onrender.com';

export const elcaAPI = {
  // Get all agents
  async getAgents() {
    const response = await fetch(`${API_BASE_URL}/api/agents`);
    return response.json();
  },
  
  // Generate sermon
  async generateSermon(agentId: string, topic: string, scripture: string) {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: agentId,
        input_data: {
          type: 'sermon',
          topic,
          scripture,
          length: 'short'
        }
      })
    });
    return response.json();
  },
  
  // Generate social media content
  async generateSocial(agentId: string, platform: string, topic: string) {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: agentId,
        input_data: {
          type: 'social_media',
          platform,
          topic
        }
      })
    });
    return response.json();
  },
  
  // Deploy volunteers
  async deployVolunteers(agentId: string, mission: string, count: number) {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: agentId,
        input_data: {
          type: 'volunteer_deployment',
          mission,
          volunteer_count: count
        }
      })
    });
    return response.json();
  },
  
  // Get ELCA values
  async getValues() {
    const response = await fetch(`${API_BASE_URL}/api/ontology/values`);
    return response.json();
  }
};
```

---

## Flutter/Dart Example

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ElcaAPI {
  static const baseUrl = 'https://elca-blockbusters-api.onrender.com';
  
  Future<List<dynamic>> getAgents() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/agents')
    );
    return json.decode(response.body);
  }
  
  Future<Map<String, dynamic>> generateSermon({
    required String agentId,
    required String topic,
    String? scripture,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/tasks'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'agent_id': agentId,
        'input_data': {
          'type': 'sermon',
          'topic': topic,
          'scripture': scripture ?? '',
          'length': 'short'
        }
      })
    );
    return json.decode(response.body);
  }
}
```

---

## CORS Configuration

The backend already has CORS enabled for mobile apps:

```python
# In backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows mobile apps
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Your mobile app can call these APIs directly!**

---

## What About Your Other 8 APIs?

**Please tell me:**
1. What's the other project/page with 8 APIs?
2. What are those APIs for?
3. Where is that code located?

**I can:**
- Extract those API endpoints
- Document them for mobile
- Combine all 11 APIs into one mobile SDK
- Create a unified authentication layer

**Let me know the location of your other project and I'll integrate it!**

---

## Quick Start for Mobile

1. **Get API keys** (see links above)
2. **Add to backend** (.env or Render)
3. **Use endpoints** from this doc in your mobile app
4. **No authentication needed** for MVP (add later)

**All 3 ELCA agent APIs are ready for mobile integration right now!**

