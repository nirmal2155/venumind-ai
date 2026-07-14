import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LANGUAGES = [
  { code: 'en-US', name: 'English', flag: '🇺🇸', greeting: 'Hello! I am VenueMind AI, your smart stadium concierge. How can I help you today?' },
  { code: 'ar-QA', name: 'Arabic', flag: '🇶🇦', greeting: 'مرحباً! أنا VenueMind AI، المساعد الذكي للملعب. كيف يمكنني مساعدتك اليوم؟' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸', greeting: '¡Hola! Soy VenueMind AI, el conserje inteligente del estadio. ¿Cómo puedo ayudarte hoy?' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷', greeting: 'Bonjour ! Je suis VenueMind AI, le concierge intelligent du stade. Comment puis-je vous aider aujourd\'hui ?' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷', greeting: 'Olá! Eu sou o VenueMind AI, o concierge inteligente do estádio. Como posso ajudar você hoje?' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪', greeting: 'Hallo! Ich bin VenueMind AI, Ihr intelligenter Stadion-Concierge. Wie kann ich Ihnen heute helfen?' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵', greeting: 'こんにちは！私はVenueMind AIです。スマートスタジアムコンシェルジュです。本日はどのようなご用件でしょうか？' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳', greeting: 'नमस्ते! मैं VenueMind AI हूँ, आपका स्मार्ट स्टेडियम कंसीयज। आज मैं आपकी क्या सहायता कर सकता हूँ?' }
];

