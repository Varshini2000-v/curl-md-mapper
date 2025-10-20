import { FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UploadedFile } from '@/types/api';

interface FileSidebarProps {
  files: UploadedFile[];
  selectedFile: string | null;
  onSelectFile: (fileId: string) => void;
  onDeleteFile: (fileId: string) => void;
}

export function FileSidebar({
  files,
  selectedFile,
  onSelectFile,
  onDeleteFile,
}: FileSidebarProps) {
  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Uploaded Files</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No files uploaded yet
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                className={`
                  group relative rounded-md transition-colors
                  ${
                    selectedFile === file.id
                      ? 'bg-sidebar-accent'
                      : 'hover:bg-sidebar-accent/50'
                  }
                `}
              >
                <button
                  onClick={() => onSelectFile(file.id)}
                  className="w-full flex items-center gap-2 p-2 text-left"
                >
                  <FileText className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                </button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.id);
                  }}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
