import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MapperWidgetProps {
  mappers: any[];
}

export function MapperWidget({ mappers }: MapperWidgetProps) {
  return (
    <div className="grid gap-4">
      {mappers.map((mapper) => (
        <Card key={mapper.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{mapper.curlFile}</h3>
            <Badge variant="secondary">
              {new Date(mapper.createdAt).toLocaleString()}
            </Badge>
          </div>
          <ScrollArea className="h-[200px] w-full">
            <pre className="text-xs bg-muted p-3 rounded">
              {JSON.stringify(mapper.mappings, null, 2)}
            </pre>
          </ScrollArea>
        </Card>
      ))}
    </div>
  );
}
