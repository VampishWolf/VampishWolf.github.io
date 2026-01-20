import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPicker } from "./ColorPicker";
import { GradientEditor } from "./GradientEditor";
import type { ColorConfig, GradientConfig } from "@/types/qr-styling";
import { Palette, Circle, Square } from "lucide-react";

interface ColorsSectionProps {
  dotsColor: ColorConfig;
  cornersColor: ColorConfig;
  backgroundColor: ColorConfig;
  onDotsColorChange: (color: ColorConfig) => void;
  onCornersColorChange: (color: ColorConfig) => void;
  onBackgroundColorChange: (color: ColorConfig) => void;
}

const DEFAULT_GRADIENT: GradientConfig = {
  type: 'linear',
  rotation: 0,
  colorStops: [
    { offset: 0, color: '#000000' },
    { offset: 1, color: '#3B82F6' }
  ]
};

const DEFAULT_BG_GRADIENT: GradientConfig = {
  type: 'linear',
  rotation: 0,
  colorStops: [
    { offset: 0, color: '#FFFFFF' },
    { offset: 1, color: '#F3F4F6' }
  ]
};

interface ColorControlProps {
  label: string;
  icon: React.ReactNode;
  colorConfig: ColorConfig;
  onChange: (config: ColorConfig) => void;
  defaultGradient?: GradientConfig;
}

function ColorControl({ label, icon, colorConfig, onChange, defaultGradient = DEFAULT_GRADIENT }: ColorControlProps) {
  const handleTypeChange = (type: 'solid' | 'gradient') => {
    if (type === 'solid') {
      onChange({
        type: 'solid',
        color: colorConfig.color || '#000000'
      });
    } else {
      onChange({
        type: 'gradient',
        gradient: colorConfig.gradient || defaultGradient
      });
    }
  };

  const handleSolidColorChange = (color: string) => {
    onChange({ ...colorConfig, color });
  };

  const handleGradientChange = (gradient: GradientConfig) => {
    onChange({ ...colorConfig, gradient });
  };

  return (
    <div className="space-y-2 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
      <Label className="text-xs text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </Label>
      <Tabs
        value={colorConfig.type}
        onValueChange={(v) => handleTypeChange(v as 'solid' | 'gradient')}
        className="w-full"
      >
        <TabsList className="w-full h-8">
          <TabsTrigger value="solid" className="flex-1 text-xs">Solid</TabsTrigger>
          <TabsTrigger value="gradient" className="flex-1 text-xs">Gradient</TabsTrigger>
        </TabsList>
        <TabsContent value="solid" className="mt-2">
          <ColorPicker
            color={colorConfig.color || '#000000'}
            onChange={handleSolidColorChange}
          />
        </TabsContent>
        <TabsContent value="gradient" className="mt-2">
          <GradientEditor
            gradient={colorConfig.gradient || defaultGradient}
            onChange={handleGradientChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ColorsSection({
  dotsColor,
  cornersColor,
  backgroundColor,
  onDotsColorChange,
  onCornersColorChange,
  onBackgroundColorChange,
}: ColorsSectionProps) {
  return (
    <Accordion type="single" collapsible defaultValue="colors">
      <AccordionItem value="colors" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium hover:no-underline">
          <span className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {/* Dots Color */}
          <ColorControl
            label="Dots Color"
            icon={<Circle className="h-3 w-3" />}
            colorConfig={dotsColor}
            onChange={onDotsColorChange}
          />

          {/* Corners Color */}
          <ColorControl
            label="Corners Color"
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 1 L1 4 M1 1 L4 1" />
                <path d="M11 1 L11 4 M11 1 L8 1" />
                <path d="M1 11 L1 8 M1 11 L4 11" />
              </svg>
            }
            colorConfig={cornersColor}
            onChange={onCornersColorChange}
          />

          {/* Background Color */}
          <ColorControl
            label="Background Color"
            icon={<Square className="h-3 w-3" />}
            colorConfig={backgroundColor}
            onChange={onBackgroundColorChange}
            defaultGradient={DEFAULT_BG_GRADIENT}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
