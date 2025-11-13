import { useState } from 'react';
import { Eye, Trash2, Download, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UploadedFile } from '@/types/api';

interface SelectedFilesListProps {
  files: UploadedFile[];
  onReorder: (newOrder: string[]) => void;
  onDelete: (fileId: string) => void;
  onSelect: (fileId: string) => void;
}

export function SelectedFilesList({ files, onReorder, onDelete, onSelect }: SelectedFilesListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [viewFile, setViewFile] = useState<UploadedFile | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newFiles = [...files];
    const draggedFile = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(dropIndex, 0, draggedFile);

    const newOrder = newFiles.map(f => f.id);
    onReorder(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDownload = (file: UploadedFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (files.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No CURL files selected. Select files from the dropdown above.
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Selected CURL Files (drag to reorder)</h3>
      <div className="space-y-2">
        {files.map((file, index) => (
          <Card
            key={file.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`p-4 flex items-center gap-3 cursor-move hover:bg-accent/50 transition-colors ${draggedIndex === index ? 'opacity-50' : ''}`}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
            <span 
              className="flex-1 font-medium cursor-pointer hover:text-primary"
              onClick={() => onSelect(file.id)}
            >
              {file.name}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewFile(file)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(file)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(file.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!viewFile} onOpenChange={() => setViewFile(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewFile?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <pre className="text-sm">{viewFile?.content}</pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
