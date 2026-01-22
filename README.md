# Curamete - Medical Chat Bot

Curamete is a medical chatbot application that provides emergency care information through a real-time connection to a medical database.

## Features

- Real-time WebSocket connection to backend medical database
- Emergency care symptom checker
- Responsive chat interface
- User authentication (accepts any email/password)

## Architecture

- **Frontend**: React 19 with Vite
- **Backend**: Python FastAPI with WebSocket
- **Styling**: Tailwind CSS
- **Data**: CSV-based medical information

## Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- npm or yarn

## Setup

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`.

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```
   python main.py
   ```

   The backend will be available at `http://localhost:8000`.

## Usage

1. Start both the frontend and backend servers
2. Open your browser and navigate to `http://localhost:5173`
3. Log in with any email and password
4. Navigate to the chat page
5. Ask questions about medical symptoms, treatments, or emergency care

## Project Structure

```
curamete/
├── backend/          # Python FastAPI backend
│   ├── main.py       # Main server file
│   ├── requirements.txt # Python dependencies
│   └── README.md     # Backend documentation
├── data/             # Medical data files
│   ├── diseases.csv
│   ├── emergency_care.csv
│   ├── medications.csv
│   └── symptoms.csv
├── src/              # React frontend source
│   ├── App.jsx       # Main application component
│   ├── main.jsx      # Entry point
│   └── index.css     # Global styles
├── index.html        # HTML entry point
├── package.json      # Frontend dependencies
└── vite.config.js    # Vite configuration
```

## Application Pages

1. **Login Page** - Simple authentication with any email/password
2. **Home Page** - Overview of the application with navigation to chat
3. **Chat Page** - Interactive medical chatbot interface

## WebSocket Communication

The frontend connects to the backend via WebSocket at `ws://localhost:8000/ws`. The backend serves all CSV data from the data folder and responds to user queries with relevant medical information.

## Development

### Frontend Development

- Uses React 19 with functional components and hooks
- React Router for navigation
- Tailwind CSS for styling
- WebSocket for real-time communication

### Backend Development

- FastAPI for REST API and WebSocket handling
- Automatic periodic data updates
- CORS configuration for frontend communication

## Deployment

To build the frontend for production:

```
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build:

```
npm run preview
```