import { createContext, useContext, useEffect, useMemo, useState } from "react";

const translations = {
  "Dashboard": ["डैशबोर्ड", "Dashboard"], "Find Facility": ["फैसिलिटी खोजें", "Facility खोजें"],
  "Smart Recommendation": ["स्मार्ट सुझाव", "Smart Recommendation"], "Digital Triage": ["डिजिटल ट्रायेज", "Digital Triage"],
  "Appointments": ["अपॉइंटमेंट", "Appointments"], "Referrals": ["रेफरल", "Referral"], "Medicines": ["दवाइयाँ", "Medicines"],
  "Diagnostics": ["डायग्नोस्टिक्स", "Diagnostics"], "Follow-up": ["फॉलो-अप", "Follow-up"], "Care Journey": ["केयर जर्नी", "Care Journey"],
  "Medical History": ["मेडिकल हिस्ट्री", "Medical History"], "Notifications": ["सूचनाएँ", "Notifications"], "Help & Support": ["मदद और सपोर्ट", "Help & Support"],
  "Logout": ["लॉगआउट", "Logout"], "Doctor Portal": ["डॉक्टर पोर्टल", "Doctor Portal"], "Health Worker": ["स्वास्थ्य कार्यकर्ता", "Health Worker"],
  "Patient": ["पेशेंट", "Patient"], "Doctor": ["डॉक्टर", "Doctor"], "Profile": ["प्रोफाइल", "Profile"], "Settings": ["सेटिंग्स", "Settings"],
  "Patients": ["पेशेंट्स", "Patients"], "Consultations": ["कंसल्टेशन", "Consultations"], "Prescriptions": ["प्रिस्क्रिप्शन", "Prescriptions"],
  "Analytics": ["एनालिटिक्स", "Analytics"], "Medical Records": ["मेडिकल रिकॉर्ड", "Medical Records"], "Book Appointment": ["अपॉइंटमेंट बुक करें", "Appointment बुक करें"],
  "Confirm Appointment": ["अपॉइंटमेंट कन्फर्म करें", "Appointment confirm करें"], "View Report": ["रिपोर्ट देखें", "Report देखें"],
  "View Document": ["डॉक्यूमेंट देखें", "Document देखें"], "Start Consultation": ["कंसल्टेशन शुरू करें", "Consultation शुरू करें"],
  "Accept Appointment": ["अपॉइंटमेंट स्वीकार करें", "Appointment accept करें"], "Follow-up consultation": ["फॉलो-अप कंसल्टेशन", "Follow-up consultation"],
  "Teleconsultation": ["टेलीकंसल्टेशन", "Teleconsultation"], "Video Consultation": ["वीडियो कंसल्टेशन", "Video Consultation"],
  "Video Call": ["वीडियो कॉल", "Video Call"], "Voice": ["वॉइस", "Voice"], "Clinical Assessment": ["क्लिनिकल असेसमेंट", "Clinical Assessment"],
  "Diagnosis": ["डायग्नोसिस", "Diagnosis"], "Medicine": ["दवा", "Medicine"], "Diagnostics": ["डायग्नोस्टिक्स", "Diagnostics"],
  "Clinical Notes": ["क्लिनिकल नोट्स", "Clinical Notes"], "Patient Details": ["पेशेंट विवरण", "Patient Details"],
  "Necessary Care Details": ["आवश्यक देखभाल विवरण", "Necessary Care Details"], "Medical History / Documents": ["मेडिकल हिस्ट्री / डॉक्यूमेंट", "Medical History / Documents"],
  "Complete Medical History": ["पूरी मेडिकल हिस्ट्री", "Complete Medical History"], "Previous Medical Documents": ["पिछले मेडिकल डॉक्यूमेंट", "Previous Medical Documents"],
  "Low-connectivity ready": ["कम कनेक्टिविटी के लिए तैयार", "Low-connectivity ready"], "Offline mode": ["ऑफलाइन मोड", "Offline mode"],
  "English": ["अंग्रेज़ी", "English", "इंग्रजी"], "Hindi": ["हिंदी", "Hindi", "हिंदी"], "Marathi": ["मराठी", "Marathi", "मराठी"],
  "Open profile": ["प्रोफाइल खोलें", "Profile खोलें"], "Close": ["बंद करें", "Close"], "Cancel": ["रद्द करें", "Cancel"],
  "Complete Consultation": ["कंसल्टेशन पूरा करें", "Consultation complete करें"], "Current Consultation": ["वर्तमान कंसल्टेशन", "Current Consultation"],
  "Patient Information": ["पेशेंट जानकारी", "Patient Information"], "Latest Health Worker Vitals": ["लेटेस्ट हेल्थ वर्कर वाइटल्स", "Latest Health Worker Vitals"],
  "Blood Pressure": ["ब्लड प्रेशर", "Blood Pressure"], "Blood Sugar": ["ब्लड शुगर", "Blood Sugar"], "Temperature": ["तापमान", "Temperature"], "Pulse": ["पल्स", "Pulse"],
  "Report opened": ["रिपोर्ट खोली गई", "Report opened"], "Document": ["डॉक्यूमेंट", "Document"], "Reports": ["रिपोर्ट", "Reports"],
  "Save": ["सेव करें", "Save"], "Search": ["खोजें", "Search"], "Reason": ["कारण", "Reason"], "Status": ["स्थिति", "Status"],
};


