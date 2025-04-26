# AI Content Pilot - Backend

This is the backend API for the AI Content Pilot application, built with FastAPI and Python.

## Features

- AI-powered content generation for various types:
  - Blog posts
  - Social media content
  - Email copy
  - Ad copy
  - Product descriptions
  - SEO-optimized content
- AI image generation
- Content analysis and optimization
- Authentication and authorization
- Rate limiting and usage tracking

## Setup

### Prerequisites

- Python 3.9+
- OpenAI API key
- DeepSeek API key (optional)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Create a virtual environment:
   \`\`\`
   python -m venv venv
   \`\`\`
4. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
5. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`
6. Create a `.env` file based on `.env.example` and add your API keys
7. Run the application:
   \`\`\`
   uvicorn main:app --reload
   \`\`\`

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Docker Deployment

To build and run the Docker container:

\`\`\`bash
docker build -t ai-content-pilot-backend .
docker run -p 8000:8000 --env-file .env ai-content-pilot-backend
\`\`\`

## Environment Variables

- `DEBUG`: Enable debug mode (default: False)
- `HOST`: Host to bind the server to (default: 0.0.0.0)
- `PORT`: Port to bind the server to (default: 8000)
- `SECRET_KEY`: Secret key for JWT token generation
- `OPENAI_API_KEY`: Your OpenAI API key
- `DEEPSEEK_API_KEY`: Your DeepSeek API key
- `RATE_LIMIT_PER_MINUTE`: Rate limit for API requests (default: 10)
