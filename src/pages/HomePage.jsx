import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Logo from '../assets/logo.jpg';

// --- SVG Icon Components ---
const CheckIcon = () => (
  <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const QuestionIcon = () => (
  <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FeatureIcon = ({ children }) => (
    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-cyan-100 text-cyan-600 mb-6 shadow-inner">
        {children}
    </div>
);

// --- FAQ Data and Component ---
const faqData = [
  {
    question: "Is Curamate a replacement for a doctor?",
    answer: "No, Curamate is an AI-powered health assistant designed to provide information and support. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any medical concerns."
  },
  {
    question: "How does the smart reminder feature work?",
    answer: "You can set up your medication schedule in the chat. Our AI will then send you timely reminders. It can also adapt to your routine, asking you if you'd like to adjust reminder times based on your activity."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We prioritize your privacy and use end-to-end encryption for all conversations. Your personal health information is kept confidential and is not shared with third parties."
  },
  {
    question: "What kind of questions can I ask the AI?",
    answer: "You can ask a wide range of health-related questions, from understanding symptoms and medical terms to information about medications, first-aid procedures, and general wellness tips."
  }
];

const FaqSection = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-20 bg-cyan-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-cyan-800 mb-2">Have Questions?</h2>
        <p className="text-lg text-gray-600 mb-10">We've got answers. Here are some of the most common things we get asked.</p>
        <div className="space-y-4 text-left">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
              <button onClick={() => toggleFaq(index)} className="w-full p-5 flex justify-between items-center text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-300 hover:bg-cyan-50/70">
                <span className="text-left">{faq.question}</span>
                <svg className={`w-6 h-6 transform transition-transform duration-300 flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-5 pt-0 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const HomePage = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-200 via-blue-50 to-white font-sans text-gray-800">
      {/* --- Navigation --- */}
      <nav className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex-shrink-0 flex items-center">
                <img src={Logo} alt="Curamete Logo" className="h-10 w-10 rounded-full shadow-md object-cover" />
                <span className="ml-3 text-2xl font-bold text-cyan-800">Curamate</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 hidden sm:block">Welcome, {user}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Main Content Section --- */}
      <main>
        {/* --- Hero Section --- */}
        <div className="relative flex flex-col items-center justify-center text-center py-20 md:py-28 px-4 bg-gradient-to-t from-blue-200/50 via-blue-100/50 to-white/0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-cyan-300/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-200/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          <div className="w-full max-w-4xl z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-cyan-900 tracking-tight drop-shadow-lg">
              Would You Rather: Health Situations
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Which path aligns with your health priorities?
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 text-left flex flex-col transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                <div className="flex items-center mb-4"><CheckIcon /><h2 className="ml-3 text-2xl font-bold text-gray-800">Scenario A</h2></div>
                <ul className="space-y-3 text-gray-600 flex-grow">
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-1">&#10003;</span><span>Always remember to take your medication exactly on time, every time.</span></li>
                  <li className="flex items-start"><span className="text-red-500 mr-2 mt-1">&ndash;</span><span>But miss out on occasional spontaneous dinner plans due to strict timing.</span></li>
                </ul>
              </div>
              <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 text-left flex flex-col transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                <div className="flex items-center mb-4"><QuestionIcon /><h2 className="ml-3 text-2xl font-bold text-gray-800">Scenario B</h2></div>
                <ul className="space-y-3 text-gray-600 flex-grow">
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-1">&#10003;</span><span>Enjoy complete freedom with your schedule, dining out whenever.</span></li>
                  <li className="flex items-start"><span className="text-red-500 mr-2 mt-1">&ndash;</span><span>But risk forgetting your medication 1-2 times a month, requiring alarms.</span></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12"><button onClick={() => navigate('/chat')} className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-cyan-600 hover:bg-cyan-700 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">Find Your Solution</button></div>
          </div>
        </div>

        {/* --- How It Works Section --- */}
        <section className="py-20 bg-white/70">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-cyan-800 mb-4">A Simpler Path to Health Management</h2>
                <p className="text-lg text-gray-600 mb-12">In just three simple steps, Curamate revolutionizes your health routine.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div className="flex flex-col items-center p-6 bg-white/80 rounded-xl shadow-md transform transition hover:scale-105 hover:shadow-lg"><div className="text-4xl font-bold text-cyan-500 bg-cyan-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">1</div><h3 className="text-xl font-semibold mb-2 text-gray-800">Chat & Share</h3><p className="text-gray-500">Start a conversation with our AI about your health questions or medication schedule.</p></div>
                    <div className="flex flex-col items-center p-6 bg-white/80 rounded-xl shadow-md transform transition hover:scale-105 hover:shadow-lg"><div className="text-4xl font-bold text-cyan-500 bg-cyan-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">2</div><h3 className="text-xl font-semibold mb-2 text-gray-800">Get Smart Insights</h3><p className="text-gray-500">Receive instant, reliable information and personalized reminders tailored to you.</p></div>
                    <div className="flex flex-col items-center p-6 bg-white/80 rounded-xl shadow-md transform transition hover:scale-105 hover:shadow-lg"><div className="text-4xl font-bold text-cyan-500 bg-cyan-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">3</div><h3 className="text-xl font-semibold mb-2 text-gray-800">Live Healthier</h3><p className="text-gray-500">Enjoy peace of mind with a health partner that's always available, 24/7.</p></div>
                </div>
            </div>
        </section>
        
        {/* --- Features Section --- */}
        <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-cyan-800 mb-12">Your All-in-One Health Toolkit</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="flex flex-col items-center p-6 rounded-lg transform transition hover:-translate-y-2"><FeatureIcon><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></FeatureIcon><h3 className="text-xl font-semibold mb-2 text-gray-800">Adaptive Reminders</h3><p className="text-gray-500">Our smart system learns your routine to send medication reminders at the perfect time.</p></div>
                    <div className="flex flex-col items-center p-6 rounded-lg transform transition hover:-translate-y-2"><FeatureIcon><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></FeatureIcon><h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Health AI</h3><p className="text-gray-500">Ask any health-related question and get clear, reliable answers in seconds.</p></div>
                    <div className="flex flex-col items-center p-6 rounded-lg transform transition hover:-translate-y-2"><FeatureIcon><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></FeatureIcon><h3 className="text-xl font-semibold mb-2 text-gray-800">Emergency Guide</h3><p className="text-gray-500">Access step-by-step guidance for common medical emergencies.</p></div>
                </div>
            </div>
        </section>

        {/* --- FAQ Section --- */}
        <FaqSection />

        {/* --- Footer --- */}
        <footer className="bg-slate-100/70 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
              <img src={Logo} alt="Curamete Logo" className="h-12 w-12 rounded-full shadow-md mx-auto mb-4 object-cover" />
                <h3 className="text-xl font-bold text-cyan-800 mb-2">Curamate</h3>
                <p className="text-sm mb-4">Your health, simplified.</p>
                <p className="text-xs">&copy; {new Date().getFullYear()} Curamate. All Rights Reserved.</p>
            </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;

