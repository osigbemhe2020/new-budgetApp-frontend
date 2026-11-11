'use client';

import React, { createContext, useContext } from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const SelectContext = createContext<SelectContextType>({
  value: '',
  onValueChange: () => {},
});

export function Select({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <div style={{ position: 'relative', width: '100%' }}>{children}</div>
    </SelectContext.Provider>
  );
}

const SelectElement = styled.select`
  width: 100%;
  padding: 0.625rem 2.25rem 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
`;

export function SelectTrigger({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return null; // Will be handled by rendered select
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return null;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  const { value, onValueChange } = useContext(SelectContext);

  const options: { value: string; label: React.ReactNode }[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const props = child.props as { value: string; children: React.ReactNode };
      options.push({ value: props.value, label: props.children });
    }
  });

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <SelectElement value={value} onChange={(e) => onValueChange(e.target.value)}>
        <option value="" disabled>
          Select an option
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </SelectElement>
      <IconWrapper>
        <ChevronDown size={16} />
      </IconWrapper>
    </div>
  );
}

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return null; // Used structurally by SelectContent
}
