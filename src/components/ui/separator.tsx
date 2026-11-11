'use client';

import styled from 'styled-components';

export const Separator = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 1rem 0;
`;
