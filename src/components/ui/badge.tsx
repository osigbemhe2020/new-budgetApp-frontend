'use client';

import styled, { css } from 'styled-components';

export const Badge = styled.span<{ $variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radii.full};

  ${({ $variant = 'default', theme }) => {
    switch ($variant) {
      case 'success':
        return css`
          background-color: ${theme.colors.successBg};
          color: ${theme.colors.success};
          border: 1px solid ${theme.colors.successBorder};
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.dangerBg};
          color: ${theme.colors.danger};
          border: 1px solid ${theme.colors.dangerBorder};
        `;
      case 'warning':
        return css`
          background-color: ${theme.colors.warningBg};
          color: ${theme.colors.warning};
          border: 1px solid ${theme.colors.warningBorder};
        `;
      case 'info':
        return css`
          background-color: ${theme.colors.primaryLight};
          color: ${theme.colors.primary};
        `;
      default:
        return css`
          background-color: ${theme.colors.background};
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}
`;
