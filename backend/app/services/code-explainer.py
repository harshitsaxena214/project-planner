import google.generativeai as genai
import os
import json
import logging

logger = logging.getLogger(__name__)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


class AIServiceError(Exception):
    pass


async def analyze_code(code: str, language: str):
    try:
        if not code or not code.strip():
            raise ValueError("Code cannot be empty")

        if len(code) > 10000:
            raise ValueError("Code too large")

        prompt = f"""
You are a senior software engineer.

Analyze this {language} code and return ONLY valid JSON:

{{
  "explanation": "simple explanation",
  "issues": ["issue1", "issue2"],
  "improvements": ["improvement1", "improvement2"]
}}

Code:
{code}
"""

        # ⚠️ Gemini call
        response = model.generate_content(prompt)

        if not response or not response.text:
            raise AIServiceError("Empty response from AI model")

        text = response.text.strip()

        # ✅ Try parsing JSON
        try:
            return json.loads(text)

        except json.JSONDecodeError as e:
            logger.warning(f"JSON parsing failed: {e}")
            logger.warning(f"Raw response: {text}")

            return {
                "explanation": text,
                "issues": [],
                "improvements": []
            }

    except ValueError as e:
        # User input issues
        raise AIServiceError(f"Invalid input: {str(e)}")

    except AIServiceError:
        # Already handled, just re-raise
        raise

    except Exception as e:
        # Unexpected errors (API failure, network, etc.)
        logger.error(f"AI service failed: {str(e)}")

        raise AIServiceError("Failed to analyze code. Please try again.")