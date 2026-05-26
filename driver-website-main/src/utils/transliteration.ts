// Tamil transliteration mapping
const tamilMap: Record<string, string> = {
  // Vowels
  'a': 'அ', 'aa': 'ஆ', 'A': 'ஆ',
  'i': 'இ', 'ii': 'ஈ', 'I': 'ஈ',
  'u': 'உ', 'uu': 'ஊ', 'U': 'ஊ',
  'e': 'எ', 'ee': 'ஏ', 'E': 'ஏ',
  'ai': 'ஐ',
  'o': 'ஒ', 'oo': 'ஓ', 'O': 'ஓ',
  'au': 'ஔ',
  
  // Consonants
  'ka': 'க', 'ki': 'கி', 'ku': 'கு', 'ke': 'கெ', 'ko': 'கொ',
  'kaa': 'கா', 'kee': 'கீ', 'koo': 'கூ',
  'nga': 'ங', 'ngi': 'ஙி', 'ngu': 'ஙு',
  
  'cha': 'ச', 'chi': 'சி', 'chu': 'சு', 'che': 'செ', 'cho': 'சொ',
  'chaa': 'சா', 'chee': 'சீ', 'choo': 'சூ',
  'nja': 'ஞ', 'nji': 'ஞி', 'nju': 'ஞு',
  
  'ta': 'த', 'ti': 'தி', 'tu': 'து', 'te': 'தெ', 'to': 'தொ',
  'taa': 'தா', 'tee': 'தீ', 'too': 'தூ',
  'tha': 'த', 'thi': 'தி', 'thu': 'து',
  
  'na': 'ன', 'ni': 'னி', 'nu': 'னு', 'ne': 'னெ', 'no': 'னொ',
  'naa': 'னா', 'noo': 'னூ',
  
  'pa': 'ப', 'pi': 'பி', 'pu': 'பு', 'pe': 'பெ', 'po': 'பொ',
  'paa': 'பா', 'pee': 'பீ', 'poo': 'பூ',
  
  'ma': 'ம', 'mi': 'மி', 'mu': 'மு', 'me': 'மெ', 'mo': 'மொ',
  'maa': 'மா', 'mee': 'மீ', 'moo': 'மூ',
  
  'ya': 'ய', 'yi': 'யி', 'yu': 'யு', 'ye': 'யெ', 'yo': 'யொ',
  'yaa': 'யா', 'yee': 'யீ', 'yoo': 'யூ',
  
  'ra': 'ர', 'ri': 'ரி', 'ru': 'ரு', 're': 'ரெ', 'ro': 'ரொ',
  'raa': 'ரா', 'ree': 'ரீ', 'roo': 'ரூ',
  
  'la': 'ல', 'li': 'லி', 'lu': 'லு', 'le': 'லெ', 'lo': 'லொ',
  'laa': 'லா', 'lee': 'லீ', 'loo': 'லூ',
  
  'va': 'வ', 'vi': 'வி', 'vu': 'வு', 've': 'வெ', 'vo': 'வொ',
  'vaa': 'வா', 'vee': 'வீ', 'voo': 'வூ',
  'wa': 'வ', 'wi': 'வி', 'wu': 'வு',
  
  'zha': 'ழ', 'zhi': 'ழி', 'zhu': 'ழு',
  'La': 'ள', 'Li': 'ளி', 'Lu': 'ளு',
  'Ra': 'ற', 'Ri': 'றி', 'Ru': 'று',
  'Na': 'ண', 'Ni': 'ணி', 'Nu': 'ணு',
  
  'sa': 'ச', 'si': 'சி', 'su': 'சு',
  'sha': 'ஷ', 'shi': 'ஷி', 'shu': 'ஷு',
  
  'ha': 'ஹ', 'hi': 'ஹி', 'hu': 'ஹு',
  
  // Common words
  'tamil': 'தமிழ்',
  'vanakkam': 'வணக்கம்',
  'nandri': 'நன்றி',
  'amma': 'அம்மா',
  'appa': 'அப்பா',
  'peyar': 'பெயர்',
  'oor': 'ஊர்',
  'veedu': 'வீடு',
  'naan': 'நான்',
  'avan': 'அவன்',
  'aval': 'அவள்',
};

