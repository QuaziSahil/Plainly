/**
 * Plainly - Native Tool Implementations
 * These tools work natively within the app
 */

// Tip Calculator
export const calculateTip = (
  billAmount: number,
  tipPercentage: number,
  numberOfPeople: number = 1
): {
  tipAmount: number;
  totalAmount: number;
  tipPerPerson: number;
  totalPerPerson: number;
} => {
  const tipAmount = billAmount * (tipPercentage / 100);
  const totalAmount = billAmount + tipAmount;
  const tipPerPerson = tipAmount / numberOfPeople;
  const totalPerPerson = totalAmount / numberOfPeople;

  return {
    tipAmount: Math.round(tipAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    tipPerPerson: Math.round(tipPerPerson * 100) / 100,
    totalPerPerson: Math.round(totalPerPerson * 100) / 100,
  };
};

// BMI Calculator
export const calculateBMI = (
  weight: number,
  height: number,
  unit: 'metric' | 'imperial' = 'metric'
): {
  bmi: number;
  category: string;
  healthyWeightRange: { min: number; max: number };
  color: string;
} => {
  let bmi: number;
  let heightInMeters: number;

  if (unit === 'imperial') {
    // Convert lbs to kg and inches to meters
    const weightKg = weight * 0.453592;
    heightInMeters = height * 0.0254;
    bmi = weightKg / (heightInMeters * heightInMeters);
  } else {
    // Height in cm, convert to meters
    heightInMeters = height / 100;
    bmi = weight / (heightInMeters * heightInMeters);
  }

  bmi = Math.round(bmi * 10) / 10;

  let category: string;
  let color: string;

  if (bmi < 18.5) {
    category = 'Underweight';
    color = '#3b82f6';
  } else if (bmi < 25) {
    category = 'Normal weight';
    color = '#22c55e';
  } else if (bmi < 30) {
    category = 'Overweight';
    color = '#f59e0b';
  } else {
    category = 'Obese';
    color = '#ef4444';
  }

  // Calculate healthy weight range (BMI 18.5-24.9)
  const minWeight = 18.5 * (heightInMeters * heightInMeters);
  const maxWeight = 24.9 * (heightInMeters * heightInMeters);

  return {
    bmi,
    category,
    healthyWeightRange: {
      min: Math.round(minWeight * 10) / 10,
      max: Math.round(maxWeight * 10) / 10,
    },
    color,
  };
};

// Percentage Calculator
export const calculatePercentage = {
  // What is X% of Y?
  percentOf: (percent: number, number: number): number => {
    return Math.round((percent / 100) * number * 100) / 100;
  },
  // X is what % of Y?
  whatPercent: (x: number, y: number): number => {
    if (y === 0) return 0;
    return Math.round((x / y) * 100 * 100) / 100;
  },
  // X is Y% of what?
  percentOfWhat: (x: number, percent: number): number => {
    if (percent === 0) return 0;
    return Math.round((x / (percent / 100)) * 100) / 100;
  },
  // Percentage change from X to Y
  percentChange: (from: number, to: number): number => {
    if (from === 0) return 0;
    return Math.round(((to - from) / from) * 100 * 100) / 100;
  },
  // Increase X by Y%
  increaseBy: (number: number, percent: number): number => {
    return Math.round(number * (1 + percent / 100) * 100) / 100;
  },
  // Decrease X by Y%
  decreaseBy: (number: number, percent: number): number => {
    return Math.round(number * (1 - percent / 100) * 100) / 100;
  },
};

// Age Calculator
export const calculateAge = (
  birthDate: Date
): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  nextBirthday: Date;
  daysUntilBirthday: number;
} => {
  const today = new Date();
  const birth = new Date(birthDate);

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Total calculations
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  // Next birthday
  let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday <= today) {
    nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const daysUntilBirthday = Math.ceil(
    (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    nextBirthday,
    daysUntilBirthday,
  };
};

// Compound Interest Calculator
export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  time: number,
  compoundingFrequency: 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily' = 'annually'
): {
  futureValue: number;
  totalInterest: number;
  effectiveRate: number;
  yearlyBreakdown: { year: number; balance: number; interest: number }[];
} => {
  const frequencyMap = {
    annually: 1,
    'semi-annually': 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  };

  const n = frequencyMap[compoundingFrequency];
  const r = rate / 100;

  // A = P(1 + r/n)^(nt)
  const futureValue = principal * Math.pow(1 + r / n, n * time);
  const totalInterest = futureValue - principal;

  // Effective annual rate
  const effectiveRate = (Math.pow(1 + r / n, n) - 1) * 100;

  // Yearly breakdown
  const yearlyBreakdown = [];
  for (let year = 1; year <= time; year++) {
    const balance = principal * Math.pow(1 + r / n, n * year);
    const prevBalance = year === 1 ? principal : principal * Math.pow(1 + r / n, n * (year - 1));
    yearlyBreakdown.push({
      year,
      balance: Math.round(balance * 100) / 100,
      interest: Math.round((balance - prevBalance) * 100) / 100,
    });
  }

  return {
    futureValue: Math.round(futureValue * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    yearlyBreakdown,
  };
};

// Loan/EMI Calculator
export const calculateLoan = (
  principal: number,
  annualRate: number,
  termMonths: number
): {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: { month: number; payment: number; principal: number; interest: number; balance: number }[];
} => {
  const monthlyRate = annualRate / 100 / 12;
  
  // Monthly payment formula: M = P[r(1+r)^n]/[(1+r)^n-1]
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / termMonths;
  } else {
    monthlyPayment =
      principal *
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - principal;

  // Amortization schedule
  const amortizationSchedule = [];
  let balance = principal;

  for (let month = 1; month <= termMonths; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;

    amortizationSchedule.push({
      month,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.max(0, Math.round(balance * 100) / 100),
    });
  }

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    amortizationSchedule,
  };
};

