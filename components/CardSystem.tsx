import React, { useState, useEffect } from 'react';
import { CARDS } from '../constants';
import { UserAnswer, CardType, CardOption } from '../types';
import { ArrowRight, Check, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';

interface CardSystemProps {
  onComplete: (answers: UserAnswer[]) => void;
}

const CardSystem: React.FC<CardSystemProps> = ({ onComplete }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentValue, setCurrentValue] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const card = CARDS[currentCardIndex];
  const progress = ((currentCardIndex + 1) / CARDS.length) * 100;

  // Reset value when card changes
  useEffect(() => {
    // Logic to set default values for specific card types
    if (card.type === CardType.SORTABLE && card.options) {
      setCurrentValue(card.options.map(o => o.value)); // Default order
    } else if (card.type === CardType.SLIDER) {
        setCurrentValue(0.5);
    } else {
      setCurrentValue(null);
    }
    setError(null);
    setIsAnimating(false);
  }, [card]);

  const validate = (): boolean => {
    if (card.type === CardType.TEXT_INPUT || card.type === CardType.TEXT_AREA) {
      if (!currentValue || (typeof currentValue === 'string' && currentValue.trim() === '')) {
        setError("请填写内容后再继续");
        return false;
      }
    }
    if (card.type === CardType.SINGLE_SELECT) {
      if (!currentValue) {
        setError("请选择一个选项");
        return false;
      }
    }
    if (card.type === CardType.MULTI_SELECT) {
      if (!currentValue || !Array.isArray(currentValue) || currentValue.length === 0) {
        setError("请至少选择一个选项");
        return false;
      }
    }
    // SLIDER and SORTABLE always have defaults
    return true;
  };

  const handleNext = () => {
    if (!validate()) {
      return;
    }

    const newAnswer: UserAnswer = {
      cardId: card.id,
      value: currentValue
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentCardIndex < CARDS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentCardIndex(prev => prev + 1);
      }, 300);
    } else {
      onComplete(newAnswers);
    }
  };

  const renderInput = () => {
    switch (card.type) {
      case CardType.TEXT_INPUT:
        const textVal = typeof currentValue === 'string' ? currentValue : '';
        return (
          <input
            type="text"
            className={`w-full bg-edge-800 border ${error ? 'border-red-500' : 'border-edge-700'} rounded-lg p-4 text-white focus:ring-2 focus:ring-edge-accent focus:border-transparent outline-none transition-all`}
            placeholder={card.placeholder || "输入你的回答..."}
            value={textVal}
            onChange={(e) => {
              setCurrentValue(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            autoFocus
          />
        );
      case CardType.TEXT_AREA:
        const areaVal = typeof currentValue === 'string' ? currentValue : '';
        return (
          <textarea
            className={`w-full h-32 bg-edge-800 border ${error ? 'border-red-500' : 'border-edge-700'} rounded-lg p-4 text-white focus:ring-2 focus:ring-edge-accent focus:border-transparent outline-none transition-all resize-none`}
            placeholder={card.placeholder || "输入你的思考..."}
            value={areaVal}
            onChange={(e) => {
               setCurrentValue(e.target.value);
               if (error) setError(null);
            }}
            autoFocus
          />
        );
      case CardType.SLIDER:
        const sliderVal = typeof currentValue === 'number' ? currentValue : 0.5;
        return (
          <div className="space-y-6">
             <div className="flex justify-between text-sm text-gray-400 font-medium">
                <span>{card.minLabel}</span>
                <span>{card.maxLabel}</span>
             </div>
             <input
               type="range"
               min="0"
               max="1"
               step="0.1"
               value={sliderVal}
               onChange={(e) => setCurrentValue(parseFloat(e.target.value))}
               className="w-full h-2 bg-edge-700 rounded-lg appearance-none cursor-pointer accent-edge-accent"
             />
             <div className="text-center text-edge-glow font-mono">
               Value: {sliderVal}
             </div>
          </div>
        );
      case CardType.SINGLE_SELECT:
        return (
          <div className="space-y-3">
            {card.options?.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setCurrentValue(opt.value);
                  if (error) setError(null);
                }}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  currentValue === opt.value
                    ? 'bg-edge-accent/20 border-edge-accent text-white'
                    : 'bg-edge-800 border-edge-700 text-gray-400 hover:border-edge-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        );
      case CardType.MULTI_SELECT:
        const selected = Array.isArray(currentValue) ? (currentValue as string[]) : [];
        const toggleSelection = (val: string) => {
           if (error) setError(null);
           if (selected.includes(val)) {
             setCurrentValue(selected.filter(v => v !== val));
           } else {
             if (selected.length < (card.maxSelections || 99)) {
               setCurrentValue([...selected, val]);
             }
           }
        };
        return (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 text-right">已选 {selected.length} / {card.maxSelections}</p>
            {card.options?.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleSelection(opt.value)}
                className={`w-full flex justify-between items-center p-4 rounded-lg border transition-all ${
                  selected.includes(opt.value)
                    ? 'bg-edge-accent/20 border-edge-accent text-white'
                    : 'bg-edge-800 border-edge-700 text-gray-400 hover:border-edge-500'
                }`}
              >
                <span>{opt.label}</span>
                {selected.includes(opt.value) && <Check className="w-4 h-4 text-edge-accent" />}
              </button>
            ))}
          </div>
        );
      case CardType.SORTABLE:
        // Safeguard: Ensure currentOrder is an array
        const rawOrder = Array.isArray(currentValue) ? (currentValue as string[]) : [];
        const currentOrder = rawOrder.length > 0 ? rawOrder : (card.options?.map(o => o.value) || []);
        
        const moveItem = (index: number, direction: -1 | 1) => {
          const newOrder = [...currentOrder];
          if (index + direction < 0 || index + direction >= newOrder.length) return;
          
          const temp = newOrder[index];
          newOrder[index] = newOrder[index + direction];
          newOrder[index + direction] = temp;
          setCurrentValue(newOrder);
        };
        
        return (
          <div className="space-y-2">
             {currentOrder.map((val, idx) => {
               const opt = card.options?.find(o => o.value === val);
               return (
                 <div key={val} className="flex items-center gap-3 bg-edge-800 border border-edge-700 p-3 rounded-lg">
                   <div className="flex flex-col gap-1">
                      <button 
                        disabled={idx === 0} 
                        onClick={() => moveItem(idx, -1)}
                        className="text-gray-500 hover:text-white disabled:opacity-20"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button 
                        disabled={idx === currentOrder.length - 1} 
                        onClick={() => moveItem(idx, 1)}
                        className="text-gray-500 hover:text-white disabled:opacity-20"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                   </div>
                   <span className="flex-1 text-gray-300">{idx + 1}. {opt?.label || val}</span>
                 </div>
               );
             })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className={`w-full max-w-2xl transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-edge-accent text-sm font-mono tracking-wider mb-1">{card.module}</h2>
            <div className="text-gray-600 text-xs font-mono">Card {card.id} / {CARDS.length}</div>
          </div>
          <div className="w-32 h-1 bg-edge-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-edge-accent transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Card Content */}
        <div className="bg-edge-900/80 border border-edge-800 rounded-2xl p-8 backdrop-blur-md shadow-2xl shadow-edge-900/50">
           <h3 className="text-2xl text-white font-medium mb-8 leading-relaxed">
             {card.question}
           </h3>

           <div className="min-h-[200px]">
             {renderInput()}
           </div>

           {error && (
             <div className="mt-4 flex items-center gap-2 text-red-400 text-sm animate-pulse">
               <AlertCircle className="w-4 h-4" />
               <span>{error}</span>
             </div>
           )}

           <div className="mt-8 flex justify-end">
             <button
               onClick={handleNext}
               className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
             >
               <span>{currentCardIndex === CARDS.length - 1 ? "完成构建" : "继续"}</span>
               <ArrowRight className="w-4 h-4" />
             </button>
           </div>
        </div>

        {/* Decorative elements */}
        {card.type === CardType.SLIDER && (
           <div className="mt-4 text-center text-xs text-edge-accent/50 animate-pulse">
             系统正在校准你的认知倾向...
           </div>
        )}
      </div>
    </div>
  );
};

export default CardSystem;