import React from 'react';
import { TextConfig, ShapeConfig } from '../../types/project';

interface TextProps {
  config: TextConfig;
}

export const TextComponent: React.FC<TextProps> = ({ config }) => {
  return (
    <div
      className="flex h-full w-full items-center p-2 select-none"
      style={{
        justifyContent: config.textAlign === 'center' ? 'center' : config.textAlign === 'right' ? 'flex-end' : 'flex-start',
        backgroundColor: config.backgroundColor || 'transparent',
      }}
    >
      <div
        style={{
          fontSize: `${config.fontSize || 16}px`,
          fontWeight: config.fontWeight || 'normal',
          color: config.textColor || '#0f172a',
          fontFamily: config.fontFamily || 'inherit',
          textAlign: config.textAlign || 'left',
          width: '100%',
        }}
      >
        {config.content}
      </div>
    </div>
  );
};

interface ShapeProps {
  config: ShapeConfig;
}

export const ShapeComponent: React.FC<ShapeProps> = ({ config }) => {
  const { shapeType, fillColor, borderColor, borderWidth, borderRadius, opacity, text, textColor } = config;

  return (
    <div
      className="flex h-full w-full items-center justify-center select-none"
      style={{
        backgroundColor: fillColor || '#3b82f6',
        border: borderWidth ? `${borderWidth}px solid ${borderColor || '#1d4ed8'}` : 'none',
        borderRadius: shapeType === 'circle' ? '50%' : `${borderRadius ?? 8}px`,
        opacity: opacity ?? 1,
      }}
    >
      {text && (
        <span style={{ color: textColor || '#ffffff', fontSize: '13px', fontWeight: 600 }}>
          {text}
        </span>
      )}
    </div>
  );
};