const marathiTranslations = {
  "Dashboard":"डॅशबोर्ड","Find Facility":"आरोग्य सुविधा शोधा","Smart Recommendation":"स्मार्ट शिफारस","Digital Triage":"डिजिटल ट्रायाज","Appointments":"अपॉइंटमेंट्स","Referrals":"रेफरल","Medicines":"औषधे","Diagnostics":"डायग्नोस्टिक्स","Follow-up":"फॉलो-अप","Care Journey":"केअर जर्नी","Medical History":"वैद्यकीय इतिहास","Notifications":"सूचना","Help & Support":"मदत आणि समर्थन","Logout":"लॉगआउट","Doctor Portal":"डॉक्टर पोर्टल","Health Worker":"आरोग्य कर्मचारी","Patient":"रुग्ण","Doctor":"डॉक्टर","Profile":"प्रोफाइल","Settings":"सेटिंग्ज","Patients":"रुग्ण","Consultations":"सल्लामसलत","Prescriptions":"प्रिस्क्रिप्शन्स","Analytics":"विश्लेषण","Medical Records":"वैद्यकीय नोंदी","Book Appointment":"अपॉइंटमेंट बुक करा","Confirm Appointment":"अपॉइंटमेंट निश्चित करा","View Report":"रिपोर्ट पहा","View Document":"दस्तऐवज पहा","Start Consultation":"सल्लामसलत सुरू करा","Accept Appointment":"अपॉइंटमेंट स्वीकारा","Follow-up consultation":"फॉलो-अप सल्लामसलत","Teleconsultation":"टेलिकन्सल्टेशन","Video Consultation":"व्हिडिओ सल्लामसलत","Video Call":"व्हिडिओ कॉल","Clinical Assessment":"क्लिनिकल मूल्यांकन","Diagnosis":"निदान","Medicine":"औषध","Clinical Notes":"क्लिनिकल नोंदी","Patient Details":"रुग्ण तपशील","Necessary Care Details":"आवश्यक काळजी तपशील","Complete Medical History":"संपूर्ण वैद्यकीय इतिहास","Previous Medical Documents":"मागील वैद्यकीय दस्तऐवज","Offline mode":"ऑफलाइन मोड","Open profile":"प्रोफाइल उघडा","Close":"बंद करा","Cancel":"रद्द करा","Complete Consultation":"सल्लामसलत पूर्ण करा","Current Consultation":"सध्याची सल्लामसलत","Patient Information":"रुग्ण माहिती","Latest Health Worker Vitals":"आरोग्य कर्मचाऱ्यांचे नवीनतम व्हायटल्स","Blood Pressure":"रक्तदाब","Blood Sugar":"रक्तातील साखर","Temperature":"तापमान","Pulse":"नाडी","Report opened":"रिपोर्ट उघडला","Document":"दस्तऐवज","Reports":"रिपोर्ट्स","Save":"सेव्ह करा","Search":"शोधा","Reason":"कारण","Status":"स्थिती","Today's Appointment Capacity":"आजची अपॉइंटमेंट क्षमता","Seats Left":"उपलब्ध जागा","Full":"पूर्ण","Available":"उपलब्ध","Edit Profile":"प्रोफाइल संपादित करा"
};