// Hindi transliteration mapping
const hindiMap: Record<string, string> = {
  // Vowels
  'a': 'अ', 'aa': 'आ', 'A': 'आ',
  'i': 'इ', 'ii': 'ई', 'I': 'ई',
  'u': 'उ', 'uu': 'ऊ', 'U': 'ऊ',
  'e': 'ए', 'ai': 'ऐ',
  'o': 'ओ', 'au': 'औ',
  
  // Consonants with vowels
  'ka': 'क', 'ki': 'कि', 'ku': 'कु', 'ke': 'के', 'ko': 'को',
  'kaa': 'का', 'kee': 'की', 'koo': 'कू',
  'kha': 'ख', 'khi': 'खि', 'khu': 'खु',
  'khaa': 'खा', 'khee': 'खी', 'khoo': 'खू',
  
  'ga': 'ग', 'gi': 'गि', 'gu': 'गु', 'ge': 'गे', 'go': 'गो',
  'gaa': 'गा', 'gee': 'गी', 'goo': 'गू',
  'gha': 'घ', 'ghi': 'घि', 'ghu': 'घु',
  
  'cha': 'च', 'chi': 'चि', 'chu': 'चु', 'che': 'चे', 'cho': 'चो',
  'chaa': 'चा', 'chee': 'ची', 'choo': 'चू',
  'chha': 'छ', 'chhi': 'छि', 'chhu': 'छु',
  
  'ja': 'ज', 'ji': 'जि', 'ju': 'जु', 'je': 'जे', 'jo': 'जो',
  'jaa': 'जा', 'jee': 'जी', 'joo': 'जू',
  'jha': 'झ', 'jhi': 'झि', 'jhu': 'झु',
  
  'ta': 'त', 'ti': 'ति', 'tu': 'तु', 'te': 'ते', 'to': 'तो',
  'taa': 'ता', 'tee': 'ती', 'too': 'तू',
  'tha': 'थ', 'thi': 'थि', 'thu': 'थु', 'thaa': 'था',
  
  'da': 'द', 'di': 'दि', 'du': 'दु', 'de': 'दे', 'do': 'दो',
  'daa': 'दा', 'dee': 'दी', 'doo': 'दू',
  'dha': 'ध', 'dhi': 'धि', 'dhu': 'धु',
  
  'na': 'न', 'ni': 'नि', 'nu': 'नु', 'ne': 'ने', 'no': 'नो',
  'naa': 'ना', 'nee': 'नी', 'noo': 'नू',
  
  'pa': 'प', 'pi': 'पि', 'pu': 'पु', 'pe': 'पे', 'po': 'पो',
  'paa': 'पा', 'pee': 'पी', 'poo': 'पू',
  'pha': 'फ', 'phi': 'फि', 'phu': 'फु',
  
  'ba': 'ब', 'bi': 'बि', 'bu': 'बु', 'be': 'बे', 'bo': 'बो',
  'baa': 'बा', 'bee': 'बी', 'boo': 'बू',
  'bha': 'भ', 'bhi': 'भि', 'bhu': 'भु',
  
  'ma': 'म', 'mi': 'मि', 'mu': 'मु', 'me': 'मे', 'mo': 'मो',
  'maa': 'मा', 'mee': 'मी', 'moo': 'मू',
  
  'ya': 'य', 'yi': 'यि', 'yu': 'यु', 'ye': 'ये', 'yo': 'यो',
  'yaa': 'या', 'yee': 'यी', 'yoo': 'यू',
  
  'ra': 'र', 'ri': 'रि', 'ru': 'रु', 're': 'रे', 'ro': 'रो',
  'raa': 'रा', 'ree': 'री', 'roo': 'रू',
  
  'la': 'ल', 'li': 'लि', 'lu': 'लु', 'le': 'ले', 'lo': 'लो',
  'laa': 'ला', 'lee': 'ली', 'loo': 'लू',
  
  'va': 'व', 'vi': 'वि', 'vu': 'वु', 've': 'वे', 'vo': 'वो',
  'vaa': 'वा', 'vee': 'वी', 'voo': 'वू',
  'wa': 'व', 'wi': 'वि', 'wu': 'वु',
  
  'sha': 'श', 'shi': 'शि', 'shu': 'शु', 'she': 'शे', 'sho': 'शो',
  'shaa': 'शा', 'shee': 'शी', 'shoo': 'शू',
  
  'sa': 'स', 'si': 'सि', 'su': 'सु', 'se': 'से', 'so': 'सो',
  'saa': 'सा', 'see': 'सी', 'soo': 'सू',
  
  'ha': 'ह', 'hi': 'हि', 'hu': 'हु', 'he': 'हे', 'ho': 'हो',
  'haa': 'हा', 'hee': 'ही', 'hoo': 'हू',
  
  // Common words
  'hindi': 'हिंदी',
  'namaste': 'नमस्ते',
  'dhanyavaad': 'धन्यवाद',
  'haan': 'हाँ',
  'nahi': 'नहीं',
  'naam': 'नाम',
  'ghar': 'घर',
  'paani': 'पानी',
  'khana': 'खाना',
  'main': 'मैं',
  'tum': 'तुम',
  'aap': 'आप',
};

export const transliterate = (text: string, language: 'tamil' | 'hindi'): string => {
  const map = language === 'tamil' ? tamilMap : hindiMap;
  let result = '';
  let buffer = '';
  
  // Process text character by character
  for (let i = 0; i < text.length; i++) {
    buffer += text[i];
    
    // Try to find longest match first
    let matched = false;
    for (let len = buffer.length; len > 0; len--) {
      const segment = buffer.slice(-len);
      if (map[segment]) {
        // Found a match, add the transliterated text
        result += buffer.slice(0, buffer.length - len) + map[segment];
        buffer = '';
        matched = true;
        break;
      }
    }
    
    // If we have accumulated 4+ chars without a match, output the first char
    if (!matched && buffer.length >= 4) {
      result += buffer[0];
      buffer = buffer.slice(1);
    }
  }
  
  // Add any remaining buffer
  result += buffer;
  
  return result;
};

export const transliterateWord = (word: string, language: 'tamil' | 'hindi'): string => {
  const map = language === 'tamil' ? tamilMap : hindiMap;
  
  // Check if the entire word has a direct mapping
  if (map[word.toLowerCase()]) {
    return map[word.toLowerCase()];
  }
  
  // Otherwise, transliterate character by character
  return transliterate(word, language);
};
