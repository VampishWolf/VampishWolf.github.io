import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  QrCode, 
  Download, 
  Edit, 
  ExpandIcon, 
  FileImage, 
  Eye, 
  Zap, 
  Smartphone, 
  Info, 
  Link, 
  Mail, 
  Phone, 
  Type,
  CheckCircle
} from "lucide-react";

export default function QRGenerator() {
  const [qrContent, setQrContent] = useState("https://example.com");
  const [qrSize, setQrSize] = useState("200");
  const [qrFormat, setQrFormat] = useState("png");
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [inputError, setInputError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  // Dynamically import QRCode library
  const generateQRCode = useCallback(async (text: string, size: number) => {
    const QRCode = await import('qrcode');
    return QRCode.toDataURL(text, {
      width: size,
      height: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  }, []);

  const validateInput = (text: string) => {
    if (!text || text.trim().length === 0) {
      return { valid: false, message: 'Please enter some content' };
    }
    
    if (text.length > 1000) {
      return { valid: false, message: 'Content is too long (max 1000 characters)' };
    }
    
    return { valid: true };
  };

  const handleGenerateQRCode = useCallback(async () => {
    const text = qrContent.trim();
    const validation = validateInput(text);
    
    if (!validation.valid) {
      setInputError(validation.message);
      setQrDataUrl(null);
      return;
    }
    
    setInputError("");
    setIsGenerating(true);
    
    try {
      // Simulate slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const dataUrl = await generateQRCode(text, parseInt(qrSize));
      setQrDataUrl(dataUrl);
      
    } catch (error) {
      console.error('QR Code generation failed:', error);
      setInputError('Failed to generate QR code. Please try again.');
      setQrDataUrl(null);
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [qrContent, qrSize, generateQRCode, toast]);

  // Real-time generation with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (qrContent.trim()) {
        handleGenerateQRCode();
      } else {
        setQrDataUrl(null);
        setInputError("");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [qrContent, qrSize, handleGenerateQRCode]);

  const handleDownload = async () => {
    if (!qrDataUrl) return;

    setIsDownloading(true);
    
    try {
      const link = document.createElement('a');
      const filename = `qr-code-${Date.now()}.${qrFormat}`;
      
      if (qrFormat === 'jpeg') {
        // Convert PNG to JPEG
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        await new Promise((resolve) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Fill with white background for JPEG
            ctx!.fillStyle = 'white';
            ctx!.fillRect(0, 0, canvas.width, canvas.height);
            ctx!.drawImage(img, 0, 0);
            
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            resolve(null);
          };
          img.src = qrDataUrl;
        });
      } else {
        link.href = qrDataUrl;
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Complete",
        description: `QR code downloaded as ${filename}`,
      });
      
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Generator</h1>
            <p className="text-gray-600">Create professional QR codes instantly for any text or URL</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* QR Generator Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 mb-2">
                    <Edit className="inline mr-2 h-4 w-4 text-primary" />
                    Enter Text or URL
                  </Label>
                  <Textarea
                    id="qr-input"
                    placeholder="Enter your text, URL, or any content to generate QR code..."
                    className="w-full resize-none"
                    rows={4}
                    value={qrContent}
                    onChange={(e) => setQrContent(e.target.value)}
                  />
                  {inputError && (
                    <div className="mt-2 text-sm text-destructive flex items-center">
                      <Info className="mr-1 h-4 w-4" />
                      {inputError}
                    </div>
                  )}
                </div>

                {/* QR Code Options */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Size Selection */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-3">
                      <ExpandIcon className="inline mr-2 h-4 w-4 text-primary" />
                      Size
                    </Label>
                    <RadioGroup value={qrSize} onValueChange={setQrSize} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="200" id="size-200" />
                        <Label htmlFor="size-200" className="text-sm">Small (200x200)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="300" id="size-300" />
                        <Label htmlFor="size-300" className="text-sm">Medium (300x300)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="400" id="size-400" />
                        <Label htmlFor="size-400" className="text-sm">Large (400x400)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Format Selection */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-3">
                      <FileImage className="inline mr-2 h-4 w-4 text-primary" />
                      Format
                    </Label>
                    <RadioGroup value={qrFormat} onValueChange={setQrFormat} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="png" id="format-png" />
                        <Label htmlFor="format-png" className="text-sm">PNG</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="jpeg" id="format-jpeg" />
                        <Label htmlFor="format-jpeg" className="text-sm">JPEG</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={handleGenerateQRCode}
                  className="w-full bg-primary hover:bg-blue-700 text-white font-medium"
                  disabled={isGenerating}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate QR Code"}
                </Button>
              </div>

              {/* Preview Section */}
              <div className="flex flex-col items-center">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Eye className="inline mr-2 h-5 w-5 text-primary" />
                    Preview
                  </h3>
                  <p className="text-sm text-gray-600">Your QR code will appear here</p>
                </div>

                {/* QR Code Display Area */}
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-sm aspect-square flex items-center justify-center mb-6">
                  {isGenerating ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4 mx-auto"></div>
                      <p className="text-gray-600">Generating QR Code...</p>
                    </div>
                  ) : qrDataUrl ? (
                    <div>
                      <img 
                        src={qrDataUrl} 
                        alt="Generated QR Code" 
                        className="max-w-full h-auto rounded-lg shadow-sm"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <QrCode className="h-16 w-16 text-gray-400 mb-4 mx-auto" />
                      <p className="text-gray-500">QR Code will appear here</p>
                    </div>
                  )}
                </div>

                {/* Download Section */}
                {qrDataUrl && (
                  <div className="w-full max-w-sm">
                    <div className="bg-accent/10 rounded-lg p-4 mb-4">
                      <div className="flex items-center text-accent mb-2">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span className="font-medium">QR Code Generated Successfully!</span>
                      </div>
                      <p className="text-sm text-gray-600">Ready to download in your selected format</p>
                    </div>

                    <Button 
                      onClick={handleDownload}
                      className="w-full bg-accent hover:bg-green-600 text-white font-medium"
                      disabled={isDownloading}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isDownloading ? "Downloading..." : "Download QR Code"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Generation</h3>
              <p className="text-sm text-gray-600">Generate QR codes instantly as you type with real-time preview</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
              <p className="text-sm text-gray-600">Fully responsive design that works perfectly on all devices</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
              <p className="text-sm text-gray-600">Download in PNG or JPEG format with customizable sizes</p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Instructions */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <Info className="inline mr-2 h-5 w-5 text-primary" />
              How to Use
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Supported Content Types:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Link className="text-primary mr-2 h-4 w-4" />
                    Website URLs (http://example.com)
                  </li>
                  <li className="flex items-center">
                    <Mail className="text-primary mr-2 h-4 w-4" />
                    Email addresses (mailto:user@example.com)
                  </li>
                  <li className="flex items-center">
                    <Phone className="text-primary mr-2 h-4 w-4" />
                    Phone numbers (tel:+1234567890)
                  </li>
                  <li className="flex items-center">
                    <Type className="text-primary mr-2 h-4 w-4" />
                    Plain text and messages
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Simple Steps:</h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                    Enter your text or URL in the input field
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                    Choose your preferred size and format
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                    Click generate to create your QR code
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">4</span>
                    Download your QR code and use it anywhere
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2024 QR Code Generator. Built with modern web technologies.</p>
            <p className="text-sm">Free QR code generation tool for personal and commercial use.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