const RESPONSES = {
  'en-US': {
    welcome: 'Hello! I am VenueMind AI...',
    prayer: 'I can help you find the prayer room near Gate A. Do you need a wheelchair-accessible route?',
    food: 'The nearest food court (Concessions) is just 2 minutes away. You can also order directly to your seat! 🍔',
    merchandise: 'The main FIFA Superstore is located near Gate B on Level 1. There is currently a 5-minute wait time. I have highlighted the path on your map.',
    lostFound: '🔍 Lost & Found Centre is at Gate A, Level 1, Desk 3 (open 24/7). Please describe your item to our AI log system — include color, brand, and last known location. I have notified security to look out for it.',
    fallback: 'I understand! As VenueMind AI, I am constantly monitoring the stadium. In this demo, try asking me about "Food", "Merchandise", "Prayer room", or "Lost item"!',
    routeYes: 'Routing via Elevators and Ramps. Path highlighted in blue. No stairs on this route. 🦽',
    routeNo: 'Certainly. Take the North Escalator to Level 3. Section 302 will be on your right.'
  },
  'ar-QA': {
    welcome: 'مرحباً! أنا VenueMind AI...',
    prayer: 'يمكنني مساعدتك في العثور على غرفة الصلاة بالقرب من البوابة A. هل تحتاج إلى مسار يسهل الوصول إليه بالكرسي المتحرك؟',
    food: 'أقرب صالة طعام تقع على بعد دقيقتين فقط. يمكنك أيضاً الطلب مباشرة إلى مقعدك! 🍔',
    merchandise: 'يقع متجر FIFA الرئيسي بالقرب من البوابة B في الطابق 1. الانتظار 5 دقائق. تم تحديد المسار على الخريطة.',
    lostFound: '🔍 مركز المفقودات عند البوابة A، الطابق 1، مكتب 3 (مفتوح 24/7). يرجى وصف غرضك المفقود: اللون، العلامة التجارية، وآخر موقع معروف. تم إخطار الأمن.',
    fallback: 'أنا أفهم! بصفتي VenueMind AI، أقوم بمراقبة الملعب. جرب السؤال عن "الطعام" أو "المتجر" أو "غرفة الصلاة" أو "الغرض المفقود"!',
    routeYes: 'التوجيه عبر المصاعد والمنحدرات. المسار محدد باللون الأزرق. لا توجد سلالم. 🦽',
    routeNo: 'بالتأكيد. خذ السلم الكهربائي الشمالي إلى المستوى 3. سيكون القسم 302 على يمينك.'
  },
  'es-ES': {
    welcome: '¡Hola! Soy VenueMind AI...',
    prayer: 'Puedo ayudarte a encontrar la sala de oración cerca de la Puerta A. ¿Necesitas una ruta accesible para silla de ruedas?',
    food: 'El patio de comidas más cercano está a solo 2 minutos. ¡También puedes ordenar directamente a tu asiento! 🍔',
    merchandise: 'La tienda oficial de FIFA está cerca de la Puerta B en el Nivel 1. La espera es de 5 minutos. Ruta marcada en el mapa.',
    lostFound: '🔍 El Centro de Objetos Perdidos está en la Puerta A, Nivel 1, Mostrador 3 (abierto 24/7). Por favor describe tu artículo: color, marca y última ubicación conocida.',
    fallback: '¡Comprendo! Como VenueMind AI, estoy monitoreando el estadio. ¡Intenta preguntar por "Comida", "Tienda", "Sala de oración" o "Objeto perdido"!',
    routeYes: 'Ruta por ascensores y rampas. Camino resaltado en azul. Sin escaleras. 🦽',
    routeNo: 'Claro. Toma la escalera mecánica norte al Nivel 3. La sección 302 estará a tu derecha.'
  },
  'fr-FR': {
    welcome: 'Bonjour ! Je suis VenueMind AI...',
    prayer: 'Je peux vous aider à trouver la salle de prière près de la Porte A. Avez-vous besoin d\'un itinéraire accessible aux fauteuils roulants ?',
    food: 'L\'aire de restauration la plus proche est à seulement 2 minutes. Vous pouvez aussi commander directement à votre siège ! 🍔',
    merchandise: 'La boutique officielle FIFA se trouve près de la Porte B au Niveau 1. L\'attente est de 5 minutes. Itinéraire tracé sur votre carte.',
    lostFound: '🔍 Le bureau des objets trouvés est à la Porte A, Niveau 1, Bureau 3 (ouvert 24h/24). Décrivez votre objet: couleur, marque, dernier emplacement connu.',
    fallback: 'Je comprends ! En tant que VenueMind AI, je surveille le stade. Essayez de demander "Nourriture", "Boutique", "Salle de prière" ou "Objet perdu" !',
    routeYes: 'Itinéraire via ascenseurs et rampes. Chemin surligné en bleu. Pas d\'escaliers sur ce trajet. 🦽',
    routeNo: 'Certainement. Prenez l\'escalator Nord jusqu\'au niveau 3. La section 302 sera sur votre droite.'
  },
  'pt-BR': {
    welcome: 'Olá! Eu sou o VenueMind AI...',
    prayer: 'Posso ajudar a encontrar a sala de oração perto do Portão A. Precisa de uma rota acessível para cadeiras de rodas?',
    food: 'A praça de alimentação mais próxima fica a apenas 2 minutos. Você também pode pedir direto no seu assento! 🍔',
    merchandise: 'A loja oficial da FIFA fica perto do Portão B no Nível 1. A espera é de 5 minutos. Rota destacada no seu mapa.',
    lostFound: '🔍 O Centro de Achados e Perdidos fica na Portão A, Nível 1, Balcão 3 (aberto 24h). Descreva seu item: cor, marca e último local conhecido.',
    fallback: 'Entendi! Como VenueMind AI, estou monitorando o estádio. Experimente perguntar sobre "Comida", "Loja", "Sala de oração" ou "Item perdido"!',
    routeYes: 'Rota por elevadores e rampas. Caminho destacado em azul. Sem escadas nesse percurso. 🦽',
    routeNo: 'Com certeza. Pegue a escada rolante norte até o Nível 3. A seção 302 estará à sua direita.'
  },
  'de-DE': {
    welcome: 'Hallo! Ich bin VenueMind AI...',
    prayer: 'Ich kann Ihnen helfen, den Gebetsraum nahe Tor A zu finden. Benötigen Sie eine barrierefreie Route?',
    food: 'Der nächste Food-Court ist nur 2 Minuten entfernt. Sie können auch direkt an Ihren Sitzplatz bestellen! 🍔',
    merchandise: 'Der FIFA Superstore befindet sich nahe Tor B auf Ebene 1. Wartezeit beträgt 5 Minuten. Route ist auf der Karte markiert.',
    lostFound: '🔍 Das Fundbüro befindet sich an Tor A, Ebene 1, Schalter 3 (24/7 geöffnet). Bitte beschreiben Sie Ihren verlorenen Gegenstand: Farbe, Marke und letzten bekannten Standort.',
    fallback: 'Ich verstehe! Als VenueMind AI überwache ich das Stadion. Fragen Sie mich nach "Essen", "Shop", "Gebetsraum" oder "Verlorener Gegenstand"!',
    routeYes: 'Route über Aufzüge und Rampen. Pfad blau markiert. Keine Treppen auf dieser Route. 🦽',
    routeNo: 'Sicher. Nehmen Sie die Nord-Rolltreppe zu Ebene 3. Block 302 befindet sich zu Ihrer Rechten.'
  },
  'ja-JP': {
    welcome: 'こんにちは！私はVenueMind AIです...',
    prayer: 'ゲートA近くの礼拝室をご案内できます。車椅子対応のルートが必要ですか？',
    food: '最寄りのフードコートは徒歩2分の場所にあります。座席への直接デリバリーも可能です！ 🍔',
    merchandise: '公式FIFAストアはレベル1のゲートB近くにあります。待ち時間は5分です。マップ上にルートを表示しました。',
    lostFound: '🔍 遺失物センターはゲートA、レベル1、カウンター3にあります（24時間営業）。お忘れ物の色、ブランド、最後に気づいた場所をお知らせください。',
    fallback: '分かりました！VenueMind AIとしてスタジアムを監視しています。「フード」「ショップ」「礼拝室」「忘れ物」について質問してみてください！',
    routeYes: 'エレベーターとスロープを使用するルートです。青いラインで表示されています。階段はありません。 🦽',
    routeNo: 'かしこまりました。北エスカレーターでレベル3へお進みください。セクション302は右側にあります。'
  },
  'hi-IN': {
    welcome: 'नमस्ते! मैं VenueMind AI हूँ...',
    prayer: 'मैं गेट ए (Gate A) के पास प्रार्थना कक्ष खोजने में आपकी मदद कर सकता हूँ। क्या आपको व्हीलचेयर-सुलभ रास्ता चाहिए?',
    food: 'सबसे नजदीकी फूड कोर्ट केवल 2 मिनट की दूरी पर है। आप सीधे अपनी सीट पर भी खाना ऑर्डर कर सकते हैं! 🍔',
    merchandise: 'मुख्य फीफा सुपरस्टोर लेवल 1 पर गेट बी के पास है। अभी 5 मिनट का वेटिंग टाइम है। रास्ता मैप पर दिखा दिया गया है।',
    lostFound: '🔍 खोया-पाया केंद्र गेट A, लेवल 1, काउंटर 3 पर है (24/7 खुला)। कृपया अपनी खोई हुई चीज़ का विवरण दें: रंग, ब्रांड और आखिरी जगह जहाँ वो थी। AI ने सुरक्षाकर्मियों को सूचित कर दिया है।',
    fallback: 'मैं समझ गया! VenueMind AI के रूप में मैं स्टेडियम की निगरानी कर रहा हूँ। "Food", "Merchandise", "Prayer room", या "खोई हुई चीज़" के बारे में पूछें!',
    routeYes: 'लिफ्ट और रैंप के माध्यम से मार्ग। रास्ता नीले रंग में हाइलाइट किया गया है। इस मार्ग पर कोई सीढ़ियां नहीं हैं। 🦽',
    routeNo: 'बिल्कुल। लेवल 3 के लिए नॉर्थ एस्केलेटर लें। सेक्शन 302 आपकी दाईं ओर होगा।'
  }
};

