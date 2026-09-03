import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  Check,
  TrendingUp,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export const Signup: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});

  // Step 2
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});

  // Step 3
  const [monthlyIncomeRange, setMonthlyIncomeRange] = useState('₹40,000 - ₹75,000');
  const [employmentType, setEmploymentType] = useState('Salaried / Corporate');
  const [primaryGoal, setPrimaryGoal] = useState('Build Emergency Fund');

  // Step 4
  const [creationStage, setCreationStage] = useState(0);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Password Strength
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

  // Validation
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Full Name is required.';
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please provide a valid email format.';
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

  const handleFinalSubmit = async () => {
    setStep(4);
    setCreationStage(0);

    setTimeout(() => setCreationStage(1), 500);
    setTimeout(() => setCreationStage(2), 1200);
    setTimeout(() => setCreationStage(3), 1900);

    setTimeout(async () => {
      await signup({
        fullName,
        email,
        mobile,
        dob,
        password,
        monthlyIncomeRange,
        employmentType,
        primaryGoal,
      });
      navigate('/');
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex justify-center items-center space-x-2.5">
          <div className="w-11 h-11 bg-white border border-slate-200/80 rounded-2xl p-1 flex items-center justify-center shadow-xs">
            <img src={logoImg} alt="CashTwin Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Cash<span className="text-indigo-600">Twin</span>
          </span>
        </Link>
        <h2 className="mt-3 text-center text-sm font-medium text-slate-500">
          Create your personalized AI financial digital twin
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 border border-slate-100 sm:rounded-2xl sm:px-10 relative overflow-hidden">
          {/* Subtle gradient top accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500" />

          {/* Step Progress Bar */}
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

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div className="mb-5">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Step 1 — Personal Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Basic verification to establish your digital profile.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  {step1Errors.fullName && (
                    <p className="text-rose-500 text-[11px] mt-1">{step1Errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  {step1Errors.email && (
                    <p className="text-rose-500 text-[11px] mt-1">{step1Errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                    {step1Errors.mobile && (
                      <p className="text-rose-500 text-[11px] mt-1">{step1Errors.mobile}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="date"
                        value={dob}
                        max="2010-01-01"
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                    {step1Errors.dob && (
                      <p className="text-rose-500 text-[11px] mt-1">{step1Errors.dob}</p>
                    )}
                  </div>
                </div>
              </div>

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

              <div className="mt-4 text-center text-xs text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-purple-600 hover:text-purple-800 hover:underline">
                  Sign In
                </Link>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <div className="mb-5">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Step 2 — Account Setup
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create a secure passphrase to protect your account.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {step2Errors.password && (
                    <p className="text-rose-500 text-[11px] mt-1">{step2Errors.password}</p>
                  )}

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
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {step2Errors.confirmPassword && (
                    <p className="text-rose-500 text-[11px] mt-1">{step2Errors.confirmPassword}</p>
                  )}
                </div>
              </div>

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

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Step 3 — Financial Profile
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Essential parameters to personalize early warning signals.
                </p>
              </div>

              <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
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

          {/* Step 4 Animation */}
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

              <div className="mt-6 max-w-xs mx-auto space-y-3 text-left">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
