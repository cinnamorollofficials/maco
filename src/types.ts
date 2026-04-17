import React from 'react';

export interface WindowState {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  content: React.ReactNode;
}

export interface DesktopItem {
  id: string;
  type: 'folder' | 'file';
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}
