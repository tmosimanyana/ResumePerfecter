import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (resume: any) => void;
}

export function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const resume = await response.json();
        setUploadedFile({
          name: file.name,
          size: formatFileSize(file.size),
        });
        onFileUploaded(resume);
        
        toast({
          title: "Resume uploaded successfully",
          description: "Your resume has been processed and is ready for analysis.",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    onFileUploaded(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadedFile) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center" data-testid="file-status">
          <FileText className="h-6 w-6 text-red-500 mr-3" />
          <div>
            <p className="font-medium text-gray-900" data-testid="text-filename">{uploadedFile.name}</p>
            <p className="text-sm text-muted" data-testid="text-filesize">{uploadedFile.size}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <button 
            onClick={handleRemoveFile}
            className="text-gray-400 hover:text-gray-600"
            data-testid="button-remove-file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer group ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        data-testid="file-drop-zone"
      >
        <div className="group-hover:scale-105 transition-transform">
          <Upload className="h-12 w-12 text-gray-400 group-hover:text-primary mx-auto mb-4 transition-colors" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {isUploading ? 'Processing...' : 'Drop your resume here or click to browse'}
          </p>
          <p className="text-sm text-muted mb-4">Supports PDF, DOCX files up to 10MB</p>
          <Button 
            type="button"
            disabled={isUploading}
            className="bg-primary hover:bg-blue-700"
            data-testid="button-choose-file"
          >
            {isUploading ? 'Processing...' : 'Choose File'}
          </Button>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileSelect}
        className="hidden"
        data-testid="input-file"
      />
    </div>
  );
}
