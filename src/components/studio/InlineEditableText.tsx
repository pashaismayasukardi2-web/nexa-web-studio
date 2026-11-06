'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Lock } from 'lucide-react';

interface InlineEditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  multiline?: boolean;
  placeholder?: string;
  onAuthRequired?: () => void;
}

export const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
  as = 'span',
  multiline = false,
  placeholder = 'Klik 2x untuk mengetik...',
  onAuthRequired,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempValue, setTempValue] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAuthRequired) {
      onAuthRequired();
      return;
    }
    if (disabled) return;
    setIsEditing(true);
  };

  const handleCommit = () => {
    setIsEditing(false);
    if (tempValue.trim() !== value) {
      onChange(tempValue);
    }
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Enter' && (!multiline || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCommit();
    }
  };

  if (disabled && !onAuthRequired) {
    const Component = as;
    return <Component className={className}>{value || placeholder}</Component>;
  }

  if (isEditing) {
    return (
      <div className="relative inline-block w-full z-30" onClick={(e) => e.stopPropagation()}>
        {multiline ? (
          <textarea
            ref={inputRef as any}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            rows={3}
            className={`w-full bg-slate-900/95 text-slate-100 border-2 border-indigo-500 rounded-md p-1.5 shadow-xl focus:outline-none ring-2 ring-indigo-500/30 ${className}`}
          />
        ) : (
          <input
            ref={inputRef as any}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            className={`w-full bg-slate-900/95 text-slate-100 border-2 border-indigo-500 rounded-md px-2 py-0.5 shadow-xl focus:outline-none ring-2 ring-indigo-500/30 ${className}`}
          />
        )}
        <div className="absolute -bottom-6 left-0 z-40 bg-slate-900 border border-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded shadow-lg whitespace-nowrap flex items-center gap-1.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Enter: simpan • Esc: batal</span>
        </div>
      </div>
    );
  }

  const Component = as;

  return (
    <Component
      onDoubleClick={handleStartEdit}
      className={`group/inline relative transition-all duration-150 select-text ${className} hover:ring-1 hover:ring-indigo-400/50 hover:bg-indigo-500/10 rounded-xs px-0.5 -mx-0.5 ${
        onAuthRequired ? 'cursor-pointer' : 'cursor-text'
      }`}
      title={onAuthRequired ? 'Klik 2x untuk mengedit (Wajib Login NexaMOS)' : 'Klik 2x untuk edit langsung'}
    >
      <span>{value || placeholder}</span>
      <span className="opacity-0 group-hover/inline:opacity-100 ml-1.5 inline-flex items-center text-indigo-400 transition-opacity duration-150 align-middle">
        {onAuthRequired ? (
          <Lock className="w-3 h-3 inline-block text-amber-400" />
        ) : (
          <Pencil className="w-3 h-3 inline-block" />
        )}
      </span>
    </Component>
  );
};

