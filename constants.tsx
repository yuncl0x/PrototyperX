import React from 'react';
import { 
  Box, 
  Type, 
  MousePointer2, 
  Image as ImageIcon, 
  Square, 
  AlignLeft,
  CheckSquare,
  ChevronDown,
  Heading,
  Minus,
  CircleDot,
  Search,
  Settings,
  User,
  Users,
  Calendar,
  FileText,
  BarChart,
  ArrowRight,
  Trash2,
  ToggleLeft,
  SlidersHorizontal,
  CircleUser,
  CreditCard,
  Loader,
  Award
} from 'lucide-react';
import { LibraryCategory, ElementStyle } from './types';

export const DEFAULT_STYLE: ElementStyle = {
  backgroundColor: 'transparent',
  color: '#1e293b',
  fontSize: 14,
  fontWeight: 'normal',
  borderRadius: 0,
  borderWidth: 0,
  borderColor: '#e2e8f0',
  padding: 8,
  textAlign: 'left',
  opacity: 1,
  shadow: false,
};

export const COMPONENT_LIBRARY: LibraryCategory[] = [
  {
    name: 'Layout',
    items: [
      {
        type: 'container',
        label: 'Container',
        icon: <Box size={20} />,
        defaultWidth: 300,
        defaultHeight: 200,
        defaultContent: '',
        defaultStyle: {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderRadius: 4,
          shadow: true,
        },
      },
      {
        type: 'card',
        label: 'Card',
        icon: <CreditCard size={20} />,
        defaultWidth: 280,
        defaultHeight: 160,
        defaultContent: '',
        defaultStyle: {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderRadius: 8,
          shadow: true,
        },
      },
      {
        type: 'line',
        label: 'H-Line',
        icon: <Minus size={20} />,
        defaultWidth: 200,
        defaultHeight: 2,
        defaultContent: 'horizontal',
        defaultStyle: {
          backgroundColor: '#cbd5e1',
          borderWidth: 0,
        },
      },
      {
        type: 'line',
        label: 'V-Line',
        icon: <Minus size={20} className="rotate-90" />,
        defaultWidth: 2,
        defaultHeight: 200,
        defaultContent: 'vertical',
        defaultStyle: {
          backgroundColor: '#cbd5e1',
          borderWidth: 0,
        },
      },
    ],
  },
  {
    name: 'Typography',
    items: [
      {
        type: 'heading',
        label: 'Heading',
        icon: <Heading size={20} />,
        defaultWidth: 200,
        defaultHeight: 40,
        defaultContent: 'Heading',
        defaultStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#0f172a',
        },
      },
      {
        type: 'text',
        label: 'Text',
        icon: <AlignLeft size={20} />,
        defaultWidth: 200,
        defaultHeight: 60,
        defaultContent: 'Lorem ipsum dolor sit amet.',
        defaultStyle: {
          fontSize: 14,
          color: '#475569',
        },
      },
    ],
  },
  {
    name: 'Form',
    items: [
      {
        type: 'button',
        label: 'Button',
        icon: <MousePointer2 size={20} />,
        defaultWidth: 120,
        defaultHeight: 40,
        defaultContent: 'Button',
        defaultStyle: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: 6,
          textAlign: 'center',
          fontWeight: '500',
        },
      },
      {
        type: 'input',
        label: 'Input',
        icon: <Type size={20} />,
        defaultWidth: 200,
        defaultHeight: 40,
        defaultContent: '',
        defaultStyle: {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderRadius: 4,
          padding: 8,
        },
      },
      {
        type: 'switch',
        label: 'Switch',
        icon: <ToggleLeft size={20} />,
        defaultWidth: 44,
        defaultHeight: 24,
        defaultContent: '',
        defaultStyle: {
          backgroundColor: '#3b82f6',
          borderRadius: 999,
        },
      },
       {
        type: 'slider',
        label: 'Slider',
        icon: <SlidersHorizontal size={20} />,
        defaultWidth: 160,
        defaultHeight: 20,
        defaultContent: '',
        defaultStyle: {
          color: '#3b82f6', // used for track color
        },
      },
      {
        type: 'checkbox',
        label: 'Checkbox',
        icon: <CheckSquare size={20} />,
        defaultWidth: 20,
        defaultHeight: 20,
        defaultContent: '',
        defaultStyle: {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderRadius: 4,
        },
      },
      {
        type: 'radio',
        label: 'Radio',
        icon: <CircleDot size={20} />,
        defaultWidth: 20,
        defaultHeight: 20,
        defaultContent: '',
        defaultStyle: {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderRadius: 10,
        },
      },
       {
        type: 'select',
        label: 'Select',
        icon: <ChevronDown size={20} />,
        defaultWidth: 200,
        defaultHeight: 40,
        defaultContent: 'Option',
        defaultStyle: {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderRadius: 4,
          padding: 8,
        },
      },
    ],
  },
  {
    name: 'UI Elements',
    items: [
       {
        type: 'avatar',
        label: 'Avatar',
        icon: <CircleUser size={20} />,
        defaultWidth: 48,
        defaultHeight: 48,
        defaultContent: '',
        defaultStyle: {
          backgroundColor: '#e2e8f0',
          borderRadius: 999,
        },
      },
      {
        type: 'badge',
        label: 'Badge',
        icon: <Award size={20} />,
        defaultWidth: 60,
        defaultHeight: 24,
        defaultContent: 'Badge',
        defaultStyle: {
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          borderRadius: 999,
          fontSize: 12,
          fontWeight: '600',
          textAlign: 'center',
          padding: 4,
        },
      },
      {
        type: 'progress',
        label: 'Progress',
        icon: <Loader size={20} />,
        defaultWidth: 200,
        defaultHeight: 8,
        defaultContent: '',
        defaultStyle: {
          backgroundColor: '#e2e8f0', // track
          color: '#3b82f6', // fill
          borderRadius: 999,
        },
      },
      {
        type: 'textarea',
        label: 'Shape',
        icon: <Square size={20} />,
        defaultWidth: 80,
        defaultHeight: 80,
        defaultContent: '',
        defaultStyle: {
          backgroundColor: '#cbd5e1',
        },
      },
    ]
  },
  {
    name: 'Media',
    items: [
      {
        type: 'image',
        label: 'Image',
        icon: <ImageIcon size={20} />,
        defaultWidth: 100,
        defaultHeight: 100,
        defaultContent: '',
        defaultStyle: {
          backgroundColor: '#f1f5f9',
          borderRadius: 4,
        },
      },
    ],
  },
  {
    name: 'Icons',
    items: [
      { type: 'icon', label: 'Search', icon: <Search size={20} />, defaultWidth: 32, defaultHeight: 32, defaultContent: '', iconName: 'Search', defaultStyle: { color: '#64748b' } },
      { type: 'icon', label: 'Settings', icon: <Settings size={20} />, defaultWidth: 32, defaultHeight: 32, defaultContent: '', iconName: 'Settings', defaultStyle: { color: '#64748b' } },
      { type: 'icon', label: 'User', icon: <User size={20} />, defaultWidth: 32, defaultHeight: 32, defaultContent: '', iconName: 'User', defaultStyle: { color: '#64748b' } },
      { type: 'icon', label: 'Users', icon: <Users size={20} />, defaultWidth: 32, defaultHeight: 32, defaultContent: '', iconName: 'Users', defaultStyle: { color: '#64748b' } },
      { type: 'icon', label: 'Calendar', icon: <Calendar size={20} />, defaultWidth: 32, defaultHeight: 32, defaultContent: '', iconName: 'Calendar', defaultStyle: { color: '#64748b' } },
      { type: 'icon', label: 'File', icon: <FileText size={20} />, defaultWidth: 32, defaultHeight: 32, defaultContent: '', iconName: 'FileText', defaultStyle: { color: '#64748b' } },
      { type: 'icon', label: 'Chart', icon: <BarChart size={20} />, defaultWidth: 32, defaultHeight: 32, defaultContent: '', iconName: 'BarChart', defaultStyle: { color: '#64748b' } },
      { type: 'icon', label: 'Arrow', icon: <ArrowRight size={20} />, defaultWidth: 32, defaultHeight: 32, defaultContent: '', iconName: 'ArrowRight', defaultStyle: { color: '#64748b' } },
      { type: 'icon', label: 'Trash', icon: <Trash2 size={20} />, defaultWidth: 32, defaultHeight: 32, defaultContent: '', iconName: 'Trash2', defaultStyle: { color: '#ef4444' } },
    ]
  },
];

// Helper to get SVG string for HTML export
export const getIconSvg = (name: string, color: string) => {
  const props = `width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  
  switch (name) {
    case 'Search': return `<svg ${props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;
    case 'Settings': return `<svg ${props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
    case 'User': return `<svg ${props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    case 'Users': return `<svg ${props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    case 'Calendar': return `<svg ${props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
    case 'FileText': return `<svg ${props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;
    case 'BarChart': return `<svg ${props}><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`;
    case 'ArrowRight': return `<svg ${props}><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
    case 'Trash2': return `<svg ${props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;
    default: return '';
  }
}