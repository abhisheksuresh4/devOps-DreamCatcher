# Dream Journal App

A full-stack web application that allows users to record their dreams and receive AI-powered interpretations using Gemini.

## Features

- Record dreams with timestamp
- Get AI interpretations of your dreams
- View all past dreams and their interpretations
- Delete dreams
- PostgreSQL database for persistent storage
- Vanilla JavaScript frontend
- Express backend with RESTful API

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL (node-postgres)
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **AI**: Google Gemini API

## Project Structure

```
dream-journal/
├── server.js           # Express server and API routes
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (create this)
├── .env.example       # Example env file
└── public/
    ├── index.html     # Frontend HTML
    ├── styles.css     # Styles
    └── app.js         # Frontend JavaScript
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-3.6-flash
PORT=3001
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
DB_SCHEMA=public
```

For a local Postgres: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:17`

Get your API key from: https://aistudio.google.com/apikey

### 3. Run the Application

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The app will be available at `http://localhost:3001`

## API Endpoints

- `GET /api/dreams` - Get all dreams
- `GET /api/dreams/:id` - Get a specific dream
- `POST /api/dreams` - Create a new dream (requires `dream_text` in body)
- `DELETE /api/dreams/:id` - Delete a dream

## Deployment to Render

Everything is defined in `render.yaml` (a Render Blueprint):

| Resource | Branch | Data |
|---|---|---|
| `dream-catcher` (web, Docker) | `main` | `public` schema |
| `dream-catcher-staging` (web, Docker) | `staging` | `staging` schema |
| `dream-catcher-db` (Postgres, free) | n/a | shared by both services |

Render allows one free Postgres per workspace, so production and staging share
one instance and are separated by schema (`DB_SCHEMA`). `DATABASE_URL` is wired
in automatically from the database; `GEMINI_API_KEY` must be entered in the
Render dashboard for each service.

Release flow: push to `staging`, check the staging URL, then merge into `main`.

Note: free Render Postgres databases expire 30 days after creation. Upgrade the
database plan to keep data long term.

## Usage

1. Enter your dream in the text area
2. Click "Get Interpretation" to save the dream and receive an AI interpretation
3. View all your dreams below, sorted by most recent
4. Click "Delete" to remove a dream

## License

MIT