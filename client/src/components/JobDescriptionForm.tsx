import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface JobDescriptionFormProps {
  onJobDescriptionCreated: (jobDescription: any) => void;
}

export function JobDescriptionForm({ onJobDescriptionCreated }: JobDescriptionFormProps) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in the job title and description.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/job-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          company: company.trim() || null,
          description: description.trim(),
        }),
      });

      if (response.ok) {
        const jobDescription = await response.json();
        onJobDescriptionCreated(jobDescription);
        
        toast({
          title: "Job description saved",
          description: "Ready to analyze your resume against this position.",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save job description');
      }
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-2">
          Job Title
        </Label>
        <Input
          id="job-title"
          type="text"
          placeholder="e.g., Senior Software Engineer"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
          data-testid="input-job-title"
        />
      </div>
      
      <div>
        <Label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
          Company (Optional)
        </Label>
        <Input
          id="company"
          type="text"
          placeholder="e.g., Google, Microsoft, etc."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full"
          data-testid="input-company"
        />
      </div>
      
      <div>
        <Label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-2">
          Job Description
          <span className="text-muted font-normal ml-1">(Paste the full job posting)</span>
        </Label>
        <Textarea
          id="job-description"
          placeholder="Paste the complete job description here. Include requirements, responsibilities, and qualifications for the best keyword analysis..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
          className="w-full resize-none"
          data-testid="textarea-job-description"
        />
        <div className="mt-2 text-sm text-muted">
          {description.length} characters
        </div>
      </div>
    </form>
  );
}
