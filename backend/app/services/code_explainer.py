import google.generativeai as genai
import os
import json
import logging
import re

logger = logging.getLogger(__name__)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")


class AIServiceError(Exception):
    pass


def extract_json(text: str):
    """
    Safely extract JSON from messy LLM output
    """

    # 🔹 Remove markdown wrappers
    text = re.sub(r"```json|```", "", text).strip()

    # 🔹 Try direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 🔹 Extract first JSON object
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    return None


async def analyze_code(code: str, language: str):
    try:
        if not code or not code.strip():
            raise ValueError("Code cannot be empty")

        if len(code) > 10000:
            raise ValueError("Code too large")

        prompt = f"""
You are a senior software engineer.

Analyze this {language} code.

Return ONLY raw JSON.
Do NOT use markdown.
Do NOT wrap in ```json.
Do NOT add any text outside JSON.

Return strictly:

{{
  "explanation": "simple explanation",
  "issues": ["issue1", "issue2"],
  "improvements": ["improvement1", "improvement2"]
}}

Code:
{code}
"""

        response = model.generate_content(prompt)

        if not response or not response.text:
            raise AIServiceError("Empty response from AI")

        text = response.text.strip()

        # 🔥 Robust parsing
        parsed = extract_json(text)

        if parsed:
            return parsed

        # ❗ fallback (still return valid shape)
        logger.warning(f"Failed to parse JSON. Raw: {text}")

        return {
            "explanation": text,
            "issues": [],
            "improvements": []
        }

    except ValueError as e:
        raise AIServiceError(str(e))

    except AIServiceError:
        raise

    except Exception as e:
        logger.error(f"AI error: {str(e)}")
        raise AIServiceError("Failed to analyze code")