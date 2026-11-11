'use client';

import styled from 'styled-components';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const SwitchContainer = styled.button<{ $checked: boolean }>`
  width: 2.75rem;
  height: 1.5rem;
  background-color: ${({ $checked, theme }) =>
    $checked ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  padding: 0.125rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  outline: none;
`;

const SwitchThumb = styled.span<{ $checked: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  background-color: #ffffff;
  border-radius: ${({ theme }) => theme.radii.full};
  transition: transform 0.2s ease;
  transform: ${({ $checked }) => ($checked ? 'translateX(1.25rem)' : 'translateX(0)')};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

export function Switch({ checked, onCheckedChange }: SwitchProps) {
  return (
    <SwitchContainer
      type="button"
      $checked={checked}
      onClick={() => onCheckedChange(!checked)}
    >
      <SwitchThumb $checked={checked} />
    </SwitchContainer>
  );
}