const Concierge = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]); // Default: English
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: LANGUAGES[0].greeting,
    }
  ]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    setMessages([
      {
        role: 'assistant',
        content: lang.greeting,
      }
    ]);
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLang.code;
      
      // Try to find a native voice for better quality
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(selectedLang.code.split('-')[0]));
      if (voice) utterance.voice = voice;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceClick = () => {
    if (isRecording) return;
    
    if (!('webkitSpeechRecognition' in window)) {
      setMessages(prev => [...prev, { role: 'assistant', content: '🎙️ Voice input requires Google Chrome. Please type your question instead.' }]);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedLang.code; // Dynamic Language Code

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const confirmRoute = (isAccessible) => {
    const lang = selectedLang.code;
    const resp = RESPONSES[lang] || RESPONSES['en-US'];

    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1].hasAccessPrompt = false;
      return [...updated, { role: 'user', content: isAccessible ? (lang === 'hi-IN' ? 'हाँ, सुलभ मार्ग' : 'Yes, accessible route') : (lang === 'hi-IN' ? 'नहीं, सबसे तेज़ मार्ग' : 'No, fastest route') }];
    });
    
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isAccessible ? resp.routeYes : resp.routeNo,
        hasMap: true,
        isAccessiblePath: isAccessible
      }]);
      setLoading(false);
    }, 1000);
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const lowerText = text.toLowerCase();
      const lang = selectedLang.code;
      const resp = RESPONSES[lang] || RESPONSES['en-US'];
      
      // Multi-lingual Match Triggers
      const matchesPrayer = lowerText.includes('prayer') || lowerText.includes('صلاة') || lowerText.includes('oración') || lowerText.includes('prière') || lowerText.includes('oração') || lowerText.includes('gebet') || lowerText.includes('礼拝') || lowerText.includes('प्रार्थना');
      const matchesFood = lowerText.includes('food') || lowerText.includes('hungry') || lowerText.includes('طعام') || lowerText.includes('comida') || lowerText.includes('nourriture') || lowerText.includes('essen') || lowerText.includes('フード') || lowerText.includes('भूख') || lowerText.includes('खाना');
      const matchesMerch = lowerText.includes('merchandise') || lowerText.includes('store') || lowerText.includes('shop') || lowerText.includes('متجر') || lowerText.includes('tienda') || lowerText.includes('boutique') || lowerText.includes('loja') || lowerText.includes('superstore') || lowerText.includes('ショップ') || lowerText.includes('दुकान');
      const matchesLost = lowerText.includes('lost') || lowerText.includes('missing') || lowerText.includes('found') || lowerText.includes('bag') || lowerText.includes('wallet') || lowerText.includes('phone') || lowerText.includes('مفقود') || lowerText.includes('perdido') || lowerText.includes('perdu') || lowerText.includes('verloren') || lowerText.includes('खोया') || lowerText.includes('گم') || lowerText.includes('忘れ');

      if (matchesPrayer) {
        setTimeout(() => {
          setMessages([...newMessages, { 
            role: 'assistant', 
            content: resp.prayer,
            hasAccessPrompt: true 
          }]);
          setLoading(false);
        }, 1000);
        return;
      } else if (matchesFood) {
        setTimeout(() => {
          setMessages([...newMessages, { 
            role: 'assistant', 
            content: resp.food,
            hasMap: false,
            hasFoodOrder: true
          }]);
          setLoading(false);
        }, 1500);
        return;
      } else if (matchesMerch) {
        setTimeout(() => {
          setMessages([...newMessages, { 
            role: 'assistant', 
            content: resp.merchandise,
            hasMap: true
          }]);
          setLoading(false);
        }, 1500);
        return;
      } else if (matchesLost) {
        setTimeout(() => {
          setMessages([...newMessages, {
            role: 'assistant',
            content: resp.lostFound,
          }]);
          setLoading(false);
        }, 1200);
        return;
      }

      setTimeout(async () => {
        try {
          // 🤖 REAL GEMINI API CALL via backend proxy
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `[FIFA World Cup 2026 - Lusail Stadium - Language: ${selectedLang.name}] ${text}. Reply in ${selectedLang.name} language.`
            })
          });
          const data = await res.json();
          setMessages([...newMessages, {
            role: 'assistant',
            content: data.reply || resp.fallback
          }]);
        } catch {
          // Fallback if backend unreachable
          setMessages([...newMessages, { role: 'assistant', content: resp.fallback }]);
        }
        setLoading(false);
      }, 200);
      
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' }]);
      setLoading(false);
    }
  };

  return (
    <div className="flex-col" style={{ height: '100%', padding: '1.5rem', zIndex: 1, position: 'relative' }}>
      
      {/* Header Status */}
      <div className="flex-col" style={{ alignItems: 'center', marginBottom: '1rem', marginTop: '0.5rem' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(43,255,136,0.2)', marginBottom: '0.75rem' }}>
          <Bot size={36} color="#000" />
        </div>
        <h3 className="text-accent-green" style={{ fontSize: '1rem', letterSpacing: '0.5px', fontWeight: 'bold' }}>Concierge AI Active</h3>
        
        {/* Flag Language Switcher Bar */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', width: '100%', padding: '8px 0', justifyContent: 'flex-start', marginTop: '8px', scrollbarWidth: 'none' }}>
          {LANGUAGES.map((lang) => (
            <button 
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              style={{
                background: selectedLang.code === lang.code ? 'rgba(43,255,136,0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedLang.code === lang.code ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}>
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-col gap-4" style={{ flex: 1, overflowY: 'auto', paddingBottom: '220px', scrollbarWidth: 'none' }}>
        
        {messages.map((msg, idx) => (
          <div key={idx} className="flex-row" style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <article className="glass-card" style={{ 
              borderTopLeftRadius: msg.role === 'assistant' ? 0 : '16px', 
              borderTopRightRadius: msg.role === 'user' ? 0 : '16px',
              padding: '1.25rem', 
              maxWidth: '85%',
              background: msg.role === 'user' ? 'rgba(43, 255, 136, 0.1)' : 'var(--bg-card)',
              borderColor: msg.role === 'user' ? 'var(--border-green)' : 'var(--border-glass)',
              position: 'relative'
            }}>
              {msg.role === 'assistant' && (
                <button 
                  onClick={() => handleSpeak(msg.content)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, padding: '4px' }}>
                  <Volume2 size={16} color="var(--accent-green)" />
                </button>
              )}
              <p style={{ lineHeight: '1.5', fontSize: '1rem', color: 'var(--text-primary)', marginTop: msg.role === 'assistant' ? '15px' : '0' }}>{msg.content}</p>
              
              {/* Accessibility Prompt */}
              {msg.hasAccessPrompt && (
                <div className="flex-col gap-2" style={{ marginTop: '1rem' }}>
                  <button onClick={() => confirmRoute(true)} style={{ width: '100%', background: '#00C8FF', border: 'none', color: '#000', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {selectedLang.code === 'hi-IN' ? 'हाँ, सुलभ मार्ग 🦽' : 'Yes, Accessible Route 🦽'}
                  </button>
                  <button onClick={() => confirmRoute(false)} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {selectedLang.code === 'hi-IN' ? 'नहीं, सबसे तेज़ मार्ग' : 'No, Fastest Route'}
                  </button>
                </div>
              )}

              {/* Map UI in AI Response */}
              {msg.hasMap && (
                <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', padding: '0.5rem', border: `1px solid ${msg.isAccessiblePath ? '#00C8FF' : 'rgba(255,255,255,0.05)'}` }}>
                  <div style={{ height: '140px', borderRadius: '8px', position: 'relative', overflow: 'hidden', marginBottom: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <img src="/images/stadium_hologram.png" alt="Map View" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, filter: msg.isAccessiblePath ? 'hue-rotate(90deg)' : 'none' }} />
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: msg.isAccessiblePath ? '#00C8FF' : 'var(--accent-green)', padding: '4px 12px', borderRadius: '4px', color: '#000', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      {msg.isAccessiblePath ? (selectedLang.code === 'hi-IN' ? 'सुलभ मार्ग 🦽' : 'ACCESSIBLE PATH 🦽') : (selectedLang.code === 'hi-IN' ? 'लाइव मार्ग' : 'LIVE PATH')}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.target.innerHTML = 'Routing...';
                      e.target.style.opacity = '0.7';
                      setTimeout(() => navigate('/maps'), 1200);
                    }} 
                    style={{ width: '100%', background: 'transparent', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '10px', borderRadius: '8px', fontWeight: '400', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
                    <Send size={16} style={{ transform: 'rotate(-45deg)', marginTop: '-2px' }} /> {selectedLang.code === 'hi-IN' ? 'मार्गदर्शन शुरू करें' : 'Start Navigation'}
                  </button>
                </div>
              )}

              {/* Food Order UI */}
              {msg.hasFoodOrder && (
                <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--accent-yellow)' }}>
                  <h4 style={{ color: 'var(--accent-yellow)', margin: '0 0 10px 0', fontSize: '1rem' }}>In-Seat Delivery Menu</h4>
                  <div className="flex-col gap-2" style={{ marginBottom: '1rem' }}>
                    <div className="flex-row justify-between" style={{ fontSize: '0.9rem' }}><span>🍔 Classic Burger</span><span>$8.00</span></div>
                    <div className="flex-row justify-between" style={{ fontSize: '0.9rem' }}><span>🍟 Fries</span><span>$4.00</span></div>
                    <div className="flex-row justify-between" style={{ fontSize: '0.9rem' }}><span>🥤 Coke</span><span>$3.00</span></div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.target.innerHTML = selectedLang.code === 'hi-IN' ? 'ऑर्डर दिया गया! 10 मिनट में पहुंचेगा' : 'Order Placed! Arriving in 10 mins';
                      e.target.style.background = 'var(--accent-green)';
                      e.target.style.color = '#000';
                      e.target.disabled = true;
                    }}
                    style={{ width: '100%', background: 'var(--accent-yellow)', border: 'none', color: '#000', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>
                    {selectedLang.code === 'hi-IN' ? 'सीट पर मंगवाएं (Sec 302) - $15.00' : 'Order to Seat (Sec 302) - $15.00'}
                  </button>
                </div>
              )}
            </article>
          </div>
        ))}
        {loading && (
           <div className="flex-row" style={{ justifyContent: 'flex-start' }}>
             <article className="glass-card" style={{ borderTopLeftRadius: 0, padding: '1rem' }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid rgba(43,255,136,0.1)', borderTopColor: 'var(--accent-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
             </article>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Fixed at Bottom */}
      <div style={{ position: 'fixed', bottom: '85px', left: '0', right: '0', padding: '0 1.5rem', maxWidth: '1200px', margin: '0 auto', background: 'linear-gradient(transparent, var(--bg-secondary) 20%)', paddingTop: '20px' }}>
         <div className="flex-row gap-2" style={{ overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
           <span className="glass-card text-small" style={{ padding: '8px 16px', whiteSpace: 'nowrap', borderRadius: '16px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }} onClick={() => sendMessage(selectedLang.code === 'hi-IN' ? "प्रार्थना कक्ष कहाँ है?" : "Where is the nearest prayer room?")}>
             {selectedLang.code === 'hi-IN' ? "प्रार्थना कक्ष कहाँ है?" : "Where is the nearest prayer room?"}
           </span>
           <span className="glass-card text-small" style={{ padding: '8px 16px', whiteSpace: 'nowrap', borderRadius: '16px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }} onClick={() => sendMessage(selectedLang.code === 'hi-IN' ? "क्या यहाँ खाना ऑर्डर कर सकते हैं?" : "Can I order food here?")}>
             {selectedLang.code === 'hi-IN' ? "क्या यहाँ खाना ऑर्डर कर सकते हैं?" : "Can I order food here?"}
           </span>
           <span className="glass-card text-small" style={{ padding: '8px 16px', whiteSpace: 'nowrap', borderRadius: '16px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }} onClick={() => sendMessage(selectedLang.code === 'hi-IN' ? "मेरा बैग खो गया है" : "I lost my bag")}>
             {selectedLang.code === 'hi-IN' ? "मेरा बैग खो गया है" : "I lost my bag 🔍"}
           </span>
         </div>
          <div className="glass-card flex-row gap-3" style={{ padding: '0.5rem', borderRadius: '24px', alignItems: 'center' }}>
            <button onClick={handleVoiceClick} style={{ width: '40px', height: '40px', borderRadius: '50%', background: isRecording ? '#FF6B6B' : 'rgba(43,255,136,0.1)', border: 'none', color: isRecording ? '#FFF' : 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', animation: isRecording ? 'pulse 1.5s infinite' : 'none' }}>
               <Mic size={20} />
            </button>
            <input 
              type="text" 
              placeholder={selectedLang.code === 'hi-IN' ? "VenueMind से कुछ भी पूछें..." : `Ask VenueMind in ${selectedLang.name}...`} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', outline: 'none' }} 
            />
            <button onClick={() => sendMessage(input)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-yellow)', border: 'none', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
               <Send size={18} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default Concierge;