const LanguageContext = createContext({ language: "English", setLanguage: () => {}, t: (x) => x });

// Global UI dictionary.  Components can use t(), while the DOM fallback also
// covers legacy/static labels so the language selected on the landing page is
// applied consistently after navigation and when modules render dynamically.
const extraHindi = {
  "Language":"भाषा","Smart Rural Healthcare Network":"स्मार्ट ग्रामीण स्वास्थ्य नेटवर्क","Explore Healthcare Services":"स्वास्थ्य सेवाएँ देखें","See how it works":"यह कैसे काम करता है देखें","Role-based access":"भूमिका-आधारित एक्सेस","Feedback":"फीडबैक","Submit":"जमा करें","Name":"नाम","Message":"संदेश","District":"जिला","Rating":"रेटिंग","Home":"होम","About":"हमारे बारे में","Contact":"संपर्क","Features":"सुविधाएँ","How It Works":"यह कैसे काम करता है","Discover":"खोजें","Assess":"आकलन करें","Recommend":"सुझाव दें","Connect":"कनेक्ट करें","Follow Up":"फॉलो-अप करें","Available Timing":"उपलब्ध समय","Available services":"उपलब्ध सेवाएँ","Book a healthcare visit or video call":"स्वास्थ्य विज़िट या वीडियो कॉल बुक करें","Healthcare availability":"स्वास्थ्य सेवा उपलब्धता","Healthcare facilities near you":"आपके पास स्वास्थ्य सुविधाएँ","Patient Account":"पेशेंट अकाउंट","Doctor available":"डॉक्टर उपलब्ध","Doctors":"डॉक्टर","Hospitals":"अस्पताल","PHCs":"पीएचसी","Facility":"फैसिलिटी","Date":"तारीख","Time":"समय","Age":"उम्र","Gender":"लिंग","Mobile Number":"मोबाइल नंबर","Email":"ईमेल","Address":"पता","Blood Pressure":"ब्लड प्रेशर","Blood Sugar":"ब्लड शुगर","Temperature":"तापमान","Pulse":"पल्स","Save":"सेव करें","Edit":"एडिट करें","Delete":"डिलीट करें","Close":"बंद करें","Back":"वापस","Next":"आगे","Previous":"पिछला","Submit":"जमा करें","Loading...":"लोड हो रहा है...","No active consultation":"कोई सक्रिय कंसल्टेशन नहीं","No pending approvals":"कोई लंबित स्वीकृति नहीं","Confirmed":"पुष्ट","Accepted":"स्वीकृत","Pending":"लंबित","Rejected":"अस्वीकृत","Completed":"पूर्ण","In Progress":"प्रगति में","Available":"उपलब्ध","Full":"पूर्ण","Seats Left":"बची सीटें","Today's Appointment Capacity":"आज की अपॉइंटमेंट क्षमता","Appointment Schedule":"अपॉइंटमेंट शेड्यूल","Appointment type":"अपॉइंटमेंट प्रकार","New Appointment":"नई अपॉइंटमेंट","NEW APPOINTMENT":"नई अपॉइंटमेंट","Accept Appointment":"अपॉइंटमेंट स्वीकार करें","Start Consultation":"कंसल्टेशन शुरू करें","Complete Consultation":"कंसल्टेशन पूरा करें","Follow-up Consultation":"फॉलो-अप कंसल्टेशन","Teleconsultation":"टेलीकंसल्टेशन","Video Consultation":"वीडियो कंसल्टेशन","Video Call":"वीडियो कॉल","Voice":"वॉइस","Reports":"रिपोर्ट्स","Report":"रिपोर्ट","View Report":"रिपोर्ट देखें","View Document":"डॉक्यूमेंट देखें","Document":"डॉक्यूमेंट","Documents":"डॉक्यूमेंट्स","Diagnostic Report":"डायग्नोस्टिक रिपोर्ट","Diagnostic Test":"डायग्नोस्टिक टेस्ट","Diagnostic tests & reports":"डायग्नोस्टिक टेस्ट और रिपोर्ट्स","Medicine Name":"दवा का नाम","Dosage":"खुराक","Frequency":"आवृत्ति","Diagnosis":"डायग्नोसिस","Clinical Assessment":"क्लिनिकल असेसमेंट","Clinical Notes":"क्लिनिकल नोट्स","Patient Details":"पेशेंट विवरण","Patient Information":"पेशेंट जानकारी","Latest Health Worker Vitals":"लेटेस्ट हेल्थ वर्कर वाइटल्स","Necessary Care Details":"आवश्यक देखभाल विवरण","Complete Medical History":"पूरी मेडिकल हिस्ट्री","Previous Medical Documents":"पिछले मेडिकल डॉक्यूमेंट","Medical History":"मेडिकल हिस्ट्री","Medical History / Documents":"मेडिकल हिस्ट्री / डॉक्यूमेंट","Profile":"प्रोफाइल","Profile information":"प्रोफाइल जानकारी","Profile Settings":"प्रोफाइल सेटिंग्स","Edit Profile":"प्रोफाइल एडिट करें","Logout":"लॉगआउट","Notifications":"सूचनाएँ","Settings":"सेटिंग्स","Help & Support":"मदद और सपोर्ट","Search":"खोजें","Reason":"कारण","Status":"स्थिति","Priority Level":"प्राथमिकता स्तर","Current status":"वर्तमान स्थिति","Emergency Help":"आपातकालीन सहायता","Emergency Care":"आपातकालीन देखभाल","Care Journey":"केयर जर्नी","Care Continuity":"केयर कंटिन्यूटी","Care Gap Alerts":"केयर गैप अलर्ट्स","Referral":"रेफरल","Referrals":"रेफरल्स","Medicines":"दवाइयाँ","Diagnostics":"डायग्नोस्टिक्स","Appointments":"अपॉइंटमेंट्स","Patient":"पेशेंट","Doctor":"डॉक्टर","Health Worker":"स्वास्थ्य कार्यकर्ता","Admin":"एडमिन","Patient Portal":"पेशेंट पोर्टल","Doctor Portal":"डॉक्टर पोर्टल","Health Worker Portal":"स्वास्थ्य कार्यकर्ता पोर्टल","Admin Portal":"एडमिन पोर्टल"
};

