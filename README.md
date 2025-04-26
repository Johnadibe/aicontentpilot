# AIContentPilot 🚀

<!-- [![Build Status](https://travis-ci.org/yourusername/aiwpautogenja.svg?branch=main)](https://travis-ci.org/yourusername/aiwpautogenja) -->

**AI-powered blog post generator with seamless WordPress integration.**

AIContentPilot helps content creators, marketers, and businesses generate high-quality, optimized blog posts effortlessly. Leverage advanced AI to research topics, write engaging content, and publish directly to your WordPress sites, streamlining your content workflow.

<!-- Optional: Add a screenshot or GIF here -->
<!-- ![AIContentPilot Screenshot](link/to/your/screenshot.png) -->

## ✨ Key Features

- **🤖 AI-Powered Content Generation**: Create unique blog posts on any topic. Customize tone, length, and style to match your brand voice.
- **🔗 Direct WordPress Integration**: Publish generated content directly to multiple WordPress sites with a single click.
- **📂 Content Management Dashboard**: Organize, edit, review, and track the status of all your generated blog posts in one place.
- **📊 Analytics Overview**: Monitor key metrics like content generation volume, usage statistics, and more (feature details may vary by plan).
- **💳 Flexible Subscription Plans**: Choose from Free, Basic, and Premium tiers to fit your needs, offering varying levels of features and usage limits.
- **🔒 Secure Authentication**: Sign up and log in securely using Google OAuth or traditional email/password credentials via NextAuth.js.
- **💸 Integrated Payments**: Manage your subscription easily with Stripe integration.

## 🛠️ Tech Stack

- **Frontend**:
  - [Next.js](https://nextjs.org/) 14 (React Framework)
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/) (UI Components)
  - [Framer Motion](https://www.framer.com/motion/) (Animations)
- **Backend**:
  - [FastAPI](https://fastapi.tiangolo.com/) (Python Web Framework)
  - [Python](https://www.python.org/) 3.x
  - [Autogen](https://microsoft.github.io/autogen/) (AI Agent Framework - _Assumed based on repo name_)
- **Database**:
  - [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **Authentication**:
  - [NextAuth.js](https://next-auth.js.org/) (Google OAuth & Credentials Provider)
- **Payments**:
  - [Stripe](https://stripe.com/) (Subscription Management)
- **Deployment & Infrastructure**:
  - [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

## 🚀 Getting Started

Follow these instructions to set up and run the project locally using Docker.

### Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (Usually included with Docker Desktop)
- Access keys/secrets for required services (Google OAuth, Stripe, Neon DB, potentially OpenAI/other AI model providers for Autogen).

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Johnadibe/aicontentpilot.git
    cd aiwpautogenja
    ```

2.  **Configure Environment Variables:**

    - This project requires environment variables for various services. You'll likely need separate `.env` files for the frontend and backend.
    - **Frontend:** Create a `.env.local` file in the `frontend` directory. Refer to `frontend/.env.example` (if provided) for required variables like:
      ```dotenv
      # frontend/.env.local
      NEXTAUTH_URL=http://localhost:3000
      NEXTAUTH_SECRET= # Generate a strong secret: openssl rand -base64 32
      GOOGLE_CLIENT_ID=
      GOOGLE_CLIENT_SECRET=
      STRIPE_SECRET_KEY= # Use test key for development
      STRIPE_PUBLIC_KEY= # Use test key for development
      NEXT_PUBLIC_API_URL=http://localhost:8000 # URL of your FastAPI backend
      # ... other frontend specific variables
      ```
    - **Backend:** Create a `.env` file in the `backend` directory. Refer to `backend/.env.example` (if provided) for required variables like:
      ```dotenv
      # backend/.env
      DATABASE_URL=postgresql://user:password@host:port/dbname # Your Neon connection string
      SECRET_KEY= # For JWT or other security features
      OPENAI_API_KEY= # Or other AI provider keys needed by Autogen
      # ... other backend specific variables (e.g., CORS origins)
      ```
    - **Important:** Obtain the necessary API keys and credentials from Google Cloud Console, Stripe Dashboard, Neon, and your AI service provider. **Never commit your `.env` files with secrets to Git.**

3.  **Build Docker Images (Optional but recommended first time):**
    - From the project root directory:
    ```bash
    docker-compose build
    ```

### Running the Application

1.  **Start the services using Docker Compose:**

    - For development (assuming `docker-compose.yml` or `docker-compose.dev.yml`):

      ```bash
      # Using default file
      docker-compose up

      # Or specifying a dev file
      # docker-compose -f docker-compose.dev.yml up
      ```

    - This will start the Next.js frontend, FastAPI backend, and potentially other services defined in your compose file.

2.  **Access the application:**

    - Frontend: [http://localhost:3000](http://localhost:3000) (or the port specified in your frontend setup)
    - Backend API Docs (FastAPI): [http://localhost:8000/docs](http://localhost:8000/docs) (or the port specified for the backend)

3.  **Stopping the application:**
    - Press `Ctrl + C` in the terminal where `docker-compose up` is running.
    - To remove the containers, run:
      ```bash
      docker-compose down
      ```

## ⚙️ Configuration

- **Environment Variables**: As mentioned in the setup, configure `.env.local` (frontend) and `.env` (backend) with your specific keys and settings.
- **Docker Compose**: Modify `docker-compose.yml` (and potentially `docker-compose.dev.yml`, `docker-compose.prod.yml`) to adjust service configurations, ports, volumes, etc.

## 🚢 Deployment

- This application is designed to be deployed using Docker containers.
- You can adapt the `docker-compose.yml` or create a production-specific version (`docker-compose.prod.yml`) for deployment.
- Deployment platforms like AWS ECS, Google Cloud Run, Kubernetes, or managed hosting with Docker support can be used.
- Ensure proper handling of secrets and environment variables in your production environment.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

Please read `CONTRIBUTING.md` (if available) for more detailed contribution guidelines.
