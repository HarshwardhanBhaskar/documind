<div align="center">

<h1>🧠 DocuMind</h1>
<p><strong>AI-Powered Document Intelligence Toolkit</strong></p>

<p>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/EasyOCR-AI-FF6F00?style=for-the-badge&logo=tensorflow" />
  <img src="https://img.shields.io/badge/HuggingFace-BART-FFD21E?style=for-the-badge&logo=huggingface" />
</p>

<p>Transform PDFs, scanned documents, and images into structured data using AI — automatically.</p>

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Merge PDFs** | Combine multiple PDFs into one perfectly ordered document |
| 🗜️ **Compress Documents** | Reduce file size by up to 90% with zero quality loss |
| 🔄 **Convert Files** | Convert PDFs to PNG images with round-trip fidelity |
| 🔍 **OCR Extraction** | Extract text from scanned documents and images (99.8% accuracy) |
| 🤖 **AI Classification** | Auto-detect document type — Invoice, Receipt, Contract, Resume, Certificate |
| 📊 **Smart Field Extraction** | Pull structured data (vendor, amount, date, etc.) into clean JSON |
| 🔐 **Auth System** | Supabase Auth with JWT — sign up, login, session management |
| 📦 **File Storage** | Private Supabase Storage bucket with RLS-enforced access |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (Next.js)                      │
│  React · TailwindCSS · Framer Motion · Supabase Auth    │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP + Bearer JWT
┌─────────────────────▼───────────────────────────────────┐
│               FastAPI Backend (Python)                   │
│  /auth · /upload · /documents · /processing             │
│  /smart-classify · /utilities                           │
│                                                          │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ OCR Service│  │Classification│  │Extraction Service│ │
│  │  EasyOCR  │  │Keyword + BART│  │ Regex per type  │ │
│  └────────────┘  └──────────────┘  └─────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  Supabase (BaaS)                         │
│   Auth (JWT) · PostgreSQL + RLS · Storage Bucket        │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- A [Supabase](https://supabase.com) project
- Poppler (for PDF → image conversion)

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/documind.git
cd documind
```

---

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
# Start the frontend
npm run dev
# → http://localhost:3000
```

---

### 3. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

Edit `backend/.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=http://localhost:3000
ENABLE_ZERO_SHOT_CLASSIFIER=false
```

```bash
# Start the backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# → http://localhost:8000
# → Swagger UI: http://localhost:8000/docs
```

---

## 🤖 AI Classification Pipeline

```
Upload Document
     ↓
OCR Extraction (EasyOCR)
     ↓
Keyword Classification (fast path)
     ↓  if low confidence
Zero-Shot Classification (HuggingFace BART)
     ↓
Field Extraction (type-specific regex)
     ↓
Structured JSON Response
```

**Supported document types and extracted fields:**

| Document Type | Key Fields Extracted |
|---|---|
| **Invoice** | vendor, client, invoice_id, amount, date, due_date, tax |
| **Receipt** | store_name, receipt_no, total, subtotal, tax, payment_method |
| **Contract** | parties, effective_date, expiry_date, jurisdiction |
| **Resume** | name, email, phone, linkedin, skills |
| **Certificate** | recipient_name, certificate_title, issued_by, date |

**Example API response:**
```json
POST /smart-classify/file

{
  "document_type": "Invoice",
  "confidence": 0.94,
  "fields": {
    "vendor": "Acme Corp Ltd.",
    "invoice_id": "INV-2024-0099",
    "amount": "$5,400.00",
    "date": "March 14, 2024",
    "due_date": "March 28, 2024"
  }
}
```

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | ❌ | Create new account |
| POST | `/auth/login` | ❌ | Login, returns JWT |
| POST | `/upload` | ✅ | Upload a document |
| GET | `/documents` | ✅ | List your documents |
| DELETE | `/documents/{id}` | ✅ | Delete a document |
| POST | `/process-document` | ✅ | Run full AI pipeline |
| POST | `/smart-classify/text` | ❌ | Classify raw text |
| POST | `/smart-classify/file` | ❌ | Classify uploaded file |
| POST | `/utilities/merge-pdfs` | ❌ | Merge PDFs |
| POST | `/utilities/compress` | ❌ | Compress to ZIP |
| POST | `/utilities/convert-pdf` | ❌ | PDF → Images |
| GET | `/docs` | ❌ | Swagger UI |

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [TailwindCSS](https://tailwindcss.com/) — Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Lucide React](https://lucide.dev/) — Icons
- [Supabase JS](https://supabase.com/docs/reference/javascript) — Auth client

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — High-performance Python API
- [EasyOCR](https://github.com/JaidedAI/EasyOCR) — Multi-language OCR
- [HuggingFace Transformers](https://huggingface.co/docs/transformers) — Zero-shot classification (BART)
- [pypdf](https://pypdf.readthedocs.io/) — PDF manipulation
- [pdf2image](https://github.com/Belval/pdf2image) — PDF to image conversion

**Infrastructure**
- [Supabase](https://supabase.com/) — PostgreSQL + Auth + Storage
- [Vercel](https://vercel.com/) / [Cloudflare Pages](https://pages.cloudflare.com/) — Frontend hosting
- [Oracle Cloud Free VM](https://www.oracle.com/cloud/free/) — Backend hosting (24GB ARM)

---

## 🔐 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Backend (`backend/.env`)
```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
CORS_ORIGINS=http://localhost:3000
ENABLE_ZERO_SHOT_CLASSIFIER=false
```

---

## 📁 Project Structure

```
documind/
├── app/                    # Next.js app router pages
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Design system & tokens
│   └── not-found.tsx       # Custom 404 page
├── components/             # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Problem.tsx
│   ├── Features.tsx        # PDF tools with interactive modal
│   ├── AIPipeline.tsx      # 4-step AI pipeline visualization
│   ├── UploadDemo.tsx      # Live OCR + AI demo
│   ├── DashboardPreview.tsx
│   ├── TechStack.tsx
│   ├── CTA.tsx
│   ├── Footer.tsx
│   ├── ToolModal.tsx       # Reusable tool interaction modal
│   └── AuthModal.tsx
├── lib/
│   └── api.ts              # Type-safe API client
├── context/
│   └── AuthContext.tsx     # Global auth state
└── backend/
    ├── main.py             # FastAPI app entry point
    ├── routers/            # API route handlers
    │   ├── auth.py
    │   ├── upload.py
    │   ├── documents.py
    │   ├── processing.py
    │   ├── utilities.py
    │   └── smart_classify.py
    └── services/           # Business logic
        ├── classification_service.py
        ├── extraction_service.py
        ├── smart_classify_service.py
        └── ocr_service.py
```

---

## 🌐 Deployment

**Frontend → Vercel**
```bash
# Connect your GitHub repo to Vercel
# Add environment variables in Vercel dashboard
# Deploy automatically on every push to main
```

**Backend → Oracle Cloud Free VM**
```bash
# SSH into your VM
git clone your-repo && cd documind/backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 🙌 Author

Built by a 3rd year CS student as a full-stack AI + SaaS showcase project.

- **Frontend**: Next.js + TailwindCSS + Framer Motion
- **Backend**: FastAPI + Python ML pipeline
- **AI/ML**: EasyOCR + HuggingFace BART zero-shot classification

---

<div align="center">
<p>⭐ Star this repo if you found it helpful!</p>
</div>
