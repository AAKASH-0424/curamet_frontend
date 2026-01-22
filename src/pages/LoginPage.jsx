import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, HeartPulse } from 'lucide-react';

// --- Animated Particles Background Component ---
const ParticlesBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();

        let particles = [];
        const particleCount = 70;

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.8 - 0.4;
                this.speedY = Math.random() * 0.8 - 0.4;
                this.color = `rgba(167, 243, 208, ${Math.random() * 0.4 + 0.1})`;
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
            }
        };
        initParticles();

        const connectParticles = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        opacityValue = 1 - (distance / 120);
                        ctx.strokeStyle = `rgba(110, 231, 183, ${opacityValue * 0.5})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        window.addEventListener('resize', resizeCanvas);
        
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />;
};


const LoginPage = ({ setUser, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const mouseX = (x / width) * 100;
        const mouseY = (y / height) * 100;
        card.style.setProperty('--mouse-x', `${mouseX}%`);
        card.style.setProperty('--mouse-y', `${mouseY}%`);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setUser(email);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', email);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans text-white overflow-hidden">
        <ParticlesBackground />
        <div ref={cardRef} className="card-spotlight relative w-full max-w-sm rounded-2xl bg-slate-800/90 backdrop-blur-lg border border-slate-700/50 shadow-2xl overflow-hidden">
            
            {/* Subtle Static Glow Effect */}
            <div className="absolute -inset-px bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-md opacity-40"></div>
            
            <div className="relative z-10 p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-slate-900/50 rounded-full mb-4 ring-1 ring-slate-700">
                        <HeartPulse size={40} className="text-cyan-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-wider">Curamate</h1>
                    <p className="text-slate-400 text-sm">Welcome back! Please log in.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              id="email" type="email" required
                              className="block w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
                              placeholder="your@email.com"
                              value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              id="password" type="password" required
                              className="block w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
                              placeholder="••••••••"
                              value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium bg-gradient-to-r from-cyan-600 to-blue-700 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-all transform hover:scale-105">
                          Log In
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <style jsx global>{`
            .card-spotlight::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(
                    circle 400px at var(--mouse-x) var(--mouse-y),
                    rgba(34, 211, 238, 0.1),
                    transparent 80%
                );
                border-radius: inherit;
                pointer-events: none;
                transition: opacity 0.4s;
                opacity: 0;
            }
            .card-spotlight:hover::before {
                opacity: 1;
            }
        `}</style>
    </div>
  );
};

export default LoginPage;

