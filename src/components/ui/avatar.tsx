'use client';

import styled from 'styled-components';

export const Avatar = styled.div`
  position: relative;
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  shrink: 0;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;
