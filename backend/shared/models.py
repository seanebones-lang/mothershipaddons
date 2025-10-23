"""
Simplified database models for ELCA Blockbusters MVP.
Uses SQLite for rapid development.
"""

import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from enum import Enum

from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey, Integer
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pydantic import BaseModel, Field, ConfigDict

# Database configuration - SQLite for MVP
DATABASE_URL = "sqlite+aiosqlite:///./elca_blockbusters.db"

engine = create_async_engine(DATABASE_URL, echo=True)
async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

# Enums
class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class AgentStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    BUSY = "busy"
    ERROR = "error"

# Database Models
class Value(Base):
    """Ontological values table."""
    __tablename__ = "values"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    tenant_id = Column(String, default="elca-demo")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Belief(Base):
    """Ontological beliefs table."""
    __tablename__ = "beliefs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    related_values = Column(JSON, default=list)
    tenant_id = Column(String, default="elca-demo")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Agent(Base):
    """Agent registry table."""
    __tablename__ = "agents"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), unique=True, nullable=False)
    agent_type = Column(String(255), nullable=False)
    capabilities = Column(JSON, nullable=False, default=dict)
    status = Column(String(50), default=AgentStatus.ACTIVE)
    last_heartbeat = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    tasks = relationship("Task", back_populates="agent")

class Task(Base):
    """Task tracking table."""
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, default="demo-user")
    agent_id = Column(String, ForeignKey("agents.id"))
    input_data = Column(JSON, nullable=False)
    output_data = Column(JSON)
    status = Column(String(50), default=TaskStatus.PENDING)
    error_message = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime)
    
    # Relationships
    agent = relationship("Agent", back_populates="tasks")

# Pydantic Schemas
class ValueCreate(BaseModel):
    """Schema for creating a value."""
    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)

class ValueResponse(BaseModel):
    """Schema for value response."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    name: str
    description: str
    created_at: datetime
    updated_at: datetime

class BeliefCreate(BaseModel):
    """Schema for creating a belief."""
    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    related_values: List[str] = Field(default_factory=list)

class BeliefResponse(BaseModel):
    """Schema for belief response."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    name: str
    description: str
    related_values: List[str]
    created_at: datetime
    updated_at: datetime

class AgentResponse(BaseModel):
    """Schema for agent response."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    name: str
    agent_type: str
    capabilities: Dict[str, Any]
    status: str
    last_heartbeat: Optional[datetime]
    created_at: datetime
    updated_at: datetime

class TaskCreate(BaseModel):
    """Schema for creating a task."""
    user_id: Optional[str] = "demo-user"
    agent_id: str
    input_data: Dict[str, Any]

class TaskResponse(BaseModel):
    """Schema for task response."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    user_id: Optional[str]
    agent_id: str
    input_data: Dict[str, Any]
    output_data: Optional[Dict[str, Any]]
    status: str
    error_message: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]

# Database dependency
async def get_db() -> AsyncSession:
    """Get database session."""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()

# Initialize database
async def init_db():
    """Initialize database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
