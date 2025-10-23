"""
ELCA Blockbusters FastAPI Backend - 48 Hour MVP
Streamlined backend with 3 specialized agents and ELCA compliance.
"""

import os
import uuid
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import structlog

from shared.models import (
    get_db, init_db, Agent, Task, Value, Belief,
    AgentResponse, TaskCreate, TaskResponse, ValueResponse, BeliefResponse
)
from elca_ontology_manager import ELCAOntologyManager
from shared.elca_ai_providers import ELCAAIProviderManager

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Global services
ai_provider: Optional[ELCAAIProviderManager] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    global ai_provider
    
    # Startup
    logger.info("Starting ELCA Blockbusters application")
    
    # Initialize database
    await init_db()
    
    # Initialize AI provider
    ai_provider = ELCAAIProviderManager()
    
    # Initialize ELCA ontology
    async for db in get_db():
        ontology_manager = ELCAOntologyManager(db)
        try:
            # Check if ontology already exists
            result = await db.execute(select(func.count(Value.id)))
            value_count = result.scalar()
            
            if value_count == 0:
                await ontology_manager.initialize_elca_ontology()
                logger.info("ELCA ontology initialized")
            
            # Register the 3 agents
            await register_agents(db)
            
        except Exception as e:
            logger.error("Failed to initialize ontology", error=str(e))
        finally:
            break
    
    yield
    
    # Shutdown
    logger.info("Shutting down ELCA Blockbusters application")

async def register_agents(db: AsyncSession):
    """Register the 3 ELCA agents."""
    agents = [
        {
            "name": "Pastoral Agent",
            "agent_type": "pastoral_care",
            "capabilities": {
                "sermon_generation": True,
                "scripture_search": True,
                "devotional_creation": True,
                "liturgy_planning": True,
                "pastoral_counseling_support": True
            }
        },
        {
            "name": "Youth Engagement Agent",
            "agent_type": "youth_engagement",
            "capabilities": {
                "social_media_content": True,
                "youth_journey_creation": True,
                "genz_outreach": True,
                "event_planning": True,
                "peer_mentorship": True
            }
        },
        {
            "name": "Miracle Finder Agent",
            "agent_type": "mission_coordination",
            "capabilities": {
                "volunteer_deployment": True,
                "mission_coordination": True,
                "resource_allocation": True,
                "community_outreach": True,
                "administrative_automation": True
            }
        }
    ]
    
    for agent_data in agents:
        # Check if agent already exists
        result = await db.execute(
            select(Agent).where(Agent.name == agent_data["name"])
        )
        existing_agent = result.scalar_one_or_none()
        
        if not existing_agent:
            agent = Agent(
                name=agent_data["name"],
                agent_type=agent_data["agent_type"],
                capabilities=agent_data["capabilities"],
                status="active"
            )
            db.add(agent)
    
    await db.commit()
    logger.info("ELCA agents registered")

# Create FastAPI app
app = FastAPI(
    title="ELCA Blockbusters",
    description="AI-powered ministry tools for ELCA congregations",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "elca-blockbusters"}

@app.get("/ready")
async def readiness_check():
    """Readiness check endpoint."""
    try:
        # Check AI provider health
        if ai_provider:
            health_status = await ai_provider.health_check()
            return {
                "status": "ready", 
                "service": "elca-blockbusters",
                "ai_providers": health_status
            }
        return {"status": "ready", "service": "elca-blockbusters"}
    except Exception as e:
        logger.error("Readiness check failed", error=str(e))
        raise HTTPException(status_code=503, detail="Service not ready")

