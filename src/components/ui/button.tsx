'use client';

import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  /* Sizes */
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 0.375rem 0.75rem;
          font-size: 0.8125rem;
          gap: 0.375rem;
        `;
      case 'lg':
        return css`
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          gap: 0.625rem;
        `;
      default:
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          gap: 0.5rem;
        `;
    }
  }}

  /* Variants */
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.primaryLight};
          color: ${theme.colors.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.border};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          border-color: ${theme.colors.border};
          color: ${theme.colors.textPrimary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.background};
            border-color: ${theme.colors.textMuted};
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.textSecondary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.background};
            color: ${theme.colors.textPrimary};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.danger};
          color: #ffffff;
          &:hover:not(:disabled) {
            opacity: 0.9;
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: #ffffff;
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryHover};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
