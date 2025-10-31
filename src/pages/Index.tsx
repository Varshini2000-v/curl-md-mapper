import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { FileSidebar } from '@/components/FileSidebar';
import { FileUploadArea } from '@/components/FileUploadArea';
import { CurlPasteArea } from '@/components/CurlPasteArea';
import { FieldsTable } from '@/components/FieldsTable';
import { ResponseDisplay } from '@/components/ResponseDisplay';
import { PayloadMapper } from '@/components/PayloadMapper';
import { UploadedFile, ParsedField, ApiResponse, ApiMapping } from '@/types/api';
import { parseCurlCommand, extractFields, parseApiMappings } from '@/utils/curlParser';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fields, setFields] = useState<ParsedField[]>([]);
  const [apiMappings, setApiMappings] = useState<ApiMapping[]>([]);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFilesUpload = async (uploadedFiles: File[]) => {
    const newFiles: UploadedFile[] = [];

    for (const file of uploadedFiles) {
      const content = await file.text();
      newFiles.push({
        id: crypto.randomUUID(),
        name: file.name,
        content,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
    toast({
      title: 'Files uploaded',
      description: `${uploadedFiles.length} file(s) uploaded successfully`,
    });
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (selectedFile === fileId) {
      setSelectedFile(null);
      setFields([]);
    }
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFile(fileId);
    const file = files.find((f) => f.id === fileId);
    if (file) {
      // First try to parse as API mappings array
      const mappings = parseApiMappings(file.content);
      if (mappings) {
        setApiMappings(mappings);
        setFields([]);
        toast({
          title: 'API Mappings loaded',
          description: `Found ${mappings.length} API configuration(s)`,
        });
        return;
      }

      // Fallback: Try to parse as curl command
      const parsed = parseCurlCommand(file.content);
      if (parsed) {
        const extractedFields = extractFields(parsed);
        setFields(extractedFields);
        setApiMappings([]);
        toast({
          title: 'Curl command parsed',
          description: `Extracted ${extractedFields.length} fields`,
        });
      } else {
        setFields([]);
        setApiMappings([]);
        toast({
          title: 'Parse error',
          description: 'Could not parse file content',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCurlParse = (curlText: string) => {
    const parsed = parseCurlCommand(curlText);
    if (parsed) {
      const extractedFields = extractFields(parsed);
      setFields(extractedFields);
      toast({
        title: 'Curl command parsed',
        description: `Extracted ${extractedFields.length} fields`,
      });
    } else {
      toast({
        title: 'Parse error',
        description: 'Could not parse the curl command',
        variant: 'destructive',
      });
    }
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockResponse: ApiResponse = {
      status: 200,
      statusText: 'OK',
      data: {
        success: true,
        message: 'API call executed successfully',
        fields: fields.map((f) => ({ [f.name]: f.value })),
      },
      headers: {
        'content-type': 'application/json',
        'x-request-id': crypto.randomUUID(),
      },
    };

    setResponse(mockResponse);
    setIsLoading(false);

    toast({
      title: 'API executed',
      description: 'Request completed successfully',
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <FileSidebar
        files={files}
        selectedFile={selectedFile}
        onSelectFile={handleSelectFile}
        onDeleteFile={handleDeleteFile}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            API Tester
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload .md files or paste curl commands to test APIs
          </p>
        </header>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
              <TabsTrigger value="curl">Paste Curl</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-4">
              <FileUploadArea onFilesUpload={handleFilesUpload} />
            </TabsContent>

            <TabsContent value="curl" className="mt-4">
              <CurlPasteArea onParse={handleCurlParse} />
            </TabsContent>
          </Tabs>

          {apiMappings.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Payload Mapper</h2>
              <PayloadMapper apiMappings={apiMappings} />
            </div>
          ) : (
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

              <FieldsTable fields={fields} onFieldChange={handleFieldChange} />
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Response</h2>
            <ResponseDisplay response={response} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
