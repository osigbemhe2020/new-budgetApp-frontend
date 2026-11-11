'use client';

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useApp } from "@/store/AppContext";
import { useAuth } from "@/store/AuthContext";
import { useTaxProfile, useUpsertTaxProfile, useGenerateTaxDocument, useTaxFilings, useDownloadFiling } from "@/hooks/useTax";
import { formatCurrency, formatDate, NIGERIAN_STATES } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, CheckCircle, AlertTriangle, Download, Loader2, FileText } from "lucide-react";

const SpaceStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  @media (max-width: 768px) {
    flex: 1;
    padding: 0.75rem 1rem;
  }
`;

const Banner = styled(Card)<{ $variant: 'success' | 'warning' }>`
  border: 1px solid ${({ $variant, theme }) =>
    $variant === 'success' ? theme.colors.successBorder : '#fcd34d'};
  background-color: ${({ $variant, theme }) =>
    $variant === 'success' ? theme.colors.successBg : '#fef3c7'};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.5rem;
`;

const SectionSubtitle = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const HelperText = styled.p`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.25rem;
`;

const ReadOnlyInput = styled(Input)`
  background-color: ${({ theme }) => theme.colors.background};
  cursor: not-allowed;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconBox = styled.div<{ $bg: string; $color: string }>`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const PeriodChips = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 0.5rem;
  }
`;

const PeriodChip = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'white'};
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PreviewLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PreviewValue = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ProgressStep = styled.div<{ $completed: boolean; $current: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ $completed, $current, theme }) =>
    $completed ? theme.colors.successBg : $current ? theme.colors.primaryLight : 'transparent'};
  color: ${({ $completed, $current, theme }) =>
    $completed ? '#15803d' : $current ? theme.colors.primary : theme.colors.textSecondary};
`;

const FilingCard = styled(Card)`
  margin-bottom: 1rem;
