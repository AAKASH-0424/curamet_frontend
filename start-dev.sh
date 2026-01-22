#!/bin/bash

echo "Starting Curamete Development Environment..."
echo "=========================================="

# Start backend server in background
echo "Starting Backend Server..."
cd ../backend
python main.py &
BACKEND_PID=$!
cd ../frontend

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "Starting Frontend Server..."
npm run dev

# Kill backend when frontend is stopped
kill $BACKEND_PID