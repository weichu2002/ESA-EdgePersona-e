import React, { useState, useEffect, useRef } from 'react';
import { PersonalityProfile, ChatMessage } from '../types';
import { generatePersonaResponse, saveMilestone, sendFeedbackToEdge } from '../services/edgeService';
import { Send, User, Bot, Sparkles, AlertCircle, ThumbsUp, ThumbsDown, X, Activity } from 'lucide-react';

interface ChatInterfaceProps {
  profile: PersonalityProfile;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `已接入边缘节点。我是 ${profile.name}。我的核心逻辑已根据你的 ${profile.coreIdentities[0] || '特质'} 进行初始化。我们聊聊？`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(true);
  const [showGraphModal, setShowGraphModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Get AI response
      const responseText = await generatePersonaResponse([...messages, userMsg], profile);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = (msgId: string, type: 'like' | 'dislike', content: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === msgId ? { ...msg, feedback: type } : msg
    ));
    
    // Send reinforcement signal to the edge
    sendFeedbackToEdge(type, content);
  };

  const renderPersonalityGraph = () => (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-edge-900 border border-edge-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <button 
          onClick={() => setShowGraphModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-8 border-b border-edge-800 pb-4">
          <Activity className="w-6 h-6 text-edge-accent" />
          <h2 className="text-xl font-bold text-white">人格动态图谱</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Core Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-gray-500 uppercase mb-2">核心身份</h3>
              <div className="flex flex-wrap gap-2">
                {profile.coreIdentities.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 uppercase mb-2">价值观序列</h3>
              <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                 {Array.isArray(profile.values) ? profile.values.map((v, i) => (
                   <li key={i} className="pl-2">{v}</li>
                 )) : <li className="pl-2">数据加载中...</li>}
              </ol>
            </div>
          </div>

          {/* Column 2: Traits Visualization */}
          <div className="space-y-5">
             <h3 className="text-sm text-gray-500 uppercase mb-2">思维特征</h3>
             
             {/* Trait: Rationality */}
             <div>
               <div className="flex justify-between text-xs text-gray-400 mb-1">
                 <span>感性</span>
                 <span>理性</span>
               </div>
               <div className="h-2 bg-edge-800 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-blue-500 to-purple-500" 
                   style={{ width: `${(profile.traits.rationality || 0.5) * 100}%` }}
                 ></div>
               </div>
             </div>

             {/* Trait: Risk */}
             <div>
               <div className="flex justify-between text-xs text-gray-400 mb-1">
                 <span>规避风险</span>
                 <span>热衷冒险</span>
               </div>
               <div className="h-2 bg-edge-800 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-green-500 to-yellow-500" 
                   style={{ width: `${(profile.traits.risk || 0.5) * 100}%` }}
                 ></div>
               </div>
             </div>

             {/* Trait: Planning */}
             <div>
               <div className="flex justify-between text-xs text-gray-400 mb-1">
                 <span>计划导向</span>
                 <span>随性而为</span>
               </div>
               <div className="h-2 bg-edge-800 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-pink-500 to-orange-500" 
                   style={{ width: `${(profile.traits.planning || 0.5) * 100}%` }}
                 ></div>
               </div>
             </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-edge-800 text-center">
           <p className="text-xs text-edge-glow/70 font-mono animate-pulse">
             系统正在根据交互数据实时微调神经权重...
           </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-black text-gray-200 overflow-hidden relative">
      
      {/* Modals */}
      {showGraphModal && renderPersonalityGraph()}

      {showMilestoneModal && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-edge-900 border border-edge-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
             <div className="flex items-center gap-3 text-edge-accent mb-4">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold text-lg">每日大事记</h3>
             </div>
             <p className="text-gray-400 mb-4 text-sm">今日有什么值得铭记的时刻？这将成为我的核心记忆。</p>
             <textarea 
                className="w-full bg-edge-800 rounded p-3 text-white text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-edge-accent"
                placeholder="例如：赢得了初选，但感觉..."
                id="milestone-input"
             />
             <div className="flex justify-end gap-3">
               <button 
                 onClick={() => setShowMilestoneModal(false)}
                 className="text-gray-500 text-sm hover:text-white"
               >
                 跳过
               </button>
               <button 
                 onClick={() => {
                   const val = (document.getElementById('milestone-input') as HTMLTextAreaElement).value;
                   if(val) saveMilestone(val, "reflecting");
                   setShowMilestoneModal(false);
                 }}
                 className="bg-edge-accent text-black px-4 py-2 rounded text-sm font-medium hover:bg-edge-glow"
               >
                 记录并同步
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full bg-edge-900/30 border-x border-edge-800">
        
        {/* Header */}
        <div className="p-4 border-b border-edge-800 bg-edge-900/80 backdrop-blur flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-edge-800 to-edge-700 border border-edge-600 flex items-center justify-center overflow-hidden">
                 <img src="https://picsum.photos/100/100" alt="Avatar" className="w-full h-full object-cover opacity-80" />
              </div>
              <div>
                <h2 className="text-white font-medium">{profile.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest">Edge Online</span>
                </div>
              </div>
           </div>
           <button 
            className="text-xs font-medium text-edge-accent border border-edge-accent/30 px-3 py-2 rounded hover:bg-edge-accent/10 transition-colors flex items-center gap-2"
            onClick={() => setShowGraphModal(true)}
           >
             <Activity className="w-3 h-3" />
             查看人格图谱
           </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-edge-700 border border-edge-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-edge-accent" />}
              </div>
              
              <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/30 rounded-tr-none' 
                    : 'bg-edge-800 text-gray-200 border border-edge-700 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                
                {/* Feedback Buttons for Assistant */}
                {msg.role === 'assistant' && (
                   <div className="mt-2 flex gap-2">
                      <button 
                        onClick={() => handleFeedback(msg.id, 'like', msg.content)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] transition-all ${
                          msg.feedback === 'like' 
                            ? 'bg-green-500/20 border-green-500 text-green-400' 
                            : 'bg-edge-900 border-edge-700 text-gray-500 hover:border-edge-500 hover:text-gray-300'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        这很像我
                      </button>
                      <button 
                        onClick={() => handleFeedback(msg.id, 'dislike', msg.content)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] transition-all ${
                          msg.feedback === 'dislike' 
                            ? 'bg-red-500/20 border-red-500 text-red-400' 
                            : 'bg-edge-900 border-edge-700 text-gray-500 hover:border-edge-500 hover:text-gray-300'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                        这不像我
                      </button>
                   </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-4">
               <div className="w-8 h-8 bg-edge-700 rounded-full border border-edge-600 flex items-center justify-center">
                 <Bot className="w-4 h-4 text-edge-accent" />
               </div>
               <div className="bg-edge-800 border border-edge-700 p-4 rounded-2xl rounded-tl-none">
                 <div className="flex gap-1">
                   <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                   <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                 </div>
               </div>
             </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-edge-900 border-t border-edge-800">
          <div className="relative">
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="与你的镜像对话..."
               className="w-full bg-black border border-edge-700 rounded-xl py-4 pl-4 pr-12 text-white focus:ring-1 focus:ring-edge-accent focus:border-edge-accent outline-none placeholder-gray-600"
             />
             <button 
               onClick={handleSend}
               disabled={!input.trim() || isTyping}
               className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-edge-accent/10 text-edge-accent rounded-lg hover:bg-edge-accent hover:text-black transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-edge-accent"
             >
               <Send className="w-4 h-4" />
             </button>
          </div>
          <div className="text-center mt-2 text-[10px] text-gray-600">
             ESA Edge Powered by DeepSeek-V3 | E2E Encryption
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatInterface;