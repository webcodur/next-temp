'use client';

import React, { useState, useCallback } from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';

interface ImageUrlInputProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxImages?: number;
  // 왼쪽 아이콘 표시 여부
  showIcon?: boolean;
}

export function ImageUrlInput({
  label = '이미지 URL',
  value = [],
  onChange,
  placeholder = '이미지 URL을 입력하세요',
  maxImages = 5,
  showIcon = true
}: ImageUrlInputProps) {
  const [newUrl, setNewUrl] = useState('');

  const handleAddUrl = useCallback(() => {
    if (newUrl.trim() && value.length < maxImages) {
      onChange([...value, newUrl.trim()]);
      setNewUrl('');
    }
  }, [newUrl, value, onChange, maxImages]);

  const handleRemoveUrl = useCallback((index: number) => {
    onChange(value.filter((_, i) => i !== index));
  }, [value, onChange]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUrl();
    }
  }, [handleAddUrl]);

  const canAdd = newUrl.trim() && value.length < maxImages;

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      {/* URL 입력 영역 */}
      <div className="flex gap-2">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={value.length >= maxImages}
        />
        <button
          type="button"
          onClick={handleAddUrl}
          disabled={!canAdd}
          className="flex gap-1 items-center px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* 이미지 URL 목록 */}
      {value.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            등록된 이미지 ({value.length}/{maxImages})
          </div>
          <div className="space-y-2">
            {value.map((url, index) => (
              <div
                key={index}
                className="flex gap-2 items-center p-2 bg-gray-50 rounded-md"
              >
                {showIcon && <ImageIcon size={16} className="text-gray-400" />}
                <span className="flex-1 text-sm text-gray-700 truncate">
                  {url}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveUrl(index)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 최대 개수 안내 */}
      {value.length >= maxImages && (
        <div className="text-sm text-orange-600">
          최대 {maxImages}개까지 등록 가능합니다.
        </div>
      )}
    </div>
  );
} 