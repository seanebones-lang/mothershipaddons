"""
Enhanced AI Provider with ELCA-specific optimizations and Grok integration.
Supports OpenAI, Claude, and X.ai Grok with cost optimization.
"""

import os
import asyncio
from typing import List, Dict, Any, Optional, Union
from enum import Enum
import structlog
import openai
from anthropic import AsyncAnthropic
import httpx

logger = structlog.get_logger()

class AIProvider(str, Enum):
    OPENAI = "openai"
    CLAUDE = "claude"
    GROK = "grok"

class ELCAAIProviderManager:
    """Enhanced AI provider manager with ELCA-specific optimizations."""
    
    def __init__(self):
        self.providers = self._initialize_providers()
        self.primary_provider = AIProvider.CLAUDE  # Claude Sonnet 4.5 as primary
        self.fallback_providers = [AIProvider.OPENAI, AIProvider.GROK]
        self.cost_optimization_enabled = True
        self.usage_tracking = {}
        
        # ELCA-specific model preferences - Claude Sonnet 4.5 prioritized
        self.elca_model_preferences = {
            "pastoral_care": AIProvider.CLAUDE,  # Claude Sonnet 4.5 for sensitive conversations
            "youth_engagement": AIProvider.CLAUDE,  # Claude Sonnet 4.5 for authentic Gen-Z content
            "mission_coordination": AIProvider.CLAUDE,  # Claude Sonnet 4.5 for structured tasks
            "sermon_generation": AIProvider.CLAUDE,  # Claude Sonnet 4.5 for theological content
            "general": AIProvider.CLAUDE  # Claude Sonnet 4.5 as primary for all ELCA use cases
        }
    
    def _initialize_providers(self) -> Dict[AIProvider, Any]:
        """Initialize AI provider clients."""
        providers = {}
        
        # OpenAI
        if os.getenv("OPENAI_API_KEY"):
            providers[AIProvider.OPENAI] = openai.AsyncOpenAI(
                api_key=os.getenv("OPENAI_API_KEY")
            )
        
        # Claude
        if os.getenv("ANTHROPIC_API_KEY"):
            providers[AIProvider.CLAUDE] = AsyncAnthropic(
                api_key=os.getenv("ANTHROPIC_API_KEY")
            )
        
        # X.ai Grok
        if os.getenv("XAI_API_KEY"):
            providers[AIProvider.GROK] = httpx.AsyncClient(
                base_url="https://api.x.ai/v1",
                headers={
                    "Authorization": f"Bearer {os.getenv('XAI_API_KEY')}",
                    "Content-Type": "application/json"
                }
            )
        
        return providers
    
    async def generate_text(
        self, 
        prompt: str, 
        use_case: str = "general",
        max_tokens: int = 1000,
        temperature: float = 0.7,
        provider: Optional[AIProvider] = None
    ) -> str:
        """Generate text with ELCA-specific optimizations."""
        
        # Select provider based on use case and cost optimization
        if not provider:
            provider = self._select_optimal_provider(use_case, max_tokens)
        
        try:
            if provider == AIProvider.OPENAI and provider in self.providers:
                return await self._generate_openai_text(prompt, max_tokens, temperature, use_case)
            elif provider == AIProvider.CLAUDE and provider in self.providers:
                return await self._generate_claude_text(prompt, max_tokens, temperature, use_case)
            elif provider == AIProvider.GROK and provider in self.providers:
                return await self._generate_grok_text(prompt, max_tokens, temperature, use_case)
            else:
                raise ValueError(f"Provider {provider} not available")
                
        except Exception as e:
            logger.warning("Primary provider failed, trying fallback", provider=provider, error=str(e))
            return await self._generate_text_with_fallback(prompt, use_case, max_tokens, temperature)
    
    def _select_optimal_provider(self, use_case: str, max_tokens: int) -> AIProvider:
        """Select optimal provider based on use case and cost."""
        
        # Use case-specific preferences
        if use_case in self.elca_model_preferences:
            preferred = self.elca_model_preferences[use_case]
            if preferred in self.providers:
                return preferred
        
        # Default to primary provider
        return self.primary_provider if self.primary_provider in self.providers else AIProvider.OPENAI
    
    async def _generate_text_with_fallback(self, prompt: str, use_case: str, max_tokens: int, temperature: float) -> str:
        """Try fallback providers for text generation."""
        for provider in self.fallback_providers:
            try:
                if provider in self.providers:
                    return await self.generate_text(prompt, use_case, max_tokens, temperature, provider)
            except Exception as e:
                logger.warning("Fallback provider failed", provider=provider, error=str(e))
                continue
        
        raise RuntimeError("All text generation providers failed")
    
    async def _generate_openai_text(self, prompt: str, max_tokens: int, temperature: float, use_case: str) -> str:
        """Generate text using OpenAI with ELCA context."""
        client = self.providers[AIProvider.OPENAI]
        
        # Select model based on use case
        model = "gpt-4-turbo" if use_case in ["pastoral_care", "sermon_generation"] else "gpt-3.5-turbo"
        
        # Add ELCA context to prompt
        elca_context = self._get_elca_context(use_case)
        enhanced_prompt = f"{elca_context}\n\n{prompt}"
        
        response = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": enhanced_prompt}],
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        # Track usage for cost monitoring
        self._track_usage(AIProvider.OPENAI, model, max_tokens)
        
        return response.choices[0].message.content
    
    async def _generate_claude_text(self, prompt: str, max_tokens: int, temperature: float, use_case: str) -> str:
        """Generate text using Claude with ELCA context."""
        client = self.providers[AIProvider.CLAUDE]
        
        # Select model based on use case - using Claude Sonnet 4.5 as primary
        model = "claude-sonnet-4-5"  # Latest Claude Sonnet 4.5 (October 2025) for all ELCA use cases
        
        # Add ELCA context to prompt
        elca_context = self._get_elca_context(use_case)
        enhanced_prompt = f"{elca_context}\n\n{prompt}"
        
        response = await client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            messages=[{"role": "user", "content": enhanced_prompt}]
        )
        
        # Track usage for cost monitoring
        self._track_usage(AIProvider.CLAUDE, model, max_tokens)
        
        return response.content[0].text
    
    async def _generate_grok_text(self, prompt: str, max_tokens: int, temperature: float, use_case: str) -> str:
        """Generate text using X.ai Grok with ELCA context."""
        client = self.providers[AIProvider.GROK]
        
        # Add ELCA context to prompt
        elca_context = self._get_elca_context(use_case)
        enhanced_prompt = f"{elca_context}\n\n{prompt}"
        
        payload = {
            "messages": [{"role": "user", "content": enhanced_prompt}],
            "model": "grok-beta",
            "stream": False,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        response = await client.post("/chat/completions", json=payload)
        response.raise_for_status()
        
        result = response.json()
        
        # Track usage for cost monitoring
        self._track_usage(AIProvider.GROK, "grok-beta", max_tokens)
        
        return result["choices"][0]["message"]["content"]
    
    def _get_elca_context(self, use_case: str) -> str:
        """Get ELCA-specific context for AI prompts."""
        contexts = {
            "pastoral_care": """
            You are assisting with pastoral care in an ELCA congregation. Remember:
            - Ground responses in grace and unconditional love
            - Respect human dignity and worth
            - Encourage professional pastoral care when appropriate
            - Be inclusive and welcoming to all
            - Maintain confidentiality and trust
            """,
            "sermon_generation": """
            You are assisting with sermon preparation in an ELCA congregation. Remember:
            - Honor Lutheran liturgical traditions and theology
            - Include diverse voices and perspectives
            - Ground messages in grace and Gospel
            - Make scripture accessible and relevant
            - Support authentic worship experiences
            """,
            "youth_engagement": """
            You are assisting with youth engagement in an ELCA congregation. Remember:
            - Use authentic, age-appropriate language
            - Respect diverse backgrounds and experiences
            - Encourage participation and belonging
            - Support spiritual growth and discipleship
            - Be inclusive of all identities and orientations
            """,
            "mission_coordination": """
            You are assisting with mission coordination in an ELCA congregation. Remember:
            - Practice radical hospitality
            - Support justice and advocacy work
            - Respect community partnerships
            - Encourage sustainable service
            - Honor diverse gifts and abilities
            """,
            "general": """
            You are assisting an ELCA congregation. Remember:
            - Ground all responses in ELCA values
            - Practice radical hospitality and inclusion
            - Respect human dignity and worth
            - Support justice and advocacy
            - Honor Lutheran traditions and beliefs
            """
        }
        
        return contexts.get(use_case, contexts["general"])
    
    def _track_usage(self, provider: AIProvider, model: str, tokens: int):
        """Track AI usage for cost monitoring."""
        if provider not in self.usage_tracking:
            self.usage_tracking[provider] = {}
        
        if model not in self.usage_tracking[provider]:
            self.usage_tracking[provider][model] = {"tokens": 0, "requests": 0}
        
        self.usage_tracking[provider][model]["tokens"] += tokens
        self.usage_tracking[provider][model]["requests"] += 1
    
    async def generate_structured_output(
        self,
        prompt: str,
        schema: Dict[str, Any],
        use_case: str = "general",
        provider: Optional[AIProvider] = None
    ) -> Dict[str, Any]:
        """Generate structured output following a schema with ELCA context."""
        
        # Add ELCA context to prompt
        elca_context = self._get_elca_context(use_case)
        structured_prompt = f"""
        {elca_context}
        
        {prompt}
        
        Please respond with valid JSON following this schema:
        {schema}
        
        Ensure the response is valid JSON and follows the schema exactly.
        """
        
        response_text = await self.generate_text(structured_prompt, use_case, provider=provider)
        
        try:
            import json
            return json.loads(response_text)
        except json.JSONDecodeError as e:
            logger.error("Failed to parse structured output", error=str(e), response=response_text)
            raise ValueError(f"Invalid JSON response: {response_text}")
    
    def get_usage_stats(self) -> Dict[str, Any]:
        """Get AI usage statistics for cost monitoring."""
        total_tokens = 0
        total_requests = 0
        
        for provider, models in self.usage_tracking.items():
            for model, stats in models.items():
                total_tokens += stats["tokens"]
                total_requests += stats["requests"]
        
        return {
            "total_tokens": total_tokens,
            "total_requests": total_requests,
            "provider_breakdown": self.usage_tracking,
            "cost_optimization_enabled": self.cost_optimization_enabled
        }
    
    def get_available_providers(self) -> List[AIProvider]:
        """Get list of available AI providers."""
        return list(self.providers.keys())
    
    async def health_check(self) -> Dict[str, Any]:
        """Check health of all AI providers."""
        health_status = {}
        
        for provider in self.providers:
            try:
                if provider == AIProvider.OPENAI:
                    client = self.providers[provider]
                    await client.models.list()
                    health_status[provider] = "healthy"
                elif provider == AIProvider.CLAUDE:
                    client = self.providers[provider]
                    await client.messages.create(
                        model="claude-sonnet-4-5",
                        max_tokens=10,
                        messages=[{"role": "user", "content": "test"}]
                    )
                    health_status[provider] = "healthy"
                elif provider == AIProvider.GROK:
                    client = self.providers[provider]
                    response = await client.post("/chat/completions", json={
                        "messages": [{"role": "user", "content": "test"}],
                        "model": "grok-beta",
                        "max_tokens": 1
                    })
                    response.raise_for_status()
                    health_status[provider] = "healthy"
                else:
                    health_status[provider] = "healthy"
            except Exception as e:
                health_status[provider] = f"unhealthy: {str(e)}"
        
        return health_status
