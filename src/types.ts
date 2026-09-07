import React from 'react';

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized?: boolean;
  zIndex: number;
  config?: any;
  initialPosition?: { x: number; y: number };
}

export interface DesktopItem {
  id: string;
  type: 'folder' | 'file';
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}
export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}
