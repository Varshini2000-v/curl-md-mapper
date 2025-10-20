import { ApiResponse } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ResponseDisplayProps {
  response: ApiResponse | null;
  isLoading: boolean;
}

export function ResponseDisplay({ response, isLoading }: ResponseDisplayProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Executing API call...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Response will appear here after executing the API call
      </div>
    );
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'destructive';
    return 'secondary';
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300)
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    if (status >= 400 && status < 500)
      return <AlertCircle className="h-5 w-5 text-warning" />;
    return <XCircle className="h-5 w-5 text-destructive" />;
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border p-4 flex items-center gap-3 bg-secondary">
        {getStatusIcon(response.status)}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge
              variant={getStatusColor(response.status) as any}
              className="font-mono"
            >
              {response.status}
            </Badge>
            <span className="text-sm font-medium">{response.statusText}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">Response Body</h4>
        <ScrollArea className="h-96 w-full rounded-md border border-border bg-code-bg p-4">
          <pre className="text-sm font-mono">
            <code>{JSON.stringify(response.data, null, 2)}</code>
          </pre>
        </ScrollArea>
      </div>

      {Object.keys(response.headers).length > 0 && (
        <div className="border-t border-border p-4">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Headers</h4>
          <div className="space-y-1">
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="flex gap-2 text-xs font-mono">
                <span className="text-code-keyword">{key}:</span>
                <span className="text-code-string">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
