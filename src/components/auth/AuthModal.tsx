import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  Check,
  TrendingUp,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openSignIn,
    openSignUp,
    login,
    loginAsDemo,
    signup,
  } = useAuth();

  // Mode state
  const isSignIn = authModalMode === 'signin';

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [signInError, setSignInError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Sign Up Multi-step state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // Step 4 is creation animation

  // Step 1: Personal Information
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});

  // Step 2: Account Setup
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});

  // Step 3: Financial Profile
  const [monthlyIncomeRange, setMonthlyIncomeRange] = useState('₹40,000 - ₹75,000');
  const [employmentType, setEmploymentType] = useState('Salaried / Corporate');
  const [primaryGoal, setPrimaryGoal] = useState('Build Emergency Fund');

  // Step 4 Animation progression states
  const [creationStage, setCreationStage] = useState<number>(0);

  // Reset errors when modal opens or closes
  useEffect(() => {
    if (isAuthModalOpen) {
      setSignInError('');
      setStep1Errors({});
      setStep2Errors({});
      setForgotSent(false);
      if (authModalMode === 'signup') {
        setStep(1);
        setCreationStage(0);
      }
    }
  }, [isAuthModalOpen, authModalMode]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen && step !== 4) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal, step]);

  if (!isAuthModalOpen) return null;

  // Password Strength Calculation
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const pwdStrength = calculatePasswordStrength(password);

  // Sign In Handler
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    if (!signInEmail.trim()) {
      setSignInError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(signInEmail)) {
      setSignInError('Please enter a valid email address.');
      return;
    }
    if (!signInPassword) {
      setSignInError('Please enter your password.');
      return;
    }

    try {
      setIsSigningIn(true);
      await login(signInEmail, signInPassword, rememberMe);
    } catch {
      setSignInError('Invalid credentials. Please verify your details and try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Full Name is required.';
    if (!signUpEmail.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(signUpEmail)) {
      errors.email = 'Please provide a valid email format (e.g., user@example.com).';
    }
    if (!mobile.trim()) {
      errors.mobile = 'Mobile number is required.';
    } else if (!/^\+?[\d\s-]{10,14}$/.test(mobile.trim())) {
      errors.mobile = 'Please enter a valid 10-digit mobile number.';
    }
    if (!dob) {
      errors.dob = 'Date of birth is required.';
    }
    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setStep2Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // Trigger Creation Animation Flow
  const handleFinalSubmit = async () => {
    setStep(4);
    setCreationStage(0);

    // Sequence the checklist animations
    setTimeout(() => setCreationStage(1), 500);
    setTimeout(() => setCreationStage(2), 1200);
    setTimeout(() => setCreationStage(3), 1900);

    // Complete registration and log in
    setTimeout(async () => {
      await signup({
        fullName,
        email: signUpEmail,
        mobile,
        dob,
        password,
        monthlyIncomeRange,
        employmentType,
        primaryGoal,
      });
    }, 2500);
  };

  const incomeOptions = [
    '₹20,000 - ₹40,000',
    '₹40,000 - ₹75,000',
    '₹75,000 - ₹1,50,000',
    '₹1,50,000+',
  ];

  const employmentOptions = [
    'Salaried / Corporate',
    'Self-Employed / Business',
    'Freelancer / Gig Economy',
    'Government / PSU',
  ];

  const goalOptions = [
    { id: 'Build Emergency Fund', title: 'Build Emergency Fund', desc: 'Secure 3-6 months buffer for unforeseen events' },
    { id: 'Reduce Debt', title: 'Reduce Debt', desc: 'Accelerate high-interest loans & credit card repayment' },
    { id: 'Improve Savings', title: 'Improve Savings', desc: 'Systematically grow surplus liquidity reserve' },
    { id: 'Control Spending', title: 'Control Spending', desc: 'Optimize recurring outlays & discretionary leakages' },
    { id: 'Financial Stability', title: 'Financial Stability', desc: 'Eliminate cash deficit risk & maintain resilience' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8 transform transition-all">
        {/* Subtle decorative purple-blue gradient glow bar at the top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500" />

        {/* Close Button */}
        {step !== 4 && (
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* =========================================================================
            VIEW 1: SIGN IN FLOW
           ========================================================================= */}
        {isSignIn && (
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-3 border border-purple-100">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>Verified CashTwin Portal</span>
              </div>
              <h2 id="auth-modal-title" className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
                Welcome Back <span className="ml-2">👋</span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Sign in to continue monitoring your financial health.
              </p>
            </div>

            {/* Error Message */}
            {signInError && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>{signInError}</span>
              </div>
            )}

            {/* Forgot Password Confirmation Banner */}
            {forgotSent && (
              <div className="mb-5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>A secure password reset link has been dispatched to your email.</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label htmlFor="signin-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="signin-email"
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. rahul.verma@cashtwin.bank"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signin-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signin-password"
                    type={showSignInPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden"
                    aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 transition-colors"
                  />
                  <span className="font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors hover:underline focus:outline-hidden"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to CashTwin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Sign In Shortcut */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center">
              <button
                type="button"
                onClick={loginAsDemo}
                className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-purple-50/60 border border-slate-200 hover:border-purple-200 text-slate-700 hover:text-purple-700 text-xs font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                title="Quick demo access as Rahul Verma"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>One-Click Demo: Sign in as Rahul Verma</span>
              </button>
            </div>

            {/* Secure Banking Indicator */}
            <div className="mt-5 flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 font-medium">
              <span>🔒</span>
              <span>Secure Banking Environment</span>
              <span>&bull;</span>
              <span>256-Bit SSL</span>
            </div>

            {/* Footer switcher */}
            <div className="mt-4 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={openSignUp}
                className="font-bold text-purple-600 hover:text-purple-800 hover:underline transition-colors focus:outline-hidden cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: SIGN UP / CREATE ACCOUNT MULTI-STEP FLOW
           ========================================================================= */}
        {!isSignIn && (
          <div className="p-6 sm:p-8">
            {/* Step Progress Bar (for Steps 1, 2, 3) */}
            {step !== 4 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span className={step === 1 ? 'text-purple-700 font-bold' : step > 1 ? 'text-indigo-600' : ''}>
                    1. Personal Info
                  </span>
                  <span className={step === 2 ? 'text-purple-700 font-bold' : step > 2 ? 'text-indigo-600' : ''}>
                    2. Account Setup
                  </span>
                  <span className={step === 3 ? 'text-purple-700 font-bold' : ''}>
                    3. Financial Profile
                  </span>
                </div>

                {/* Progress track */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
                    style={{
                      width: step === 1 ? '33%' : step === 2 ? '66%' : '100%',
                    }}
                  />
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------
                STEP 1: PERSONAL INFORMATION
               ------------------------------------------------------------------ */}
            {step === 1 && (
              <div>
                <div className="mb-5">
                  <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900 tracking-tight">
                    Step 1 — Personal Information
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Start by providing basic identity verification details.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Verma"
                        className={`w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border rounded-xl text-sm transition-all focus:outline-hidden ${
                          step1Errors.fullName ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        }`}
                      />
                    </div>
                    {step1Errors.fullName && (
                      <p className="text-rose-500 text-[11px] mt-1">{step1Errors.fullName}</p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-email"
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="e.g. rahul@example.com"
                        className={`w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border rounded-xl text-sm transition-all focus:outline-hidden ${
                          step1Errors.email ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        }`}
                      />
                    </div>
                    {step1Errors.email && (
                      <p className="text-rose-500 text-[11px] mt-1">{step1Errors.email}</p>
                    )}
                  </div>

                  {/* Mobile & DOB row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Mobile Number */}
                    <div>
                      <label htmlFor="signup-mobile" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <input
                          id="signup-mobile"
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="+91 98765 43210"
                          className={`w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border rounded-xl text-sm transition-all focus:outline-hidden ${
                            step1Errors.mobile ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                          }`}
                        />
                      </div>
                      {step1Errors.mobile && (
                        <p className="text-rose-500 text-[11px] mt-1">{step1Errors.mobile}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label htmlFor="signup-dob" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <input
                          id="signup-dob"
                          type="date"
                          value={dob}
                          max="2010-01-01"
                          onChange={(e) => setDob(e.target.value)}
                          className={`w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border rounded-xl text-sm transition-all focus:outline-hidden ${
                            step1Errors.dob ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                          }`}
                        />
                      </div>
                      {step1Errors.dob && (
                        <p className="text-rose-500 text-[11px] mt-1">{step1Errors.dob}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Continue button */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Switch to sign in */}
                <div className="mt-4 text-center text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={openSignIn}
                    className="font-bold text-purple-600 hover:text-purple-800 hover:underline transition-colors focus:outline-hidden cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------
                STEP 2: ACCOUNT SETUP
               ------------------------------------------------------------------ */}
            {step === 2 && (
              <div>
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Step 2 — Account Setup
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Secure your twin with a strong passphrase.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Create Password */}
                  <div>
                    <label htmlFor="signup-pwd" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Create Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-pwd"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className={`w-full pl-9 pr-10 py-2 bg-slate-50 focus:bg-white border rounded-xl text-sm transition-all focus:outline-hidden ${
                          step2Errors.password ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {step2Errors.password && (
                      <p className="text-rose-500 text-[11px] mt-1">{step2Errors.password}</p>
                    )}

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-500 font-medium">Strength:</span>
                          <span className={`font-bold ${pwdStrength.text}`}>{pwdStrength.label}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 h-1.5">
                          <div className={`rounded-full transition-colors ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-slate-200'}`} />
                          <div className={`rounded-full transition-colors ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-slate-200'}`} />
                          <div className={`rounded-full transition-colors ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-slate-200'}`} />
                        </div>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-2">
                          <span className={password.length >= 8 ? 'text-emerald-600 font-semibold' : ''}>✓ 8+ chars</span>
                          <span className={/[A-Z]/.test(password) ? 'text-emerald-600 font-semibold' : ''}>✓ Uppercase</span>
                          <span className={/[0-9]/.test(password) ? 'text-emerald-600 font-semibold' : ''}>✓ Number</span>
                          <span className={/[^A-Za-z0-9]/.test(password) ? 'text-emerald-600 font-semibold' : ''}>✓ Symbol</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="signup-confirm-pwd" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-confirm-pwd"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className={`w-full pl-9 pr-10 py-2 bg-slate-50 focus:bg-white border rounded-xl text-sm transition-all focus:outline-hidden ${
                          step2Errors.confirmPassword ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {step2Errors.confirmPassword && (
                      <p className="text-rose-500 text-[11px] mt-1">{step2Errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Back and Continue Buttons */}
                <div className="mt-6 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep2()) setStep(3);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------
                STEP 3: FINANCIAL PROFILE
               ------------------------------------------------------------------ */}
            {step === 3 && (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Step 3 — Financial Profile
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Essential details to initialize your personalized resilience model.
                  </p>
                </div>

                <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                  {/* Monthly Income Range */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-1 text-purple-600" />
                      Monthly Income Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {incomeOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setMonthlyIncomeRange(opt)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                            monthlyIncomeRange === opt
                              ? 'bg-purple-50/80 border-purple-500 text-purple-900 shadow-2xs'
                              : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {monthlyIncomeRange === opt && <Check className="w-3.5 h-3.5 text-purple-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Employment Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                      <Briefcase className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                      Employment Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {employmentOptions.map((emp) => (
                        <button
                          key={emp}
                          type="button"
                          onClick={() => setEmploymentType(emp)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                            employmentType === emp
                              ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 shadow-2xs'
                              : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="line-clamp-1">{emp}</span>
                          {employmentType === emp && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Financial Goal */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                      <Layers className="w-3.5 h-3.5 mr-1 text-blue-600" />
                      Primary Financial Goal
                    </label>
                    <div className="space-y-1.5">
                      {goalOptions.map((goal) => {
                        const isSelected = primaryGoal === goal.id;
                        return (
                          <button
                            key={goal.id}
                            type="button"
                            onClick={() => setPrimaryGoal(goal.id)}
                            className={`w-full p-2.5 rounded-xl border transition-all text-left flex items-center space-x-3 cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-r from-purple-50/90 to-blue-50/70 border-indigo-500 shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                                {goal.title}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {goal.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Back and Create Button */}
                <div className="mt-5 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Create My CashTwin</span>
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------
                STEP 4: ANIMATED ACCOUNT CREATION TRANSITION
               ------------------------------------------------------------------ */}
            {step === 4 && (
              <div className="py-6 px-2 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-xl shadow-indigo-500/30 flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Creating your CashTwin...
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Configuring deterministic cashflow simulations and tailoring safety guardrails.
                </p>

                {/* Transition Sequence Checklist */}
                <div className="mt-6 max-w-xs mx-auto space-y-3 text-left">
                  {/* Item 1 */}
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        creationStage >= 1
                          ? 'bg-emerald-500 text-white scale-110 shadow-xs shadow-emerald-500/40'
                          : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      {creationStage >= 1 ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold transition-colors ${
                        creationStage >= 1 ? 'text-slate-900 font-bold' : 'text-slate-400'
                      }`}
                    >
                      Building Financial Profile
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        creationStage >= 2
                          ? 'bg-emerald-500 text-white scale-110 shadow-xs shadow-emerald-500/40'
                          : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      {creationStage >= 2 ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold transition-colors ${
                        creationStage >= 2 ? 'text-slate-900 font-bold' : 'text-slate-400'
                      }`}
                    >
                      Initializing Risk Analysis
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        creationStage >= 3
                          ? 'bg-emerald-500 text-white scale-110 shadow-xs shadow-emerald-500/40'
                          : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      {creationStage >= 3 ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold transition-colors ${
                        creationStage >= 3 ? 'text-slate-900 font-bold' : 'text-slate-400'
                      }`}
                    >
                      Preparing Your Dashboard
                    </span>
                  </div>
                </div>

                <div className="mt-7 text-[11px] text-indigo-600 font-semibold flex items-center justify-center space-x-1 animate-pulse">
                  <span>Launching AI Financial Twin</span>
                  <span>&rarr;</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
