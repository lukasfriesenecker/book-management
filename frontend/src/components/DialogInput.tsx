import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface CredentialInputProps {
  label: string;
  icon: React.ReactElement<{ className?: string }>;
  type: string;
  identifier: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function DialogInput({
  label,
  icon,
  type,
  identifier,
  value,
  onChange,
  disabled,
}: CredentialInputProps) {
  return (
    <div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={identifier} className="text-left">
          {label}
        </Label>
        <div className="relative col-span-3 flex items-center">
          {React.cloneElement(icon, {
            className: 'text-muted-foreground absolute left-3 size-4',
          })}
          <Input
            type={type}
            value={value}
            onChange={onChange}
            className="pl-10"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
