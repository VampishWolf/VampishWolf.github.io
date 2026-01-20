import { useState, useCallback } from "react";
import Saturation from "@uiw/react-color-saturation";
import Hue from "@uiw/react-color-hue";
import Alpha from "@uiw/react-color-alpha";
import { hsvaToHex, hexToHsva, hsvaToRgba } from "@uiw/color-convert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRESET_COLORS } from "@/types/qr-styling";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  showAlpha?: boolean;
  className?: string;
}

export function ColorPicker({
  color,
  onChange,
  showAlpha = false,
  className,
}: ColorPickerProps) {
  const [hsva, setHsva] = useState(() => hexToHsva(color));
  const [hexInput, setHexInput] = useState(color);

  const handleSaturationChange = useCallback((newColor: { h: number; s: number; v: number; a: number }) => {
    const newHsva = { ...hsva, ...newColor };
    setHsva(newHsva);
    const hex = hsvaToHex(newHsva);
    setHexInput(hex);
    onChange(hex);
  }, [hsva, onChange]);

  const handleHueChange = useCallback((newHue: { h: number }) => {
    const newHsva = { ...hsva, h: newHue.h };
    setHsva(newHsva);
    const hex = hsvaToHex(newHsva);
    setHexInput(hex);
    onChange(hex);
  }, [hsva, onChange]);

  const handleAlphaChange = useCallback((newAlpha: { a: number }) => {
    const newHsva = { ...hsva, a: newAlpha.a };
    setHsva(newHsva);
    const rgba = hsvaToRgba(newHsva);
    const hex = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
    setHexInput(hsvaToHex(newHsva));
    onChange(hex);
  }, [hsva, onChange]);

  const handleHexInputChange = useCallback((value: string) => {
    setHexInput(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      try {
        const newHsva = hexToHsva(value);
        setHsva(newHsva);
        onChange(value);
      } catch {
        // Invalid color, ignore
      }
    }
  }, [onChange]);

  const handlePresetClick = useCallback((presetColor: string) => {
    setHexInput(presetColor);
    const newHsva = hexToHsva(presetColor);
    setHsva(newHsva);
    onChange(presetColor);
  }, [onChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-9 px-3 justify-start gap-2 font-normal",
            className
          )}
        >
          <div
            className="w-5 h-5 rounded border border-gray-300"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm">{hexInput.toUpperCase()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          {/* Saturation Picker */}
          <div className="relative rounded overflow-hidden" style={{ height: 150 }}>
            <Saturation
              hsva={hsva}
              onChange={handleSaturationChange}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Hue Slider */}
          <div className="relative" style={{ height: 12 }}>
            <Hue
              hue={hsva.h}
              onChange={handleHueChange}
              style={{ width: '100%', height: '100%', borderRadius: 6 }}
            />
          </div>

          {/* Alpha Slider (optional) */}
          {showAlpha && (
            <div className="relative" style={{ height: 12 }}>
              <Alpha
                hsva={hsva}
                onChange={handleAlphaChange}
                style={{ width: '100%', height: '100%', borderRadius: 6 }}
              />
            </div>
          )}

          {/* Hex Input */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">HEX</span>
            <Input
              value={hexInput}
              onChange={(e) => handleHexInputChange(e.target.value)}
              className="h-8 text-sm font-mono"
              placeholder="#000000"
            />
          </div>

          {/* Preset Colors */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Presets</span>
            <div className="grid grid-cols-10 gap-1">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  className={cn(
                    "w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform",
                    hexInput.toLowerCase() === presetColor.toLowerCase() && "ring-2 ring-primary ring-offset-1"
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handlePresetClick(presetColor)}
                  title={presetColor}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
