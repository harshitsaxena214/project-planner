import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def parse_tasks(text: str):
    lines = text.split("\n")

    tasks = []
    for line in lines:
        line = line.strip()

        if line:
            cleaned = line.lstrip("0123456789.-) ")
            if cleaned:
                tasks.append(cleaned)

    return tasks

async def generate_tasks(title: str, description: str):
    prompt = f"""
    You are an expert project planner.

    Break the following project into clear, actionable tasks.

    Project Title: {title}
    Description: {description}

    Rules:
    - Return ONLY a numbered list
    - Each task should be short and actionable
    - No explanations
    - Around 5–10 tasks
    """

    response = model.generate_content(prompt)

    raw_text = response.text

    tasks = parse_tasks(raw_text)

    return tasks