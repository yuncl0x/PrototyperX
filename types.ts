import React from 'react';

export type ElementType = 
  | 'container' 
  | 'text' 
  | 'button' 
  | 'input' 
  | 'image' 
  | 'textarea' 
  | 'select' 
  | 'checkbox'
  | 'radio'
  | 'heading'
  | 'line'
  | 'icon'
  // New Prototypes
  | 'switch'
  | 'slider'
  | 'avatar'
  | 'badge'
  | 'progress'
  | 'card';

export interface ElementStyle {
  backgroundColor: string;
  color: string;
  fontSize: number;
  fontWeight: string;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  padding: number;
  textAlign: 'left' | 'center' | 'right';
  opacity: number;
  shadow: boolean;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
  style: ElementStyle;
  zIndex: number;
  // Optional specific metadata for icons or special shapes
  iconName?: string; 
}

export interface ComponentItem {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
  defaultWidth: number;
  defaultHeight: number;
  defaultContent: string;
  defaultStyle: Partial<ElementStyle>;
  iconName?: string; // For the 'icon' type, which icon to render
}

export type Category = 'Layout' | 'Typography' | 'Form' | 'Media' | 'Icons' | 'UI Elements';

export interface LibraryCategory {
  name: Category;
  items: ComponentItem[];
}