// Calorie Calculator
export const calculateCalories = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active',
  unit: 'metric' | 'imperial' = 'metric'
): {
  bmr: number;
  tdee: number;
  goals: { lose: number; maintain: number; gain: number };
  macros: { protein: number; carbs: number; fat: number };
} => {
  let weightKg: number;
  let heightCm: number;

  if (unit === 'imperial') {
    weightKg = weight * 0.453592;
    heightCm = height * 2.54;
  } else {
    weightKg = weight;
    heightCm = height;
  }

  // Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9,
  };

  const tdee = bmr * activityMultipliers[activityLevel];

  // Goals (500 calorie deficit/surplus)
  const goals = {
    lose: Math.round(tdee - 500),
    maintain: Math.round(tdee),
    gain: Math.round(tdee + 500),
  };

  // Macros for maintenance (balanced: 30% protein, 40% carbs, 30% fat)
  const macros = {
    protein: Math.round((goals.maintain * 0.3) / 4), // 4 cal/g
    carbs: Math.round((goals.maintain * 0.4) / 4), // 4 cal/g
    fat: Math.round((goals.maintain * 0.3) / 9), // 9 cal/g
  };

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    goals,
    macros,
  };
};

// Discount Calculator
export const calculateDiscount = (
  originalPrice: number,
  discountPercent: number
): {
  discountAmount: number;
  finalPrice: number;
  savings: number;
} => {
  const discountAmount = originalPrice * (discountPercent / 100);
  const finalPrice = originalPrice - discountAmount;

  return {
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    savings: Math.round(discountAmount * 100) / 100,
  };
};

// Unit Converter
export const convertUnits = {
  // Length
  length: {
    mToFt: (m: number) => m * 3.28084,
    ftToM: (ft: number) => ft / 3.28084,
    kmToMi: (km: number) => km * 0.621371,
    miToKm: (mi: number) => mi / 0.621371,
    cmToIn: (cm: number) => cm * 0.393701,
    inToCm: (inches: number) => inches / 0.393701,
  },
  // Weight
  weight: {
    kgToLb: (kg: number) => kg * 2.20462,
    lbToKg: (lb: number) => lb / 2.20462,
    gToOz: (g: number) => g * 0.035274,
    ozToG: (oz: number) => oz / 0.035274,
  },
  // Temperature
  temperature: {
    cToF: (c: number) => (c * 9) / 5 + 32,
    fToC: (f: number) => ((f - 32) * 5) / 9,
    cToK: (c: number) => c + 273.15,
    kToC: (k: number) => k - 273.15,
  },
  // Volume
  volume: {
    lToGal: (l: number) => l * 0.264172,
    galToL: (gal: number) => gal / 0.264172,
    mlToOz: (ml: number) => ml * 0.033814,
    ozToMl: (oz: number) => oz / 0.033814,
  },
};

