import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadAreaProps {
  onFilesUpload: (files: File[]) => void;
}

export function FileUploadArea({ onFilesUpload }: FileUploadAreaProps) {
  const { toast } = useToast();

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.name.endsWith('.md')
      );
      
      if (files.length === 0) {
        toast({
          title: 'Invalid files',
          description: 'Please upload .md files only',
          variant: 'destructive',
        });
        return;
      }
      
      onFilesUpload(files);
    },
    [onFilesUpload, toast]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        onFilesUpload(files);
      }
    },
    [onFilesUpload]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors bg-card"
    >
      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">Upload Markdown Files</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop .md files here, or click to browse
      </p>
      <input
        type="file"
        multiple
        accept=".md"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
      >
        Choose Files
      </label>
    </div>
  );
}
