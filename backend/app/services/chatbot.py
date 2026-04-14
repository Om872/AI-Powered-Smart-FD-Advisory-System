import os

import httpx
from dotenv import load_dotenv
from fastapi import HTTPException

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
load_dotenv()


def get_chatbot_reply(message: str) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    model = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Chatbot is not configured. Set OPENROUTER_API_KEY in backend environment.",
        )

    system_prompt = (
        "You are an FD advisory assistant for Shubhanjana Co-operative. "
        "Brand tone: trustworthy, simple, member-first, and practical. "
        "Reference products like FD, RD, DDS (Daily Deposit), Savings, and transparent loan guidance where relevant. "
        "Give concise, practical guidance about fixed deposits, risk, and interest planning. "
        "Prefer Hindi-English (Hinglish) clarity when user tone suggests it. "
        "Do not provide legal or tax guarantees."
    )

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ],
        "temperature": 0.4,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(OPENROUTER_URL, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()
    except (httpx.HTTPError, KeyError, IndexError) as exc:
        raise HTTPException(status_code=502, detail=f"Chatbot provider error: {exc}") from exc