// Random Number Generator
export const generateRandomNumber = (
  min: number,
  max: number,
  count: number = 1,
  allowDuplicates: boolean = true
): number[] => {
  const numbers: number[] = [];
  const range = max - min + 1;

  if (!allowDuplicates && count > range) {
    count = range;
  }

  while (numbers.length < count) {
    const num = Math.floor(Math.random() * range) + min;
    if (allowDuplicates || !numbers.includes(num)) {
      numbers.push(num);
    }
  }

  return numbers;
};

// GPA Calculator
export const calculateGPA = (
  grades: { grade: string; credits: number }[]
): {
  gpa: number;
  totalCredits: number;
  totalPoints: number;
} => {
  const gradePoints: { [key: string]: number } = {
    'A+': 4.0,
    A: 4.0,
    'A-': 3.7,
    'B+': 3.3,
    B: 3.0,
    'B-': 2.7,
    'C+': 2.3,
    C: 2.0,
    'C-': 1.7,
    'D+': 1.3,
    D: 1.0,
    'D-': 0.7,
    F: 0.0,
  };

  let totalPoints = 0;
  let totalCredits = 0;

  for (const { grade, credits } of grades) {
    const points = gradePoints[grade.toUpperCase()] || 0;
    totalPoints += points * credits;
    totalCredits += credits;
  }

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  return {
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    totalPoints: Math.round(totalPoints * 100) / 100,
  };
};

// Water Intake Calculator
export const calculateWaterIntake = (
  weight: number,
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'very-active',
  unit: 'metric' | 'imperial' = 'metric'
): {
  dailyIntakeMl: number;
  dailyIntakeOz: number;
  glasses: number; // 8oz glasses
} => {
  let weightKg = unit === 'imperial' ? weight * 0.453592 : weight;

  // Base: 30-35ml per kg body weight
  let baseIntake = weightKg * 35;

  // Activity multiplier
  const multipliers = {
    sedentary: 1.0,
    moderate: 1.2,
    active: 1.4,
    'very-active': 1.6,
  };

  const dailyIntakeMl = Math.round(baseIntake * multipliers[activityLevel]);
  const dailyIntakeOz = Math.round(dailyIntakeMl * 0.033814);
  const glasses = Math.round(dailyIntakeOz / 8);

  return {
    dailyIntakeMl,
    dailyIntakeOz,
    glasses,
  };
};

// Mortgage Calculator
export const calculateMortgage = (
  homePrice: number,
  downPayment: number,
  interestRate: number,
  loanTermYears: number,
  propertyTax: number = 0,
  homeInsurance: number = 0,
  pmi: number = 0
): {
  monthlyPayment: number;
  monthlyPrincipalInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
} => {
  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  // Monthly principal & interest
  let monthlyPrincipalInterest: number;
  if (monthlyRate === 0) {
    monthlyPrincipalInterest = loanAmount / numberOfPayments;
  } else {
    monthlyPrincipalInterest =
      loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  const monthlyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;
  const monthlyPMI = downPayment / homePrice < 0.2 ? pmi / 12 : 0;

  const monthlyPayment = monthlyPrincipalInterest + monthlyTax + monthlyInsurance + monthlyPMI;
  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = (monthlyPrincipalInterest * numberOfPayments) - loanAmount;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    monthlyPrincipalInterest: Math.round(monthlyPrincipalInterest * 100) / 100,
    monthlyTax: Math.round(monthlyTax * 100) / 100,
    monthlyInsurance: Math.round(monthlyInsurance * 100) / 100,
    monthlyPMI: Math.round(monthlyPMI * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    loanAmount,
  };
};
