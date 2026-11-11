'use client';

import styled from 'styled-components';

const ProgressTrack = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.full};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $value: number }>`
  height: 100%;
  width: ${({ $value }) => Math.min(Math.max($value, 0), 100)}%;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width 0.5s ease;
`;

export function Progress({ value = 0 }: { value?: number }) {
  return (
    <ProgressTrack>
      <ProgressFill $value={value} />
    </ProgressTrack>
  );
}
