declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    color?: string;
    className?: string;
  }
  export type Icon = FC<IconProps>;

  export const BookOpen: Icon;
  export const Layers: Icon;
  export const FileBox: Icon;
  export const GraduationCap: Icon;
  export const Settings: Icon;
  export const Compass: Icon;
  export const Sparkles: Icon;
  export const Globe2: Icon;
  export const Clock: Icon;
  export const Plus: Icon;
  export const Upload: Icon;
  export const ChevronRight: Icon;
  export const ChevronDown: Icon;
  export const Flame: Icon;
  export const FileText: Icon;
  export const FileCheck2: Icon;
  export const TrendingUp: Icon;
  export const FolderOpen: Icon;
  export const Folder: Icon;
  export const FolderPlus: Icon;
  export const FileUp: Icon;
  export const Trash2: Icon;
  export const Edit3: Icon;
  export const Eye: Icon;
  export const Download: Icon;
  export const ArrowLeft: Icon;
  export const Search: Icon;
  export const MoreVertical: Icon;
  export const Calendar: Icon;
  export const Filter: Icon;
  export const HelpCircle: Icon;
  export const RotateCw: Icon;
  export const CheckCircle2: Icon;
  export const Award: Icon;
  export const RotateCcw: Icon;
  export const Palette: Icon;
  export const Database: Icon;
  export const AlertTriangle: Icon;
  export const AlertCircle: Icon;
  export const X: Icon;
  export const ExternalLink: Icon;
  export const ZoomIn: Icon;
  export const ZoomOut: Icon;
  export const Cpu: Icon;
  export const Code: Icon;
  export const Sigma: Icon;
}
