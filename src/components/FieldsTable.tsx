import { useState } from 'react';
import { ParsedField } from '@/types/api';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface FieldsTableProps {
  fields: ParsedField[];
  onFieldChange: (index: number, field: ParsedField) => void;
}

const MOCK_APIS = [
  { name: 'accountDetailsApi', fields: ['accountId', 'accountName', 'balance'] },
  { name: 'userApi', fields: ['userId', 'username', 'email'] },
  { name: 'orderApi', fields: ['orderId', 'total', 'status'] },
];

export function FieldsTable({ fields, onFieldChange }: FieldsTableProps) {
  const [selectedApi, setSelectedApi] = useState<Record<number, string>>({});

  const handleChangeableToggle = (index: number, checked: boolean) => {
    onFieldChange(index, { ...fields[index], isChangeable: checked });
  };

  const handleApiSelect = (index: number, apiName: string) => {
    setSelectedApi((prev) => ({ ...prev, [index]: apiName }));
    onFieldChange(index, {
      ...fields[index],
      mappedTo: { apiName, fieldName: '' },
    });
  };

  const handleFieldSelect = (index: number, fieldName: string) => {
    const currentMapping = fields[index].mappedTo;
    if (currentMapping) {
      onFieldChange(index, {
        ...fields[index],
        mappedTo: { ...currentMapping, fieldName },
      });
    }
  };

  if (fields.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Upload a file or paste a curl command to see extracted fields
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Field Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Changeable</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Map to API</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Field</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {fields.map((field, index) => {
              const api = MOCK_APIS.find((a) => a.name === selectedApi[index]);
              
              return (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono text-code-keyword">{field.name}</code>
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={field.value}
                      onChange={(e) =>
                        onFieldChange(index, { ...field, value: e.target.value })
                      }
                      className="h-8 text-sm font-mono bg-input"
                      disabled={!field.isChangeable}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="font-mono text-xs">
                      {field.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Checkbox
                      checked={field.isChangeable}
                      onCheckedChange={(checked) =>
                        handleChangeableToggle(index, checked as boolean)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={selectedApi[index] || ''}
                      onValueChange={(value) => handleApiSelect(index, value)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select API" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {MOCK_APIS.map((api) => (
                          <SelectItem key={api.name} value={api.name}>
                            {api.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={field.mappedTo?.fieldName || ''}
                      onValueChange={(value) => handleFieldSelect(index, value)}
                      disabled={!selectedApi[index]}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select Field" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {api?.fields.map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
