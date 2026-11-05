import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Send, ShieldAlert, Volume2, VolumeX, Sparkles, 
  CornerDownLeft, Radio, AlertTriangle, CheckCircle, RefreshCw 
} from 'lucide-react';
import { Language, VoiceAssistantResponse } from '../types';
import { translations } from '../locales/translations';
import { speechService } from '../services/speech';
import { ApiService } from '../services/api';

interface VoiceAssistantViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onTriggerSos: () => void;
  currentCoords?: { latitude: number; longitude: number };
  onNavigate: (view: string) => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  isEmergency?: boolean;
  recommendedAction?: string;
  timestamp: string;
}

export const VoiceAssistantView: React.FC<VoiceAssistantViewProps> = ({
  language,
  onLanguageChange,
  onTriggerSos,
  currentCoords,
  onNavigate,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emergencyAlertActive, setEmergencyAlertActive] = useState<boolean>(false);

  const t = translations[language];

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text:
        language === 'te'
          ? 'నమస్కారం! నేను మీ AURASAFE24 రక్షణ అసిస్టెంట్‌ని. మీకు ఏదైనా భయంగా ఉన్నా లేదా అత్యవసర పరిస్థితి ఎదురైనా నాకు చెప్పండి. నేను వెంటనే సహాయం చేస్తాను.'
          : "Hello! I am your AURASAFE24 Safety Assistant. If you feel unsafe or need help, speak to me in English or Telugu. I am here to protect you.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Suggested commands in English and Telugu
  const englishSamples = [
    "I am feeling unsafe.",
    "Send an emergency alert.",
    "Share my location.",
    "I am safe.",
    "Find nearby police station.",
  ];

  const teluguSamples = [
    "నాకు భయంగా ఉంది.",
    "నాకు సహాయం కావాలి.",
    "నా లొకేషన్ పంపించు.",
    "అత్యవసర అలర్ట్ పంపించు.",
    "నేను సురక్షితంగా ఉన్నాను.",
  ];

  const sampleCommands = language === 'te' ? teluguSamples : englishSamples;

  const handleToggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    setErrorMsg(null);
    setTranscript('');

    if (!speechService.isSpeechSupported()) {
      setErrorMsg(
        language === 'te'
          ? 'ఈ బ్రౌజర్‌లో మైక్రోఫోన్ వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి టైప్ చేయండి.'
          : 'Speech recognition is not supported in this browser. Please use text input.'
      );
      return;
    }

    setIsListening(true);
    speechService.startListening(
      language,
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          setIsListening(false);
          handleSend(text);
        }
      },
      (err) => {
        console.warn('Speech err:', err);
        setIsListening(false);
        setErrorMsg(
          language === 'te'
            ? 'మైక్ గుర్తించడంలో సమస్య వచ్చింది. దయచేసి స్పష్టంగా మాట్లాడండి లేదా టైప్ చేయండి.'
            : 'Voice input error. Please speak clearly or type your message.'
        );
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || textInput || transcript).trim();
    if (!textToSend || isThinking) return;

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTextInput('');
    setTranscript('');
    setIsThinking(true);
    setErrorMsg(null);

    try {
      const response: VoiceAssistantResponse = await ApiService.askVoiceAssistant(
        textToSend,
        language,
        currentCoords
      );

      const replyText = language === 'te' ? response.responseTextTe : response.responseTextEn;

      const assistantMsg: Message = {
        sender: 'assistant',
        text: replyText,
        isEmergency: response.isEmergency,
        recommendedAction: response.recommendedAction,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If Emergency Intent detected, trigger urgent SOS prompt immediately
      if (response.isEmergency) {
        setEmergencyAlertActive(true);
        // Play alert audio cue or speak immediate direction
        if (autoSpeak) {
          speechService.speak(replyText, language);
        }
      } else if (autoSpeak) {
        speechService.speak(replyText, language);
      }

      // Action recommendations
      if (response.recommendedAction === 'SHOW_MAP') {
        setTimeout(() => onNavigate('map'), 1500);
      } else if (response.recommendedAction === 'SHOW_CONTACTS') {
        setTimeout(() => onNavigate('contacts'), 2000);
      }

    } catch (err: any) {
      console.error(err);
      const fallbackReply =
        language === 'te'
          ? 'క్షమించండి, సర్వర్ స్పందించలేదు. మీరు ఆపదలో ఉంటే దయచేసి వెంటనే రెడ్ అలర్ట్ బటన్ నొక్కండి.'
          : 'Service temporarily busy. If you are in immediate danger, please trigger RED ALERT immediately.';
      
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-24 md:pb-12 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t.voiceTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.voiceSubtitle}
            </p>
          </div>
        </div>

        {/* Audio Output Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => {
              setAutoSpeak(!autoSpeak);
              if (autoSpeak) speechService.stopSpeaking();
            }}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              autoSpeak
                ? 'bg-purple-50 border-purple-200 text-purple-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
            title="Toggle Text to Speech"
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {autoSpeak ? 'Audio On' : 'Muted'}
            </span>
          </button>
        </div>
      </div>

      {/* Emergency Intent Alert Banner (Immediate Bypass Option) */}
      {emergencyAlertActive && (
        <div className="bg-red-600 text-white rounded-3xl p-5 shadow-xl shadow-red-600/30 border-2 border-red-400 flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-red-600 flex items-center justify-center font-black">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">
                {t.voiceEmergencyDetected}
              </h3>
              <p className="text-xs text-red-100">
                {language === 'te'
                  ? 'మీ మాటల్లో అత్యవసర పరిస్థితి కనిపించింది. ఆలస్యం చేయకుండా రెడ్ అలర్ట్ పంపండి.'
                  : 'Distress or danger detected. Trigger Red Alert immediately without conversational delays.'}
              </p>
            </div>
          </div>
          <button
            onClick={onTriggerSos}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-white hover:bg-red-50 text-red-700 font-black text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t.voiceTriggerSosNow}</span>
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-2.5 rounded-2xl flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Conversation Thread */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-purple-100 shadow-sm min-h-[340px] max-h-[460px] overflow-y-auto flex flex-col space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-purple-800 text-white rounded-tr-none'
                  : msg.isEmergency
                  ? 'bg-red-50 text-red-950 border border-red-200 rounded-tl-none font-medium'
                  : 'bg-purple-50/70 text-slate-800 border border-purple-100/60 rounded-tl-none'
              }`}
            >
              {msg.isEmergency && (
                <div className="flex items-center gap-1.5 text-xs font-black text-red-600 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>EMERGENCY DETECTED</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {msg.isEmergency && (
                <div className="mt-3 pt-2 border-t border-red-200">
                  <button
                    onClick={onTriggerSos}
                    className="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{t.sosModalConfirmBtn}</span>
                  </button>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-start">
            <div className="bg-purple-50 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-purple-700 font-semibold flex items-center gap-2 border border-purple-100">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-ping"></div>
              <span>
                {language === 'te' ? 'AURASAFE24 ఆలోచిస్తోంది...' : 'AURASAFE24 AI is thinking...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Waveform & Microphone Controls */}
      <div className="bg-gradient-to-b from-white to-purple-50/50 rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col items-center justify-center text-center">
        {/* Animated Listening Waveform */}
        <div className="h-12 flex items-center justify-center gap-1.5 mb-3">
          {isListening ? (
            <>
              <div className="w-1.5 bg-purple-700 rounded-full voice-wave-bar" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 bg-purple-600 rounded-full voice-wave-bar" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-1.5 bg-purple-800 rounded-full voice-wave-bar" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 bg-indigo-600 rounded-full voice-wave-bar" style={{ animationDelay: '0.4s' }}></div>
              <div className="w-1.5 bg-purple-600 rounded-full voice-wave-bar" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 bg-purple-700 rounded-full voice-wave-bar" style={{ animationDelay: '0.5s' }}></div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Radio className="w-3.5 h-3.5" />
              <span>{t.voiceTapToSpeak} ({language === 'te' ? 'తెలుగు' : 'English'})</span>
            </div>
          )}
        </div>

        {/* Live speech transcription text preview */}
        {isListening && transcript && (
          <div className="text-xs font-semibold text-purple-900 bg-purple-100/60 px-4 py-2 rounded-xl mb-4 max-w-md">
            "{transcript}"
          </div>
        )}

        {/* Big Mic Button */}
        <button
          onClick={handleToggleListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer group active:scale-95 ${
            isListening
              ? 'bg-gradient-to-tr from-red-600 to-rose-500 shadow-red-500/40 animate-pulse'
              : 'bg-gradient-to-tr from-purple-800 via-purple-700 to-indigo-600 shadow-purple-800/30 hover:scale-105'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start speaking'}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 group-hover:scale-110 transition-transform" />
          ) : (
            <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <span className="text-xs font-bold text-slate-700 mt-3">
          {isListening ? t.voiceListening : t.voiceTapToSpeak}
        </span>
      </div>

      {/* Text input fallback form */}
      <div className="bg-white rounded-3xl p-3 border border-purple-100 shadow-sm flex items-center gap-2">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={t.voiceTextFallbackPlaceholder}
          className="flex-1 px-4 py-2.5 text-sm bg-transparent border-0 focus:outline-hidden text-slate-800 placeholder-slate-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={!textInput.trim() || isThinking}
          className="p-3 rounded-2xl bg-purple-800 hover:bg-purple-900 disabled:opacity-40 text-white transition-all cursor-pointer"
          aria-label="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Command Chips */}
      <div>
        <span className="text-xs font-bold text-slate-500 mb-2 block">
          {t.voiceTryCommands}
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleCommands.map((cmd, i) => (
            <button
              key={i}
              onClick={() => handleSend(cmd)}
              className="py-1.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/60 text-purple-900 text-xs font-medium transition-colors text-left"
            >
              "{cmd}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
