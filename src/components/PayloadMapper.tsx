import { ApiMapping } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PayloadMapperProps {
  apiMappings: ApiMapping[];
}

export const PayloadMapper = ({ apiMappings }: PayloadMapperProps) => {
  if (!apiMappings || apiMappings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            No API mappings found. Upload a file with API mapping configuration.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {apiMappings.map((api, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{api.apiName}</span>
              <Badge variant="outline">{api.endpoint}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Headers Section */}
            {api.headers && Object.keys(api.headers).length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Headers</h4>
                <div className="rounded-md border border-border bg-muted/50 p-3">
                  {Object.entries(api.headers).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm py-1">
                      <span className="font-medium text-foreground">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mappings Section */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Field Mappings</h4>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(api.mappings).map(([mappingName, mapping]) => (
                  <AccordionItem key={mappingName} value={mappingName}>
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-2">
                        <span>{mappingName}</span>
                        <Badge variant="secondary" className="text-xs">
                          {mapping.type}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-4">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-muted-foreground min-w-[60px]">Type:</span>
                          <span className="text-xs text-foreground">{mapping.type}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-muted-foreground min-w-[60px]">Source:</span>
                          <span className="text-xs text-foreground">{mapping.source}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-muted-foreground min-w-[60px]">Field:</span>
                          <span className="text-xs text-foreground">{mapping.field}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
