import React, { useState, useRef, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
  Maximize2,
  Minimize2,
  AlertCircle,
  PiggyBank,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BachatMitra: React.FC = () => {
  const {
    selectedCustomer,
    isMitraOpen,
    setIsMitraOpen,
    mitraMessages,
    sendMitraMessage,
    resetMitraChat,
    speakText,
    accessibility,
    updateAccessibility,
  } = useCustomer();

  const [inputVal, setInputVal] = useState('');
  const [purchaseAmountPrompt, setPurchaseAmountPrompt] = useState(false);
  const [customPurchaseVal, setCustomPurchaseVal] = useState('10000');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isMitraOpen) {
      scrollToBottom();
    }
  }, [mitraMessages, isMitraOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    sendMitraMessage(inputVal.trim());
    setInputVal('');
  };

  const quickActions = [
    'Can I afford a ₹10,000 purchase?',
    'Help me save money',
    'Analyze my financial health',
    'Why is my risk increasing?',
    'Create a recovery plan',
    'Help me reduce expenses',
  ];

  const handleQuickAction = (action: string) => {
    sendMitraMessage(action);
  };

  const handleAffordCheck = () => {
    const val = customPurchaseVal.trim() || '10000';
    sendMitraMessage(`Can I afford a ₹${val} purchase?`);
    setPurchaseAmountPrompt(false);
  };

  return (
    <>
      {/* Floating Collapsed Button */}
      {!isMitraOpen && (
        <button
          type="button"
          id="btn-open-bachat-mitra"
          onClick={() => setIsMitraOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white p-3 sm:px-4 sm:py-3 rounded-2xl shadow-xl hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-200 flex items-center space-x-2.5 border border-indigo-400/40 group"
          aria-label="Open Bachat Mitra AI Financial Co-Pilot"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-800" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-extrabold tracking-tight flex items-center gap-1">
              <span>Bachat Mitra</span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-white/20 font-mono">
                AI Co-Pilot
              </span>
            </div>
            <div className="text-[10px] text-indigo-200 font-medium">Ask financial guidance &rarr;</div>
          </div>
        </button>
      )}

      {/* Expanded Co-Pilot Drawer / Modal */}
      {isMitraOpen && (
        <aside
          id="bachat-mitra-drawer"
          className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 w-auto sm:w-[420px] h-[560px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border-2 border-indigo-500/30 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-150"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-extrabold tracking-tight text-white">
                    Bachat Mitra
                  </h3>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Co-Pilot
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 flex items-center gap-1.5">
                  <span>Context: {selectedCustomer.name}</span>
                  <span>&bull;</span>
                  <span className="font-mono text-indigo-300">
                    {selectedCustomer.riskLevel.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {/* Voice Readout Toggle */}
              <button
                type="button"
                onClick={() =>
                  updateAccessibility({ voiceFriendly: !accessibility.voiceFriendly })
                }
                className={`p-1.5 rounded-lg transition-colors ${
                  accessibility.voiceFriendly
                    ? 'text-emerald-400 bg-emerald-950/50'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={accessibility.voiceFriendly ? 'Voice reading active' : 'Enable voice readout'}
              >
                {accessibility.voiceFriendly ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={resetMitraChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="btn-close-bachat-mitra"
                onClick={() => setIsMitraOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Pills Scrollable Bar */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200/80 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1">
              Quick:
            </span>
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickAction(action)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 text-[11px] font-semibold text-slate-700 hover:text-indigo-700 border border-slate-200/90 whitespace-nowrap transition-colors shrink-0 shadow-2xs"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs custom-scrollbar overscroll-contain pr-2">
            {mitraMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${
                    isUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-2xs text-xs font-bold ${
                      isUser
                        ? 'bg-slate-900 text-white'
                        : 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`w-full max-w-[85%] space-y-2`}>
                    <div
                      className={`p-3.5 rounded-2xl shadow-2xs leading-relaxed ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                      }`}
                    >
                      <p
                        className="text-xs font-medium recommendation-text"
                        style={{
                          wordBreak: 'normal',
                          overflowWrap: 'break-word',
                          whiteSpace: 'normal',
                          lineHeight: 1.5,
                        }}
                      >
                        {msg.text}
                      </p>

                      {/* Structured Purchase Verdict Card */}
                      {msg.structuredDetails && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5 text-[11px]">
                          <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                            <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[10px]">
                              AFFORDABILITY IMPACT
                            </span>
                            <span
                              className={`font-extrabold px-2 py-0.5 rounded-full text-[10px] tracking-wide border ${
                                msg.structuredDetails.impactVerdict === 'AFFORDABLE'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : msg.structuredDetails.impactVerdict === 'CAUTION'
                                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                                  : 'bg-rose-100 text-rose-800 border-rose-200'
                              }`}
                            >
                              {msg.structuredDetails.impactVerdict === 'STRESS_WARNING'
                                ? 'AT RISK'
                                : msg.structuredDetails.impactVerdict}
                            </span>
                          </div>

                          {/* Visual Buffer Runway Transition */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                              Buffer Runway
                            </span>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs font-extrabold">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                                  {msg.structuredDetails.bufferBefore ||
                                    (msg.structuredDetails.bufferChange?.includes('→')
                                      ? msg.structuredDetails.bufferChange.split('→')[0].trim()
                                      : '14 Days')}
                                </span>
                                <span className="text-slate-400 font-bold text-sm">→</span>
                                <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                                  {msg.structuredDetails.bufferAfter ||
                                    (msg.structuredDetails.bufferChange?.includes('→')
                                      ? msg.structuredDetails.bufferChange.split('→')[1].trim()
                                      : '5 Days')}
                                </span>
                              </div>
                              {msg.structuredDetails.impactVerdict !== 'AFFORDABLE' && (
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                  -9 Days
                                </span>
                              )}
                            </div>
                          </div>

                          {msg.structuredDetails.recommendationSummary && (
                            <div className="text-slate-600 text-[11px] font-medium leading-relaxed bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70">
                              <strong className="text-amber-900 font-semibold block mb-0.5">
                                Recommendation:
                              </strong>
                              {msg.structuredDetails.recommendationSummary}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Direct CTA button if provided */}
                      {msg.actionSuggestion && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <Link
                            to={msg.actionSuggestion.route || '/simulator'}
                            onClick={() => setIsMitraOpen(false)}
                            className="inline-flex items-center space-x-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                          >
                            <span>{msg.actionSuggestion.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>

                    <div
                      className={`text-[9px] text-slate-400 font-mono px-1 ${
                        isUser ? 'text-right' : 'text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Purchase Tool Popup */}
          {purchaseAmountPrompt && (
            <div className="p-3 bg-indigo-50 border-t border-indigo-100 flex items-center justify-between gap-2 text-xs">
              <span className="font-bold text-indigo-900">Check purchase affordability:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-slate-500">₹</span>
                <input
                  type="number"
                  value={customPurchaseVal}
                  onChange={(e) => setCustomPurchaseVal(e.target.value)}
                  className="w-24 px-2 py-1 rounded-lg border border-indigo-200 text-xs font-mono font-bold"
                  placeholder="10000"
                />
                <button
                  type="button"
                  onClick={handleAffordCheck}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px]"
                >
                  Analyze
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseAmountPrompt(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <button
              type="button"
              onClick={() => setPurchaseAmountPrompt(!purchaseAmountPrompt)}
              className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition-colors"
              title="Quick Affordability Calculator"
            >
              <PiggyBank className="w-4 h-4" />
            </button>

            <input
              type="text"
              id="bachat-mitra-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Bachat Mitra: 'Can I afford ₹10,000?'"
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-indigo-600 bg-slate-50/50"
            />

            <button
              type="submit"
              id="btn-send-mitra-msg"
              disabled={!inputVal.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-all shadow-2xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Advisory Disclaimer Notice */}
          <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            Advisory simulations powered by CashTwin AI. Not certified financial advice.
          </div>
        </aside>
      )}
    </>
  );
};
