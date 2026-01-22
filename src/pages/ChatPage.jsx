import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, Trash2, Send, Bot, User, Activity, WifiOff, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';

// --- Chat Storage Utilities ---
const getStorageKey = (user, chatId) => `chatHistory_${user}_${chatId}`;

const saveChatToStorage = (user, chatId, messages, sessionData) => {
  if (!user || !chatId) return;
  try {
    const chatData = { messages, sessionData };
    localStorage.setItem(getStorageKey(user, chatId), JSON.stringify(chatData));
  } catch (error) {
    console.error("Failed to save chat to storage:", error);
  }
};

const loadChatFromStorage = (user, chatId) => {
  if (!user || !chatId) return null;
  try {
    const storedData = localStorage.getItem(getStorageKey(user, chatId));
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Failed to load chat from storage:", error);
    return null;
  }
};

const clearChatFromStorage = (user, chatId) => {
  if (!user || !chatId) return;
  try {
    localStorage.removeItem(getStorageKey(user, chatId));
  } catch (error) {
    console.error("Failed to clear chat from storage:", error);
  }
};


const ChatPage = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [websocket, setWebsocket] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [chatId, setChatId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null); 
    const [sessionData, setSessionData] = useState({}); 
    const [csvData, setCsvData] = useState({}); 
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const isInitialLoad = useRef(true);

    const generateMessageId = () => Date.now() + Math.random();

    useEffect(() => {
        const uniqueChatId = `${user}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setChatId(uniqueChatId);
    }, [user]);

    useEffect(() => {
        if (chatId && user && isInitialLoad.current) {
            const storedChat = loadChatFromStorage(user, chatId);
            if (storedChat) {
                setMessages(storedChat.messages || []);
                setSessionData(storedChat.sessionData || {});
                if (storedChat.sessionData && storedChat.sessionData.currentQuestion) {
                    setCurrentQuestion(storedChat.sessionData.currentQuestion);
                }
            }
            isInitialLoad.current = false;
        }
    }, [chatId, user]);

    useEffect(() => {
        if (chatId && user && !isInitialLoad.current) {
            saveChatToStorage(user, chatId, messages, { ...sessionData, currentQuestion });
        }
    }, [messages, sessionData, currentQuestion, chatId, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleConversationalResponse = useCallback((data) => {
        if (data.message) {
            const botMessage = { id: generateMessageId(), text: data.message, sender: 'bot', timestamp: new Date().toLocaleTimeString() };
            setMessages(prev => [...prev, botMessage]);
            return;
        }

        if (data.followups && data.followups.length > 0) {
            const firstQuestion = data.followups[0];
            const questionText = `**${firstQuestion.question}**\n\n*Please answer this question to help me understand your condition better.*`;
            const botMessage = { id: generateMessageId(), text: questionText, sender: 'bot', timestamp: new Date().toLocaleTimeString() };
            setMessages(prev => [...prev, botMessage]);
            setCurrentQuestion(firstQuestion);
            setSessionData(prev => ({ ...prev, followups: data.followups, decisionRules: data.decision_rules || [], all_csv_data: data.all_csv_data || {} }));
            return;
        }
        
        if (data.diseases && data.diseases.length > 0) {
            let response = "**Based on the information you've provided, here are some possible conditions:**\n\n";
            data.diseases.forEach((disease, index) => {
                response += `${index + 1}. **${disease.disease || disease.disease_id || 'Unknown Condition'}**\n`;
                Object.entries(disease).forEach(([key, value]) => {
                    if (key !== 'disease_id' && key !== 'disease' && value) {
                        response += `  - **${key.replace(/_/g, ' ')}:** ${value}\n`;
                    }
                });
                response += "\n";
            });
            const botMessage = { id: generateMessageId(), text: response, sender: 'bot', timestamp: new Date().toLocaleTimeString() };
            setMessages(prev => [...prev, botMessage]);
            setCurrentQuestion(null);
            return;
        }

        const formatResponse = (data) => {
            if (data.message) return data.message;
            let response = "";
            Object.entries(data).forEach(([tableName, rows]) => {
                if (!rows || rows.length === 0) return;
                response += `**${tableName.replace(/_/g, ' ').toUpperCase()}**\n\n`;
                rows.forEach((row, index) => {
                    response += `${index + 1}.\n`;
                    Object.entries(row).forEach(([key, value]) => {
                        if (key && value) response += `  - **${key.replace(/_/g, ' ')}:** ${value}\n`;
                    });
                    response += "\n";
                });
            });
            return response || "No relevant information found.";
        };

        const formattedResponse = formatResponse(data);
        const botMessageText = (formattedResponse && formattedResponse !== "No relevant information found.") ? formattedResponse : "I need more information to help you. Can you tell me more about your symptoms?";
        const botMessage = { id: generateMessageId(), text: botMessageText, sender: 'bot', timestamp: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, botMessage]);
    }, []);
    
    useEffect(() => {
        if (!chatId) return;
        const ws = new WebSocket('ws://localhost:8000/ws');
        setWebsocket(ws);
        setConnectionStatus('connecting');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            setConnectionStatus('connected');
            setTimeout(() => {
                if (chatId) {
                    ws.send(JSON.stringify({ type: "init", chatId, user }));
                }
            }, 100);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (!data.chatId || data.chatId === chatId) {
                    if (data.type === 'greeting') {
                        setMessages(prev => [...prev, { id: generateMessageId(), text: data.message, sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
                    } else if (data.type === 'query_response') {
                        handleConversationalResponse(data.data);
                        setLoading(false);
                    } else if (data.type === 'data_update' || data.type === 'initial_data') {
                        setCsvData(data.data);
                        setSessionData(prev => ({ ...prev, all_csv_data: data.data }));
                    }
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };
        ws.onclose = () => setConnectionStatus('disconnected');
        ws.onerror = () => setConnectionStatus('error');
        return () => ws.close();
    }, [chatId, user, handleConversationalResponse]);


    const handleFinalDiagnosis = (sessionData) => {
        let possibleDiseases = [];
        const all_csv_data = sessionData.all_csv_data || {};
        if (sessionData.decisionRules && sessionData.decisionRules.length > 0) {
            const diseaseScores = {};
            sessionData.decisionRules.forEach(rule => {
                const diseaseId = rule.disease_id;
                const keywords = rule.condition_keywords?.split(',') || [];
                const minDuration = parseInt(rule.min_duration_days) || 0;
                const scoreWeight = parseInt(rule.score_weight) || 1;
                let score = 0;
                keywords.forEach(keyword => {
                    const trimmedKeyword = keyword.trim();
                    Object.entries(sessionData).forEach(([key, value]) => {
                        if (!['followups', 'decisionRules', 'all_csv_data'].includes(key) && typeof value === 'string' && value.toLowerCase().includes(trimmedKeyword)) {
                            score += scoreWeight;
                        }
                    });
                });
                if (minDuration > 0 && sessionData.duration_days && parseInt(sessionData.duration_days) >= minDuration) {
                    score += scoreWeight;
                }
                if (score > 0) {
                    diseaseScores[diseaseId] = (diseaseScores[diseaseId] || 0) + score;
                }
            });
            possibleDiseases = Object.entries(diseaseScores).map(([diseaseId, score]) => ({ diseaseId, score })).sort((a, b) => b.score - a.score);
        }
        
        let response;
        if (possibleDiseases.length > 0) {
            const topDisease = possibleDiseases[0];
            const diseaseDetails = all_csv_data.diseases || [];
            const diseaseInfo = diseaseDetails.find(d => d.disease_id === topDisease.diseaseId);
            
            response = `### Based on your symptoms, the most likely condition is:\n\n**${diseaseInfo?.disease || topDisease.diseaseId}**\n\n`;
            if (diseaseInfo) {
                Object.entries(diseaseInfo).forEach(([key, value]) => {
                    if (key !== 'disease_id' && key !== 'disease' && value) {
                        response += `- **${key.replace(/_/g, ' ')}:** ${value}\n`;
                    }
                });
            }
        } else {
            response = "Thank you for the information. Based on your symptoms, I recommend consulting with a healthcare professional for an accurate diagnosis. Would you like me to provide information on any specific condition?";
        }
        setMessages(prev => [...prev, { id: generateMessageId(), text: response, sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
        setCurrentQuestion(null);
    };

    const handleFollowupAnswer = (answer) => {
        if (!currentQuestion) {
            setLoading(false);
            return;
        }
        const updatedSessionData = { ...sessionData, [currentQuestion.field]: answer };
        setSessionData(updatedSessionData);

        const followups = sessionData.followups || [];
        const currentIndex = followups.findIndex(q => q.q_id === currentQuestion.q_id);
        const nextQuestion = followups[currentIndex + 1];

        if (nextQuestion) {
            const questionText = `**${nextQuestion.question}**\n\n*Please answer this question...*`;
            setMessages(prev => [...prev, { id: generateMessageId(), text: questionText, sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
            setCurrentQuestion(nextQuestion);
            setLoading(false);
        } else {
            handleFinalDiagnosis(updatedSessionData);
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim() || loading) return;
        const userMessageText = inputValue.trim();
        const newUserMessage = { id: generateMessageId(), text: userMessageText, sender: 'user', timestamp: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setLoading(true);

        if (currentQuestion) {
            setTimeout(() => handleFollowupAnswer(userMessageText), 300);
            return;
        }

        if (websocket && websocket.readyState === WebSocket.OPEN && chatId) {
            websocket.send(JSON.stringify({ type: "query", query: userMessageText, chatId, user }));
        } else {
            setTimeout(() => {
                setMessages(prev => [...prev, { id: generateMessageId(), text: "Connection error. Please try again.", sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
                setLoading(false);
            }, 1000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleLogout = () => {
        if (chatId && user) clearChatFromStorage(user, chatId);
        localStorage.removeItem('currentUser');
        navigate('/auth');
    };

    const clearChatHistory = () => {
        setMessages([]);
        setSessionData({});
        setCurrentQuestion(null);
        if (chatId && user) clearChatFromStorage(user, chatId);
    };

    const ConnectionIndicator = () => {
        const statusConfig = {
            connected: { text: "Online", color: "bg-green-500" },
            connecting: { text: "Connecting...", color: "bg-yellow-500" },
            disconnected: { text: "Offline", color: "bg-red-500" },
            error: { text: "Error", color: "bg-red-500" },
        };
        const { text, color } = statusConfig[connectionStatus];
        return (
             <div className="flex items-center ml-3">
                <div className={`w-2.5 h-2.5 rounded-full mr-2 ${color} ${connectionStatus !== 'disconnected' && 'animate-pulse'}`}></div>
                <span className="text-xs text-gray-500 font-medium">{text}</span>
            </div>
        );
    };

    return (
        <div className="flex h-screen flex-col bg-gradient-to-t from-blue-200 via-blue-50 to-white font-sans text-gray-800">
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Chat Header */}
                <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-b border-gray-200/80">
                    <div className="flex items-center justify-between p-4 max-w-6xl mx-auto h-20">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="h-10 w-10 bg-cyan-500 rounded-full flex items-center justify-center shadow-md">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-cyan-900">Curamate AI Assistant</h1>
                                <ConnectionIndicator />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                             <span className="text-gray-600 hidden sm:block text-sm">Welcome, {user}</span>
                            <button onClick={clearChatHistory} className="p-2 rounded-full text-gray-500 hover:bg-gray-200/70 hover:text-gray-800 transition-colors"><Trash2 size={18} /></button>
                            <button onClick={handleLogout} className="p-2 rounded-full text-gray-500 hover:bg-gray-200/70 hover:text-gray-800 transition-colors"><Power size={18} /></button>
                        </div>
                    </div>
                </header>
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 pb-28">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {messages.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-block p-8 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100">
                                    <div className="flex justify-center mb-6">
                                        <div className="bg-gradient-to-br from-cyan-100 to-blue-200 p-5 rounded-full">
                                            <MessageSquare size={48} className="text-cyan-600" />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Curamete!</h2>
                                    <p className="text-gray-600 mb-8 text-lg">How can I help you today? Feel free to describe your symptoms.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {["I have a fever", "I have a headache", "I have stomach pain"].map(symptom => (
                                            <button key={symptom} onClick={() => setInputValue(symptom)}
                                                className="bg-white border border-gray-200 hover:bg-cyan-50 text-cyan-800 font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-105 shadow-sm hover:shadow-md">
                                                {symptom}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div key={message.id} className={`flex items-end gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {message.sender === 'bot' && <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 shadow-sm"><Bot size={18} className="text-white"/></div>}
                                    <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-md ${
                                        message.sender === 'user' 
                                            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-none' 
                                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                    }`}>
                                        <div className="prose prose-sm max-w-none prose-p:text-gray-700 prose-headings:text-gray-800 prose-strong:text-gray-800">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                                        </div>
                                    </div>
                                    {message.sender === 'user' && <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><User size={18} className="text-gray-600"/></div>}
                                </div>
                            ))
                        )}
                        {loading && (
                             <div className="flex items-end gap-3 justify-start">
                                 <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 shadow-sm"><Bot size={18} className="text-white"/></div>
                                <div className="max-w-[75%] rounded-2xl p-4 bg-white rounded-bl-none border border-gray-100 shadow-md">
                                    <div className="flex space-x-2">
                                        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce"></div>
                                        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                
                {/* Chat Input */}
                <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200/80 p-4 fixed bottom-0 left-0 right-0">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center rounded-xl border border-gray-300 overflow-hidden shadow-sm bg-white focus-within:ring-2 focus-within:ring-cyan-500">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={currentQuestion ? "Please answer the question above..." : "Describe your symptoms..."}
                                className="flex-1 px-5 py-4 focus:outline-none text-gray-800 bg-transparent placeholder-gray-500"
                                disabled={loading || connectionStatus !== 'connected'}
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !inputValue.trim() || connectionStatus !== 'connected'}
                                className="px-5 py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                               <Send size={20} className="text-cyan-500 group-hover:text-cyan-700 group-disabled:text-gray-400 transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;

