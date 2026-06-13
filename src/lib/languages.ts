import { LayoutId } from './transliterate';

export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
  type: 'unicode' | 'legacy';
}

export interface LayoutOption {
  id: LayoutId;
  name: string;
}

export interface LanguageConfig {
  id: string;
  name: string;
  fonts: FontOption[];
  layouts: LayoutOption[];
  words: string[];
  quotes: { text: string; author: string; title: string }[];
  examPassages: { text: string; source: string; title: string }[];
}

export const LANGUAGES: LanguageConfig[] = [
  {
    id: 'english',
    name: 'English',
    fonts: [
      { id: 'standard', name: 'Standard (QWERTY)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', type: 'unicode' }
    ],
    layouts: [
      { id: 'OS_DEFAULT', name: 'Standard QWERTY' }
    ],
    words: ["the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from"],
    quotes: [
      { text: "Video killed the radio star. In my mind and in my car.", author: "Bruce Woolley", title: "Lyrics" }
    ],
    examPassages: [
      { text: "The Digital India initiative has revolutionized the socio-economic landscape of the country by empowering citizens with digital infrastructure and on-demand services.", source: "SSC CGL Practice Passage", title: "Digital India" }
    ]
  },
  {
    id: 'hindi',
    name: 'Hindi (हिन्दी)',
    fonts: [
      { id: 'mangal', name: 'Mangal / Annapurna (InScript)', fontFamily: '"Annapurna SIL", "Mangal", "Arial Unicode MS", sans-serif', type: 'unicode' },
      { id: 'krutidev', name: 'Kruti Dev 010 (Legacy)', fontFamily: '"Kruti Dev 010", "DevLys 010", monospace', type: 'legacy' }
    ],
    layouts: [
      { id: 'MANGAL_INSCRIPT', name: 'Mangal InScript' },
      { id: 'MANGAL_GAIL', name: 'Mangal Remington GAIL' },
      { id: 'KRUTIDEV_010', name: 'Krutidev 010' }
    ],
    words: ["में", "है", "और", "से", "के", "को", "का", "कि", "यह", "एक", "पर", "नहीं", "लिए", "हैं", "भी", "ही", "जो", "कर", "तो", "ने"],
    quotes: [
      { text: "उठो, जागो और तब तक नहीं रुको जब तक लक्ष्य ना प्राप्त हो जाये।", author: "Swami Vivekananda", title: "Inspirational" }
    ],
    examPassages: [
      { text: "भारत एक विशाल देश है, जहाँ अनेक धर्मों और संस्कृतियों के लोग एक साथ मिलकर रहते हैं। हमारी विविधता ही हमारी सबसे बड़ी शक्ति है।", source: "SSC Mock", title: "India" }
    ]
  },
  {
    id: 'marathi',
    name: 'Marathi (मराठी)',
    fonts: [
      { id: 'mangal-mr', name: 'Mangal / Annapurna (Unicode)', fontFamily: '"Annapurna SIL", "Mangal", sans-serif', type: 'unicode' },
      { id: 'krutidev-mr', name: 'Kruti Dev (Legacy)', fontFamily: '"Kruti Dev 010", "DevLys 010", monospace', type: 'legacy' }
    ],
    layouts: [
      { id: 'MANGAL_INSCRIPT', name: 'Mangal InScript' },
      { id: 'KRUTIDEV_010', name: 'Krutidev 010' }
    ],
    words: ["आणि", "आहे", "नाही", "तर", "पण", "किंवा", "मी", "तू", "ते", "हे"],
    quotes: [{ text: "जेथे कमी तेथे आम्ही.", author: "Unknown", title: "Proverb" }],
    examPassages: [{ text: "महाराष्ट्र हे भारतातील एक प्रमुख राज्य आहे.", source: "MSBTE", title: "Maharashtra" }]
  },
  {
    id: 'punjabi',
    name: 'Punjabi (ਪੰਜਾਬੀ)',
    fonts: [
      { id: 'raavi', name: 'Raavi (Gurmukhi)', fontFamily: '"Raavi", "Arial Unicode MS", sans-serif', type: 'unicode' }
    ],
    layouts: [
      { id: 'PUNJABI_INSCRIPT', name: 'Raavi InScript' }
    ],
    words: ["ਅਤੇ", "ਹੈ", "ਨਹੀਂ", "ਮੈਂ", "ਤੂੰ", "ਉਹ", "ਇਹ", "ਸਨ", "ਸੀ", "ਨੇ"],
    quotes: [{ text: "ਚੜ੍ਹਦੀ ਕਲਾ.", author: "Traditional", title: "Blessing" }],
    examPassages: [{ text: "ਪੰਜਾਬ ਭਾਰਤ ਦਾ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਸੂਬਾ ਹੈ।", source: "Punjab HC", title: "Punjab" }]
  },
  {
    id: 'gujarati',
    name: 'Gujarati (ગુજરાતી)',
    fonts: [
      { id: 'shruti', name: 'Shruti', fontFamily: '"Shruti", "Arial Unicode MS", sans-serif', type: 'unicode' },
      { id: 'lmg-arun', name: 'LMG Arun (Legacy)', fontFamily: '"LMG Arun"', type: 'legacy' }
    ],
    layouts: [
      { id: 'GUJARATI_INSCRIPT', name: 'Shruti InScript' }
    ],
    words: ["અને", "છે", "નથી", "હું", "તું", "તે", "આ", "પણ", "તો", "કે"],
    quotes: [{ text: "જય જય ગરવી ગુજરાત.", author: "Narmad", title: "Poem" }],
    examPassages: [{ text: "ગુજરાત ભારતના પશ્ચિમ ભાગમાં આવેલું રાજ્ય છે.", source: "GSSSB", title: "Gujarat" }]
  },
  {
    id: 'bengali',
    name: 'Bengali (বাংলা)',
    fonts: [
      { id: 'vrinda-bn', name: 'Vrinda (Unicode)', fontFamily: '"Vrinda", "SolaimanLipi", sans-serif', type: 'unicode' },
      { id: 'solaimanlipi', name: 'SolaimanLipi', fontFamily: '"SolaimanLipi", sans-serif', type: 'unicode' }
    ],
    layouts: [
      { id: 'BENGALI_INSCRIPT', name: 'Bengali InScript' },
      { id: 'BENGALI_BIJOY', name: 'Bengali Bijoy' }
    ],
    words: ["এবং", "হয়", "না", "আমি", "তুমি", "সে", "এই", "কিন্তু", "তো", "কি"],
    quotes: [{ text: "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।", author: "Rabindranath Tagore", title: "Anthem" }],
    examPassages: [{ text: "পশ্চিমবঙ্গ ভারতের একটি রাজ্য।", source: "WBPSC", title: "West Bengal" }]
  },
  {
    id: 'odia',
    name: 'Odia (ଓଡ଼ିଆ)',
    fonts: [
      { id: 'kalinga', name: 'Kalinga', fontFamily: '"Kalinga", "Utkal", sans-serif', type: 'unicode' },
      { id: 'utkal', name: 'Utkal', fontFamily: '"Utkal", sans-serif', type: 'unicode' }
    ],
    layouts: [
      { id: 'ODIA_INSCRIPT', name: 'Kalinga InScript' }
    ],
    words: ["ଏବଂ", "ଅଟେ", "ନାହିଁ", "ମୁଁ", "ତୁମେ", "ସେ", "ଏହା", "କିନ୍ତୁ", "ତେଣୁ", "କି"],
    quotes: [{ text: "ବନ୍ଦେ ଉତ୍କଳ ଜନନୀ।", author: "Laxmikanta Mohapatra", title: "Anthem" }],
    examPassages: [{ text: "ଓଡ଼ିଶା ଭାରତର ପୂର୍ବ ଉପକୂଳରେ ଥିବା ଏକ ରାଜ୍ୟ।", source: "OSSC", title: "Odisha" }]
  },
  {
    id: 'assamese',
    name: 'Assamese (অসমীয়া)',
    fonts: [
      { id: 'vrinda-as', name: 'Vrinda', fontFamily: '"Vrinda", "Arial Unicode MS", sans-serif', type: 'unicode' }
    ],
    layouts: [
      { id: 'ASSAMESE_INSCRIPT', name: 'InScript' }
    ],
    words: ["আৰু", "হয়", "নহয়", "মই", "তুমি", "সি", "এই", "কিন্তু", "তো", "কি"],
    quotes: [{ text: "অ' মোৰ আপোনাৰ দেশ।", author: "Lakshminath Bezbaroa", title: "Anthem" }],
    examPassages: [{ text: "অসম ভাৰতৰ উত্তৰ-পূব অঞ্চলৰ এখন ৰাজ্য।", source: "AMTRON", title: "Assam" }]
  },
  {
    id: 'tamil',
    name: 'Tamil (தமிழ்)',
    fonts: [
      { id: 'latha', name: 'Latha', fontFamily: '"Latha", "Nirmala UI", sans-serif', type: 'unicode' },
      { id: 'nirmala', name: 'Nirmala UI', fontFamily: '"Nirmala UI", sans-serif', type: 'unicode' }
    ],
    layouts: [
      { id: 'TAMIL_INSCRIPT', name: 'InScript' }
    ],
    words: ["மற்றும்", "ஆகும்", "இல்லை", "நான்", "நீ", "அவன்", "இது", "ஆனால்", "எனவே", "என்று"],
    quotes: [{ text: "யாதும் ஊரே யாவரும் கேளிர்.", author: "Kaniyan Pungundranar", title: "Purananuru" }],
    examPassages: [{ text: "தமிழ்நாடு இந்தியாவின் தென்பகுதியில் அமைந்துள்ள ஒரு மாநிலம்.", source: "TNPSC", title: "Tamil Nadu" }]
  },
  {
    id: 'telugu',
    name: 'Telugu (తెలుగు)',
    fonts: [
      { id: 'gautami', name: 'Gautami', fontFamily: '"Gautami", "Vani", sans-serif', type: 'unicode' },
      { id: 'vani', name: 'Vani', fontFamily: '"Vani", sans-serif', type: 'unicode' }
    ],
    layouts: [
      { id: 'TELUGU_INSCRIPT', name: 'InScript' }
    ],
    words: ["మరియు", "అవును", "కాదు", "నేను", "నువ్వు", "అతను", "ఇది", "కానీ", "అందువలన", "అని"],
    quotes: [{ text: "దేశభాషలందు తెలుగు లెస్స.", author: "Sri Krishnadevaraya", title: "Poem" }],
    examPassages: [{ text: "ఆంధ్రప్రదేశ్ భారతదేశంలోని ఒక రాష్ట్రం.", source: "APPSC", title: "Andhra Pradesh" }]
  },
  {
    id: 'kannada',
    name: 'Kannada (ಕನ್ನಡ)',
    fonts: [
      { id: 'tunga', name: 'Tunga', fontFamily: '"Tunga", "Nudi", sans-serif', type: 'unicode' },
      { id: 'nudi', name: 'Nudi', fontFamily: '"Nudi", sans-serif', type: 'unicode' }
    ],
    layouts: [
      { id: 'KANNADA_INSCRIPT', name: 'InScript' }
    ],
    words: ["ಮತ್ತು", "ಹೌದು", "ಇಲ್ಲ", "ನಾನು", "ನೀನು", "ಅವನು", "ಇದು", "ಆದರೆ", "ಆದ್ದರಿಂದ", "ಎಂದು"],
    quotes: [{ text: "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ.", author: "Traditional", title: "Slogan" }],
    examPassages: [{ text: "ಕರ್ನಾಟಕ ಭಾರತದ ದಕ್ಷಿಣ ಭಾಗದಲ್ಲಿರುವ ಒಂದು ರಾಜ್ಯ.", source: "KPSC", title: "Karnataka" }]
  },
  {
    id: 'malayalam',
    name: 'Malayalam (മലയാളം)',
    fonts: [
      { id: 'kartika', name: 'Kartika', fontFamily: '"Kartika", "AnjaliOldLipi", sans-serif', type: 'unicode' },
      { id: 'anjali', name: 'AnjaliOldLipi', fontFamily: '"AnjaliOldLipi", sans-serif', type: 'unicode' }
    ],
    layouts: [
      { id: 'MALAYALAM_INSCRIPT', name: 'InScript' }
    ],
    words: ["കൂടാതെ", "ആണ്", "അല്ല", "ഞാൻ", "നീ", "അവൻ", "ഇത്", "പക്ഷേ", "അതിനാൽ", "എന്ന്"],
    quotes: [{ text: "കേരളം ദൈവത്തിന്റെ സ്വന്തം നാട്.", author: "Traditional", title: "Slogan" }],
    examPassages: [{ text: "കേരളം ഇന്ത്യയുടെ തെക്കുപടിഞ്ഞാറൻ തീരത്തുള്ള ഒരു സംസ്ഥാനമാണ്.", source: "Kerala PSC", title: "Kerala" }]
  },
  {
    id: 'urdu',
    name: 'Urdu (اردو)',
    fonts: [
      { id: 'arial-urdu', name: 'Arial Unicode MS', fontFamily: '"Arial Unicode MS", "Times New Roman", serif', type: 'unicode' },
      { id: 'jameel', name: 'Jameel Noori Nastaleeq', fontFamily: '"Jameel Noori Nastaleeq", serif', type: 'unicode' }
    ],
    layouts: [
      { id: 'URDU_PHONETIC', name: 'Urdu Phonetic/Standard' }
    ],
    words: ["اور", "ہے", "نہیں", "میں", "تم", "وہ", "یہ", "لیکن", "تو", "کہ"],
    quotes: [{ text: "اقبال کا شاہین.", author: "Allama Iqbal", title: "Poem" }],
    examPassages: [{ text: "اردو ایک خوبصورت زبان ہے۔", source: "Mock", title: "Urdu Language" }]
  },
  {
    id: 'manipuri',
    name: 'Manipuri (ꯃꯤꯇꯩꯂꯣꯟ)',
    fonts: [
      { id: 'arial-mn', name: 'Arial Unicode MS', fontFamily: '"Arial Unicode MS", sans-serif', type: 'unicode' }
    ],
    layouts: [
      { id: 'MANIPURI_INSCRIPT', name: 'InScript' }
    ],
    words: ["ꯑꯃꯁꯨꯡ", "ꯑꯁꯤ", "ꯅꯠꯇꯦ", "ꯑꯩ", "ꯅꯪ", "ꯃꯍꯥꯛ", "ꯃꯁꯤ", "ꯑꯗꯨꯕꯨ", "ꯃꯔꯝ", "ꯍꯥꯌꯅꯥ"],
    quotes: [{ text: "ꯃꯅꯤꯄꯨꯔ ꯑꯁꯤ ꯐꯖꯕꯥ ꯂꯝꯅꯤ꯫", author: "Traditional", title: "Slogan" }],
    examPassages: [{ text: "ꯃꯅꯤꯄꯨꯔ ꯑꯁꯤ ꯏꯟꯗꯤꯌꯥꯒꯤ ꯁꯇꯦꯠ ꯑꯃꯅꯤ꯫", source: "Mock", title: "Manipur" }]
  }
];
