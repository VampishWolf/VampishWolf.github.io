// QR Code Styling Type Definitions

export type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';

export type CornerSquareType = 'square' | 'dot' | 'rounded';

export type CornerDotType = 'square' | 'dot' | 'rounded';

export type GradientType = 'linear' | 'radial';

export interface GradientColorStop {
  offset: number;
  color: string;
}

export interface GradientConfig {
  type: GradientType;
  rotation?: number; // degrees, for linear gradients
  colorStops: GradientColorStop[];
}

export interface ColorConfig {
  type: 'solid' | 'gradient';
  color?: string; // for solid
  gradient?: GradientConfig; // for gradient
}

export interface QRStylingOptions {
  dotsOptions: {
    type: DotType;
    color: ColorConfig;
  };
  cornersSquareOptions: {
    type: CornerSquareType;
    color: ColorConfig;
  };
  cornersDotOptions: {
    type: CornerDotType;
    color: ColorConfig;
  };
  backgroundOptions: {
    color: ColorConfig;
  };
}

export const DEFAULT_QR_STYLING_OPTIONS: QRStylingOptions = {
  dotsOptions: {
    type: 'square',
    color: { type: 'solid', color: '#000000' }
  },
  cornersSquareOptions: {
    type: 'square',
    color: { type: 'solid', color: '#000000' }
  },
  cornersDotOptions: {
    type: 'square',
    color: { type: 'solid', color: '#000000' }
  },
  backgroundOptions: {
    color: { type: 'solid', color: '#FFFFFF' }
  }
};

export const DOT_TYPES: { value: DotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dots', label: 'Dots' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' }
];

export const CORNER_SQUARE_TYPES: { value: CornerSquareType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'rounded', label: 'Rounded' }
];

export const CORNER_DOT_TYPES: { value: CornerDotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'rounded', label: 'Rounded' }
];

export const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#EF4444', '#F97316', '#EAB308',
  '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899',
  '#6B7280', '#1F2937', '#DC2626', '#EA580C', '#CA8A04',
  '#16A34A', '#0D9488', '#2563EB', '#7C3AED', '#DB2777'
];
