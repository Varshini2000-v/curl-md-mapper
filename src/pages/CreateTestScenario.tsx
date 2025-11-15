import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Save } from 'lucide-react';
import { SelectedFilesList } from '@/components/SelectedFilesList';
import { FieldsTable } from '@/components/FieldsTable';
import { ResponseDisplay } from '@/components/ResponseDisplay';
import { FileRepositorySelector } from '@/components/FileRepositorySelector';
import { MapperWidget } from '@/components/MapperWidget';
import { UploadedFile, ParsedField, ApiResponse } from '@/types/api';
import { parseCurlCommand, extractFields } from '@/utils/curlParser';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useFileContext } from '@/contexts/FileContext';

export default function CreateTestScenario() {
  const navigate = useNavigate();
  const { repositoryFiles } = useFileContext();
  const [selectedCurlFileIds, setSelectedCurlFileIds] = useState<string[]>([]);
  const [selectedJsonFileIds, setSelectedJsonFileIds] = useState<string[]>([]);
  const [fields, setFields] = useState<ParsedField[]>([]);
  const [sourceFieldsMap, setSourceFieldsMap] = useState<Record<string, ParsedField[]>>({});
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [mappers, setMappers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiInfo, setApiInfo] = useState<{ apiUrl: string; apiName: string } | null>(null);
  const { toast } = useToast();

  const selectedCurlFiles = repositoryFiles.filter(f => selectedCurlFileIds.includes(f.id));
  const selectedJsonFiles = repositoryFiles.filter(f => selectedJsonFileIds.includes(f.id));
  const curlFiles = repositoryFiles.filter(f => !f.name.endsWith('.json'));
  const jsonFiles = repositoryFiles.filter(f => f.name.endsWith('.json'));

  const handleReorderCurlFiles = (newOrder: string[]) => {
    setSelectedCurlFileIds(newOrder);
  };

  const handleDeleteCurlFile = (fileId: string) => {
    setSelectedCurlFileIds(prev => prev.filter(id => id !== fileId));
  };

  const handleJsonFilesChange = (fileIds: string[]) => {
    setSelectedJsonFileIds(fileIds);
    
    // Extract fields from all selected JSON files
    const newSourceFields: Record<string, ParsedField[]> = {};
    fileIds.forEach(fileId => {
      const jsonFile = repositoryFiles.find(f => f.id === fileId);
      if (jsonFile) {
        try {
          const jsonData = JSON.parse(jsonFile.content);
          const fields: ParsedField[] = [];
          extractFieldsFromJson(jsonData, '', fields);
          newSourceFields[jsonFile.id] = fields;
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      }
    });
    setSourceFieldsMap(newSourceFields);
  };

  const handleSelectCurlFile = (fileId: string) => {
    const file = repositoryFiles.find(f => f.id === fileId);
    if (file) {
      // Handle .md files differently
      if (file.name.endsWith('.md')) {
        // Extract apiUrl and apiName from markdown file
        const lines = file.content.split('\n');
        let apiUrl = '';
        let apiName = '';
        
        lines.forEach(line => {
          if (line.toLowerCase().includes('api url:') || line.toLowerCase().includes('apiurl:')) {
            apiUrl = line.split(':').slice(1).join(':').trim();
          }
          if (line.toLowerCase().includes('api name:') || line.toLowerCase().includes('apiname:')) {
            apiName = line.split(':').slice(1).join(':').trim();
          }
        });
        
        setApiInfo({ apiUrl, apiName });
        
        // Extract curl command from markdown
        const curlMatch = file.content.match(/```(?:bash|sh)?\s*(curl\s+[^`]+)```/i);
        if (curlMatch) {
          const parsed = parseCurlCommand(curlMatch[1]);
          if (parsed) {
            const extractedFields = extractFields(parsed);
            // Clear any previous mappings when switching files
            const clearedFields = extractedFields.map(f => ({ ...f, mappedTo: undefined }));
            setFields(clearedFields);
            
            // Build sourceFieldsMap with both selected files
            const newSourceFields: Record<string, ParsedField[]> = { ...sourceFieldsMap };
            
            // Add current MD file's extracted fields
            newSourceFields[file.id] = extractedFields;
            
            // Add fields from all selected JSON files
            selectedJsonFiles.forEach(jsonFile => {
              try {
                const jsonData = JSON.parse(jsonFile.content);
                const fields: ParsedField[] = [];
                extractFieldsFromJson(jsonData, '', fields);
                newSourceFields[jsonFile.id] = fields;
              } catch (error) {
                console.error('Error parsing JSON file:', error);
              }
            });
            
            setSourceFieldsMap(newSourceFields);
          }
        }
      } else {
        // Handle regular curl files
        setApiInfo(null);
        const parsed = parseCurlCommand(file.content);
        if (parsed) {
          const extractedFields = extractFields(parsed);
          // Clear any previous mappings when switching files
          const clearedFields = extractedFields.map(f => ({ ...f, mappedTo: undefined }));
          setFields(clearedFields);
          
          // Build sourceFieldsMap with both selected files
          const newSourceFields: Record<string, ParsedField[]> = { ...sourceFieldsMap };
          
          // Add current curl file's extracted fields
          newSourceFields[file.id] = extractedFields;
          
          // Add fields from all selected JSON files
          selectedJsonFiles.forEach(jsonFile => {
            try {
              const jsonData = JSON.parse(jsonFile.content);
              const fields: ParsedField[] = [];
              extractFieldsFromJson(jsonData, '', fields);
              newSourceFields[jsonFile.id] = fields;
            } catch (error) {
              console.error('Error parsing JSON file:', error);
            }
          });
          
          setSourceFieldsMap(newSourceFields);
        }
      }
    }
  };

  const extractFieldsFromJson = (obj: any, prefix: string, fields: ParsedField[]) => {
    Object.entries(obj).forEach(([key, value]) => {
      const fieldName = prefix ? `${prefix}.${key}` : key;
      
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        extractFieldsFromJson(value[0], prefix, fields);
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        extractFieldsFromJson(value, fieldName, fields);
      } else if (!Array.isArray(value)) {
        fields.push({
          name: fieldName,
          value: String(value),
          type: typeof value,
          isChangeable: false,
        });
      }
    });
  };


  const handleFieldChange = (index: number, field: ParsedField) => {
    setFields((prev) => {
      const updated = [...prev];
      updated[index] = field;
      return updated;
    });
  };

  const handleRunApi = async () => {
    setIsLoading(true);
    setResponse(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Only include fields that have mappings set
    const mappedFields = fields.filter((f) => f.isChangeable && f.mappedTo && f.mappedTo.fieldName);

    const mappings: Record<string, any> = {};
    mappedFields.forEach((field) => {
      mappings[field.name] = {
        type: 'dynamic',
        source: field.mappedTo?.apiName || 'static',
        field: field.mappedTo?.fieldName || field.name,
        value: field.value,
      };
    });

    const mockResponse: ApiResponse = {
      status: 200,
      statusText: 'OK',
      data: {
        apiName: apiInfo?.apiName || selectedCurlFiles[0]?.name || 'API',
        endpoint: apiInfo?.apiUrl || '/api/endpoint',
        headers: {
          'Content-Type': 'application/json',
        },
        mappings,
      },
      headers: {
        'content-type': 'application/json',
        'x-request-id': crypto.randomUUID(),
      },
    };

    setResponse(mockResponse);
    
    // Generate mapper object for the current API
    const currentApiName = apiInfo?.apiName || selectedCurlFiles[0]?.name.replace(/\.(md|txt)$/i, '') || 'API';
    const newMapper = {
      id: crypto.randomUUID(),
      apiName: currentApiName,
      apiUrl: apiInfo?.apiUrl || 'N/A',
      mappings,
      createdAt: new Date().toISOString(),
    };
    
    // Accumulate mappers instead of replacing
    setMappers(prev => [...prev, newMapper]);
    
    setIsLoading(false);

    toast({
      title: 'API executed',
      description: `Mapper created for ${currentApiName}`,
    });
  };

  const handleSave = async () => {
    const payload = {
      curlFiles: selectedCurlFiles.map(f => ({ id: f.id, name: f.name, content: f.content })),
      jsonFiles: selectedJsonFiles.map(f => ({ id: f.id, name: f.name, content: f.content })),
      fields,
      mappers,
    };

    console.log('Saving test scenario:', payload);
    
    toast({
      title: 'Test scenario saved',
      description: 'Your test scenario has been saved successfully',
    });

    // Here you would call your API
    // await fetch('/api/test-scenarios', { method: 'POST', body: JSON.stringify(payload) });
  };

  return (
    <>
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/test-scenarios')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Create Test Scenario
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload files or paste curl commands to test APIs
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FileRepositorySelector
            files={curlFiles}
            selectedFileIds={selectedCurlFileIds}
            onSelectionChange={setSelectedCurlFileIds}
            label="CURL Files"
          />
          
          <FileRepositorySelector
            files={jsonFiles}
            selectedFileIds={selectedJsonFileIds}
            onSelectionChange={handleJsonFilesChange}
            label="JSON Files"
          />
        </div>

        <SelectedFilesList
          files={selectedCurlFiles}
          onReorder={handleReorderCurlFiles}
          onDelete={handleDeleteCurlFile}
          onSelect={handleSelectCurlFile}
        />

        {fields.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Extracted Fields</h2>
              <Button
                onClick={handleRunApi}
                disabled={fields.length === 0 || isLoading}
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Run API Call
              </Button>
            </div>

            {apiInfo && (
              <div className="p-4 bg-muted rounded-md space-y-2">
                <div className="flex gap-2">
                  <span className="font-semibold">API URL:</span>
                  <code className="text-sm">{apiInfo.apiUrl}</code>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">API Name:</span>
                  <code className="text-sm">{apiInfo.apiName}</code>
                </div>
              </div>
            )}

            <FieldsTable 
              fields={fields} 
              onFieldChange={handleFieldChange}
              sourceFiles={[...selectedCurlFiles, ...selectedJsonFiles]}
              sourceFieldsMap={sourceFieldsMap}
            />
          </div>
        )}

        {response && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Response</h2>
            <ResponseDisplay response={response} isLoading={isLoading} />
          </div>
        )}

        {mappers.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Generated Mappers</h2>
            <MapperWidget mappers={mappers} />
            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Test Scenario
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
