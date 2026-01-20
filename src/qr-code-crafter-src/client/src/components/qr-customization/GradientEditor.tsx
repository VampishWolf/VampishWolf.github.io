import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ColorPicker } from "./ColorPicker";
import type { GradientConfig, GradientType, GradientColorStop } from "@/types/qr-styling";
import { Plus, Minus, ArrowRight, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface GradientEditorProps {
  gradient: GradientConfig;
  onChange: (gradient: GradientConfig) => void;
}

export function GradientEditor({ gradient, onChange }: GradientEditorProps) {
  const handleTypeChange = (type: string) => {
    if (type) {
      onChange({ ...gradient, type: type as GradientType });
    }
  };

  const handleRotationChange = (value: number[]) => {
    onChange({ ...gradient, rotation: value[0] });
  };

  const handleColorStopChange = (index: number, color: string) => {
    const newColorStops = [...gradient.colorStops];
    newColorStops[index] = { ...newColorStops[index], color };
    onChange({ ...gradient, colorStops: newColorStops });
  };

  const handleAddColorStop = () => {
    if (gradient.colorStops.length >= 5) return;

    const lastStop = gradient.colorStops[gradient.colorStops.length - 1];
    const newOffset = Math.min(1, lastStop.offset + 0.25);
    const newColorStops = [
      ...gradient.colorStops,
      { offset: newOffset, color: lastStop.color }
    ];
    onChange({ ...gradient, colorStops: newColorStops });
  };

  const handleRemoveColorStop = (index: number) => {
    if (gradient.colorStops.length <= 2) return;

    const newColorStops = gradient.colorStops.filter((_, i) => i !== index);
    onChange({ ...gradient, colorStops: newColorStops });
  };

  // Generate gradient preview CSS
  const gradientPreview = gradient.type === 'linear'
    ? `linear-gradient(${gradient.rotation || 0}deg, ${gradient.colorStops.map(s => `${s.color} ${s.offset * 100}%`).join(', ')})`
    : `radial-gradient(circle, ${gradient.colorStops.map(s => `${s.color} ${s.offset * 100}%`).join(', ')})`;

  return (
    <div className="space-y-4">
      {/* Gradient Type Selector */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Gradient Type</Label>
        <ToggleGroup
          type="single"
          value={gradient.type}
          onValueChange={handleTypeChange}
          className="justify-start"
        >
          <ToggleGroupItem
            value="linear"
            aria-label="Linear"
            className="gap-1 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <ArrowRight className="h-3 w-3" />
            Linear
          </ToggleGroupItem>
          <ToggleGroupItem
            value="radial"
            aria-label="Radial"
            className="gap-1 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Target className="h-3 w-3" />
            Radial
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Rotation (for linear gradients) */}
      {gradient.type === 'linear' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Rotation</Label>
            <span className="text-xs text-muted-foreground">{gradient.rotation || 0}°</span>
          </div>
          <Slider
            value={[gradient.rotation || 0]}
            onValueChange={handleRotationChange}
            min={0}
            max={360}
            step={15}
            className="w-full"
          />
        </div>
      )}

      {/* Gradient Preview */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Preview</Label>
        <div
          className="h-8 rounded border border-gray-300"
          style={{ background: gradientPreview }}
        />
      </div>

      {/* Color Stops */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Color Stops</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddColorStop}
            disabled={gradient.colorStops.length >= 5}
            className="h-6 px-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {gradient.colorStops.map((stop, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
              <div className="flex-1">
                <ColorPicker
                  color={stop.color}
                  onChange={(color) => handleColorStopChange(index, color)}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveColorStop(index)}
                disabled={gradient.colorStops.length <= 2}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
