import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi, LoginPayload, SignupPayload } from '@/lib/api';
import { useAuth } from '@/store/AuthContext';

export function useLogin() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
}

export function useSignup() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: (data: SignupPayload) => authApi.signup(data),
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
}

export function useLogout() {
  const { logout } = useAuth();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout();
    },
  });
}

export function useProfile() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authApi.getProfile(),
    enabled: isAuthenticated,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}
