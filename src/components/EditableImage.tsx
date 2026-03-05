import { useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

const UPLOAD_URL = 'https://functions.poehali.dev/4a728cb4-3d40-43fa-b0bd-2ecac34c1165';

interface Props {
  src: string;
  alt?: string;
  onChange: (url: string) => void;
  className?: string;
  imgClassName?: string;
}

export default function EditableImage({ src, alt, onChange, className = '', imgClassName = '' }: Props) {
  const { editMode } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string) ?? '';
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      try {
        const res = await fetch(UPLOAD_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, ext }),
        });
        const data = await res.json();
        if (data.url) onChange(data.url);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!editMode) {
    return (
      <div className={className}>
        <img src={src} alt={alt} className={imgClassName} />
      </div>
    );
  }

  return (
    <div className={`relative group/img ${className}`}>
      <img src={src} alt={alt} className={`${imgClassName} ${loading ? 'opacity-40' : ''} transition-opacity`} />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/30">
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 bg-white text-graphite font-sans text-xs tracking-widest uppercase px-3 py-2 hover:bg-cream transition-colors shadow-md"
          >
            <Icon name="Upload" size={13} />
            Загрузить
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}
