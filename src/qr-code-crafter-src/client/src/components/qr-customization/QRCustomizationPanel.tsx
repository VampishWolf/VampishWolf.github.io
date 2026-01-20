import { MarkersShapeSection } from "./MarkersShapeSection";
import { ColorsSection } from "./ColorsSection";
import type { QRStylingOptions } from "@/types/qr-styling";

interface QRCustomizationPanelProps {
  options: QRStylingOptions;
  onChange: (options: QRStylingOptions) => void;
}

export function QRCustomizationPanel({ options, onChange }: QRCustomizationPanelProps) {
  return (
    <div className="space-y-3">
      <MarkersShapeSection
        dotType={options.dotsOptions.type}
        cornerSquareType={options.cornersSquareOptions.type}
        cornerDotType={options.cornersDotOptions.type}
        onDotTypeChange={(type) =>
          onChange({
            ...options,
            dotsOptions: { ...options.dotsOptions, type }
          })
        }
        onCornerSquareTypeChange={(type) =>
          onChange({
            ...options,
            cornersSquareOptions: { ...options.cornersSquareOptions, type }
          })
        }
        onCornerDotTypeChange={(type) =>
          onChange({
            ...options,
            cornersDotOptions: { ...options.cornersDotOptions, type }
          })
        }
      />

      <ColorsSection
        dotsColor={options.dotsOptions.color}
        cornersColor={options.cornersSquareOptions.color}
        backgroundColor={options.backgroundOptions.color}
        onDotsColorChange={(color) =>
          onChange({
            ...options,
            dotsOptions: { ...options.dotsOptions, color },
            cornersSquareOptions: { ...options.cornersSquareOptions, color },
            cornersDotOptions: { ...options.cornersDotOptions, color }
          })
        }
        onCornersColorChange={(color) =>
          onChange({
            ...options,
            cornersSquareOptions: { ...options.cornersSquareOptions, color },
            cornersDotOptions: { ...options.cornersDotOptions, color }
          })
        }
        onBackgroundColorChange={(color) =>
          onChange({
            ...options,
            backgroundOptions: { ...options.backgroundOptions, color }
          })
        }
      />
    </div>
  );
}
