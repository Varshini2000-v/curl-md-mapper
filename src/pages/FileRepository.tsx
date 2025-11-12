import { useState } from 'react';
import { FileText, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileUploadArea } from '@/components/FileUploadArea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFileContext } from '@/contexts/FileContext';

export default function FileRepository() {
  const [viewingFile, setViewingFile] = useState<any>(null);
  const { repositoryFiles, addRepositoryFiles, deleteRepositoryFile } = useFileContext();
  const { toast } = useToast();

  const handleFilesUpload = async (uploadedFiles: File[]) => {
    const newFiles = [];

    for (const file of uploadedFiles) {
      const content = await file.text();
      const fileId = crypto.randomUUID();
      newFiles.push({
        id: fileId,
        name: file.name,
        content,
      });
    }

    addRepositoryFiles(newFiles);
    toast({
      title: 'Files uploaded',
      description: `${uploadedFiles.length} file(s) uploaded successfully`,
    });
  };

  const handleDeleteFile = (fileId: string) => {
    deleteRepositoryFile(fileId);
    toast({
      title: 'File deleted',
      description: 'File removed successfully',
    });
  };

  const handleViewFile = (file: any) => {
    setViewingFile(file);
  };

  return (
    <>
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          File Repository
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload and manage .md and .json files
        </p>
      </header>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <FileUploadArea onFilesUpload={handleFilesUpload} />

        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              {repositoryFiles.length} file{repositoryFiles.length !== 1 ? 's' : ''} in repository
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {repositoryFiles.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No files uploaded yet
                </div>
              ) : (
                <div className="space-y-2">
                  {repositoryFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.content.length} characters
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewFile(file)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!viewingFile} onOpenChange={() => setViewingFile(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{viewingFile?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] mt-4">
            <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
              {viewingFile?.content}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
