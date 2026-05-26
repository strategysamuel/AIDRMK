import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Delete, Space, Languages } from "lucide-react";

interface RegionalKeyboardProps {
  onInput: (value: string) => void;
  onDelete: () => void;
  onSpace: () => void;
  currentValue: string;
}

export const RegionalKeyboard = ({ onInput, onDelete, onSpace, currentValue }: RegionalKeyboardProps) => {
  const [activeTab, setActiveTab] = useState<string>("english");

  const tamilVowels = ["அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ"];
  const tamilConsonants = [
    "க", "ங", "ச", "ஞ", "ட", "ண", "த", "ந", "ப", "ம",
    "ய", "ர", "ல", "வ", "ழ", "ள", "ற", "ன"
  ];
  const tamilNumbers = ["௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯", "௦"];

  const hindiVowels = ["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ"];
  const hindiConsonants = [
    "क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ",
    "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न",
    "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व",
    "श", "ष", "स", "ह"
  ];
  const hindiNumbers = ["१", "२", "३", "४", "५", "६", "७", "८", "९", "०"];

  const englishLetters = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"
  ];
  const englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  const handleCharacterClick = (char: string) => {
    onInput(char);
  };

  return (
    <Card className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          <span className="font-semibold">Language Helper</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Current: {currentValue.length} characters
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="tamil">தமிழ்</TabsTrigger>
          <TabsTrigger value="hindi">हिंदी</TabsTrigger>
        </TabsList>

        {/* English Keyboard */}
        <TabsContent value="english" className="space-y-3">
          <div>
            <div className="text-xs font-semibold mb-2 text-muted-foreground">Letters</div>
            <div className="grid grid-cols-10 gap-1">
              {englishLetters.map((char) => (
                <Button
                  key={char}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 text-base font-semibold"
                  onClick={() => handleCharacterClick(char)}
                >
                  {char}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2 text-muted-foreground">Numbers</div>
            <div className="grid grid-cols-10 gap-1">
              {englishNumbers.map((num) => (
                <Button
                  key={num}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 text-base font-semibold"
                  onClick={() => handleCharacterClick(num)}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tamil Keyboard */}
        <TabsContent value="tamil" className="space-y-3">
          <div>
            <div className="text-xs font-semibold mb-2 text-muted-foreground">உயிர் எழுத்துக்கள் (Vowels)</div>
            <div className="grid grid-cols-6 gap-1">
              {tamilVowels.map((char) => (
                <Button
                  key={char}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-12 text-lg font-semibold"
                  onClick={() => handleCharacterClick(char)}
                >
                  {char}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2 text-muted-foreground">மெய் எழுத்துக்கள் (Consonants)</div>
            <div className="grid grid-cols-9 gap-1">
              {tamilConsonants.map((char) => (
                <Button
                  key={char}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-12 text-lg font-semibold"
                  onClick={() => handleCharacterClick(char)}
                >
                  {char}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2 text-muted-foreground">எண்கள் (Numbers)</div>
            <div className="grid grid-cols-10 gap-1">
              {tamilNumbers.map((num, idx) => (
                <Button
                  key={num}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 text-base font-semibold"
                  onClick={() => handleCharacterClick(englishNumbers[idx])}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground">{num}</span>
                    <span>{englishNumbers[idx]}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Hindi Keyboard */}
        <TabsContent value="hindi" className="space-y-3">
          <div>
            <div className="text-xs font-semibold mb-2 text-muted-foreground">स्वर (Vowels)</div>
            <div className="grid grid-cols-5 gap-1">
              {hindiVowels.map((char) => (
                <Button
                  key={char}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-12 text-lg font-semibold"
                  onClick={() => handleCharacterClick(char)}
                >
                  {char}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2 text-muted-foreground">व्यंजन (Consonants)</div>
            <div className="grid grid-cols-11 gap-1">
              {hindiConsonants.map((char) => (
                <Button
                  key={char}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-12 text-lg font-semibold"
                  onClick={() => handleCharacterClick(char)}
                >
                  {char}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2 text-muted-foreground">अंक (Numbers)</div>
            <div className="grid grid-cols-10 gap-1">
              {hindiNumbers.map((num, idx) => (
                <Button
                  key={num}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 text-base font-semibold"
                  onClick={() => handleCharacterClick(englishNumbers[idx])}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground">{num}</span>
                    <span>{englishNumbers[idx]}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Control Buttons */}
      <div className="flex gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onSpace}
        >
          <Space className="h-4 w-4 mr-2" />
          Space
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onDelete}
        >
          <Delete className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </Card>
  );
};
