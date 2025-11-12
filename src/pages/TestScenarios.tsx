import { useState } from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface TestScenario {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export default function TestScenarios() {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState<TestScenario[]>([
    {
      id: '1',
      name: 'User Login Test',
      description: 'Test user authentication flow',
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'API Integration Test',
      description: 'Test external API integrations',
      createdAt: new Date(),
    },
  ]);

  const handleDelete = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <>
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Test Scenarios
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and execute your test scenarios
        </p>
      </header>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Scenarios</h2>
          <Button onClick={() => navigate('/test-scenarios/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Test Scenario
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* View Test Scenario Widget */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                View Test Scenarios
              </CardTitle>
              <CardDescription>
                Browse and review all test scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {scenarios.length} active scenario{scenarios.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          {/* Edit Test Scenario Widget */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Edit Test Scenarios
              </CardTitle>
              <CardDescription>
                Modify existing test scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Update test parameters and configurations
              </p>
            </CardContent>
          </Card>

          {/* Delete Test Scenario Widget */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                Delete Test Scenarios
              </CardTitle>
              <CardDescription>
                Remove unused test scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Clean up and organize your tests
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Test Scenarios List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium">{scenario.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {scenario.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(scenario.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
