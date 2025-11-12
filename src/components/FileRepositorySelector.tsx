import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UploadedFile } from '@/types/api';

interface FileRepositorySelectorProps {
  files: UploadedFile[];
  selectedFileIds: string[];
  onSelectionChange: (fileIds: string[]) => void;
}

export function FileRepositorySelector({ 
  files, 
  selectedFileIds, 
  onSelectionChange 
}: FileRepositorySelectorProps) {
  const [open, setOpen] = useState(false);

  const handleToggleFile = (fileId: string) => {
    const newSelection = selectedFileIds.includes(fileId)
      ? selectedFileIds.filter((id) => id !== fileId)
      : [...selectedFileIds, fileId];
    onSelectionChange(newSelection);
  };

  return (
    <div className="space-y-2">
      <Label>Files</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedFileIds.length === 0
              ? 'Select files from repository...'
              : `${selectedFileIds.length} file${selectedFileIds.length > 1 ? 's' : ''} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 bg-popover" align="start">
          <ScrollArea className="h-[300px]">
            {files.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No files in repository. Upload files in File Repository first.
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                    onClick={() => handleToggleFile(file.id)}
                  >
                    <Checkbox
                      checked={selectedFileIds.includes(file.id)}
                      onCheckedChange={() => handleToggleFile(file.id)}
                    />
                    <label className="flex-1 text-sm cursor-pointer">
                      {file.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
