import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Languages, X } from "lucide-react";
import { transliterate } from "@/utils/transliteration";
import { cn } from "@/lib/utils";

interface TransliterationInputProps {
  value: string;
  onChange: (value: string) => void;
  language: 'tamil' | 'hindi' | 'english';
  placeholder?: string;
  id?: string;
  required?: boolean;
  className?: string;
  maxLength?: number;
  type?: string;
}

export const TransliterationInput = ({
  value,
  onChange,
  language,
  placeholder,
  id,
  required,
  className,
  maxLength,
  type = "text"
}: TransliterationInputProps) => {
  const [translitEnabled, setTranslitEnabled] = useState(false);
  const [buffer, setBuffer] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (translitEnabled && buffer && language !== 'english') {
      // Generate suggestions as user types
      const transliterated = transliterate(buffer, language);
      if (transliterated !== buffer) {
        setSuggestions([transliterated]);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  }, [buffer, translitEnabled, language]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (translitEnabled && language !== 'english') {
      // Get the last added character(s)
      const diff = newValue.length - value.length;
      
      if (diff > 0) {
        // User added text
        const addedText = newValue.slice(-diff);
        
        // Check if space was pressed - convert buffer
        if (addedText === ' ') {
          if (buffer) {
            const transliterated = transliterate(buffer, language);
            onChange(value.slice(0, -buffer.length) + transliterated + ' ');
            setBuffer("");
            setSuggestions([]);
            return;
          }
        } else {
          // Add to buffer
          setBuffer(buffer + addedText);
        }
      } else if (diff < 0) {
        // User deleted text
        setBuffer(buffer.slice(0, diff));
      }
    }
    
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (translitEnabled && language !== 'english') {
      // Tab key to accept suggestion
      if (e.key === 'Tab' && suggestions.length > 0) {
        e.preventDefault();
        const suggestion = suggestions[0];
        onChange(value.slice(0, -buffer.length) + suggestion);
        setBuffer("");
        setSuggestions([]);
      }
      
      // Space or Enter to convert
      if ((e.key === ' ' || e.key === 'Enter') && buffer) {
        const transliterated = transliterate(buffer, language);
        onChange(value.slice(0, -buffer.length) + transliterated + (e.key === ' ' ? ' ' : ''));
        setBuffer("");
        setSuggestions([]);
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }
    }
  };

  const applySuggestion = (suggestion: string) => {
    onChange(value.slice(0, -buffer.length) + suggestion);
    setBuffer("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const toggleTranslit = () => {
    setTranslitEnabled(!translitEnabled);
    setBuffer("");
    setSuggestions([]);
  };

  // Show transliteration toggle only for Tamil and Hindi
  const showTranslitToggle = language === 'tamil' || language === 'hindi';

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-start">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            id={id}
            type={type}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            className={cn(className, translitEnabled && "pr-20")}
          />
          {translitEnabled && (
            <Badge 
              variant="secondary" 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
            >
              {language === 'tamil' ? 'த' : 'हि'}
            </Badge>
          )}
        </div>
        {showTranslitToggle && (
          <Button
            type="button"
            variant={translitEnabled ? "default" : "outline"}
            size="icon"
            onClick={toggleTranslit}
            title={translitEnabled ? "Disable transliteration" : "Enable transliteration"}
          >
            {translitEnabled ? <X className="h-4 w-4" /> : <Languages className="h-4 w-4" />}
          </Button>
        )}
      </div>
      
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, idx) => (
            <Button
              key={idx}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applySuggestion(suggestion)}
              className="text-base"
            >
              {suggestion}
              <span className="ml-2 text-xs text-muted-foreground">Press Tab</span>
            </Button>
          ))}
        </div>
      )}
      
      {translitEnabled && (
        <p className="text-xs text-muted-foreground">
          {language === 'tamil' 
            ? 'அச்சிட்டு இடைவெளி அல்லது Tab அழுத்தவும்' 
            : 'टाइप करें और Space या Tab दबाएं'}
        </p>
      )}
    </div>
  );
};
