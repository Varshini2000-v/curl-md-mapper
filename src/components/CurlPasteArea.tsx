import { useState } from 'react';
import { Code, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CurlPasteAreaProps {
  onParse: (curlCommand: string) => void;
}

export function CurlPasteArea({ onParse }: CurlPasteAreaProps) {
  const [curlText, setCurlText] = useState('');

  const handleParse = () => {
    if (curlText.trim()) {
      onParse(curlText);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Code className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Paste Curl Command</h3>
      </div>
      
      <Textarea
        value={curlText}
        onChange={(e) => setCurlText(e.target.value)}
        placeholder={`curl -X POST 'https://api.example.com/endpoint' \\
  -H 'Content-Type: application/json' \\
  -d '{"key": "value"}'`}
        className="min-h-[200px] font-mono text-sm bg-code-bg border-border resize-none"
      />
      
      <Button onClick={handleParse} disabled={!curlText.trim()} className="w-full">
        <Play className="h-4 w-4 mr-2" />
        Parse Command
      </Button>
    </div>
  );
}
