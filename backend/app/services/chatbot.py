import os

import httpx
from dotenv import load_dotenv
from fastapi import HTTPException

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
load_dotenv()


def get_chatbot_reply(request) -> str:
    from app import schemas
    if isinstance(request, str):
        # Backward compatibility in case it's called with a string
        request = schemas.ChatbotRequest(message=request)
        
    api_key = os.getenv("OPENROUTER_API_KEY")
    model = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Chatbot is not configured. Set OPENROUTER_API_KEY in backend environment.",
        )

    system_prompt = (
        "You are an AI financial advisor for Shubhanjana Co-operative. "
        "You must ONLY answer based on the following real product data:\n\n"
        "=== CALLABLE FIXED DEPOSIT (FD) ===\n"
        "Premature withdrawal allowed. Senior Citizens & Freedom Fighters get +0.5% extra.\n"
        "- 6 Months: 6.10% p.a.\n"
        "- 12 Months: 6.25% p.a.\n"
        "- 24 Months: 6.75% p.a.\n"
        "- 36 Months: 7.25% p.a.\n"
        "- 60 Months: 7.90% p.a.\n"
        "- 120 Months: 8.90% p.a.\n\n"
        "=== NON-CALLABLE FIXED DEPOSIT (NCFD) ===\n"
        "No premature withdrawal. Higher returns. Senior Citizens get +0.5% extra.\n"
        "- 18 Months: 8.00% p.a.\n"
        "- 24 Months: 8.25% p.a.\n"
        "- 36 Months: 8.50% p.a.\n"
        "- 42 Months: 8.75% p.a.\n"
        "- 48 Months: 9.00% p.a.\n"
        "- 54 Months: 9.25% p.a.\n"
        "- 60 Months: 9.50% p.a.\n"
        "- 66 Months: 9.75% p.a.\n"
        "- 72 Months: 10.50% p.a.\n"
        "- 120 Months: 11.50% p.a.\n\n"
        "=== RECURRING DEPOSIT (RD) ===\n"
        "Monthly savings plan. Same rates as Callable FD.\n"
        "- 6 Months: 6.10% | 12 Months: 6.25% | 24 Months: 6.75%\n"
        "- 36 Months: 7.25% | 60 Months: 7.90% | 120 Months: 8.90%\n\n"
        "=== DAILY DEPOSIT (DD) ===\n"
        "Daily savings scheme for traders and daily wage earners.\n"
        "- 356 Days (1 Yr): 5.00% p.a.\n"
        "- 730 Days (2 Yr): 6.00% p.a.\n"
        "- 1095 Days (3 Yr): 7.00% p.a.\n"
        "- 1460 Days (4 Yr): 8.00% p.a.\n"
        "- 1825 Days (5 Yr): 9.00% p.a.\n\n"
        "RULES:\n"
        "1. Always recommend specific Shubhanjana plans with exact rates.\n"
        "2. Be professional, concise, and helpful.\n"
        "3. If asked about other banks or investments, politely redirect to Shubhanjana products.\n"
        "4. Always mention Senior Citizen bonus when relevant.\n"
        "5. Do NOT provide legal or tax guarantees.\n"
        "6. Keep responses within 3-4 sentences unless detailed explanation is asked."
    )

    if request.context and request.context.customer_data:
        system_prompt += f"\n\nCURRENT CUSTOMER DATA:\nThis is the data of the user you are talking to: {request.context.customer_data}\nTailor your advice specifically for them if applicable based on age, income, risk level, etc."

    messages = [{"role": "system", "content": system_prompt}]
    
    # Add history
    for msg in request.history:
        messages.append({"role": msg.role, "content": msg.content})
        
    # Add the current message
    messages.append({"role": "user", "content": request.message})

    payload = {
        "model": model,
        "messages": messages,
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
