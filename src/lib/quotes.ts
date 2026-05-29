export interface Quote {
  text: string;
  author: string;
  title: string;
}

export const QUOTES: Quote[] = [
  {
    text: "Video killed the radio star. In my mind and in my car, we can't rewind, we've gone too far. Pictures came and broke your heart.",
    author: "Bruce Woolley",
    title: "Video Killed the Radio Star"
  },
  {
    text: "All that is gold does not glitter, not all those who wander are lost; the old that is strong does not wither, deep roots are not reached by the frost.",
    author: "J.R.R. Tolkien",
    title: "The Fellowship of the Ring"
  },
  {
    text: "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms.",
    author: "William Shakespeare",
    title: "Hamlet"
  },
  {
    text: "Never gonna give you up, never gonna let you down, never gonna run around and desert you. Never gonna make you cry, never gonna say goodbye.",
    author: "Rick Astley",
    title: "Never Gonna Give You Up"
  },
  {
    text: "Is this the real life? Is this just fantasy? Caught in a landslide, no escape from reality. Open your eyes, look up to the skies and see.",
    author: "Queen",
    title: "Bohemian Rhapsody"
  },
  {
    text: "Curiouser and curiouser! If you don't know where you are going, any road will get you there. Would you tell me, please, which way I ought to go from here?",
    author: "Lewis Carroll",
    title: "Alice in Wonderland"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts. The only limit to our realization of tomorrow will be our doubts.",
    author: "Winston Churchill",
    title: "Historical Quotes"
  }
];

export const COMMON_WORDS: string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", 
  "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", 
  "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", 
  "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", 
  "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", 
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", 
  "give", "day", "most", "us", "more", "here", "become", "those", "place", "open", "out", "move", "during", "both", 
  "must", "through", "turn", "between", "against", "develop", "many", "without", "same", "thing", "another", "keep", 
  "school", "late", "write", "find", "water", "call", "under", "never", "under", "never", "under", "never", "under"
];

export interface ExamPassage {
  text: string;
  title: string;
  source: string;
}

