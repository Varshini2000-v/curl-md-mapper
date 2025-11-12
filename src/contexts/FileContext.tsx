import { createContext, useContext, useState, ReactNode } from 'react';
import { UploadedFile } from '@/types/api';

interface FileContextType {
  repositoryFiles: UploadedFile[];
  addRepositoryFiles: (files: UploadedFile[]) => void;
  deleteRepositoryFile: (fileId: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [repositoryFiles, setRepositoryFiles] = useState<UploadedFile[]>([]);

  const addRepositoryFiles = (files: UploadedFile[]) => {
    setRepositoryFiles((prev) => [...prev, ...files]);
  };

  const deleteRepositoryFile = (fileId: string) => {
    setRepositoryFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <FileContext.Provider value={{ repositoryFiles, addRepositoryFiles, deleteRepositoryFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within FileProvider');
  }
  return context;
}