const extraMarathi = {
  "Language":"भाषा","Smart Rural Healthcare Network":"स्मार्ट ग्रामीण आरोग्य नेटवर्क","Explore Healthcare Services":"आरोग्य सेवा पहा","See how it works":"हे कसे कार्य करते ते पहा","Role-based access":"भूमिका-आधारित प्रवेश","Feedback":"अभिप्राय","Submit":"सबमिट करा","Name":"नाव","Message":"संदेश","District":"जिल्हा","Rating":"रेटिंग","Home":"होम","About":"आमच्याबद्दल","Contact":"संपर्क","Features":"वैशिष्ट्ये","How It Works":"हे कसे कार्य करते","Discover":"शोधा","Assess":"मूल्यांकन करा","Recommend":"शिफारस करा","Connect":"जोडा","Follow Up":"फॉलो-अप करा","Available Timing":"उपलब्ध वेळ","Available services":"उपलब्ध सेवा","Book a healthcare visit or video call":"आरोग्य भेट किंवा व्हिडिओ कॉल बुक करा","Healthcare availability":"आरोग्य सेवा उपलब्धता","Healthcare facilities near you":"तुमच्या जवळील आरोग्य सुविधा","Patient Account":"रुग्ण खाते","Doctor available":"डॉक्टर उपलब्ध","Doctors":"डॉक्टर","Hospitals":"रुग्णालये","PHCs":"पीएचसी","Facility":"सुविधा","Date":"तारीख","Time":"वेळ","Age":"वय","Gender":"लिंग","Mobile Number":"मोबाइल नंबर","Email":"ईमेल","Address":"पत्ता","Save":"सेव्ह करा","Edit":"संपादित करा","Delete":"हटवा","Close":"बंद करा","Back":"मागे","Next":"पुढे","Previous":"मागील","Loading...":"लोड होत आहे...","No active consultation":"सक्रिय सल्लामसलत नाही","No pending approvals":"प्रलंबित मंजुरी नाही","Confirmed":"निश्चित","Accepted":"स्वीकृत","Pending":"प्रलंबित","Rejected":"नाकारले","Completed":"पूर्ण","In Progress":"प्रगतीपथावर","Available":"उपलब्ध","Full":"पूर्ण","Seats Left":"उपलब्ध जागा","Today's Appointment Capacity":"आजची अपॉइंटमेंट क्षमता","Appointment Schedule":"अपॉइंटमेंट वेळापत्रक","Appointment type":"अपॉइंटमेंट प्रकार","New Appointment":"नवीन अपॉइंटमेंट","NEW APPOINTMENT":"नवीन अपॉइंटमेंट","Accept Appointment":"अपॉइंटमेंट स्वीकारा","Start Consultation":"सल्लामसलत सुरू करा","Complete Consultation":"सल्लामसलत पूर्ण करा","Follow-up Consultation":"फॉलो-अप सल्लामसलत","Teleconsultation":"टेलिकन्सल्टेशन","Video Consultation":"व्हिडिओ सल्लामसलत","Video Call":"व्हिडिओ कॉल","Voice":"व्हॉइस","Reports":"रिपोर्ट्स","Report":"रिपोर्ट","View Report":"रिपोर्ट पहा","View Document":"दस्तऐवज पहा","Document":"दस्तऐवज","Documents":"दस्तऐवज","Diagnostic Report":"डायग्नोस्टिक रिपोर्ट","Diagnostic Test":"डायग्नोस्टिक टेस्ट","Diagnostic tests & reports":"डायग्नोस्टिक टेस्ट आणि रिपोर्ट्स","Medicine Name":"औषधाचे नाव","Dosage":"डोस","Frequency":"वारंवारता","Diagnosis":"निदान","Clinical Assessment":"क्लिनिकल मूल्यांकन","Clinical Notes":"क्लिनिकल नोंदी","Patient Details":"रुग्ण तपशील","Patient Information":"रुग्ण माहिती","Latest Health Worker Vitals":"आरोग्य कर्मचाऱ्यांचे नवीनतम व्हायटल्स","Necessary Care Details":"आवश्यक काळजी तपशील","Complete Medical History":"संपूर्ण वैद्यकीय इतिहास","Previous Medical Documents":"मागील वैद्यकीय दस्तऐवज","Medical History":"वैद्यकीय इतिहास","Medical History / Documents":"वैद्यकीय इतिहास / दस्तऐवज","Profile":"प्रोफाइल","Profile information":"प्रोफाइल माहिती","Profile Settings":"प्रोफाइल सेटिंग्ज","Edit Profile":"प्रोफाइल संपादित करा","Logout":"लॉगआउट","Notifications":"सूचना","Settings":"सेटिंग्ज","Help & Support":"मदत आणि समर्थन","Search":"शोधा","Reason":"कारण","Status":"स्थिती","Priority Level":"प्राधान्य पातळी","Current status":"सध्याची स्थिती","Emergency Help":"आपत्कालीन मदत","Emergency Care":"आपत्कालीन काळजी","Care Journey":"केअर जर्नी","Care Continuity":"केअर कंटिन्युटी","Care Gap Alerts":"केअर गॅप अलर्ट्स","Referral":"रेफरल","Referrals":"रेफरल्स","Medicines":"औषधे","Diagnostics":"डायग्नोस्टिक्स","Appointments":"अपॉइंटमेंट्स","Patient":"रुग्ण","Doctor":"डॉक्टर","Health Worker":"आरोग्य कर्मचारी","Admin":"अॅडमिन","Patient Portal":"रुग्ण पोर्टल","Doctor Portal":"डॉक्टर पोर्टल","Health Worker Portal":"आरोग्य कर्मचारी पोर्टल","Admin Portal":"अॅडमिन पोर्टल"
};

