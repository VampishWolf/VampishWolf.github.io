import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { ShapeSelector } from "./ShapeSelector";
import type {
  DotType,
  CornerSquareType,
  CornerDotType,
} from "@/types/qr-styling";

// Header icon for the section
const MarkerShapeHeaderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14H8C8 14 8 11 8 8C5 8 2 8 2 8V4Z" />
  </svg>
);

// Label icons
const CornerSquareLabelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="3" cy="3" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="11" cy="3" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="3" cy="11" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="11" cy="11" r="1.5" fill="currentColor" stroke="none" />
    <rect x="2" y="2" width="10" height="10" rx="1" />
  </svg>
);

const CornerDotLabelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <circle cx="7" cy="7" r="3" />
  </svg>
);

interface MarkersShapeSectionProps {
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  onDotTypeChange: (type: DotType) => void;
  onCornerSquareTypeChange: (type: CornerSquareType) => void;
  onCornerDotTypeChange: (type: CornerDotType) => void;
}

// Dots Style Icons
const DotSquareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <rect x="3" y="3" width="12" height="12" />
  </svg>
);

const DotClassyRoundedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <path d="M3 6C3 4.34315 4.34315 3 6 3H12C13.6569 3 15 4.34315 15 6V12C15 13.6569 13.6569 15 12 15H9C9 15 9 12 9 9C6 9 3 9 3 9V6Z" />
  </svg>
);

const DotDotsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <circle cx="9" cy="9" r="6" />
  </svg>
);

const DotRoundedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <rect x="2" y="5" width="14" height="8" rx="4" />
  </svg>
);

const DotExtraRoundedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <rect x="4" y="6" width="4" height="6" rx="1" />
    <rect x="10" y="6" width="4" height="6" rx="1" />
  </svg>
);

const DotClassyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <rect x="3" y="5" width="4" height="8" rx="2" />
    <rect x="9" y="5" width="3" height="8" rx="1.5" />
    <rect x="14" y="5" width="2" height="8" rx="1" />
  </svg>
);

// Corner Square Icons
const CornerSquareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="10" height="10" />
  </svg>
);

const CornerDotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="9" r="5" />
  </svg>
);

const CornerRoundedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="10" height="10" rx="2.5" />
  </svg>
);

// Corner Dot Icons (inner dots)
const InnerSquareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <rect x="6" y="6" width="6" height="6" />
  </svg>
);

const InnerDotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <circle cx="9" cy="9" r="3.5" />
  </svg>
);

const InnerRoundedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <rect x="5" y="5" width="8" height="8" rx="2.5" />
  </svg>
);

const DOT_TYPE_OPTIONS = [
  { value: 'square' as DotType, label: 'Square', icon: <DotSquareIcon /> },
  { value: 'classy-rounded' as DotType, label: 'Classy Rounded', icon: <DotClassyRoundedIcon /> },
  { value: 'dots' as DotType, label: 'Dots', icon: <DotDotsIcon /> },
  { value: 'rounded' as DotType, label: 'Rounded', icon: <DotRoundedIcon /> },
  { value: 'extra-rounded' as DotType, label: 'Extra Rounded', icon: <DotExtraRoundedIcon /> },
  { value: 'classy' as DotType, label: 'Classy', icon: <DotClassyIcon /> },
];

const CORNER_SQUARE_TYPE_OPTIONS = [
  { value: 'square' as CornerSquareType, label: 'Square', icon: <CornerSquareIcon /> },
  { value: 'dot' as CornerSquareType, label: 'Dot', icon: <CornerDotIcon /> },
  { value: 'rounded' as CornerSquareType, label: 'Rounded', icon: <CornerRoundedIcon /> },
];

const CORNER_DOT_TYPE_OPTIONS = [
  { value: 'square' as CornerDotType, label: 'Square', icon: <InnerSquareIcon /> },
  { value: 'dot' as CornerDotType, label: 'Dot', icon: <InnerDotIcon /> },
  { value: 'rounded' as CornerDotType, label: 'Rounded', icon: <InnerRoundedIcon /> },
];

export function MarkersShapeSection({
  dotType,
  cornerSquareType,
  cornerDotType,
  onDotTypeChange,
  onCornerSquareTypeChange,
  onCornerDotTypeChange,
}: MarkersShapeSectionProps) {
  return (
    <Accordion type="single" collapsible defaultValue="markers-shape">
      <AccordionItem value="markers-shape" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium hover:no-underline">
          <span className="flex items-center gap-2">
            <MarkerShapeHeaderIcon />
            Markers Shape
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {/* Dots Style */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Dots Style</Label>
            <ShapeSelector
              options={DOT_TYPE_OPTIONS}
              value={dotType}
              onChange={onDotTypeChange}
            />
          </div>

          {/* Corner Squares Style */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <CornerSquareLabelIcon />
              Corner Squares
            </Label>
            <ShapeSelector
              options={CORNER_SQUARE_TYPE_OPTIONS}
              value={cornerSquareType}
              onChange={onCornerSquareTypeChange}
            />
          </div>

          {/* Corner Dots Style */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <CornerDotLabelIcon />
              Corner Dots
            </Label>
            <ShapeSelector
              options={CORNER_DOT_TYPE_OPTIONS}
              value={cornerDotType}
              onChange={onCornerDotTypeChange}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
