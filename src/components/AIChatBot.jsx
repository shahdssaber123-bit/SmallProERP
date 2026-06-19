import { useState, useRef, useEffect } from "react";

const formatTime = (date) =>
  date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

// ===== SMART RESPONSE ENGINE =====
function getSmartReply(input) {
  const q = input.toLowerCase().trim();

  if (q.match(/price|pricing|plan|plans|cost|how much|subscription|plus|premium|fee|pay/)) {
    if (q.match(/plus/))
      return "📦 Plus Plan — 1,500 EGP/month:\n• Up to 10 users\n• 1 warehouse\n• Basic support\n• OCR invoice scanning\n\nGreat for startups and small businesses!";
    if (q.match(/premium/))
      return "⭐ Premium Plan — 3,000 EGP/month:\n• Up to 25 users\n• Multiple warehouses\n• Priority support\n• AI insights + OCR\n\nPerfect for growing businesses!";
    return "💳 We have 2 simple plans:\n\n📦 Plus — 1,500 EGP/month\n• Up to 10 users | 1 warehouse | OCR\n\n⭐ Premium — 3,000 EGP/month\n• Up to 25 users | Multi-warehouse | AI insights + OCR\n\nBoth are flat monthly fees — no hidden costs!";
  }

  if (q.match(/difference|differ|vs|versus|compare|which plan|better plan/)) {
    return "📊 Plus vs Premium:\n\n┌─────────────┬────────┬─────────┐\n│ Feature     │ Plus   │ Premium │\n├─────────────┼────────┼─────────┤\n│ Price/month │ 1,500  │ 3,000   │\n│ Users       │ 10     │ 25      │\n│ Warehouses  │ 1      │ Multiple│\n│ OCR         │ ✅     │ ✅      │\n│ AI Insights │ ❌     │ ✅      │\n│ Support     │ Basic  │Priority │\n└─────────────┴────────┴─────────┘";
  }

  if (q.match(/team|founder|staff|member|who|ceo|people|employee|partner/)) {
    return "👥 Our Founding Team:\n\n• Saad Osama — CEO (10,000 EGP/mo)\n• Malak Mohammed — Backend Developer (8,000)\n• Saif Eldin Mohsen — Marketing Manager (9,000)\n• Ali Hesham — HR Manager (6,000)\n• Rawda Mostafa — System Analyst (7,000)\n• Abdelrahman Tarek — Frontend Developer (7,000)\n\nTotal: 6 equal partners, each owns 16.7%";
  }

  if (q.match(/capital|funding|invest|money|fund|budget|finance|startup cost/)) {
    return "💰 Startup Capital:\n\n• Total needed: 918,740 EGP\n• Total funded: 1,100,000 EGP\n• Each of 6 partners invested: 183,333 EGP\n\n📋 Breakdown:\n• Equipment: 20,000 EGP\n• Furniture: 20,000 EGP\n• Rent/year: 180,000 EGP\n• Salaries/year: 564,000 EGP\n• Hosting: 25,200 EGP\n• Internet: 18,000 EGP\n• Marketing: 90,040 EGP";
  }

  if (q.match(/salary|salaries|wage|pay team|how much earn|compensation/)) {
    return "💼 Team Salaries/Month:\n\n• CEO: 10,000 EGP\n• Marketing Manager: 9,000 EGP\n• Backend Developer: 8,000 EGP\n• System Analyst: 7,000 EGP\n• Frontend Developer: 7,000 EGP\n• HR Manager: 6,000 EGP\n\n📊 Total: 47,000 EGP/month = 564,000 EGP/year";
  }

  if (q.match(/product|feature|what does|what can|system|erp|include|module|function|offer|provide/)) {
    return "🖥️ SmallProERP Features:\n\n• 📦 Inventory tracking\n• 🧾 Sales & invoice management\n• 🛒 Purchases & supplier management\n• 👥 Customer records & history\n• 📊 Business reports & dashboards\n• 📷 OCR — auto invoice scanning\n• 🤖 AI insights (Premium plan)\n\nAll in one simple cloud platform — no installation needed!";
  }

  if (q.match(/competitor|competition|vs oracle|vs sap|vs odoo|vs quickbooks|alternative|compare to/)) {
    return "🏆 How we compare:\n\n❌ Oracle NetSuite: 5,346–10,746 EGP/user/month\n❌ SAP Business One: 5,130–13,500 EGP/user/month\n❌ Odoo: 483–734 EGP/user/month\n❌ QuickBooks: accounting only, no inventory\n\n✅ SmallProERP: flat 1,500–3,000 EGP/month\n• 60–75% cheaper than enterprise tools\n• 48-hour setup\n• No IT team needed";
  }

  if (q.match(/market|target|customer|audience|segment|who is|serve|country|egypt|saudi/)) {
    return "🌍 Our Target Market:\n\n📍 Initially: Egypt & Saudi Arabia\n\n🏪 Customer Segments:\n1. Micro businesses (manual processes)\n2. Growing small businesses (need structure)\n3. Service-based businesses (billing focus)\n4. Retail & trading (inventory-heavy)\n\n📊 Sectors: Retail, wholesale, trading, services";
  }

  if (q.match(/swot|strength|weakness|opportunity|threat/)) {
    return "📊 SWOT Analysis:\n\n✅ Strengths:\n• Simple UX & affordable\n• Cloud-based, no setup\n\n⚠️ Weaknesses:\n• New brand\n• Needs internet\n\n🚀 Opportunities:\n• Large untapped SME market\n• Growing cloud adoption\n\n⛔ Threats:\n• Established ERP competitors\n• Free tools resistance to change";
  }

  if (q.match(/vision|mission|goal|aim|purpose|why|dream/)) {
    return "🎯 Vision:\nEmpower SME owners to manage operations efficiently without complexity or technical expertise.\n\n💡 Mission:\nDeliver a simple, affordable, cloud-based ERP that replaces manual tools and scattered systems — so business owners spend less time on paperwork and more time growing.";
  }

  if (q.match(/market|advertis|promot|social media|facebook|linkedin|youtube|reach|campaign/)) {
    return "📣 Marketing Strategy:\n\n• Facebook, LinkedIn, YouTube ads\n• Motion graphic video campaigns\n• Educational content about business problems\n• Free trial period\n• Word of mouth & referrals\n• Partnerships with accountants & consultants\n• Direct online subscriptions";
  }

  if (q.match(/contact|email|phone|reach|address|location|where/)) {
    return "📞 Contact SmallProERP:\n\n📧 Email: smallpro26@gmail.com\n📱 Phone: +20 10 20268647\n📍 Location: 6th of October City, Cairo, Egypt\n🌐 Type: Cloud-based SaaS (work from anywhere!)";
  }

  if (q.match(/ocr|invoice scan|scan|image|photo|automatic entry/)) {
    return "📷 OCR Feature:\n\nSmallProERP can automatically read invoice data from photos or scanned images — no manual data entry needed!\n\n• Available in both Plus & Premium plans\n• Saves time and reduces errors\n• Just upload the invoice image and the system fills in the data";
  }

  if (q.match(/ai|artificial intelligence|insight|smart|intelligent/)) {
    return "🤖 AI Insights (Premium only):\n\nThe Premium plan includes AI-powered business insights that help you:\n• Understand sales trends\n• Get smart inventory alerts\n• Receive actionable recommendations\n• See your business performance clearly\n\nAll in plain, easy-to-understand language — no data expertise needed!";
  }

  if (q.match(/smallpro|small pro|what is|about|tell me|overview|summary|describe/)) {
    return "🏢 About SmallProERP:\n\nSmallProERP is a simple, cloud-based ERP system built for small and medium-sized businesses.\n\nWe solve the problem of scattered tools — no more notebooks, spreadsheets, or WhatsApp messages to manage your business!\n\n🔑 Key benefits:\n• All operations in one platform\n• No technical knowledge needed\n• Affordable flat monthly pricing\n• Start in 48 hours\n\n📦 Plus: 1,500 EGP/mo | ⭐ Premium: 3,000 EGP/mo";
  }

  if (q.match(/^(hi|hello|hey|good morning|good evening|greetings|howdy|sup|what's up|hola)[\s!?.]*$/)) {
    return "👋 Hello! Welcome to SmallProERP Assistant!\n\nI can help you with:\n• 💳 Pricing & plans\n• 🖥️ Product features\n• 👥 Our team\n• 💰 Startup capital\n• 🏆 Competitors comparison\n• 📍 Contact info\n\nWhat would you like to know?";
  }

  if (q.match(/thank|thanks|appreciate|great|awesome|perfect|good job/)) {
    return "😊 You're welcome! Feel free to ask anything else about SmallProERP.\n\n📧 For more details: smallpro26@gmail.com";
  }

  return "🤔 I'm not sure about that specific question.\n\nI can help you with:\n• 💳 Pricing & plans\n• 🖥️ Product features\n• 👥 Our team\n• 💰 Startup capital\n• 🏆 Competitors\n• 📊 SWOT analysis\n• 📍 Contact info\n\nTry asking about any of these topics!";
}

const SUGGESTIONS = [
  "What are the pricing plans?",
  "Who is the founding team?",
  "What is the startup capital?",
  "What's the difference between Plus and Premium?",
];

const styles = `
  .sp-fab {
    position: fixed; bottom: 24px; right: 24px;
    width: 54px; height: 54px; border-radius: 50%;
    background: #0f4c75; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; transition: transform .2s, box-shadow .2s;
    box-shadow: 0 4px 18px rgba(15,76,117,.4);
  }
  .sp-fab:hover { transform: scale(1.08); box-shadow: 0 6px 26px rgba(15,76,117,.55); }
  .sp-fab svg { width: 24px; height: 24px; color: white; }
  .sp-badge {
    position: absolute; top: -3px; right: -3px;
    background: #e53e3e; color: white; font-size: 11px; font-weight: 600;
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; border: 2px solid white;
  }
  .sp-win {
    position: fixed; bottom: 88px; right: 24px;
    width: 350px; height: 500px; background: #ffffff; border-radius: 16px;
    box-shadow: 0 8px 40px rgba(0,0,0,.18);
    display: flex; flex-direction: column;
    z-index: 9998; overflow: hidden;
    font-family: 'Segoe UI', Tahoma, sans-serif;
    animation: sp-up .22s ease;
  }
  @keyframes sp-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  .sp-head {
    background: linear-gradient(135deg, #0f4c75, #1b6ca8);
    padding: 12px 14px; display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  }
  .sp-ava {
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(255,255,255,.18);
    display: flex; align-items: center; justify-content: center;
  }
  .sp-ava svg { width: 18px; height: 18px; color: white; }
  .sp-hi { flex: 1; }
  .sp-ht { color: white; font-size: 13px; font-weight: 600; margin: 0; }
  .sp-hs { color: rgba(255,255,255,.72); font-size: 11px; margin: 0; display: flex; align-items: center; gap: 4px; }
  .sp-dot { width: 6px; height: 6px; border-radius: 50%; background: #68d391; }
  .sp-xbtn {
    background: rgba(255,255,255,.15); border: none; border-radius: 6px;
    width: 28px; height: 28px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: white; transition: background .15s;
  }
  .sp-xbtn:hover { background: rgba(255,255,255,.25); }
  .sp-xbtn svg { width: 15px; height: 15px; }
  .sp-msgs {
    flex: 1; overflow-y: auto; padding: 12px;
    display: flex; flex-direction: column; gap: 8px; background: #f7f9fc;
  }
  .sp-msgs::-webkit-scrollbar { width: 3px; }
  .sp-msgs::-webkit-scrollbar-thumb { background: #d0daea; border-radius: 3px; }
  .sp-bw { display: flex; flex-direction: column; gap: 2px; }
  .sp-bw.user { align-items: flex-end; }
  .sp-bw.assistant { align-items: flex-start; }
  .sp-b {
    max-width: 84%; padding: 8px 12px; border-radius: 12px;
    font-size: 13px; line-height: 1.5; white-space: pre-wrap; word-break: break-word;
  }
  .sp-b.user { background: #0f4c75; color: white; border-bottom-right-radius: 3px; }
  .sp-b.assistant { background: white; color: #1a202c; border: 1px solid #e2e8f0; border-bottom-left-radius: 3px; }
  .sp-tm { font-size: 10px; color: #a0aec0; padding: 0 3px; }
  .sp-typing {
    display: flex; gap: 4px; align-items: center;
    padding: 9px 12px; background: white; border-radius: 12px;
    border: 1px solid #e2e8f0; width: fit-content;
  }
  .sp-typing span { width: 6px; height: 6px; border-radius: 50%; background: #a0aec0; animation: sp-bounce 1.2s infinite; }
  .sp-typing span:nth-child(2) { animation-delay: .2s; }
  .sp-typing span:nth-child(3) { animation-delay: .4s; }
  @keyframes sp-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }
  .sp-sug { display: flex; flex-wrap: wrap; gap: 5px; padding: 0 10px 8px; background: #f7f9fc; flex-shrink: 0; }
  .sp-sug button {
    background: white; border: 1px solid #dde3ee; border-radius: 20px;
    padding: 4px 10px; font-size: 11.5px; color: #0f4c75;
    cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .sp-sug button:hover { background: #ebf4ff; border-color: #90cdf4; }
  .sp-inp {
    padding: 8px 10px; background: white; border-top: 1px solid #e8ecf4;
    display: flex; gap: 7px; align-items: flex-end; flex-shrink: 0;
  }
  .sp-ta {
    flex: 1; border: 1px solid #dde3ee; border-radius: 8px;
    padding: 8px 10px; font-size: 13px; font-family: inherit;
    resize: none; outline: none; max-height: 70px; line-height: 1.4;
    color: #1a202c; background: #f7f9fc; transition: border-color .15s;
  }
  .sp-ta:focus { border-color: #0f4c75; background: white; }
  .sp-send {
    width: 36px; height: 36px; border-radius: 8px; background: #0f4c75;
    border: none; cursor: pointer; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0; transition: background .15s, transform .1s;
  }
  .sp-send:hover { background: #1b6ca8; }
  .sp-send:active { transform: scale(.93); }
  .sp-send:disabled { background: #a0aec0; cursor: not-allowed; }
  .sp-send svg { width: 16px; height: 16px; color: white; }
  @media (max-width: 400px) {
    .sp-win { width: calc(100vw - 20px); right: 10px; }
    .sp-fab { right: 14px; bottom: 18px; }
  }
`;

export default function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the SmallPro Assistant 👋\nHow can I help you today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text, time: new Date() }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const reply = getSmartReply(text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply, time: new Date() }]);
      if (!open) setUnread((n) => n + 1);
      setLoading(false);
    }, 600);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Show suggestions only when no user message has been sent yet
  const showSuggestions = messages.length === 1;

  return (
    <>
      <style>{styles}</style>

      <button className="sp-fab" onClick={() => setOpen((o) => !o)} aria-label="Open Assistant">
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 9h8M8 13h5" strokeLinecap="round" />
          </svg>
        )}
        {unread > 0 && !open && <span className="sp-badge">{unread}</span>}
      </button>

      {open && (
        <div className="sp-win" role="dialog" aria-label="SmallProERP Assistant">
          <div className="sp-head">
            <div className="sp-ava">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M12 2a4 4 0 0 1 4 4v5H8V6a4 4 0 0 1 4-4z" />
                <circle cx="9" cy="16" r="1" fill="currentColor" />
                <circle cx="15" cy="16" r="1" fill="currentColor" />
              </svg>
            </div>
            <div className="sp-hi">
              <p className="sp-ht">SmallPro Assistant</p>
              <p className="sp-hs"><span className="sp-dot" />Online & ready</p>
            </div>
            <button className="sp-xbtn" onClick={() => setOpen(false)} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="sp-msgs">
            {messages.map((msg, i) => (
              <div key={i} className={`sp-bw ${msg.role}`}>
                <div className={`sp-b ${msg.role}`}>{msg.content}</div>
                <span className="sp-tm">{formatTime(msg.time)}</span>
              </div>
            ))}
            {loading && (
              <div className="sp-bw assistant">
                <div className="sp-typing"><span /><span /><span /></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showSuggestions && (
            <div className="sp-sug">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}>{s}</button>
              ))}
            </div>
          )}

          <div className="sp-inp">
            <textarea
              ref={inputRef}
              className="sp-ta"
              placeholder="Type your question here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button
              className="sp-send"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}