const allTranslations = { ...translations };
for (const [k,v] of Object.entries(extraHindi)) {
  if (!allTranslations[k]) allTranslations[k] = [v, k];
  else allTranslations[k][0] = v;
}
for (const [k,v] of Object.entries(extraMarathi)) {
  if (!allTranslations[k]) allTranslations[k] = [extraHindi[k] || k, k, v];
  else allTranslations[k][2] = v;
}

const reverse = new Map();
function buildReverse() {
  reverse.clear();
  Object.entries(allTranslations).forEach(([en, values]) => {
    [en, values?.[0], values?.[1], values?.[2], marathiTranslations[en]].filter(Boolean).forEach((x) => reverse.set(String(x), en));
  });
}
buildReverse();

function translated(en, language) {
  const item = allTranslations[en];
  if (!item || language === "English") return en;
  if (language === "Hindi") return item[0] || en;
  return item[2] || marathiTranslations[en] || item[1] || en;
}

const originalText = new WeakMap();
const originalAttrs = new WeakMap();
const translatableAttrs = ["placeholder", "title", "aria-label", "alt"];

function translateNode(node, language) {
  const current = node.nodeValue || "";
  const source = originalText.get(node) || reverse.get(current.trim()) || current;
  if (!originalText.has(node)) originalText.set(node, source);
  if (!source.trim()) return;
  let result = source;
  const keys = Object.keys(allTranslations).sort((a,b) => b.length-a.length);
  for (const key of keys) {
    if (result.includes(key)) result = result.split(key).join(translated(key, language));
  }
  if (result !== current) node.nodeValue = result;
}

