'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, TrendingUp, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useSignup } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-10px) rotate(3deg); }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 80% 50%, rgba(120, 80, 255, 0.15) 0%, transparent 60%),
                radial-gradient(ellipse at 20% 20%, rgba(37, 99, 235, 0.2) 0%, transparent 60%);
  }
`;

const Blob = styled.div<{ $x: string; $y: string; $size: string; $color: string; $delay?: string }>`
  position: absolute;
  left: ${({ $x }) => $x};
  top: ${({ $y }) => $y};
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border-radius: 50%;
  background: ${({ $color }) => $color};
  filter: blur(60px);
  opacity: 0.3;
  animation: ${float} 8s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
`;

const Left = styled.div`
  display: none;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  z-index: 1;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  z-index: 1;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.5rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 28rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
`;

const LogoIcon = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.875rem;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.5);
`;

const LogoText = styled.h1`
  font-size: 1.375rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.025em;
`;

const Heading = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.375rem;
`;

const Subheading = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 1.75rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const FieldLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.025em;
  text-transform: uppercase;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  height: 3rem;
  padding: 0 3rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid ${({ $hasError }) => ($hasError ? 'rgba(239, 68, 68, 0.7)' : 'rgba(255, 255, 255, 0.15)')};
  border-radius: 0.75rem;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.7);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;

  &:hover { color: rgba(255, 255, 255, 0.7); }
`;

const ErrorText = styled.p`
  font-size: 0.75rem;
  color: #f87171;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const SubmitBtn = styled(motion.button)`
  width: 100%;
  height: 3rem;
  border: none;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
  transition: opacity 0.2s;
  margin-top: 0.5rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AlertBox = styled.div`
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #fca5a5;
  margin-bottom: 1rem;
`;

const Divider = styled.div`
  text-align: center;
  position: relative;
  margin: 0.75rem 0 0.5rem;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.8rem;

  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
  &::before { left: 0; }
  &::after  { right: 0; }
`;

const LinkRow = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);

  a {
    color: #818cf8;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.2s;
    &:hover { color: #a5b4fc; }
  }
`;

const BenefitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
`;

const BenefitCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1rem;
`;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const signupMutation = useSignup();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      await signupMutation.mutateAsync({ fullName: data.fullName, email: data.email, password: data.password });
      router.push('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setServerError(error?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const benefits = [
    { icon: '💰', title: 'Budget Cycles', desc: 'Monthly budget tracking' },
    { icon: '🔒', title: 'Savings Lock', desc: 'Discipline-based saving' },
    { icon: '📊', title: 'Insights', desc: 'Smart analytics' },
    { icon: '📉', title: 'Inflation', desc: 'Purchasing power tracking' },
  ];

  return (
    <Page>
      <Blob $x="10%" $y="20%" $size="280px" $color="rgba(99,102,241,0.5)" />
      <Blob $x="65%" $y="10%" $size="220px" $color="rgba(37,99,235,0.4)" $delay="2s" />
      <Blob $x="50%" $y="70%" $size="260px" $color="rgba(124,58,237,0.35)" $delay="4s" />

      {/* Left panel */}
      <Left>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '30rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{
              width: '3rem', height: '3rem', borderRadius: '1rem',
              background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={22} color="#fff" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em' }}>BudgetFlow</span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
            Your financial<br />
            <span style={{ background: 'linear-gradient(90deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              journey starts here
            </span>
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '1rem' }}>
            Join thousands of users who have taken control of their financial future with BudgetFlow.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Free forever — no credit card required', 'Data synced securely to the cloud', 'Set savings goals and track progress', 'Debt repayment planning tools'].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
                <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={12} color="#fff" />
                </div>
                {f}
              </div>
            ))}
          </div>

          <BenefitGrid>
            {benefits.map((b, i) => (
              <BenefitCard
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{b.icon}</div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>{b.title}</p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>{b.desc}</p>
              </BenefitCard>
            ))}
          </BenefitGrid>
        </motion.div>
      </Left>

      {/* Right form */}
      <Right>
        <Card
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Logo>
            <LogoIcon><TrendingUp size={18} color="#fff" /></LogoIcon>
            <LogoText>BudgetFlow</LogoText>
          </Logo>

          <Heading>Create account</Heading>
          <Subheading>Start your financial journey today</Subheading>

          {serverError && (
            <AlertBox>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {serverError}
            </AlertBox>
          )}

          <Form onSubmit={handleSubmit(onSubmit)} id="signup-form">
            <FieldWrapper>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <InputWrapper>
                <InputIcon><User size={16} /></InputIcon>
                <StyledInput
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  $hasError={!!errors.fullName}
                  {...register('fullName')}
                />
              </InputWrapper>
              {errors.fullName && <ErrorText><AlertCircle size={12} />{errors.fullName.message}</ErrorText>}
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <InputWrapper>
                <InputIcon><Mail size={16} /></InputIcon>
                <StyledInput
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  $hasError={!!errors.email}
                  {...register('email')}
                />
              </InputWrapper>
              {errors.email && <ErrorText><AlertCircle size={12} />{errors.email.message}</ErrorText>}
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputWrapper>
                <InputIcon><Lock size={16} /></InputIcon>
                <StyledInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  $hasError={!!errors.password}
                  {...register('password')}
                />
                <EyeBtn type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </EyeBtn>
              </InputWrapper>
              {errors.password && <ErrorText><AlertCircle size={12} />{errors.password.message}</ErrorText>}
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <InputWrapper>
                <InputIcon><Lock size={16} /></InputIcon>
                <StyledInput
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  $hasError={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                />
                <EyeBtn type="button" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </EyeBtn>
              </InputWrapper>
              {errors.confirmPassword && <ErrorText><AlertCircle size={12} />{errors.confirmPassword.message}</ErrorText>}
            </FieldWrapper>

            <SubmitBtn
              type="submit"
              disabled={isSubmitting || signupMutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {signupMutation.isPending ? 'Creating account…' : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </SubmitBtn>
          </Form>

          <Divider>or</Divider>

          <LinkRow>
            Already have an account?{' '}
            <a href="/auth/signin">Sign in instead</a>
          </LinkRow>
        </Card>
      </Right>
    </Page>
  );
}
