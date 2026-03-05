import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';

interface Props {
  value: string;
  onChange: (val: string) => void;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  multiline?: boolean;
  className?: string;
}

export default function EditableText({ value, onChange, as: Tag = 'span', multiline = false, className = '' }: Props) {
  const { editMode } = useStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  if (!editMode) return <Tag className={className}>{value}</Tag>;

  if (editing) {
    const commonProps = {
      ref,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setDraft(e.target.value),
      onBlur: () => { onChange(draft); setEditing(false); },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { setDraft(value); setEditing(false); }
        if (e.key === 'Enter' && !multiline) { onChange(draft); setEditing(false); }
      },
      className: `w-full bg-white/90 border border-gold outline-none resize-none px-1 rounded ${className}`,
      style: { font: 'inherit', lineHeight: 'inherit', letterSpacing: 'inherit' },
    };
    return multiline
      ? <textarea {...commonProps} rows={3} />
      : <input {...commonProps} type="text" />;
  }

  return (
    <Tag
      className={`${className} cursor-text relative group/edit`}
      onClick={() => setEditing(true)}
      title="Нажмите, чтобы редактировать"
    >
      {value}
      <span className="absolute -top-1 -right-1 opacity-0 group-hover/edit:opacity-100 transition-opacity bg-gold text-white text-[8px] px-1 py-0.5 rounded pointer-events-none whitespace-nowrap z-50">
        ✎ ред.
      </span>
    </Tag>
  );
}