function translateElementAttributes(el, language) {
  translatableAttrs.forEach((attr) => {
    if (!el.hasAttribute(attr)) return;
    let store = originalAttrs.get(el);
    if (!store) { store = {}; originalAttrs.set(el, store); }
    const current = el.getAttribute(attr) || "";
    const source = store[attr] || reverse.get(current) || current;
    store[attr] = source;
    let result = source;
    Object.keys(allTranslations).sort((a,b) => b.length-a.length).forEach((key) => {
      if (result.includes(key)) result = result.split(key).join(translated(key, language));
    });
    if (result !== current) el.setAttribute(attr, result);
  });
}

function translateTree(root, language) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (parent && !["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) translateNode(node, language);
    } else if (node.nodeType === Node.ELEMENT_NODE) translateElementAttributes(node, language);
  });
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem("swasthyasetu_language") || "English");
  const setLanguage = (value) => {
    const next = ["English", "Hindi", "Marathi"].includes(value) ? value : "English";
    setLanguageState(next);
    localStorage.setItem("swasthyasetu_language", next);
    document.documentElement.lang = next === "Hindi" ? "hi" : next === "Marathi" ? "mr" : "en";
  };
  const t = (text) => {
    if (typeof text !== "string") return text;
    const key = reverse.get(text) || text;
    return translated(key, language);
  };
  useEffect(() => {
    document.documentElement.lang = language === "Hindi" ? "hi" : language === "Marathi" ? "mr" : "en";
    translateTree(document.body, language);
    const observer = new MutationObserver((mutations) => {
      // Translate only added/changed areas; avoid recursive full-body work.
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) translateTree(node, language);
          else if (node.nodeType === Node.TEXT_NODE) translateNode(node, language);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);
  const value = useMemo(() => ({ language, setLanguage, t }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return <label className="global-language-switcher" title="Change Language">
    <span>अ/A</span>
    <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Change Language">
      <option value="English">English</option><option value="Hindi">हिंदी</option><option value="Marathi">मराठी</option>
    </select>
  </label>;
}
