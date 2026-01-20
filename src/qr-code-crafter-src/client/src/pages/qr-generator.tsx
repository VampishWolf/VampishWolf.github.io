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
import { ThemeToggle } from "@/components/ThemeToggle";
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
  const [qrSize, setQrSize] = useState("1024");
  const [qrFormat, setQrFormat] = useState<"svg" | "png">("svg");
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
      margin: 2,
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
        margin: 40,
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

      // Get raw SVG and add rounded corners to background
      const svgData = await downloadQR.getRawData('svg');
      if (svgData instanceof Blob) {
        const svgText = await svgData.text();
        // Add rx and ry attributes to the first rect (background)
        const cornerRadius = Math.round(downloadSize * 0.05); // 5% of size
        const modifiedSvg = svgText.replace(
          /<rect([^>]*)(width="[^"]*"[^>]*height="[^"]*")([^>]*)\/>/,
          `<rect$1$2$3 rx="${cornerRadius}" ry="${cornerRadius}"/>`
        );

        if (qrFormat === 'svg') {
          const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}.svg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          // Convert SVG to PNG
          const img = new Image();
          const svgBlob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(svgBlob);

          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = downloadSize;
              canvas.height = downloadSize;
              const ctx = canvas.getContext('2d')!;
              ctx.drawImage(img, 0, 0);

              canvas.toBlob((blob) => {
                if (blob) {
                  const pngUrl = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = pngUrl;
                  link.download = `${filename}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(pngUrl);
                }
                URL.revokeObjectURL(url);
                resolve();
              }, 'image/png');
            };
            img.onerror = reject;
            img.src = url;
          });
        }
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">QR Code Generator</h1>
              <p className="text-sm text-muted-foreground">Create professional QR codes instantly</p>
            </div>
            <ThemeToggle />
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
                <Label htmlFor="qr-input" className="block text-sm font-medium text-foreground mb-2">
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
                    <Label className="block text-sm font-medium text-foreground mb-3">
                      <ExpandIcon className="inline mr-2 h-4 w-4 text-primary" />
                      Download Size
                    </Label>
                    <RadioGroup value={qrSize} onValueChange={setQrSize} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="512" id="size-512" />
                        <Label htmlFor="size-512" className="text-sm">512 x 512</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1024" id="size-1024" />
                        <Label htmlFor="size-1024" className="text-sm">1024 x 1024</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Format Selection */}
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-3">
                      <FileImage className="inline mr-2 h-4 w-4 text-primary" />
                      Format
                    </Label>
                    <RadioGroup value={qrFormat} onValueChange={(v) => setQrFormat(v as "svg" | "png")} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="svg" id="format-svg" />
                        <Label htmlFor="format-svg" className="text-sm">SVG (vector, sharp)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="png" id="format-png" />
                        <Label htmlFor="format-png" className="text-sm">PNG (raster)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Customization Panel */}
            <Card>
              <CardContent className="p-4">
                <Label className="block text-sm font-medium text-foreground mb-3">
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
              <div className="bg-slate-800 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-semibold">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Preview & Download</h3>
                    <p className="text-sm text-slate-400">SVG or PNG format</p>
                  </div>
                </div>

                {/* QR Code Display Area */}
                <div className="bg-white rounded-2xl p-[20px] shadow-lg">
                  {isGenerating ? (
                    <div className="flex items-center justify-center aspect-square">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3 mx-auto"></div>
                        <p className="text-sm text-slate-500">Generating...</p>
                      </div>
                    </div>
                  ) : qrGenerated ? (
                    <div ref={qrRef} className="[&>svg]:w-full [&>svg]:h-auto [&>svg]:block" />
                  ) : (
                    <div className="flex items-center justify-center aspect-square">
                      <div className="text-center">
                        <QrCode className="h-16 w-16 text-slate-300 mb-3 mx-auto" />
                        <p className="text-sm text-slate-400">QR code preview</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <div className="mt-6">
                  {qrGenerated && (
                    <div className="flex items-center justify-end text-green-400 text-sm mb-3">
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      <span>Ready to download</span>
                    </div>
                  )}
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-12 text-base"
                    disabled={isDownloading || !qrGenerated}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    {isDownloading ? "Downloading..." : `Download ${qrFormat.toUpperCase()}`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