# Agent endpoints
@app.get("/api/agents", response_model=List[AgentResponse])
async def get_agents(db: AsyncSession = Depends(get_db)):
    """Get all registered agents."""
    try:
        result = await db.execute(select(Agent).order_by(Agent.created_at))
        agents = result.scalars().all()
        return agents
    except Exception as e:
        logger.error("Failed to get agents", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve agents")

@app.get("/api/agents/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific agent."""
    try:
        result = await db.execute(select(Agent).where(Agent.id == agent_id))
        agent = result.scalar_one_or_none()
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        return agent
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get agent", error=str(e), agent_id=agent_id)
        raise HTTPException(status_code=500, detail="Failed to retrieve agent")

# Task endpoints
@app.post("/api/tasks", response_model=TaskResponse)
async def create_task(task_data: TaskCreate, db: AsyncSession = Depends(get_db)):
    """Create a new task."""
    try:
        # Verify agent exists
        result = await db.execute(select(Agent).where(Agent.id == task_data.agent_id))
        agent = result.scalar_one_or_none()
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        # Create task
        task = Task(
            user_id=task_data.user_id,
            agent_id=task_data.agent_id,
            input_data=task_data.input_data,
            status="pending"
        )
        
        db.add(task)
        await db.commit()
        await db.refresh(task)
        
        # Process task asynchronously (for demo, we'll process immediately)
        await process_task(task, agent, db)
        
        return task
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to create task", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to create task")

async def process_task(task: Task, agent: Agent, db: AsyncSession):
    """Process a task with the appropriate agent."""
    try:
        # Update task status
        task.status = "in_progress"
        await db.commit()
        
        # Get ontology manager
        ontology_manager = ELCAOntologyManager(db)
        
        # Get relevant ELCA values and beliefs
        values, beliefs = await ontology_manager.get_relevant_values_and_beliefs(
            str(task.input_data), 
            agent.agent_type
        )
        
        # Process based on agent type
        if agent.agent_type == "pastoral_care":
            result = await process_pastoral_task(task, values, beliefs)
        elif agent.agent_type == "youth_engagement":
            result = await process_youth_task(task, values, beliefs)
        elif agent.agent_type == "mission_coordination":
            result = await process_mission_task(task, values, beliefs)
        else:
            raise ValueError(f"Unknown agent type: {agent.agent_type}")
        
        # Validate content against ELCA guidelines
        validation = await ontology_manager.validate_ai_content(
            str(result), 
            agent.agent_type
        )
        
        # Update task with results
        task.output_data = {
            "result": result,
            "elca_validation": validation,
            "values_considered": [{"name": v.name, "description": v.description} for v in values],
            "beliefs_considered": [{"name": b.name, "description": b.description} for b in beliefs]
        }
        task.status = "completed"
        
        await db.commit()
        
        logger.info("Task processed successfully", task_id=task.id, agent_type=agent.agent_type)
        
    except Exception as e:
        task.status = "failed"
        task.error_message = str(e)
        await db.commit()
        logger.error("Task processing failed", task_id=task.id, error=str(e))

async def process_pastoral_task(task: Task, values: List[Value], beliefs: List[Belief]) -> str:
    """Process pastoral care tasks."""
    input_data = task.input_data
    task_type = input_data.get("type", "general")
    
    if task_type == "sermon":
        return await generate_sermon(input_data, values, beliefs)
    elif task_type == "devotional":
        return await generate_devotional(input_data, values, beliefs)
    elif task_type == "scripture_study":
        return await generate_scripture_study(input_data, values, beliefs)
    else:
        return await generate_pastoral_response(input_data, values, beliefs)

async def process_youth_task(task: Task, values: List[Value], beliefs: List[Belief]) -> str:
    """Process youth engagement tasks."""
    input_data = task.input_data
    task_type = input_data.get("type", "general")
    
    if task_type == "social_media":
        return await generate_social_content(input_data, values, beliefs)
    elif task_type == "youth_journey":
        return await generate_youth_journey(input_data, values, beliefs)
    elif task_type == "event_planning":
        return await generate_event_plan(input_data, values, beliefs)
    else:
        return await generate_youth_response(input_data, values, beliefs)

async def process_mission_task(task: Task, values: List[Value], beliefs: List[Belief]) -> str:
    """Process mission coordination tasks."""
    input_data = task.input_data
    task_type = input_data.get("type", "general")
    
    if task_type == "volunteer_deployment":
        return await generate_volunteer_plan(input_data, values, beliefs)
    elif task_type == "mission_opportunity":
        return await generate_mission_opportunity(input_data, values, beliefs)
    elif task_type == "resource_allocation":
        return await generate_resource_plan(input_data, values, beliefs)
    else:
        return await generate_mission_response(input_data, values, beliefs)

# Pastoral agent functions
async def generate_sermon(input_data: Dict[str, Any], values: List[Value], beliefs: List[Belief]) -> str:
    """Generate ELCA-compliant sermon."""
    topic = input_data.get("topic", "God's Grace")
    scripture = input_data.get("scripture", "")
    length = input_data.get("length", "short")
    
    values_context = "\n".join([f"- {v.name}: {v.description}" for v in values[:3]])
    
    prompt = f"""
    Generate a {length} sermon for an ELCA congregation on the topic: {topic}
    Scripture reference: {scripture}
    
    ELCA Values to incorporate:
    {values_context}
    
    Requirements:
    - Ground the message in grace and Gospel
    - Use inclusive language
    - Make scripture accessible and relevant
    - Include a clear call to action
    - Maintain Lutheran theological perspective
    - Be authentic and pastoral in tone
    
    Structure: Opening, Scripture Context, Main Message, Application, Closing Prayer
    """
    
    return await ai_provider.generate_text(prompt, "sermon_generation", max_tokens=1500)

async def generate_devotional(input_data: Dict[str, Any], values: List[Value], beliefs: List[Belief]) -> str:
    """Generate ELCA-compliant devotional."""
    theme = input_data.get("theme", "Daily Grace")
    scripture = input_data.get("scripture", "")
    
    values_context = "\n".join([f"- {v.name}: {v.description}" for v in values[:2]])
    
    prompt = f"""
    Create a daily devotional for an ELCA congregation on the theme: {theme}
    Scripture: {scripture}
    
    ELCA Values to reflect:
    {values_context}
    
    Include:
    - Brief scripture reflection
    - Personal application
    - Closing prayer
    - Encouraging and grace-centered tone
    """
    
    return await ai_provider.generate_text(prompt, "pastoral_care", max_tokens=800)

async def generate_scripture_study(input_data: Dict[str, Any], values: List[Value], beliefs: List[Belief]) -> str:
    """Generate ELCA-compliant scripture study."""
    passage = input_data.get("passage", "")
    focus = input_data.get("focus", "general study")
    
    prompt = f"""
    Create a scripture study guide for: {passage}
    Focus: {focus}
    
    For ELCA congregations, include:
    - Historical and cultural context
    - Lutheran theological perspective
    - Discussion questions
    - Modern application
    - Inclusive interpretation
    """
    
    return await ai_provider.generate_text(prompt, "pastoral_care", max_tokens=1200)

async def generate_pastoral_response(input_data: Dict[str, Any], values: List[Value], beliefs: List[Belief]) -> str:
    """Generate general pastoral response."""
    query = input_data.get("query", "")
    
    prompt = f"""
    Provide pastoral guidance for: {query}
    
    Respond with ELCA values of grace, inclusion, and human dignity.
    Encourage professional pastoral care when appropriate.
    """
    
    return await ai_provider.generate_text(prompt, "pastoral_care", max_tokens=600)

# Youth engagement functions
async def generate_social_content(input_data: Dict[str, Any], values: List[Value], beliefs: List[Belief]) -> str:
    """Generate Gen-Z social media content."""
    platform = input_data.get("platform", "instagram")
    topic = input_data.get("topic", "faith")
    
    prompt = f"""
    Create {platform} content for ELCA youth ministry on: {topic}
    
    Requirements:
    - Authentic Gen-Z voice
    - Inclusive and welcoming
    - Faith-based but not preachy
    - Engaging and relatable
    - ELCA values of radical hospitality
    """
    
    return await ai_provider.generate_text(prompt, "youth_engagement", max_tokens=400)

async def generate_youth_journey(input_data: Dict[str, Any], values: List[Value], beliefs: List[Belief]) -> str:
    """Generate youth spiritual journey plan."""
    age_group = input_data.get("age_group", "teens")
    theme = input_data.get("theme", "identity")
    
    prompt = f"""
    Design a spiritual journey experience for {age_group} on the theme: {theme}
    
    Include:
    - Interactive activities
    - Discussion prompts
    - Service opportunities
    - Reflection exercises
    - ELCA values integration
    """
    
    return await ai_provider.generate_text(prompt, "youth_engagement", max_tokens=1000)

async def generate_event_plan(input_data: Dict[str, Any], values: List[Value], beliefs: List[Belief]) -> str:
    """Generate youth event plan."""
    event_type = input_data.get("event_type", "gathering")
    theme = input_data.get("theme", "community")
    
    prompt = f"""
    Plan a youth {event_type} with theme: {theme}
    
    Include:
    - Activities and timeline
    - Materials needed
    - Accessibility considerations
    - ELCA values integration
    - Safety protocols
    """
    
    return await ai_provider.generate_text(prompt, "youth_engagement", max_tokens=800)

async def generate_youth_response(input_data: Dict[str, Any], values: List[Value], beliefs: List[Belief]) -> str:
    """Generate general youth ministry response."""
    query = input_data.get("query", "")
    
    prompt = f"""
    Provide youth ministry guidance for: {query}
    
    Use authentic, age-appropriate language while maintaining ELCA values.
    """
    
    return await ai_provider.generate_text(prompt, "youth_engagement", max_tokens=500)

# Mission coordination functions
async def generate_volunteer_plan(input_data: Dict[str, Any], values: List[Value], beliefs: List[Belief]) -> str:
    """Generate volunteer deployment plan."""
    mission = input_data.get("mission", "community service")
    volunteers = input_data.get("volunteer_count", 10)
    
    prompt = f"""
    Create a volunteer deployment plan for: {mission}
    Number of volunteers: {volunteers}
    
    Include:
    - Role assignments
    - Training requirements
    - Schedule coordination
    - ELCA justice and advocacy focus
    - Accessibility accommodations
    """
    
    return await ai_provider.generate_text(prompt, "mission_coordination", max_tokens=1000)

async def generate_mission_opportunity(input_data: Dict[str, Any], values: List[Value], beliefs: List[Belief]) -> str:
    """Generate mission opportunity."""
    focus_area = input_data.get("focus_area", "local community")
    duration = input_data.get("duration", "ongoing")
    
    prompt = f"""
    Identify mission opportunities in: {focus_area}
    Duration: {duration}
    
    Focus on ELCA values:
    - Justice and advocacy
    - Stewardship of creation
    - Community partnership
    - Sustainable impact
    """
    
    return await ai_provider.generate_text(prompt, "mission_coordination", max_tokens=800)

async def generate_resource_plan(input_data: Dict[str, Any], values: List[Value], beliefs: List[Belief]) -> str:
    """Generate resource allocation plan."""
    project = input_data.get("project", "community outreach")
    budget = input_data.get("budget", "limited")
    
    prompt = f"""
    Create resource allocation plan for: {project}
    Budget constraints: {budget}
    
    Consider:
    - Stewardship principles
    - Maximum community impact
    - Sustainable practices
    - Volunteer coordination
    - ELCA ethical procurement
    """
    
    return await ai_provider.generate_text(prompt, "mission_coordination", max_tokens=800)

async def generate_mission_response(input_data: Dict[str, Any], values: List[Value], beliefs: List[Belief]) -> str:
    """Generate general mission response."""
    query = input_data.get("query", "")
    
    prompt = f"""
    Provide mission coordination guidance for: {query}
    
    Focus on ELCA values of justice, stewardship, and community partnership.
    """
    
    return await ai_provider.generate_text(prompt, "mission_coordination", max_tokens=600)

# Recent tasks endpoint
@app.get("/api/tasks/recent", response_model=List[TaskResponse])
async def get_recent_tasks(limit: int = 10, db: AsyncSession = Depends(get_db)):
    """Get recent tasks."""
    try:
        result = await db.execute(
            select(Task)
            .order_by(Task.created_at.desc())
            .limit(limit)
        )
        tasks = result.scalars().all()
        return tasks
    except Exception as e:
        logger.error("Failed to get recent tasks", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve tasks")

# Ontology endpoints
@app.get("/api/ontology/values", response_model=List[ValueResponse])
async def get_values(db: AsyncSession = Depends(get_db)):
    """Get ELCA values."""
    try:
        ontology_manager = ELCAOntologyManager(db)
        values = await ontology_manager.get_values()
        return values
    except Exception as e:
        logger.error("Failed to get values", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve values")

@app.get("/api/ontology/beliefs", response_model=List[BeliefResponse])
async def get_beliefs(db: AsyncSession = Depends(get_db)):
    """Get ELCA beliefs."""
    try:
        ontology_manager = ELCAOntologyManager(db)
        beliefs = await ontology_manager.get_beliefs()
        return beliefs
    except Exception as e:
        logger.error("Failed to get beliefs", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve beliefs")

@app.get("/api/ontology/summary")
async def get_ontology_summary(db: AsyncSession = Depends(get_db)):
    """Get ontology summary."""
    try:
        values_result = await db.execute(select(func.count(Value.id)))
        beliefs_result = await db.execute(select(func.count(Belief.id)))
        
        return {
            "total_values": values_result.scalar(),
            "total_beliefs": beliefs_result.scalar()
        }
    except Exception as e:
        logger.error("Failed to get ontology summary", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve summary")

# AI provider status
@app.get("/api/ai/status")
async def get_ai_status():
    """Get AI provider status."""
    try:
        if ai_provider:
            health_status = await ai_provider.health_check()
            usage_stats = ai_provider.get_usage_stats()
            return {
                "providers": health_status,
                "usage": usage_stats,
                "available_providers": ai_provider.get_available_providers()
            }
        return {"status": "AI provider not initialized"}
    except Exception as e:
        logger.error("Failed to get AI status", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve AI status")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
