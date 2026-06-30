"""
services/gemini_service.py
──────────────────────────────────────────────────────────────────────────────
Wrapper around Gemini API and OpenAI-compatible APIs (DeepSeek, OpenRouter).

If DEEPSEEK_API_KEY or OPENROUTER_API_KEY is configured in the environment,
data extraction and classification tasks are routed to DeepSeek.
Otherwise, the service falls back to Gemini.
"""

import json
import logging
import os
from typing import Any
import httpx

logger = logging.getLogger(__name__)

_CLIENT = None
_MODEL = None


def _get_gemini_model():
    """Lazy-initialize the Gemini model if needed."""
    global _CLIENT, _MODEL

    if _MODEL is not None:
        return _MODEL

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        _MODEL = genai.GenerativeModel("gemini-2.0-flash")
        logger.info("Gemini model initialized (gemini-2.0-flash).")
        return _MODEL
    except Exception as exc:
        logger.error("Failed to initialize Gemini: %s", exc)
        return None


def _clean_json_response(text: str) -> str:
    """Strip markdown code fences and whitespace from response."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()


async def _call_openai_compatible_api(prompt: str, json_mode: bool = False) -> str | None:
    """
    Sends an async request to DeepSeek or OpenRouter API based on set keys.
    """
    deepseek_key = os.getenv("DEEPSEEK_API_KEY")
    openrouter_key = os.getenv("OPENROUTER_API_KEY")

    if not deepseek_key and not openrouter_key:
        return None

    if deepseek_key:
        url = "https://api.deepseek.com/chat/completions"
        model = "deepseek-chat"
        api_key = deepseek_key
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    else:
        url = "https://openrouter.ai/api/v1/chat/completions"
        model = "deepseek/deepseek-chat"
        api_key = openrouter_key
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://documind-1g2.pages.dev",
            "X-Title": "NeuroDocs"
        }

    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2
    }

    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            # Retry up to 2 times on transient failures
            for attempt in range(3):
                try:
                    response = await client.post(url, json=payload, headers=headers)
                    if response.status_code == 200:
                        result = response.json()
                        return result["choices"][0]["message"]["content"]
                    else:
                        logger.warning(
                            "OpenAI-compatible API (%s) returned status %d: %s",
                            model, response.status_code, response.text
                        )
                        return None
                except httpx.ConnectError:
                    if attempt < 2:
                        logger.info("Retrying OpenAI API call (attempt %d)...", attempt + 2)
                        import asyncio
                        await asyncio.sleep(1)
                    else:
                        raise
    except Exception as e:
        logger.error("Failed calling OpenAI-compatible API (%s): %s", model, e)
        return None


async def gemini_classify(text: str) -> dict[str, Any] | None:
    """
    Classify a document from its text content. Routes to DeepSeek if configured.
    """
    prompt = f"""You are a document classification AI. Analyze the following document text and classify it into ONE of these categories:
- Invoice
- Receipt
- Contract
- Resume
- Certificate
- Medical Record
- Financial Statement
- Legal Filing
- Report
- Unknown

Respond with ONLY a JSON object in this exact format (no extra text):
{{"document_type": "<type>", "confidence": <0.0-1.0>}}

Document text (first 3000 chars):
\"\"\"
{text[:3000]}
\"\"\""""

    # Try DeepSeek / OpenRouter first
    openai_response = await _call_openai_compatible_api(prompt, json_mode=True)
    if openai_response:
        try:
            raw = _clean_json_response(openai_response)
            result = json.loads(raw)
            logger.info("AI classified as (OpenAI): %s", result.get("document_type"))
            return result
        except Exception as exc:
            logger.warning("Failed parsing OpenAI classification JSON: %s", exc)

    # Fallback to Gemini
    model = _get_gemini_model()
    if model is None:
        return None

    try:
        response = model.generate_content(prompt)
        raw = _clean_json_response(response.text)
        result = json.loads(raw)
        logger.info("Gemini classified as: %s (%.2f)", result.get("document_type"), result.get("confidence", 0))
        return result
    except Exception as exc:
        logger.warning("Gemini classification failed: %s", exc)
        return None


async def gemini_extract_fields(text: str, document_type: str) -> dict[str, Any] | None:
    """
    Extract structured fields from document text. Routes to DeepSeek if configured.
    """
    prompt = f"""You are a document data extraction AI. The following document has been classified as a "{document_type}".

Extract ALL relevant structured fields from the text. Common fields include:
- For Invoices: vendor, client, invoice_no, date, due_date, amount, tax, currency
- For Receipts: store_name, receipt_no, date, subtotal, tax, total, payment_method
- For Contracts: parties, effective_date, expiry_date, jurisdiction, value
- For Resumes: name, email, phone, linkedin, current_role, skills, education
- For Certificates: recipient_name, certificate_title, issued_by, date, course_name, organization
- For Medical Records: patient_name, dob, diagnosis, physician, date
- For Financial Statements: period, total_revenue, net_income, total_assets, currency

Respond with ONLY a JSON object mapping field names to their extracted values.
If a field is not found, do NOT include it. Example:
{{"vendor": "Acme Corp", "amount": "$1,500.00", "date": "March 15, 2026"}}

Document text (first 4000 chars):
\"\"\"
{text[:4000]}
\"\"\""""

    # Try DeepSeek / OpenRouter first
    openai_response = await _call_openai_compatible_api(prompt, json_mode=True)
    if openai_response:
        try:
            raw = _clean_json_response(openai_response)
            fields = json.loads(raw)
            logger.info("AI extracted (OpenAI): %d fields", len(fields))
            return fields
        except Exception as exc:
            logger.warning("Failed parsing OpenAI extraction JSON: %s", exc)

    # Fallback to Gemini
    model = _get_gemini_model()
    if model is None:
        return None

    try:
        response = model.generate_content(prompt)
        raw = _clean_json_response(response.text)
        fields = json.loads(raw)
        logger.info("Gemini extracted %d fields", len(fields))
        return fields
    except Exception as exc:
        logger.warning("Gemini extraction failed: %s", exc)
        return None


async def gemini_summarize(text: str) -> str | None:
    """
    Produce a concise summary of the document. Routes to DeepSeek if configured.
    """
    prompt = f"""Summarize the following document in 2-4 sentences. Be concise and focus on the key information.

Document text (first 3000 chars):
\"\"\"
{text[:3000]}
\"\"\""""

    # Try DeepSeek / OpenRouter first
    openai_response = await _call_openai_compatible_api(prompt, json_mode=False)
    if openai_response:
        return openai_response.strip()

    # Fallback to Gemini
    model = _get_gemini_model()
    if model is None:
        return None

    try:
        response = model.generate_content(prompt)
        summary = response.text.strip()
        logger.info("Gemini summary generated (%d chars)", len(summary))
        return summary
    except Exception as exc:
        logger.warning("Gemini summarization failed: %s", exc)
        return None
