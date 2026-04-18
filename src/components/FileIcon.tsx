import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Compass, 
  Music, 
  Terminal, 
  Settings 
} from "lucide-react";

interface FileIconProps {
  icon: any; // Can be the new object format or legacy JSX
}

const FileIcon: React.FC<FileIconProps> = ({ icon }) => {
  if (!icon) return <FileText className="text-gray-400" />;

  // Support legacy direct JSX element (if it's not serialized yet)
  if (React.isValidElement(icon)) {
    return icon;
  }

  // Support new serializable object format
  if (typeof icon === 'object' && icon.identifier) {
    const { identifier, color } = icon;
    
    switch (identifier) {
      case 'file-text':
        return <FileText className={color} />;
      case 'image':
        return <ImageIcon className={color} />;
      case 'compass':
        return <Compass className={color} />;
      case 'music':
        return <Music className={color} />;
      case 'terminal':
        return <Terminal className={color} />;
      case 'settings':
        return <Settings className={color} />;
      default:
        return <FileText className={color || 'text-gray-400'} />;
    }
  }

  // Fallback for unexpected formats
  return <FileText className="text-gray-400" />;
};

export default FileIcon;
