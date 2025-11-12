import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FolderOpen, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-20 border-r border-border bg-card flex flex-col items-center py-6 gap-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AT
          </h1>
        </div>

        <Button
          variant={isActive('/') ? 'default' : 'ghost'}
          size="icon"
          onClick={() => navigate('/')}
          className="h-12 w-12"
          title="File Repository"
        >
          <FolderOpen className="h-5 w-5" />
        </Button>

        <Button
          variant={isActive('/test-scenarios') ? 'default' : 'ghost'}
          size="icon"
          onClick={() => navigate('/test-scenarios')}
          className="h-12 w-12"
          title="Test Scenarios"
        >
          <FlaskConical className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
