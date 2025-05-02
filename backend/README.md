# AI Content Pilot Backend

This is the backend service for AI Content Pilot, providing AI-powered content generation capabilities.

## Features

- Blog post generation
- Social media content creation
- Email copy generation
- Ad copy creation
- Product descriptions
- SEO-optimized content
- Multiple tone/voice selection
- Content length control

## Setup

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables in `.env` file
4. Run the server: `python -m app.main`

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Port to run the server on (default: 8000)
- `HOST`: Host to run the server on (default: 0.0.0.0)
- `DEBUG`: Set to "True" for debug mode

## API Documentation

API documentation is available at `/docs` when the server is running.
\`\`\`

```plaintext file="backend/requirements.txt"
fastapi==0.104.1
uvicorn==0.23.2
pydantic==2.4.2
python-dotenv==1.0.0
openai==1.3.0
python-multipart==0.0.6
httpx==0.25.1
beautifulsoup4==4.12.2
requests==2.31.0
