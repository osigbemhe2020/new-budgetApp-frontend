'use client';

import styled from 'styled-components';

export const Label = styled.label`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.375rem;
`;
