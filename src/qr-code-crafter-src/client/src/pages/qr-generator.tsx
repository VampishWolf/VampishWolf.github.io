import { useState, useEffect, useCallback, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
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
  Info,
  CheckCircle
} from "lucide-react";
import { QRCustomizationPanel } from "@/components/qr-customization";
import { Footer } from "@/components/Footer";
import { DEFAULT_QR_STYLING_OPTIONS, type QRStylingOptions, type ColorConfig } from "@/types/qr-styling";

// Helper function to convert ColorConfig to qr-code-styling format
function colorConfigToQRStyling(config: ColorConfig) {
  if (config.type === 'solid') {
    return { color: config.color || '#000000' };
  }

  const gradient = config.gradient!;
  return {
    gradient: {
      type: gradient.type,
      rotation: gradient.rotation || 0,
      colorStops: gradient.colorStops.map(stop => ({
        offset: stop.offset,
        color: stop.color
      }))
    }
  };
}

export default function QRGenerator() {
  const [qrContent, setQrContent] = useState("https://example.com");
  const [qrSize, setQrSize] = useState("200");
  const [qrFormat, setQrFormat] = useState<"png" | "jpeg">("png");
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [inputError, setInputError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [stylingOptions, setStylingOptions] = useState<QRStylingOptions>(DEFAULT_QR_STYLING_OPTIONS);
  const { toast } = useToast();

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  const validateInput = (text: string) => {
    if (!text || text.trim().length === 0) {
      return { valid: false, message: 'Please enter some content' };
    }

    if (text.length > 1000) {
      return { valid: false, message: 'Content is too long (max 1000 characters)' };
    }

    return { valid: true };
  };

  const generateQRCode = useCallback(() => {
    const text = qrContent.trim();
    const validation = validateInput(text);

    if (!validation.valid) {
      setInputError(validation.message || '');
      setQrGenerated(false);
      return;
    }

    setInputError("");
    setIsGenerating(true);

    // Use SVG for crisp rendering on all displays
    const previewSize = 280;

    const qrOptions = {
      type: 'svg' as const,
      width: previewSize,
      height: previewSize,
      data: text,
      margin: 8,
      dotsOptions: {
        type: stylingOptions.dotsOptions.type,
        ...colorConfigToQRStyling(stylingOptions.dotsOptions.color)
      },
      cornersSquareOptions: {
        type: stylingOptions.cornersSquareOptions.type,
        ...colorConfigToQRStyling(stylingOptions.cornersSquareOptions.color)
      },
      cornersDotOptions: {
        type: stylingOptions.cornersDotOptions.type,
        ...colorConfigToQRStyling(stylingOptions.cornersDotOptions.color)
      },
      backgroundOptions: colorConfigToQRStyling(stylingOptions.backgroundOptions.color)
    };

    // Always recreate the instance to handle gradient/solid switches properly
    qrCodeInstance.current = new QRCodeStyling(qrOptions);

    // Clear and re-append if ref exists
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCodeInstance.current.append(qrRef.current);
    }

    setIsGenerating(false);
    setQrGenerated(true);
  }, [qrContent, stylingOptions]);

  // Append QR code to DOM when ref becomes available (for initial render)
  useEffect(() => {
    if (qrGenerated && qrRef.current && qrCodeInstance.current && qrRef.current.children.length === 0) {
      qrCodeInstance.current.append(qrRef.current);
    }
  }, [qrGenerated]);

  // Real-time generation with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (qrContent.trim()) {
        generateQRCode();
      } else {
        setQrGenerated(false);
        setInputError("");
        if (qrRef.current) {
          qrRef.current.innerHTML = '';
        }
        qrCodeInstance.current = null;
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [qrContent, qrSize, stylingOptions, generateQRCode]);

  const handleDownload = async () => {
    if (!qrGenerated) return;

    setIsDownloading(true);

    try {
      const filename = `qr-code-${Date.now()}`;
      const downloadSize = parseInt(qrSize);

      // Create a new QR code instance at the user-selected size for download
      const downloadQR = new QRCodeStyling({
        width: downloadSize,
        height: downloadSize,
        data: qrContent.trim(),
        margin: 8,
        dotsOptions: {
          type: stylingOptions.dotsOptions.type,
          ...colorConfigToQRStyling(stylingOptions.dotsOptions.color)
        },
        cornersSquareOptions: {
          type: stylingOptions.cornersSquareOptions.type,
          ...colorConfigToQRStyling(stylingOptions.cornersSquareOptions.color)
        },
        cornersDotOptions: {
          type: stylingOptions.cornersDotOptions.type,
          ...colorConfigToQRStyling(stylingOptions.cornersDotOptions.color)
        },
        backgroundOptions: colorConfigToQRStyling(stylingOptions.backgroundOptions.color)
      });

      if (qrFormat === 'jpeg') {
        // For JPEG, we need to get the canvas and convert with white background
        const canvas = await downloadQR.getRawData('png');
        if (canvas instanceof Blob) {
          const img = new Image();
          const url = URL.createObjectURL(canvas);

          await new Promise((resolve, reject) => {
            img.onload = () => {
              const newCanvas = document.createElement('canvas');
              const ctx = newCanvas.getContext('2d');
              newCanvas.width = img.width;
              newCanvas.height = img.height;

              // Fill with white background for JPEG
              ctx!.fillStyle = 'white';
              ctx!.fillRect(0, 0, newCanvas.width, newCanvas.height);
              ctx!.drawImage(img, 0, 0);

              newCanvas.toBlob((blob) => {
                if (blob) {
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = `${filename}.jpeg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(link.href);
                }
                resolve(null);
              }, 'image/jpeg', 0.9);

              URL.revokeObjectURL(url);
            };
            img.onerror = reject;
            img.src = url;
          });
        }
      } else {
        await downloadQR.download({
          name: filename,
          extension: 'png'
        });
      }

      toast({
        title: "Download Complete",
        description: `QR code downloaded as ${filename}.${qrFormat}`,
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
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QR Code Generator</h1>
              <p className="text-sm text-gray-600">Create professional QR codes instantly</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Side - Options (Scrollable) */}
          <div className="w-[60%] space-y-4 pb-8">
            {/* Content Input */}
            <Card>
              <CardContent className="p-4">
                <Label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 mb-2">
                  <Edit className="inline mr-2 h-4 w-4 text-primary" />
                  Enter Text or URL
                </Label>
                <Textarea
                  id="qr-input"
                  placeholder="Enter your text, URL, or any content..."
                  className="w-full resize-none"
                  rows={3}
                  value={qrContent}
                  onChange={(e) => setQrContent(e.target.value)}
                />
                {inputError && (
                  <div className="mt-2 text-sm text-destructive flex items-center">
                    <Info className="mr-1 h-4 w-4" />
                    {inputError}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Size & Format Options */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Size Selection */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-3">
                      <ExpandIcon className="inline mr-2 h-4 w-4 text-primary" />
                      Download Size
                    </Label>
                    <RadioGroup value={qrSize} onValueChange={setQrSize} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="200" id="size-200" />
                        <Label htmlFor="size-200" className="text-sm">Small (200px)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="300" id="size-300" />
                        <Label htmlFor="size-300" className="text-sm">Medium (300px)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="400" id="size-400" />
                        <Label htmlFor="size-400" className="text-sm">Large (400px)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Format Selection */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-3">
                      <FileImage className="inline mr-2 h-4 w-4 text-primary" />
                      Format
                    </Label>
                    <RadioGroup value={qrFormat} onValueChange={(v) => setQrFormat(v as "png" | "jpeg")} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="png" id="format-png" />
                        <Label htmlFor="format-png" className="text-sm">PNG (transparent)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="jpeg" id="format-jpeg" />
                        <Label htmlFor="format-jpeg" className="text-sm">JPEG (white bg)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Customization Panel */}
            <Card>
              <CardContent className="p-4">
                <Label className="block text-sm font-medium text-gray-700 mb-3">
                  <QrCode className="inline mr-2 h-4 w-4 text-primary" />
                  Design Customization
                </Label>
                <QRCustomizationPanel
                  options={stylingOptions}
                  onChange={setStylingOptions}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Preview (Fixed) */}
          <div className="w-[40%]">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      <Eye className="inline mr-2 h-5 w-5 text-primary" />
                      Preview & Download
                    </h3>
                  </div>

                  {/* QR Code Display Area */}
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4 min-h-[300px] flex items-center justify-center mb-4">
                    {isGenerating ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3 mx-auto"></div>
                        <p className="text-sm text-gray-600">Generating...</p>
                      </div>
                    ) : qrGenerated ? (
                      <div ref={qrRef} className="flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto" />
                    ) : (
                      <div className="text-center">
                        <QrCode className="h-12 w-12 text-gray-300 mb-3 mx-auto" />
                        <p className="text-sm text-gray-400">QR code preview</p>
                      </div>
                    )}
                  </div>

                  {/* Download Button */}
                  {qrGenerated && (
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center text-green-700 text-sm">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span className="font-medium">Ready to download</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleDownload}
                        className="w-full bg-accent hover:bg-green-600 text-white font-medium"
                        disabled={isDownloading}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {isDownloading ? "Downloading..." : `Download ${qrFormat.toUpperCase()}`}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
