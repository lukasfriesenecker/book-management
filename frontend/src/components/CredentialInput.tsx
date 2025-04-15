import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface CredentialInputProps {
  label: string;
  icon: React.ReactElement;
  type: string;
  identifier: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function CredentialInput({
  label,
  icon,
  type,
  identifier,
  value,
  onChange,
  disabled,
}: CredentialInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={identifier}>{label}</Label>
      <div className="relative flex items-center">
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
  );
}
