// start-dev.js — works from frontend folder where this file lives
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting Curamete Development Environment...');
console.log('==========================================\n');

// Resolve repo root (parent of frontend)
const repoRoot = resolve(__dirname, '..'); // D:\curamete\curamete
const backendFolder = resolve(repoRoot, 'backend'); // D:\curamete\curamete\backend
const backendScript = resolve(backendFolder, 'main.py'); // D:\curamete\curamete\backend\main.py

// Spawn backend
console.log('Starting Backend Server...');
const backend = spawn('python', [backendScript], {
  cwd: backendFolder,
  stdio: 'inherit',
  // do NOT set shell:true unless you need shell features; safer without it
});

// If you use Windows and 'python' isn't recognized, try 'py' or full path to python exe.

backend.on('error', (err) => {
  console.error('Error starting backend server:', err);
});

backend.on('close', (code) => {
  console.log(`Backend server exited with code ${code}`);
});

// Start frontend after a short delay so backend boots first
setTimeout(() => {
  console.log('\nStarting Frontend Server...');
  // run `npm run dev` inside the frontend folder (this file's folder)
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    // no shell:true
  });

  frontend.on('close', (code) => {
    console.log(`Frontend server exited with code ${code}`);
    // kill backend if still running
    try { backend.kill(); } catch(e){}
    process.exit(code ?? 0);
  });

  frontend.on('error', (error) => {
    console.error('Error starting frontend server:', error);
    try { backend.kill(); } catch(e){}
  });
}, 2000);

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  try { backend.kill(); } catch(e){}
  process.exit(0);
});