export const INDIAN_EXAM_PASSAGES: ExamPassage[] = [
  {
    title: "Tryst with Destiny Speech",
    source: "Jawaharlal Nehru, 1947",
    text: "Long years ago we made a tryst with destiny, and now the time comes when we shall redeem our pledge, not wholly or in full measure, but very substantially. At the stroke of the midnight hour, when the world sleeps, India will awake to life and freedom. A moment comes, which comes but rarely in history, when we step out from the old to the new, when an age ends, and when the soul of a nation, long suppressed, finds utterance. It is fitting that at this solemn moment we take the pledge of dedication to the service of India and her people and to the still larger cause of humanity. At the dawn of history India started on her unending quest, and trackless centuries are filled with her striving and the grandeur of her success and her failures. Through good and ill fortune alike she has never lost sight of that quest or forgotten the ideals which gave her strength. We end today a period of ill fortune and India discovers herself again. The achievement we celebrate today is but a step, an opening of opportunity, to the greater triumphs and achievements that await us. Are we brave enough and wise enough to grasp this opportunity and accept the challenge of the future?"
  },
  {
    title: "Preamble to the Indian Constitution",
    source: "Constitution of India",
    text: "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship; EQUALITY of status and of opportunity; and to promote among them all FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation; IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION. The Constitution represents the collective wisdom and aspirations of the Indian people, ensuring fundamental rights, civil liberties, and directive principles that guide state policy towards a welfare state. It establishes a parliamentary democracy with a federal structure, balancing the power between central and state governments while maintaining a unified judicial system to safeguard justice for all."
  },
  {
    title: "Digital India and Financial Inclusion",
    source: "SSC CGL Practice Passage",
    text: "The Digital India initiative has revolutionized the socio-economic landscape of the country by empowering citizens with digital infrastructure and on-demand services. A key pillar of this transformation is the Unified Payments Interface, commonly known as UPI, which has democratized digital transactions across metropolitan cities and remote villages alike. Today, a street vendor in rural Bihar or a tea stall in Karnataka accepts digital micropayments with the same ease as a luxury retail outlet in Mumbai. This seamless connectivity has fostered financial inclusion, bringing millions of unbanked citizens into the formal banking fold. Coupled with Jan Dhan accounts and mobile connectivity, digital services have facilitated direct benefit transfers, eliminating leakages and corruption in social welfare schemes. As India moves forward, the expansion of high-speed optical fiber networks to every gram panchayat will further bridge the rural-urban divide, paving the way for digital education, telemedicine, and agricultural advisory services."
  },
  {
    title: "Renewable Energy and Solar Initiatives",
    source: "SSC CHSL Model Paper",
    text: "India has emerged as a global leader in renewable energy by committing to ambitious solar power initiatives to combat climate change. The establishment of the International Solar Alliance has positioned India at the center of international solar cooperation, fostering collaborative research and investment. Domestic solar parks, such as the Bhadla Solar Park in Rajasthan, are among the largest in the world, generating gigawatts of clean electricity to fuel India's growing economy. These green energy projects are vital for reducing dependence on imported fossil fuels, lowering carbon emissions, and meeting the target of net-zero emissions. Government subsidies and promotional policies have encouraged commercial enterprises and residential housing societies to install rooftop solar panels, feeding surplus energy back into the national grid. With continuous innovation in solar cell efficiency and grid storage batteries, India is well on its way to securing energy independence while fostering ecological sustainability for future generations."
  },
  {
    title: "Indian Agriculture and Rural Economy",
    source: "State Clerk typing sample",
    text: "Agriculture remains the backbone of the Indian economy, providing livelihood and food security to more than half of the country's population. The sector has undergone significant evolution from traditional subsistence farming to technology-driven modern agriculture. Introducing high-yielding seed varieties, modern irrigation systems, and soil health cards has helped farmers optimize crop yield and preserve soil fertility. Additionally, digital market platforms like e-NAM have enabled direct sales, saving farmers from middleman exploitation and securing fair market pricing for their harvest. To support the rural economy, the government has prioritized micro-irrigation systems, cold storage facilities, and agricultural credit schemes. Diversifying into horticulture, organic farming, dairy cooperatives, and poultry has further enhanced rural incomes. Strengthening rural infrastructure, rural roads, and local agro-processing units will reduce migration to urban centers, building self-sufficient rural communities across India."
  }
];
export const HINDI_QUOTES: Quote[] = [
  { text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥", author: "Bhagavad Gita", title: "Chapter 2, Verse 47" },
  { text: "उठो, जागो और तब तक नहीं रुको जब तक लक्ष्य ना प्राप्त हो जाये।", author: "Swami Vivekananda", title: "Inspirational" },
  { text: "जिंदगी तो अपने दम पर ही जी जाती है, दूसरों के कंधों पर तो सिर्फ जनाजे उठाए जाते हैं।", author: "Bhagat Singh", title: "Revolutionary" },
  { text: "मंजिलें उन्हीं को मिलती हैं, जिनके सपनों में जान होती है, पंखों से कुछ नहीं होता, हौसलों से उड़ान होती है।", author: "Unknown", title: "Motivation" },
  { text: "वक्त से लड़कर जो नसीब बदल दे, इंसान वही जो अपनी तकदीर बदल दे।", author: "Unknown", title: "Inspirational" }
];

export const HINDI_WORDS: string[] = [
  "में", "है", "और", "से", "के", "को", "का", "कि", "यह", "एक", "पर", "नहीं", "लिए", "हैं", "भी", "ही", "जो", "कर", "तो", "ने", "किया", "साथ", "हो", "अपनी", "था", "अपने", "क्या", "करना", "कुछ", "होता", "बाद", "उनके", "हुआ", "दिया", "उन", "करते", "गया", "तक", "कोई", "जाने", "वाले", "होने", "जाता", "बात", "आप", "उसे", "सभी", "तरह", "काम", "समय",
  "देश", "लोग", "समाज", "जीवन", "विकास", "शिक्षा", "सरकार", "भारत", "ज्ञान", "मनुष्य", "विचार", "स्वतंत्रता", "अधिकार", "समस्या", "विश्व", "शांति", "सफलता", "मेहनत", "विश्वास", "सत्य"
];

export const HINDI_EXAM_PASSAGES = [
  {
    title: "Govt Typist Exam Mock (Hindi)",
    source: "SSC / State Board Syllabus",
    text: "भारत एक विशाल देश है, जहाँ अनेक धर्मों और संस्कृतियों के लोग एक साथ मिलकर रहते हैं। हमारी विविधता ही हमारी सबसे बड़ी शक्ति है। स्वतंत्रता के बाद से, हमने कृषि, उद्योग और प्रौद्योगिकी के क्षेत्र में भारी प्रगति की है। एक मजबूत लोकतंत्र के रूप में, भारत विश्व पटल पर एक महत्वपूर्ण भूमिका निभा रहा है। विकास की इस यात्रा में, शिक्षा और स्वास्थ्य सेवाओं में सुधार हमारी प्रमुख प्राथमिकता होनी चाहिए।"
  }
];
