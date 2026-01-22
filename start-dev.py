#!/usr/bin/env python3
"""
Development startup script for Curamete application.
This script starts both the frontend and backend servers.
"""

import subprocess
import sys
import os
import time
from threading import Thread

def start_frontend():
    """Start the frontend development server"""
    print("Starting frontend server...")
    try:
        # Use shell=True to ensure the command runs properly on Windows
        frontend = subprocess.Popen(
            "npm run dev",
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Print frontend output
        for line in frontend.stdout:
            print(f"[FRONTEND] {line.strip()}")
            
    except Exception as e:
        print(f"Error starting frontend: {e}")

def start_backend():
    """Start the backend server"""
    print("Starting backend server...")
    try:
        # Change to backend directory
        backend_dir = os.path.join(os.getcwd(), "backend")
        os.chdir(backend_dir)
        
        backend = subprocess.Popen(
            "python main.py",
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Print backend output
        for line in backend.stdout:
            print(f"[BACKEND] {line.strip()}")
            
    except Exception as e:
        print(f"Error starting backend: {e}")

def main():
    print("Starting Curamete development servers...")
    print("Press Ctrl+C to stop both servers.")
    
    # Start backend in a separate thread
    backend_thread = Thread(target=start_backend)
    backend_thread.daemon = True
    backend_thread.start()
    
    # Give backend a moment to start
    time.sleep(2)
    
    # Start frontend in main thread
    start_frontend()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        sys.exit(0)