`;

const Badge = styled.span<{ $variant: 'success' | 'warning' | 'danger' | 'info' }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success': return theme.colors.successBg;
      case 'warning': return '#fef3c7';
      case 'danger': return theme.colors.dangerBg;
      case 'info': return theme.colors.primaryLight;
      default: return theme.colors.background;
    }
  }};
  color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success': return '#15803d';
      case 'warning': return '#d97706';
      case 'danger': return '#dc2626';
      case 'info': return theme.colors.primary;
      default: return theme.colors.textSecondary;
    }
  }};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

export function TaxPage() {
  const { addToast } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'generate'>('profile');
  
  // Tax Profile Form State
  const [accountType, setAccountType] = useState<'Personal' | 'Sole Trader'>('Personal');
  const [tin, setTin] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [stateOfResidence, setStateOfResidence] = useState('');
  const [lga, setLga] = useState('');
  const [occupation, setOccupation] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [pensionContribution, setPensionContribution] = useState('');
  const [nhfContribution, setNhfContribution] = useState('');
  const [lifeInsurancePremium, setLifeInsurancePremium] = useState('');

  // Generate Section State
  const [selectedPeriod, setSelectedPeriod] = useState<'Last Month' | 'Last Quarter' | 'Last 6 Months' | 'Full Year' | 'Calendar Year' | 'Custom Range'>('Last Month');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: taxProfile, isLoading: profileLoading } = useTaxProfile();
  const upsertProfile = useUpsertTaxProfile();
  const generateDocument = useGenerateTaxDocument();
  const { data: filings = [], isLoading: filingsLoading } = useTaxFilings();
  const downloadFiling = useDownloadFiling();

  

  // Initialize form with existing profile data
  useEffect(() => {
    if (taxProfile) {
      const acctType = taxProfile.account_type?.toLowerCase() === 'sole trader' ? 'Sole Trader' : 'Personal';
      setAccountType(acctType);
      setTin(taxProfile.tin || '');
      const dob = taxProfile.date_of_birth ? taxProfile.date_of_birth.split('T')[0] : '';
      setDateOfBirth(dob);
      const safeGender = taxProfile.gender?.toLowerCase() === 'female' ? 'Female' : 'Male';
      setGender(safeGender);
      setPhoneNumber(taxProfile.phone || taxProfile.phone_number || '');
      setAddress(taxProfile.address || '');
      setStateOfResidence(taxProfile.state_of_residence || '');
      setLga(taxProfile.lga || '');
      setOccupation(taxProfile.occupation || '');
      setEmployerName(taxProfile.employer_name || '');
      setPensionContribution(taxProfile.pension_contribution?.toString() || '');
      setNhfContribution(taxProfile.nhf_contribution?.toString() || '');
      setLifeInsurancePremium(taxProfile.life_insurance_premium?.toString() || '');
    }
  }, [taxProfile]);

  const checkProfileComplete = () => {
    const requiredFields = [];
    if (!accountType) requiredFields.push('Account Type');
    if (!dateOfBirth) requiredFields.push('Date of Birth');
    if (!gender) requiredFields.push('Gender');
    if (!phoneNumber) requiredFields.push('Phone Number');
    if (!address) requiredFields.push('Address');
    if (!stateOfResidence) requiredFields.push('State of Residence');
    if (!lga) requiredFields.push('LGA');
    if (!occupation) requiredFields.push('Occupation');
    return { complete: requiredFields.length === 0, missing: requiredFields };
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      await upsertProfile.mutateAsync({
        full_name: user.FullName || user.full_name || '',
        email: user.Email || user.email || '',
        account_type: accountType,
        tin: tin || undefined,
        date_of_birth: dateOfBirth || undefined,
        gender: gender || undefined,
        phone: phoneNumber || undefined,
        phone_number: phoneNumber || undefined,
        address: address || undefined,
        state_of_residence: stateOfResidence || undefined,
        lga: lga || undefined,
        occupation: occupation || undefined,
        employer_name: employerName || undefined,
        pension_contribution: pensionContribution ? Number(pensionContribution) : undefined,
        nhf_contribution: nhfContribution ? Number(nhfContribution) : undefined,
        life_insurance_premium: lifeInsurancePremium ? Number(lifeInsurancePremium) : undefined,
      });
      addToast({ type: 'success', message: 'Tax profile saved successfully' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to save tax profile' });
    }
  };

  const handleGenerate = async () => {
    const { complete } = checkProfileComplete();
    if (!complete) {
      addToast({ type: 'warning', message: 'Please complete your tax profile first' });
      setActiveTab('profile');
      return;
    }

    if (selectedPeriod === 'Custom Range' && (!customFrom || !customTo)) {
      addToast({ type: 'warning', message: 'Please select both from and to dates for the custom range' });
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    const steps = [
      'Gathering your financial records...',
      'Computing tax liability...',
      'AI assistant reviewing...',
      'Generating PDF...',
      'Sending to your email...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationStep(i + 1);
    }

    try {
      const periodMap: Record<string, string> = {
        'Last Month': 'last_month',
        'Last Quarter': 'quarter',
        'Last 6 Months': 'half_year',
        'Full Year': 'full_year',
        'Calendar Year': 'calendar_year',
        'Custom Range': 'custom',
      };

      await generateDocument.mutateAsync({
        period_type: (periodMap[selectedPeriod] || selectedPeriod) as any,
        period_start: selectedPeriod === 'Custom Range' ? customFrom : undefined,
        period_end: selectedPeriod === 'Custom Range' ? customTo : undefined,
        custom_from: selectedPeriod === 'Custom Range' ? customFrom : undefined,
        custom_to: selectedPeriod === 'Custom Range' ? customTo : undefined,
      });
      setShowSuccess(true);
      addToast({ type: 'success', message: 'Tax document generated successfully' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to generate tax document' });
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const handleDownload = async (filingId: number) => {
    try {
      const blob = await downloadFiling.mutateAsync(filingId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tax-document-${filingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      addToast({ type: 'success', message: 'Download started' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to download document' });
    }
  };

  const { complete, missing } = checkProfileComplete();

  return (
    <SpaceStack>
      <PageHeader>
        <Title>Tax</Title>
        <Subtitle>Manage your tax profile and generate documents</Subtitle>
      </PageHeader>

      <TabContainer>
        <TabButton $active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
          Tax Profile
        </TabButton>
        <TabButton $active={activeTab === 'generate'} onClick={() => setActiveTab('generate')}>
          Generate & History
        </TabButton>
      </TabContainer>

      {activeTab === 'profile' && (
        <>
          {/* Completion Status Banner */}
          <Banner $variant={complete ? 'success' : 'warning'}>
            <CardContent style={{ padding: '1rem' }}>
              <FlexRow>
                <IconBox $bg={complete ? '#dcfce7' : '#fef3c7'} $color={complete ? '#16a34a' : '#d97706'}>
                  {complete ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                </IconBox>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: complete ? '#15803d' : '#78350f' }}>
                    {complete ? '✓ Profile complete — ready to generate' : 'Complete your profile to generate accurate tax documents'}
                  </p>
                  {!complete && (
                    <p style={{ fontSize: '0.75rem', color: '#92400e' }}>
                      Missing: {missing.join(', ')}
                    </p>
                  )}
                </div>
              </FlexRow>
            </CardContent>
          </Banner>

          {/* Tax Profile Form */}
          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <FormGrid>
                {/* Personal Information */}
                <FormSection style={{ gridColumn: '1 / -1' }}>
                  <SectionTitle>Personal Information</SectionTitle>
                  <FormGrid>
                    <div>
                      <Label>Full Name</Label>
                      <ReadOnlyInput value={user?.FullName || ''} disabled style={{ marginTop: '0.25rem' }} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <ReadOnlyInput value={user?.Email || ''} disabled style={{ marginTop: '0.25rem' }} />
                    </div>
                    <div>
                      <Label>Account Type</Label>
                      <div style={{ marginTop: '0.25rem' }}>
                        <Select value={accountType} onValueChange={(value: any) => setAccountType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Personal">Personal</SelectItem>
                            <SelectItem value="Sole Trader">Sole Trader</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>TIN (Tax Identification Number)</Label>
                      <Input value={tin} onChange={(e) => setTin(e.target.value)} placeholder="Optional" style={{ marginTop: '0.25rem' }} />
                      <HelperText>Obtain from FIRS at firs.gov.ng if you don't have one</HelperText>
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} style={{ marginTop: '0.25rem' }} />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <div style={{ marginTop: '0.25rem' }}>
                        <Select value={gender} onValueChange={(value: any) => setGender(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Label>Phone Number</Label>
                      <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+234 XXX XXX XXXX" style={{ marginTop: '0.25rem' }} />
                    </div>
                  </FormGrid>
                </FormSection>

                {/* Location */}
                <FormSection style={{ gridColumn: '1 / -1' }}>
                  <SectionTitle>Location</SectionTitle>
                  <FormGrid>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Label>Address</Label>
                      <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your residential address" style={{ marginTop: '0.25rem' }} />
                    </div>
                    <div>
                      <Label>State of Residence</Label>
                      <div style={{ marginTop: '0.25rem' }}>
                        <Select value={stateOfResidence} onValueChange={setStateOfResidence}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {NIGERIAN_STATES.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>LGA</Label>
                      <Input value={lga} onChange={(e) => setLga(e.target.value)} placeholder="Local Government Area" style={{ marginTop: '0.25rem' }} />
                    </div>
                  </FormGrid>
                </FormSection>

                {/* Occupation */}
                <FormSection style={{ gridColumn: '1 / -1' }}>
                  <SectionTitle>Occupation</SectionTitle>
                  <FormGrid>
                    <div>
                      <Label>Occupation</Label>
                      <Input value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Your occupation" style={{ marginTop: '0.25rem' }} />
                    </div>
                    <div>
                      <Label>Employer Name</Label>
                      <Input value={employerName} onChange={(e) => setEmployerName(e.target.value)} placeholder="Optional" style={{ marginTop: '0.25rem' }} />
                      <HelperText>Leave blank if self-employed or freelance</HelperText>
                    </div>
                  </FormGrid>
                </FormSection>

                {/* Deductions */}
                <FormSection style={{ gridColumn: '1 / -1' }}>
                  <SectionTitle>Annual Deductions</SectionTitle>
                  <SectionSubtitle>These reduce your taxable income</SectionSubtitle>
                  <FormGrid>
                    <div>
                      <Label>Pension Contribution (₦)</Label>
                      <Input type="number" value={pensionContribution} onChange={(e) => setPensionContribution(e.target.value)} placeholder="0" style={{ marginTop: '0.25rem' }} />
                      <HelperText>Your annual pension contribution (8% of basic salary if employed)</HelperText>
                    </div>
                    <div>
                      <Label>NHF Contribution (₦)</Label>
                      <Input type="number" value={nhfContribution} onChange={(e) => setNhfContribution(e.target.value)} placeholder="0" style={{ marginTop: '0.25rem' }} />
                      <HelperText>National Housing Fund — 2.5% of basic salary if applicable</HelperText>
                    </div>
                    <div>
                      <Label>Life Insurance Premium (₦)</Label>
                      <Input type="number" value={lifeInsurancePremium} onChange={(e) => setLifeInsurancePremium(e.target.value)} placeholder="0" style={{ marginTop: '0.25rem' }} />
                      <HelperText>Annual life insurance premium payments</HelperText>
                    </div>
                  </FormGrid>
                </FormSection>
              </FormGrid>

              <Button 
                onClick={handleSaveProfile} 
                disabled={upsertProfile.isPending}
                style={{ width: '100%', marginTop: '1.5rem', height: '2.75rem' }}
              >
                {upsertProfile.isPending ? 'Saving...' : 'Save Tax Profile'}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'generate' && (
        <>
          {/* Generate Section */}
          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Generate Tax Document</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Your BudgetWise financial records will be used to compute your tax liability
                </p>
              </div>

              <PeriodChips>
                {['Last Month', 'Last Quarter', 'Last 6 Months', 'Full Year', 'Calendar Year', 'Custom Range'].map((period) => (
                  <PeriodChip
                    key={period}
                    $active={selectedPeriod === period}
                    onClick={() => setSelectedPeriod(period as any)}
                  >
                    {period}
                  </PeriodChip>
                ))}
              </PeriodChips>

              {selectedPeriod === 'Custom Range' && (
                <FormGrid style={{ marginTop: '1rem' }}>
                  <div>
                    <Label>From</Label>
                    <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} style={{ marginTop: '0.25rem' }} />
                  </div>
                  <div>
                    <Label>To</Label>
                    <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} style={{ marginTop: '0.25rem' }} />
                  </div>
                </FormGrid>
              )}

              {/* Tax Preview Card */}
              {(selectedPeriod || (selectedPeriod === 'Custom Range' && customFrom && customTo)) && !isGenerating && !showSuccess && (
                <Card style={{ marginTop: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <CardContent style={{ padding: '1rem' }}>
                    <PreviewGrid>
                      <PreviewItem>
                        <PreviewLabel>Period</PreviewLabel>
                        <PreviewValue>{selectedPeriod === 'Custom Range' ? `${formatDate(customFrom)} — ${formatDate(customTo)}` : selectedPeriod}</PreviewValue>
                      </PreviewItem>
                      <PreviewItem>
                        <PreviewLabel>Gross Income</PreviewLabel>
                        <PreviewValue>₦630,000</PreviewValue>
                      </PreviewItem>
                      <PreviewItem>
                        <PreviewLabel>Total Expenses</PreviewLabel>
                        <PreviewValue>₦100,000</PreviewValue>
                      </PreviewItem>
                      <PreviewItem>
                        <PreviewLabel>Estimated Tax Payable</PreviewLabel>
                        <PreviewValue>₦XX,XXX</PreviewValue>
                      </PreviewItem>
                      <PreviewItem>
                        <PreviewLabel>Effective Rate</PreviewLabel>
                        <PreviewValue>X%</PreviewValue>
                      </PreviewItem>
                    </PreviewGrid>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.75rem', fontStyle: 'italic' }}>
                      Final computation will be done by our AI assistant
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Loading State */}
              {isGenerating && (
                <div style={{ marginTop: '1.5rem' }}>
                  {['Gathering your financial records...', 'Computing tax liability...', 'AI assistant reviewing...', 'Generating PDF...', 'Sending to your email...'].map((step, index) => (
                    <ProgressStep key={index} $completed={index < generationStep} $current={index === generationStep - 1}>
                      {index < generationStep ? <CheckCircle size={18} /> : index === generationStep - 1 ? <Loader2 size={18} className="animate-spin" /> : <div style={{ width: '18px', height: '18px' }} />}
                      <span style={{ fontSize: '0.875rem' }}>{step}</span>
                    </ProgressStep>
                  ))}
                </div>
              )}

              {/* Success State */}
              {showSuccess && (
                <Card style={{ marginTop: '1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}>
                  <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <IconBox $bg="#dcfce7" $color="#16a34a" style={{ margin: '0 auto 1rem' }}>
                      <CheckCircle size={32} />
                    </IconBox>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#15803d', marginBottom: '0.25rem' }}>
                      ✓ Tax document generated successfully
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '1rem' }}>
                      Sent to {user?.Email}
                    </p>
                    <Button variant="outline" onClick={() => setShowSuccess(false)} style={{ width: '100%' }}>
                      <Download size={16} style={{ marginRight: '0.5rem' }} />
                      Download PDF
                    </Button>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.75rem' }}>
                      Download link expires in 24 hours
                    </p>
                  </CardContent>
                </Card>
              )}

              {!isGenerating && !showSuccess && (
                <Button 
                  onClick={handleGenerate}
                  disabled={generateDocument.isPending}
                  style={{ 
                    width: '100%', 
                    marginTop: '1.5rem', 
                    height: '2.75rem',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)'
                  }}
                >
                  {generateDocument.isPending ? 'Generating...' : 'Generate Tax Document & Send to Email'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Disclaimer Card */}
          <Card style={{ border: '1px solid #fcd34d', backgroundColor: '#fef3c7' }}>
            <CardContent style={{ padding: '1rem' }}>
              <FlexRow>
                <IconBox $bg="#fef3c7" $color="#d97706">
                  <AlertTriangle size={20} />
                </IconBox>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#78350f' }}>
                    This document is a financial summary for tax reference purposes. It is not a substitute for official tax filing with FIRS or your state tax authority. Please consult a qualified tax professional before submission.
                  </p>
                </div>
              </FlexRow>
            </CardContent>
          </Card>

          {/* Filing History */}
          <div>
            <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Previous Filings</h3>
            {filingsLoading ? (
              <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>Loading…</p>
            ) : !Array.isArray(filings) || filings.length === 0 ? (
              <EmptyState>
                <IconBox $bg="#f3f4f6" $color="#9ca3af" style={{ marginBottom: '1rem' }}>
                  <Receipt size={32} />
                </IconBox>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>No tax documents generated yet</p>
              </EmptyState>
            ) : (
              <div>
                {filings.map((filing) => {
                  const isExpired = filing.download_expires_at && new Date(filing.download_expires_at) < new Date();
                  return (
                    <FilingCard key={filing.id}>
                      <CardContent style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <FlexRow>
                            <Badge $variant="info">{filing.period_type}</Badge>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                              {formatDate(filing.date_from)} — {formatDate(filing.date_to)}
                            </span>
                          </FlexRow>
                          <Badge $variant={filing.status === 'Completed' ? 'success' : filing.status === 'Processing' ? 'info' : 'danger'}>
                            {filing.status}
                          </Badge>
                        </div>
                        <PreviewGrid style={{ marginBottom: '0.75rem' }}>
                          <PreviewItem>
                            <PreviewLabel>Gross Income</PreviewLabel>
                            <PreviewValue>{formatCurrency(filing.gross_income)}</PreviewValue>
                          </PreviewItem>
                          <PreviewItem>
                            <PreviewLabel>Tax Payable</PreviewLabel>
                            <PreviewValue>{formatCurrency(filing.tax_payable)}</PreviewValue>
                          </PreviewItem>
                        </PreviewGrid>
                        <FlexRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                          <Badge $variant={filing.email_sent ? 'success' : 'danger'}>
                            {filing.email_sent ? 'Email sent ✓' : 'Email failed ✗'}
                          </Badge>
                          {isExpired ? (
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Link expired — regenerate</span>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleDownload(filing.id)} disabled={downloadFiling.isPending}>
                              <Download size={14} style={{ marginRight: '0.25rem' }} />
                              Download PDF
                            </Button>
                          )}
                        </FlexRow>
                      </CardContent>
                    </FilingCard>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </SpaceStack>
  );
}
