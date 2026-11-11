'use client';

import styled from "styled-components";
import { useApp } from "@/store/AppContext";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const iconMap = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  warning: AlertTriangle,
};

const ToastContainerWrapper = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 24rem;
  width: 100%;
  pointer-events: none;
`;

const ToastCard = styled(motion.div)<{ $type: "success" | "error" | "warning" | "info" }>`
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid
    ${({ $type, theme }) => {
      switch ($type) {
        case "success":
          return theme.colors.successBorder;
        case "error":
          return theme.colors.dangerBorder;
        case "warning":
          return theme.colors.warningBorder;
        default:
          return theme.colors.primaryLight;
      }
    }};
  background-color: ${({ $type, theme }) => {
    switch ($type) {
      case "success":
        return theme.colors.successBg;
      case "error":
        return theme.colors.dangerBg;
      case "warning":
        return theme.colors.warningBg;
      default:
        return theme.colors.primaryLight;
    }
  }};
  color: ${({ $type, theme }) => {
    switch ($type) {
      case "success":
        return theme.colors.success;
      case "error":
        return theme.colors.danger;
      case "warning":
        return theme.colors.warning;
      default:
        return theme.colors.primary;
    }
  }};
  box-shadow: ${({ theme }) => theme.colors.shadowLg};
`;

const ToastContent = styled.div`
  flex: 1;
  min-width: 0;

  p {
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

const CloseIconButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 1;
  }
`;

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <ToastContainerWrapper>
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type] || Info;
          return (
            <ToastCard
              key={toast.id}
              $type={toast.type}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
            >
              <Icon size={20} style={{ marginTop: '0.125rem', flexShrink: 0 }} />
              <ToastContent>
                <p>{toast.message}</p>
              </ToastContent>
              <CloseIconButton onClick={() => removeToast(toast.id)}>
                <X size={16} />
              </CloseIconButton>
            </ToastCard>
          );
        })}
      </AnimatePresence>
    </ToastContainerWrapper>
  );
}