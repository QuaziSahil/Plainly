/**
 * Plainly - The Tool Hub
 * Tools Data (Complete - All 249 Tools from Web)
 */

export type ToolCategory = 
  | 'Finance'
  | 'Health'
  | 'Math'
  | 'Converter'
  | 'AI'
  | 'Fun'
  | 'Other'
  | 'Real Estate'
  | 'Sustainability'
  | 'Tech'
  | 'Text';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  path: string;
  category: ToolCategory;
  isAI?: boolean;
}

export const allTools: Tool[] = [
  // ===== FINANCE (63 tools) =====
  { id: 'mortgage', name: 'Mortgage Calculator', description: 'Calculate monthly payments, total interest, and amortization for home loans.', icon: 'Home', path: '/mortgage-calculator', category: 'Finance' },
  { id: 'loan', name: 'Loan Calculator', description: 'Compute loan payments, interest rates, and payoff schedules.', icon: 'CreditCard', path: '/loan-calculator', category: 'Finance' },
  { id: 'compound-interest', name: 'Compound Interest', description: 'Visualize exponential growth through compounding interest calculations.', icon: 'TrendingUp', path: '/compound-interest-calculator', category: 'Finance' },
  { id: 'investment', name: 'Investment Calculator', description: 'Project investment growth with regular contributions and returns.', icon: 'PiggyBank', path: '/investment-calculator', category: 'Finance' },
  { id: 'salary', name: 'Salary Calculator', description: 'Convert between hourly, monthly, and annual salary figures.', icon: 'Wallet', path: '/salary-calculator', category: 'Finance' },
  { id: 'tip', name: 'Tip Calculator', description: 'Calculate tips and split bills among multiple people.', icon: 'Receipt', path: '/tip-calculator', category: 'Finance' },
  { id: 'auto-loan', name: 'Auto Loan Calculator', description: 'Calculate auto loan payments with down payment and trade-in values.', icon: 'Car', path: '/auto-loan-calculator', category: 'Finance' },
  { id: 'interest', name: 'Interest Calculator', description: 'Calculate simple and compound interest with various frequencies.', icon: 'Percent', path: '/interest-calculator', category: 'Finance' },
  { id: 'payment', name: 'Payment Calculator', description: 'Calculate loan payments for monthly, bi-weekly, or weekly schedules.', icon: 'DollarSign', path: '/payment-calculator', category: 'Finance' },
  { id: 'retirement', name: 'Retirement Calculator', description: 'Plan retirement savings and estimate future income with the 4% rule.', icon: 'Landmark', path: '/retirement-calculator', category: 'Finance' },
  { id: 'emi', name: 'EMI Calculator', description: 'Calculate Equated Monthly Installments for loans.', icon: 'CreditCard', path: '/emi-calculator', category: 'Finance' },
  { id: 'sip', name: 'SIP Calculator', description: 'Calculate returns on Systematic Investment Plan investments.', icon: 'PiggyBank', path: '/sip-calculator', category: 'Finance' },
  { id: 'gst', name: 'GST Calculator', description: 'Calculate Goods and Services Tax for any amount.', icon: 'Receipt', path: '/gst-calculator', category: 'Finance' },
  { id: 'budget', name: 'Budget Calculator', description: 'Plan and track your monthly budget.', icon: 'Wallet', path: '/budget-calculator', category: 'Finance' },
  { id: 'roi', name: 'ROI Calculator', description: 'Calculate Return on Investment for any investment.', icon: 'TrendingUp', path: '/roi-calculator', category: 'Finance' },
  { id: 'currency', name: 'Currency Converter', description: 'Convert between world currencies with live rates.', icon: 'DollarSign', path: '/currency-converter', category: 'Finance' },
  { id: 'crypto', name: 'Crypto Converter', description: 'Convert cryptocurrency to fiat currency.', icon: 'Bitcoin', path: '/crypto-converter', category: 'Finance' },
  { id: 'tax', name: 'Tax Calculator', description: 'Calculate federal and state income taxes.', icon: 'FileSpreadsheet', path: '/tax-calculator', category: 'Finance' },
  { id: 'amortization', name: 'Amortization Calculator', description: 'Generate complete amortization schedules.', icon: 'BarChart3', path: '/amortization-calculator', category: 'Finance' },
  { id: 'inflation', name: 'Inflation Calculator', description: 'Calculate the future value of money accounting for inflation.', icon: 'TrendingUp', path: '/inflation-calculator', category: 'Finance' },
  { id: 'net-worth', name: 'Net Worth Calculator', description: 'Calculate your total net worth.', icon: 'TrendingUp', path: '/net-worth-calculator', category: 'Finance' },
  { id: 'stock-profit', name: 'Stock Profit Calculator', description: 'Calculate stock trading profits and returns.', icon: 'BarChart3', path: '/stock-profit-calculator', category: 'Finance' },
  { id: 'dividend', name: 'Dividend Calculator', description: 'Calculate dividend income and yield.', icon: 'PiggyBank', path: '/dividend-calculator', category: 'Finance' },
  { id: 'bond-yield', name: 'Bond Yield Calculator', description: 'Calculate bond yields and returns.', icon: 'FileSpreadsheet', path: '/bond-yield-calculator', category: 'Finance' },
  { id: 'debt-payoff', name: 'Debt Payoff Calculator', description: 'Plan your debt payoff strategy.', icon: 'CreditCard', path: '/debt-payoff-calculator', category: 'Finance' },
  { id: 'emergency-fund', name: 'Emergency Fund Calculator', description: 'Calculate your emergency fund needs.', icon: 'PiggyBank', path: '/emergency-fund-calculator', category: 'Finance' },
  { id: 'savings-goal', name: 'Savings Goal Calculator', description: 'Plan savings for your goals.', icon: 'PiggyBank', path: '/savings-goal-calculator', category: 'Finance' },
  { id: 'home-affordability', name: 'Home Affordability Calculator', description: 'Calculate how much home you can afford.', icon: 'Home', path: '/home-affordability-calculator', category: 'Finance' },
  { id: 'rule-of-72', name: 'Rule of 72 Calculator', description: 'Calculate investment doubling time.', icon: 'Calculator', path: '/rule-of-72-calculator', category: 'Finance' },
  { id: 'compound-growth', name: 'Compound Growth Calculator', description: 'Calculate compound growth over time.', icon: 'TrendingUp', path: '/compound-growth-calculator', category: 'Finance' },
  { id: 'fire', name: 'FIRE Calculator', description: 'Financial Independence, Retire Early planning.', icon: 'Flame', path: '/fire-calculator', category: 'Finance' },
  { id: 'coast-fire', name: 'Coast FIRE Calculator', description: 'Calculate when you can stop saving and coast to retirement.', icon: 'Flame', path: '/coast-fire-calculator', category: 'Finance' },
  { id: 'lean-fire', name: 'Lean FIRE Calculator', description: 'Minimalist financial independence calculator.', icon: 'Flame', path: '/lean-fire-calculator', category: 'Finance' },
  { id: 'fat-fire', name: 'Fat FIRE Calculator', description: 'Luxury retirement financial planning.', icon: 'Flame', path: '/fat-fire-calculator', category: 'Finance' },
  { id: 'crypto-portfolio', name: 'Crypto Portfolio Calculator', description: 'Track and analyze crypto holdings.', icon: 'Bitcoin', path: '/crypto-portfolio-calculator', category: 'Finance' },
  { id: 'defi-yield', name: 'DeFi Yield Calculator', description: 'Calculate yields from DeFi staking and farming.', icon: 'Bitcoin', path: '/defi-yield-calculator', category: 'Finance' },
  { id: 'nft-profit', name: 'NFT Profit Calculator', description: 'Calculate NFT trading profits and fees.', icon: 'Bitcoin', path: '/nft-profit-calculator', category: 'Finance' },
  { id: 'staking-rewards', name: 'Staking Rewards Calculator', description: 'Calculate crypto staking earnings.', icon: 'Bitcoin', path: '/staking-rewards-calculator', category: 'Finance' },
  { id: 'gas-fee', name: 'Gas Fee Calculator', description: 'Estimate Ethereum transaction costs.', icon: 'Fuel', path: '/gas-fee-calculator', category: 'Finance' },
  { id: 'dca', name: 'Dollar Cost Averaging Calculator', description: 'Plan DCA investment strategy.', icon: 'TrendingUp', path: '/dca-calculator', category: 'Finance' },
  { id: 'side-hustle', name: 'Side Hustle Calculator', description: 'Track income from multiple side hustles.', icon: 'Wallet', path: '/side-hustle-calculator', category: 'Finance' },
  { id: 'freelance-rate', name: 'Freelance Rate Calculator', description: 'Calculate your freelance hourly rate.', icon: 'DollarSign', path: '/freelance-rate-calculator', category: 'Finance' },
  { id: 'invoice', name: 'Invoice Generator', description: 'Create and calculate invoices.', icon: 'FileText', path: '/invoice-generator', category: 'Finance' },
  { id: 'hourly-to-salary', name: 'Hourly to Salary Converter', description: 'Convert between hourly and annual pay.', icon: 'ArrowLeftRight', path: '/hourly-to-salary-converter', category: 'Finance' },
  { id: 'take-home-pay', name: 'Take Home Pay Calculator', description: 'Calculate net pay after taxes.', icon: 'Wallet', path: '/take-home-pay-calculator', category: 'Finance' },
  { id: 'paycheck', name: 'Paycheck Calculator', description: 'Calculate your net paycheck.', icon: 'Receipt', path: '/paycheck-calculator', category: 'Finance' },
  { id: 'overtime', name: 'Overtime Calculator', description: 'Calculate overtime pay and earnings.', icon: 'Clock', path: '/overtime-calculator', category: 'Finance' },
  { id: 'commission', name: 'Commission Calculator', description: 'Calculate sales commission earnings.', icon: 'TrendingUp', path: '/commission-calculator', category: 'Finance' },
  { id: 'subscription-cost', name: 'Subscription Cost Calculator', description: 'Track and manage subscription expenses.', icon: 'CreditCard', path: '/subscription-cost-calculator', category: 'Finance' },
  { id: 'cost-per-use', name: 'Cost Per Use Calculator', description: 'Calculate the true value of purchases.', icon: 'Calculator', path: '/cost-per-use-calculator', category: 'Finance' },
  { id: 'rent-affordability', name: 'Rent Affordability Calculator', description: 'Find how much rent you can afford.', icon: 'Home', path: '/rent-affordability-calculator', category: 'Finance' },
  { id: 'utility-bill-splitter', name: 'Utility Bill Splitter', description: 'Split utility bills among roommates.', icon: 'Users', path: '/utility-bill-splitter', category: 'Finance' },
  { id: 'wealth-tax', name: 'Wealth Tax Calculator', description: 'Calculate wealth tax liability.', icon: 'Landmark', path: '/wealth-tax-calculator', category: 'Finance' },
  { id: 'estate-tax', name: 'Estate Tax Calculator', description: 'Estimate federal estate tax.', icon: 'Landmark', path: '/estate-tax-calculator', category: 'Finance' },
  { id: 'gift-tax', name: 'Gift Tax Calculator', description: 'Calculate gift tax and exemptions.', icon: 'Heart', path: '/gift-tax-calculator', category: 'Finance' },

  // ===== HEALTH (26 tools) =====
  { id: 'bmi', name: 'BMI Calculator', description: 'Calculate Body Mass Index and understand your weight category.', icon: 'Scale', path: '/bmi-calculator', category: 'Health' },
  { id: 'calorie', name: 'Calorie Calculator', description: 'Estimate daily caloric needs based on your activity level.', icon: 'Flame', path: '/calorie-calculator', category: 'Health' },
  { id: 'bmr', name: 'BMR Calculator', description: 'Calculate your Basal Metabolic Rate for fitness planning.', icon: 'Activity', path: '/bmr-calculator', category: 'Health' },
  { id: 'body-fat', name: 'Body Fat Calculator', description: 'Estimate body fat percentage using various methods.', icon: 'Dumbbell', path: '/body-fat-calculator', category: 'Health' },
  { id: 'ideal-weight', name: 'Ideal Weight', description: 'Find your ideal body weight based on height and frame.', icon: 'Heart', path: '/ideal-weight-calculator', category: 'Health' },
  { id: 'pace', name: 'Pace Calculator', description: 'Calculate running/cycling pace and speed from distance and time.', icon: 'Timer', path: '/pace-calculator', category: 'Health' },
  { id: 'pregnancy', name: 'Pregnancy Calculator', description: 'Calculate due date and track pregnancy progress week by week.', icon: 'Baby', path: '/pregnancy-calculator', category: 'Health' },
  { id: 'conception', name: 'Conception Calculator', description: 'Estimate conception date from your due date.', icon: 'Heart', path: '/conception-calculator', category: 'Health' },
  { id: 'due-date', name: 'Due Date Calculator', description: 'Calculate pregnancy due date using multiple methods.', icon: 'Calendar', path: '/due-date-calculator', category: 'Health' },
  { id: 'water-intake', name: 'Water Intake Calculator', description: 'Calculate daily water intake needs based on weight and activity.', icon: 'Droplet', path: '/water-intake-calculator', category: 'Health' },
  { id: 'macro', name: 'Macro Calculator', description: 'Calculate daily macronutrient needs for your diet goals.', icon: 'Utensils', path: '/macro-calculator', category: 'Health' },
  { id: 'sleep', name: 'Sleep Calculator', description: 'Calculate optimal sleep and wake times based on sleep cycles.', icon: 'Moon', path: '/sleep-calculator', category: 'Health' },
  { id: 'tdee', name: 'TDEE Calculator', description: 'Calculate Total Daily Energy Expenditure for weight management.', icon: 'Activity', path: '/tdee-calculator', category: 'Health' },
  { id: 'one-rep-max', name: 'One Rep Max Calculator', description: 'Calculate your one-rep max for weightlifting.', icon: 'Dumbbell', path: '/one-rep-max-calculator', category: 'Health' },
  { id: 'heart-rate', name: 'Heart Rate Zone Calculator', description: 'Calculate training heart rate zones for cardio workouts.', icon: 'Heart', path: '/heart-rate-zone-calculator', category: 'Health' },
  { id: 'ovulation', name: 'Ovulation Calculator', description: 'Calculate ovulation and fertile window dates.', icon: 'Calendar', path: '/ovulation-calculator', category: 'Health' },
  { id: 'period', name: 'Period Calculator', description: 'Track and predict menstrual cycle dates.', icon: 'CalendarDays', path: '/period-calculator', category: 'Health' },
  { id: 'bac', name: 'BAC Calculator', description: 'Estimate blood alcohol content based on drinks.', icon: 'AlertTriangle', path: '/bac-calculator', category: 'Health' },
  { id: 'weight-loss', name: 'Weight Loss Calculator', description: 'Plan weight loss timeline and milestones.', icon: 'TrendingDown', path: '/weight-loss-calculator', category: 'Health' },
  { id: 'caffeine', name: 'Caffeine Calculator', description: 'Track your daily caffeine intake.', icon: 'Coffee', path: '/caffeine-calculator', category: 'Health' },
  { id: 'calorie-burn', name: 'Calorie Burn Calculator', description: 'Calculate calories burned during activities.', icon: 'Flame', path: '/calorie-burn-calculator', category: 'Health' },
  { id: 'lean-body-mass', name: 'Lean Body Mass Calculator', description: 'Calculate your lean body mass.', icon: 'Dumbbell', path: '/lean-body-mass-calculator', category: 'Health' },
  { id: 'sleep-cycle', name: 'Sleep Cycle Calculator', description: 'Optimize your sleep cycles.', icon: 'Moon', path: '/sleep-cycle-calculator', category: 'Health' },
  { id: 'vo2-max', name: 'VO2 Max Calculator', description: 'Estimate your cardiovascular fitness.', icon: 'Activity', path: '/vo2-max-calculator', category: 'Health' },
  { id: 'running-calorie', name: 'Running Calorie Calculator', description: 'Calculate calories burned while running.', icon: 'Flame', path: '/running-calorie-calculator', category: 'Health' },
  { id: 'pregnancy-weight', name: 'Pregnancy Weight Calculator', description: 'Track healthy pregnancy weight gain.', icon: 'Baby', path: '/pregnancy-weight-calculator', category: 'Health' },

  // ===== MATH (27 tools) =====
  { id: 'scientific', name: 'Scientific Calculator', description: 'Advanced calculations with trigonometry, logarithms, and more.', icon: 'Calculator', path: '/scientific-calculator', category: 'Math' },
  { id: 'percentage', name: 'Percentage Calculator', description: 'Calculate percentages, increases, decreases, and differences.', icon: 'Percent', path: '/percentage-calculator', category: 'Math' },
  { id: 'fraction', name: 'Fraction Calculator', description: 'Add, subtract, multiply, and divide fractions easily.', icon: 'Divide', path: '/fraction-calculator', category: 'Math' },
  { id: 'random', name: 'Random Number Generator', description: 'Generate random numbers with custom range and quantity options.', icon: 'Shuffle', path: '/random-number-generator', category: 'Math' },
  { id: 'triangle', name: 'Triangle Calculator', description: 'Calculate triangle area, perimeter, angles, and type from side lengths.', icon: 'Triangle', path: '/triangle-calculator', category: 'Math' },
  { id: 'std-dev', name: 'Standard Deviation', description: 'Calculate mean, variance, standard deviation, and other statistics.', icon: 'BarChart3', path: '/standard-deviation-calculator', category: 'Math' },
  { id: 'quadratic', name: 'Quadratic Equation Solver', description: 'Solve quadratic equations and find roots.', icon: 'Calculator', path: '/quadratic-calculator', category: 'Math' },
  { id: 'prime', name: 'Prime Number Checker', description: 'Check if a number is prime and find factors.', icon: 'Hash', path: '/prime-checker', category: 'Math' },
  { id: 'lcm-gcd', name: 'LCM & GCD Calculator', description: 'Calculate Least Common Multiple and Greatest Common Divisor.', icon: 'Hash', path: '/lcm-gcd-calculator', category: 'Math' },
  { id: 'binary', name: 'Binary/Hex Converter', description: 'Convert between binary, octal, decimal, and hexadecimal.', icon: 'Binary', path: '/binary-hex-converter', category: 'Math' },
  { id: 'logarithm', name: 'Logarithm Calculator', description: 'Calculate logarithms and antilogarithms.', icon: 'SquareFunction', path: '/logarithm-calculator', category: 'Math' },
  { id: 'exponent', name: 'Exponent Calculator', description: 'Calculate powers, roots, and exponents.', icon: 'SquareFunction', path: '/exponent-calculator', category: 'Math' },
  { id: 'permutation-combination', name: 'Permutation & Combination', description: 'Calculate nPr and nCr for probability.', icon: 'Shuffle', path: '/permutation-combination-calculator', category: 'Math' },
  { id: 'matrix', name: 'Matrix Calculator', description: 'Add, subtract, multiply matrices and find determinants.', icon: 'Grid3x3', path: '/matrix-calculator', category: 'Math' },
  { id: 'wave', name: 'Wave Calculator', description: 'Calculate wave frequency, wavelength, and velocity.', icon: 'Waves', path: '/wave-calculator', category: 'Math' },
  { id: 'vector', name: 'Vector Calculator', description: 'Calculate 2D/3D vector operations.', icon: 'Atom', path: '/vector-calculator', category: 'Math' },
  { id: 'circle', name: 'Circle Calculator', description: 'Calculate circle area, circumference, and diameter.', icon: 'Circle', path: '/circle-calculator', category: 'Math' },
  { id: 'factorial', name: 'Factorial Calculator', description: 'Calculate factorials of numbers.', icon: 'Hash', path: '/factorial-calculator', category: 'Math' },
  { id: 'mean-median-mode', name: 'Mean Median Mode Calculator', description: 'Calculate statistical measures.', icon: 'BarChart3', path: '/mean-median-mode-calculator', category: 'Math' },
  { id: 'probability', name: 'Probability Calculator', description: 'Calculate probability and odds.', icon: 'Dice5', path: '/probability-calculator', category: 'Math' },
  { id: 'pythagorean', name: 'Pythagorean Calculator', description: 'Calculate using the Pythagorean theorem.', icon: 'Triangle', path: '/pythagorean-calculator', category: 'Math' },
  { id: 'quadratic-solver', name: 'Quadratic Solver', description: 'Solve quadratic equations step by step.', icon: 'Calculator', path: '/quadratic-solver', category: 'Math' },
  { id: 'roman-numeral', name: 'Roman Numeral Converter', description: 'Convert between Roman and Arabic numerals.', icon: 'Hash', path: '/roman-numeral-converter', category: 'Math' },
  { id: 'sphere', name: 'Sphere Calculator', description: 'Calculate sphere volume and surface area.', icon: 'Circle', path: '/sphere-calculator', category: 'Math' },
  { id: 'trigonometry', name: 'Trigonometry Calculator', description: 'Calculate trigonometric functions.', icon: 'Triangle', path: '/trigonometry-calculator', category: 'Math' },
  { id: 'gcd-lcm', name: 'GCD LCM Calculator', description: 'Find GCD and LCM of numbers.', icon: 'Hash', path: '/gcd-lcm-calculator', category: 'Math' },
  { id: 'permutation', name: 'Permutation Calculator', description: 'Calculate permutations and combinations.', icon: 'Shuffle', path: '/permutation-calculator', category: 'Math' },

  // ===== TEXT (11 tools) =====
  { id: 'word-count', name: 'Word Counter', description: 'Count words, characters, sentences, and reading time.', icon: 'FileText', path: '/word-counter', category: 'Text' },
  { id: 'lorem', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text for designs.', icon: 'FileText', path: '/lorem-ipsum-generator', category: 'Text' },
  { id: 'uuid', name: 'UUID Generator', description: 'Generate unique identifiers (UUID/GUID).', icon: 'Key', path: '/uuid-generator', category: 'Text' },
  { id: 'color-picker', name: 'Color Picker', description: 'Pick colors and convert between HEX, RGB, HSL, CMYK.', icon: 'Palette', path: '/color-picker', category: 'Text' },
  { id: 'json', name: 'JSON Formatter', description: 'Format, validate, and minify JSON data.', icon: 'Code', path: '/json-formatter', category: 'Text' },
  { id: 'readability', name: 'Readability Calculator', description: 'Analyze text readability with multiple indices.', icon: 'FileText', path: '/readability-calculator', category: 'Text' },
  { id: 'slug', name: 'Slug Generator', description: 'Generate SEO-friendly URL slugs.', icon: 'Link2', path: '/slug-generator', category: 'Text' },
  { id: 'text-scrambler', name: 'Text Scrambler', description: 'Scramble text in various modes.', icon: 'Shuffle', path: '/text-scrambler', category: 'Text' },
  { id: 'duplicate-remover', name: 'Duplicate Remover', description: 'Remove duplicate lines from text.', icon: 'FileText', path: '/duplicate-remover', category: 'Text' },
  { id: 'text-reverser', name: 'Text Reverser', description: 'Reverse text characters or words.', icon: 'ArrowLeftRight', path: '/text-reverser', category: 'Text' },
  { id: 'text-sorter', name: 'Text Sorter', description: 'Sort text lines alphabetically.', icon: 'ArrowDown', path: '/text-sorter', category: 'Text' },

  // ===== TECH (13 tools) =====
  { id: 'qr', name: 'QR Code Generator', description: 'Generate QR codes for URLs, text, and more.', icon: 'QrCode', path: '/qr-code-generator', category: 'Tech' },
  { id: 'hash', name: 'Hash Generator', description: 'Generate SHA-1, SHA-256, SHA-512 hashes.', icon: 'Hash', path: '/hash-generator', category: 'Tech' },
  { id: 'ip-subnet', name: 'IP Subnet Calculator', description: 'Calculate subnet information from IP addresses.', icon: 'Server', path: '/ip-subnet-calculator', category: 'Tech' },
  { id: 'json-formatter', name: 'JSON Formatter Calculator', description: 'Format, validate, and analyze JSON.', icon: 'FileCode', path: '/json-formatter-calculator', category: 'Tech' },
  { id: 'hash-generator', name: 'Hash Generator Calculator', description: 'Generate multiple hash types for text.', icon: 'Hash', path: '/hash-generator-calculator', category: 'Tech' },
  { id: 'power', name: 'Power Calculator', description: 'Calculate electrical power using Ohms law.', icon: 'Zap', path: '/power-calculator', category: 'Tech' },
  { id: 'base64', name: 'Base64 Encoder', description: 'Encode and decode Base64 strings.', icon: 'Code', path: '/base64-encoder', category: 'Tech' },
  { id: 'color-converter', name: 'Color Converter', description: 'Convert between color formats.', icon: 'Palette', path: '/color-converter', category: 'Tech' },
  { id: 'markdown', name: 'Markdown Previewer', description: 'Preview and convert Markdown.', icon: 'FileText', path: '/markdown-previewer', category: 'Tech' },
  { id: 'number-base', name: 'Number Base Converter', description: 'Convert between number bases.', icon: 'Binary', path: '/number-base-converter', category: 'Tech' },
  { id: 'password', name: 'Password Generator', description: 'Generate secure random passwords.', icon: 'Key', path: '/password-generator', category: 'Tech' },
  { id: 'regex', name: 'Regex Tester', description: 'Test regular expressions.', icon: 'Regex', path: '/regex-tester', category: 'Tech' },
  { id: 'url-encoder', name: 'URL Encoder', description: 'Encode and decode URLs.', icon: 'Link2', path: '/url-encoder', category: 'Tech' },

  // ===== SUSTAINABILITY (9 tools) =====
  { id: 'solar', name: 'Solar Panel Calculator', description: 'Calculate solar system size and savings.', icon: 'Sun', path: '/solar-panel-calculator', category: 'Sustainability' },
  { id: 'ev', name: 'EV Savings Calculator', description: 'Compare electric vs gas vehicle costs.', icon: 'Car', path: '/ev-savings-calculator', category: 'Sustainability' },
  { id: 'carbon', name: 'Carbon Footprint Calculator', description: 'Calculate your annual CO2 emissions.', icon: 'Leaf', path: '/carbon-footprint-calculator', category: 'Sustainability' },
  { id: 'compost', name: 'Compost Calculator', description: 'Calculate optimal composting ratios.', icon: 'Leaf', path: '/compost-calculator', category: 'Sustainability' },
  { id: 'solar-roi', name: 'Solar ROI Calculator', description: 'Calculate solar panel return on investment.', icon: 'Sun', path: '/solar-roi-calculator', category: 'Sustainability' },
  { id: 'rainwater', name: 'Rainwater Calculator', description: 'Calculate rainwater harvesting potential.', icon: 'Droplet', path: '/rainwater-calculator', category: 'Sustainability' },
  { id: 'plastic-footprint', name: 'Plastic Footprint Calculator', description: 'Track your weekly plastic usage.', icon: 'Footprints', path: '/plastic-footprint-calculator', category: 'Sustainability' },
  { id: 'electricity-usage', name: 'Electricity Usage Calculator', description: 'Calculate electricity usage and costs.', icon: 'Zap', path: '/electricity-usage-calculator', category: 'Sustainability' },
  { id: 'tree-carbon', name: 'Tree Carbon Calculator', description: 'Calculate carbon absorbed by trees.', icon: 'Trees', path: '/tree-carbon-calculator', category: 'Sustainability' },

  // ===== REAL ESTATE (7 tools) =====
  { id: 'flooring', name: 'Flooring Calculator', description: 'Calculate flooring materials and costs.', icon: 'Square', path: '/flooring-calculator', category: 'Real Estate' },
  { id: 'rental-yield', name: 'Rental Yield Calculator', description: 'Calculate rental property returns.', icon: 'Building2', path: '/rental-yield-calculator', category: 'Real Estate' },
  { id: 'paint', name: 'Paint Calculator', description: 'Calculate how much paint you need for a room.', icon: 'PaintBucket', path: '/paint-calculator', category: 'Real Estate' },
  { id: 'concrete', name: 'Concrete Calculator', description: 'Calculate concrete volume for slabs and footings.', icon: 'Cuboid', path: '/concrete-calculator', category: 'Real Estate' },
  { id: 'fence', name: 'Fence Calculator', description: 'Calculate fencing materials needed.', icon: 'Fence', path: '/fence-calculator', category: 'Real Estate' },
  { id: 'tile', name: 'Tile Calculator', description: 'Calculate tiles needed for a project.', icon: 'Grid3x3', path: '/tile-calculator', category: 'Real Estate' },
  { id: 'wallpaper', name: 'Wallpaper Calculator', description: 'Calculate wallpaper rolls needed.', icon: 'Layers', path: '/wallpaper-calculator', category: 'Real Estate' },

  // ===== FUN (17 tools) =====
  { id: 'dice', name: 'Dice Roller', description: 'Roll virtual dice for games.', icon: 'Dice5', path: '/dice-roller', category: 'Fun' },
  { id: 'random-picker', name: 'Random Picker', description: 'Pick random items from a list.', icon: 'Shuffle', path: '/random-picker', category: 'Fun' },
  { id: 'coin', name: 'Coin Flip', description: 'Flip a virtual coin.', icon: 'Coins', path: '/coin-flip', category: 'Fun' },
  { id: 'love', name: 'Love Calculator', description: 'Calculate love compatibility (just for fun!).', icon: 'Heart', path: '/love-calculator', category: 'Fun' },
  { id: 'zodiac', name: 'Zodiac Finder', description: 'Find your zodiac sign from birth date.', icon: 'Star', path: '/zodiac-finder', category: 'Fun' },
  { id: 'numerology', name: 'Numerology Calculator', description: 'Calculate life path and name numbers.', icon: 'Sparkles', path: '/numerology-calculator', category: 'Fun' },
  { id: 'magic8', name: 'Magic 8-Ball', description: 'Ask yes/no questions.', icon: 'CircleDot', path: '/magic-8-ball', category: 'Fun' },
  { id: 'baby-name', name: 'Baby Name Generator', description: 'Generate baby name suggestions.', icon: 'Baby', path: '/baby-name-generator', category: 'Fun' },
  { id: 'pet-age', name: 'Pet Age Calculator', description: 'Convert pet years to human years.', icon: 'Dog', path: '/pet-age-calculator', category: 'Fun' },
  { id: 'lottery-odds', name: 'Lottery Odds Calculator', description: 'Calculate lottery jackpot odds.', icon: 'Dice5', path: '/lottery-odds-calculator', category: 'Fun' },
  { id: 'spin-wheel', name: 'Spin the Wheel', description: 'Spin a customizable decision wheel.', icon: 'CircleDot', path: '/spin-the-wheel', category: 'Fun' },
  { id: 'secret-santa', name: 'Secret Santa Generator', description: 'Generate Secret Santa gift assignments.', icon: 'Heart', path: '/secret-santa-generator', category: 'Fun' },
  { id: 'dog-age', name: 'Dog Age Calculator', description: 'Convert dog years to human years.', icon: 'Dog', path: '/dog-age-calculator', category: 'Fun' },
  { id: 'compatibility', name: 'Compatibility Calculator', description: 'Calculate love compatibility between names.', icon: 'Stars', path: '/compatibility-calculator', category: 'Fun' },
  { id: 'reaction-time', name: 'Reaction Time Game', description: 'Test your reaction speed.', icon: 'Gamepad2', path: '/reaction-time-game', category: 'Fun' },
  { id: 'team-randomizer', name: 'Team Randomizer', description: 'Randomly assign teams.', icon: 'Users', path: '/team-randomizer', category: 'Fun' },
  { id: 'would-you-rather', name: 'Would You Rather', description: 'Fun would you rather questions.', icon: 'MessageCircle', path: '/would-you-rather', category: 'Fun' },

  // ===== CONVERTER (16 tools) =====
  { id: 'unit', name: 'Unit Converter', description: 'Convert between length, weight, temperature, speed, and more.', icon: 'ArrowLeftRight', path: '/unit-converter', category: 'Converter' },
  { id: 'conversion', name: 'Conversion Calculator', description: 'Convert between different units of measurement.', icon: 'ArrowLeftRight', path: '/conversion-calculator', category: 'Converter' },
  { id: 'cooking', name: 'Cooking Converter', description: 'Convert cooking measurements (cups, tbsp, ml).', icon: 'ChefHat', path: '/cooking-converter', category: 'Converter' },
  { id: 'temperature', name: 'Temperature Converter', description: 'Convert between Celsius, Fahrenheit, and Kelvin.', icon: 'Thermometer', path: '/temperature-converter', category: 'Converter' },
  { id: 'length', name: 'Length Converter', description: 'Convert between length units.', icon: 'Ruler', path: '/length-converter', category: 'Converter' },
  { id: 'time', name: 'Time Converter', description: 'Convert between time units.', icon: 'Clock', path: '/time-converter', category: 'Converter' },
  { id: 'pressure', name: 'Pressure Converter', description: 'Convert between pressure units.', icon: 'Gauge', path: '/pressure-converter', category: 'Converter' },
  { id: 'angle', name: 'Angle Converter', description: 'Convert between angle units.', icon: 'Triangle', path: '/angle-converter', category: 'Converter' },
  { id: 'recipe-scaler', name: 'Recipe Scaler', description: 'Scale recipe ingredients up or down.', icon: 'UtensilsCrossed', path: '/recipe-scaler', category: 'Converter' },
  { id: 'frequency', name: 'Frequency Converter', description: 'Convert between frequency units.', icon: 'ArrowUpDown', path: '/frequency-converter', category: 'Converter' },
  { id: 'area', name: 'Area Converter', description: 'Convert between area units.', icon: 'Square', path: '/area-converter', category: 'Converter' },
  { id: 'data', name: 'Data Storage Converter', description: 'Convert between data storage units.', icon: 'HardDrive', path: '/data-storage-converter', category: 'Converter' },
  { id: 'energy', name: 'Energy Converter', description: 'Convert between energy units.', icon: 'Battery', path: '/energy-converter', category: 'Converter' },
  { id: 'speed', name: 'Speed Converter', description: 'Convert between speed units.', icon: 'Gauge', path: '/speed-converter', category: 'Converter' },
  { id: 'weight', name: 'Weight Converter', description: 'Convert between weight units.', icon: 'Weight', path: '/weight-converter', category: 'Converter' },
  { id: 'shoe-size', name: 'Shoe Size Converter', description: 'Convert between shoe size standards.', icon: 'Ruler', path: '/shoe-size-converter', category: 'Converter' },

  // ===== OTHER (37 tools) =====
  { id: 'age', name: 'Age Calculator', description: 'Calculate exact age in years, months, and days.', icon: 'CalendarDays', path: '/age-calculator', category: 'Other' },
  { id: 'date', name: 'Date Calculator', description: 'Find the difference between dates or add/subtract days.', icon: 'Calendar', path: '/date-calculator', category: 'Other' },
  { id: 'gpa', name: 'GPA Calculator', description: 'Calculate Grade Point Average for academic planning.', icon: 'GraduationCap', path: '/gpa-calculator', category: 'Other' },
  { id: 'cgpa', name: 'CGPA Calculator', description: 'Convert CGPA to percentage and grades.', icon: 'GraduationCap', path: '/cgpa-calculator', category: 'Other' },
  { id: 'discount', name: 'Discount Calculator', description: 'Calculate sale prices and savings from discounts.', icon: 'BadgePercent', path: '/discount-calculator', category: 'Other' },
  { id: 'time-calc', name: 'Time Calculator', description: 'Add or subtract time durations with multiple format outputs.', icon: 'Clock', path: '/time-calculator', category: 'Other' },
  { id: 'hours', name: 'Hours Calculator', description: 'Calculate work hours and earnings from time entries.', icon: 'Clock3', path: '/hours-calculator', category: 'Other' },
  { id: 'grade', name: 'Grade Calculator', description: 'Calculate grades, percentages, GPA, and weighted averages.', icon: 'GraduationCap', path: '/grade-calculator', category: 'Other' },
  { id: 'subnet', name: 'Subnet Calculator', description: 'Calculate subnet mask, network address, and available hosts.', icon: 'Network', path: '/subnet-calculator', category: 'Other' },
  { id: 'fuel-cost', name: 'Fuel Cost Calculator', description: 'Calculate fuel costs for trips based on distance.', icon: 'Fuel', path: '/fuel-cost-calculator', category: 'Other' },
  { id: 'electricity-bill', name: 'Electricity Bill Calculator', description: 'Estimate electricity costs based on appliance usage.', icon: 'Zap', path: '/electricity-bill-calculator', category: 'Other' },
  { id: 'tip-split', name: 'Tip Split Calculator', description: 'Split bills and calculate tips for groups.', icon: 'Receipt', path: '/tip-split-calculator', category: 'Other' },
  { id: 'world-clock', name: 'World Clock', description: 'View time across different timezones.', icon: 'Globe', path: '/world-clock', category: 'Other' },
  { id: 'countdown', name: 'Countdown Timer', description: 'Set countdowns with notifications.', icon: 'Timer', path: '/countdown-timer', category: 'Other' },
  { id: 'stopwatch', name: 'Stopwatch', description: 'Precise stopwatch with lap times.', icon: 'Timer', path: '/stopwatch', category: 'Other' },
  { id: 'distance', name: 'Distance Calculator', description: 'Calculate distance between coordinates.', icon: 'Map', path: '/distance-calculator', category: 'Other' },
  { id: 'countdown-calc', name: 'Countdown Calculator', description: 'Count days until an event.', icon: 'Timer', path: '/countdown-calculator', category: 'Other' },
  { id: 'life-stats', name: 'Life Stats Calculator', description: 'Fascinating statistics about your life.', icon: 'Hourglass', path: '/life-stats-calculator', category: 'Other' },
  { id: 'package-dimension', name: 'Package Dimension Calculator', description: 'Calculate shipping dimensions and volume.', icon: 'Box', path: '/package-dimension-calculator', category: 'Other' },
  { id: 'split-time', name: 'Split Time Calculator', description: 'Analyze lap and split times.', icon: 'Timer', path: '/stopwatch-calculator', category: 'Other' },
  { id: 'car-depreciation', name: 'Car Depreciation Calculator', description: 'Calculate vehicle depreciation over time.', icon: 'Car', path: '/car-depreciation-calculator', category: 'Other' },
  { id: 'mpg', name: 'MPG Calculator', description: 'Calculate miles per gallon fuel efficiency.', icon: 'Fuel', path: '/mpg-calculator', category: 'Other' },
  { id: 'reading-speed', name: 'Reading Speed Calculator', description: 'Calculate your reading speed.', icon: 'FileText', path: '/reading-speed-calculator', category: 'Other' },
  { id: 'typing', name: 'Typing Speed Calculator', description: 'Test your typing speed.', icon: 'Keyboard', path: '/typing-speed-calculator', category: 'Other' },
  { id: 'timezone', name: 'Timezone Converter', description: 'Convert times between timezones.', icon: 'Globe', path: '/timezone-converter', category: 'Other' },
  { id: 'unix-timestamp', name: 'Unix Timestamp Converter', description: 'Convert Unix timestamps to dates.', icon: 'Clock', path: '/unix-timestamp-converter', category: 'Other' },
  { id: 'weighted-gpa', name: 'Weighted GPA Calculator', description: 'Calculate weighted GPA with honors/AP.', icon: 'GraduationCap', path: '/weighted-gpa-calculator', category: 'Other' },
  { id: 'workdays', name: 'Workdays Calculator', description: 'Calculate business days between dates.', icon: 'Calendar', path: '/workdays-calculator', category: 'Other' },
  { id: 'pool-volume', name: 'Pool Volume Calculator', description: 'Calculate pool water volume.', icon: 'Droplet', path: '/pool-volume-calculator', category: 'Other' },
  { id: 'mulch', name: 'Mulch Calculator', description: 'Calculate mulch needed for landscaping.', icon: 'Leaf', path: '/mulch-calculator', category: 'Other' },
  { id: 'rainwater-harvest', name: 'Rainwater Harvest Calculator', description: 'Calculate rainwater collection potential.', icon: 'Droplet', path: '/rainwater-harvest-calculator', category: 'Other' },
  { id: 'score-keeper', name: 'Score Keeper', description: 'Keep track of game scores.', icon: 'BarChart3', path: '/score-keeper', category: 'Other' },
  { id: 'bracket', name: 'Bracket Generator', description: 'Generate tournament brackets.', icon: 'Grid3x3', path: '/bracket-generator', category: 'Other' },
  { id: 'magic-eight-ball', name: 'Magic Eight Ball', description: 'Ask the magic 8-ball questions.', icon: 'CircleDot', path: '/magic-eight-ball', category: 'Other' },
  { id: 'volume', name: 'Volume Converter', description: 'Convert between volume units.', icon: 'Box', path: '/volume-converter', category: 'Other' },
  { id: 'screen-time', name: 'Screen Time Calculator', description: 'Track and analyze screen time.', icon: 'Timer', path: '/screen-time-calculator', category: 'Other' },

  // ===== AI TOOLS (67+ tools) =====
  { id: 'ai-email', name: 'AI Email Generator', description: 'Draft professional emails instantly with AI.', icon: 'Mail', path: '/ai-email-generator', category: 'AI', isAI: true },
  { id: 'ai-cover-letter', name: 'AI Cover Letter Generator', description: 'Create tailored cover letters for your next job.', icon: 'Briefcase', path: '/ai-cover-letter-generator', category: 'AI', isAI: true },
  { id: 'ai-resume-summary', name: 'AI Resume Summary Generator', description: 'Produce impactful summaries for your resume.', icon: 'UserCircle', path: '/ai-resume-summary-generator', category: 'AI', isAI: true },
  { id: 'ai-product-description', name: 'AI Product Description Generator', description: 'Write compelling copy for your products.', icon: 'ShoppingBag', path: '/ai-product-description-generator', category: 'AI', isAI: true },
  { id: 'ai-slogan', name: 'AI Slogan Generator', description: 'Find a catchy tagline for your brand.', icon: 'Sparkles', path: '/ai-slogan-generator', category: 'AI', isAI: true },
  { id: 'ai-tweet', name: 'AI Tweet Generator', description: 'Generate engaging tweets for social media.', icon: 'Twitter', path: '/ai-tweet-generator', category: 'AI', isAI: true },
  { id: 'ai-instagram', name: 'AI Instagram Caption Generator', description: 'Create engaging captions for Instagram.', icon: 'Instagram', path: '/ai-instagram-caption-generator', category: 'AI', isAI: true },
  { id: 'ai-youtube-title', name: 'AI YouTube Title Generator', description: 'Generate high-CTR titles for YouTube.', icon: 'Youtube', path: '/ai-youtube-title-generator', category: 'AI', isAI: true },
  { id: 'ai-blog', name: 'AI Blog Post Generator', description: 'Draft complete blog posts with AI.', icon: 'FileEdit', path: '/ai-blog-post-generator', category: 'AI', isAI: true },
  { id: 'ai-meta', name: 'AI Meta Description Generator', description: 'Generate SEO-optimized meta tags.', icon: 'Search', path: '/ai-meta-description-generator', category: 'AI', isAI: true },
  { id: 'ai-paraphraser', name: 'AI Paraphraser', description: 'Rewrite and improve your text.', icon: 'RefreshCw', path: '/ai-paraphraser', category: 'AI', isAI: true },
  { id: 'ai-linkedin', name: 'AI LinkedIn Post Generator', description: 'Create engaging professional posts for LinkedIn.', icon: 'Linkedin', path: '/ai-linkedin-post-generator', category: 'AI', isAI: true },
  { id: 'ai-grammar', name: 'AI Grammar Checker', description: 'Fix grammar and spelling errors instantly.', icon: 'CheckSquare', path: '/ai-grammar-checker', category: 'AI', isAI: true },
  { id: 'ai-voice', name: 'AI Voice Transformer', description: 'Convert passive voice to active voice.', icon: 'Volume2', path: '/ai-voice-transformer', category: 'AI', isAI: true },
  { id: 'ai-sentence-expander', name: 'AI Sentence Expander', description: 'Add detail and depth to your writing.', icon: 'Maximize2', path: '/ai-sentence-expander', category: 'AI', isAI: true },
  { id: 'ai-sentence-shortener', name: 'AI Sentence Shortener', description: 'Make your writing concise and direct.', icon: 'Minimize2', path: '/ai-sentence-shortener', category: 'AI', isAI: true },
  { id: 'ai-essay-outline', name: 'AI Essay Outline Generator', description: 'Create logical, well-structured essay outlines.', icon: 'BookOpen', path: '/ai-essay-outline-generator', category: 'AI', isAI: true },
  { id: 'ai-meeting-notes', name: 'AI Meeting Notes Generator', description: 'Turn meeting transcripts into actionable notes.', icon: 'ClipboardList', path: '/ai-meeting-notes-generator', category: 'AI', isAI: true },
  { id: 'ai-story-starter', name: 'AI Story Starter Generator', description: 'Find your next great story idea with AI.', icon: 'PenTool', path: '/ai-story-starter-generator', category: 'AI', isAI: true },
  { id: 'ai-plot', name: 'AI Plot Generator', description: 'Generate complex and intriguing story plots.', icon: 'Map', path: '/ai-plot-generator', category: 'AI', isAI: true },
  { id: 'ai-poem', name: 'AI Poem Generator', description: 'Compose beautiful and evocative AI poetry.', icon: 'Feather', path: '/ai-poem-generator', category: 'AI', isAI: true },
  { id: 'ai-song-lyrics', name: 'AI Song Lyrics Generator', description: 'Write catchy and meaningful song lyrics.', icon: 'Music', path: '/ai-song-lyrics-generator', category: 'AI', isAI: true },
  { id: 'ai-joke', name: 'AI Joke Generator', description: 'Get a quick laugh with original AI jokes.', icon: 'Laugh', path: '/ai-joke-generator', category: 'AI', isAI: true },
  { id: 'ai-quote', name: 'AI Quote Generator', description: 'Generate inspirational and deep quotes.', icon: 'Quote', path: '/ai-quote-generator', category: 'AI', isAI: true },
  { id: 'ai-pickup-line', name: 'AI Pickup Line Generator', description: 'Break the ice with witty pickup lines.', icon: 'Heart', path: '/ai-pickup-line-generator', category: 'AI', isAI: true },
  { id: 'ai-band-name', name: 'AI Band Name Generator', description: 'Find the perfect name for your music project.', icon: 'Disc', path: '/ai-band-name-generator', category: 'AI', isAI: true },
  { id: 'ai-rap-name', name: 'AI Rap Name Generator', description: 'Get a unique and powerful stage name.', icon: 'Mic', path: '/ai-rap-name-generator', category: 'AI', isAI: true },
  { id: 'ai-username', name: 'AI Username Generator', description: 'Find unique and catchy handles for social media.', icon: 'AtSign', path: '/ai-username-generator', category: 'AI', isAI: true },
  { id: 'ai-color-palette', name: 'AI Color Palette Generator', description: 'Generate harmonious color schemes for design.', icon: 'Palette', path: '/ai-color-palette-generator', category: 'AI', isAI: true },
  { id: 'ai-meeting-agenda', name: 'AI Meeting Agenda Generator', description: 'Plan productive meetings with time-boxed agendas.', icon: 'Calendar', path: '/ai-meeting-agenda-generator', category: 'AI', isAI: true },
  { id: 'ai-paragraph', name: 'AI Paragraph Generator', description: 'Generate paragraphs instantly with AI.', icon: 'FileText', path: '/ai-paragraph-generator', category: 'AI', isAI: true },
  { id: 'ai-summarizer', name: 'AI Text Summarizer', description: 'Summarize long text into key points.', icon: 'FileText', path: '/ai-text-summarizer', category: 'AI', isAI: true },
  { id: 'ai-baby-name', name: 'AI Baby Name Generator', description: 'AI-powered baby name suggestions.', icon: 'Baby', path: '/baby-name-generator', category: 'AI', isAI: true },
  { id: 'ai-translator', name: 'AI Translator', description: 'Translate text to 25+ languages instantly.', icon: 'Globe', path: '/ai-translator', category: 'AI', isAI: true },
  { id: 'ai-business-name', name: 'AI Business Name Generator', description: 'Generate creative brand names for business.', icon: 'Building2', path: '/ai-business-name-generator', category: 'AI', isAI: true },
  { id: 'ai-hashtag', name: 'AI Hashtag Generator', description: 'Generate trending hashtags for social media.', icon: 'Hash', path: '/ai-hashtag-generator', category: 'AI', isAI: true },
  // AI Code & Development Tools
  { id: 'ai-code', name: 'AI Code Generator', description: 'Generate code in any language from descriptions.', icon: 'Code2', path: '/ai-code-generator', category: 'AI', isAI: true },
  { id: 'ai-debugger', name: 'AI Code Debugger', description: 'Find and fix bugs in your code with AI.', icon: 'Bug', path: '/ai-code-debugger', category: 'AI', isAI: true },
  { id: 'ai-explainer', name: 'AI Code Explainer', description: 'Get clear explanations of any code snippet.', icon: 'FileSearch', path: '/ai-code-explainer', category: 'AI', isAI: true },
  { id: 'ai-code-converter', name: 'AI Code Converter', description: 'Convert code between programming languages.', icon: 'ArrowRightLeft', path: '/ai-code-converter', category: 'AI', isAI: true },
  { id: 'ai-sql', name: 'AI SQL Generator', description: 'Generate SQL queries from plain English.', icon: 'Database', path: '/ai-sql-generator', category: 'AI', isAI: true },
  { id: 'ai-regex', name: 'AI Regex Generator', description: 'Create regex patterns from descriptions.', icon: 'Regex', path: '/ai-regex-generator', category: 'AI', isAI: true },
  { id: 'ai-git-commit', name: 'AI Git Commit Generator', description: 'Generate meaningful commit messages.', icon: 'GitCommit', path: '/ai-git-commit-generator', category: 'AI', isAI: true },
  { id: 'ai-api-doc', name: 'AI API Documentation Generator', description: 'Auto-generate API docs from code.', icon: 'FileText', path: '/ai-api-doc-generator', category: 'AI', isAI: true },
  { id: 'ai-unit-test', name: 'AI Unit Test Generator', description: 'Generate comprehensive unit tests.', icon: 'FlaskConical', path: '/ai-unit-test-generator', category: 'AI', isAI: true },
  { id: 'ai-code-comment', name: 'AI Code Comment Generator', description: 'Add clear comments to your code.', icon: 'MessageSquareCode', path: '/ai-code-comment-generator', category: 'AI', isAI: true },
  { id: 'ai-code-review', name: 'AI Code Review Assistant', description: 'Get expert code review feedback.', icon: 'Search', path: '/ai-code-review-assistant', category: 'AI', isAI: true },
  { id: 'ai-variable-name', name: 'AI Variable Name Generator', description: 'Get perfect variable and function names.', icon: 'Variable', path: '/ai-variable-name-generator', category: 'AI', isAI: true },
  { id: 'ai-css', name: 'AI CSS Generator', description: 'Generate CSS styles from descriptions.', icon: 'Paintbrush', path: '/ai-css-generator', category: 'AI', isAI: true },
  { id: 'ai-html', name: 'AI HTML Generator', description: 'Generate semantic HTML structure.', icon: 'Code2', path: '/ai-html-generator', category: 'AI', isAI: true },
  { id: 'ai-react', name: 'AI React Component Generator', description: 'Generate React components from descriptions.', icon: 'Component', path: '/ai-react-component-generator', category: 'AI', isAI: true },
  { id: 'ai-rest-api', name: 'AI REST API Designer', description: 'Design RESTful APIs with best practices.', icon: 'Server', path: '/ai-rest-api-designer', category: 'AI', isAI: true },
  { id: 'ai-database-schema', name: 'AI Database Schema Generator', description: 'Design efficient database schemas.', icon: 'Database', path: '/ai-database-schema-generator', category: 'AI', isAI: true },
  { id: 'ai-algorithm', name: 'AI Algorithm Selector', description: 'Find the best algorithm for any problem.', icon: 'Cpu', path: '/ai-algorithm-selector', category: 'AI', isAI: true },
  { id: 'ai-tech-stack', name: 'AI Tech Stack Recommender', description: 'Get personalized tech stack recommendations.', icon: 'Layers', path: '/ai-tech-stack-recommender', category: 'AI', isAI: true },
  { id: 'ai-function-name', name: 'AI Function Name Generator', description: 'Get perfect function names for your code.', icon: 'FunctionSquare', path: '/ai-function-name-generator', category: 'AI', isAI: true },
  { id: 'ai-code-preview', name: 'Code Preview & Download', description: 'Preview, copy and download any code with line numbers.', icon: 'Eye', path: '/ai-code-preview', category: 'AI', isAI: true },
  { id: 'ai-code-runner', name: 'Code Runner', description: 'Run JavaScript code and see the output instantly.', icon: 'Terminal', path: '/ai-code-runner', category: 'AI', isAI: true },
  // AI Marketing & SEO Tools
  { id: 'ai-seo-keyword', name: 'AI SEO Keyword Research', description: 'Find high-ranking keyword opportunities with AI.', icon: 'Search', path: '/ai-seo-keyword-research', category: 'AI', isAI: true },
  { id: 'ai-ad-copy', name: 'AI Ad Copy Generator', description: 'Create high-converting ad copy for any platform.', icon: 'Megaphone', path: '/ai-ad-copy-generator', category: 'AI', isAI: true },
  { id: 'ai-customer-persona', name: 'AI Customer Persona Generator', description: 'Create detailed buyer personas for your business.', icon: 'Target', path: '/ai-customer-persona-generator', category: 'AI', isAI: true },
  // AI Image & Design Tools
  { id: 'ai-meme', name: 'AI Meme Generator', description: 'Create viral meme concepts with captions and templates.', icon: 'Laugh', path: '/ai-meme-generator', category: 'AI', isAI: true },
  { id: 'ai-thumbnail', name: 'AI Thumbnail Generator', description: 'Generate high-CTR thumbnail concepts for videos.', icon: 'Image', path: '/ai-thumbnail-generator', category: 'AI', isAI: true },
  { id: 'ai-image', name: 'AI Image Generator', description: 'Create stunning images from text with AI - Free & Unlimited.', icon: 'Image', path: '/ai-image-generator', category: 'AI', isAI: true },
  { id: 'ai-video', name: 'AI Video Generator', description: 'Create stunning videos from text with AI - Free & Unlimited.', icon: 'Video', path: '/ai-video-generator', category: 'AI', isAI: true },
  { id: 'ai-face', name: 'AI Face Generator', description: 'Generate realistic AI faces for profiles and projects.', icon: 'User', path: '/ai-face-generator', category: 'AI', isAI: true },
  { id: 'ai-logo', name: 'AI Logo Generator', description: 'Create professional logos for your brand with AI.', icon: 'Sparkles', path: '/ai-logo-generator', category: 'AI', isAI: true },
  { id: 'ai-cartoon-avatar', name: 'AI Cartoon Avatar Generator', description: 'Generate unique cartoon avatars in various styles.', icon: 'Smile', path: '/ai-cartoon-avatar-generator', category: 'AI', isAI: true },
  { id: 'ai-pattern', name: 'AI Pattern Generator', description: 'Create seamless patterns for designs and products.', icon: 'Grid3x3', path: '/ai-pattern-generator', category: 'AI', isAI: true },
  { id: 'ai-album-cover', name: 'AI Album Cover Generator', description: 'Design professional album artwork for your music.', icon: 'Disc3', path: '/ai-album-cover-generator', category: 'AI', isAI: true },
  { id: 'ai-business-card', name: 'AI Business Card Designer', description: 'Create professional business card designs with AI.', icon: 'CreditCard', path: '/ai-business-card-designer', category: 'AI', isAI: true },
  { id: 'ai-instagram-story', name: 'AI Instagram Story Template', description: 'Generate engaging Instagram story templates.', icon: 'Smartphone', path: '/ai-instagram-story-template', category: 'AI', isAI: true },
  { id: 'ai-infographic', name: 'AI Infographic Generator', description: 'Create stunning infographics and data visualizations.', icon: 'BarChart3', path: '/ai-infographic-generator', category: 'AI', isAI: true },
  { id: 'ai-presentation', name: 'AI Presentation Slide Generator', description: 'Generate professional presentation slide designs.', icon: 'Presentation', path: '/ai-presentation-slide-generator', category: 'AI', isAI: true },
  { id: 'ai-mockup', name: 'AI Mockup Generator', description: 'Create product mockups for marketing and portfolios.', icon: 'Package', path: '/ai-mockup-generator', category: 'AI', isAI: true },
  { id: 'ai-icon', name: 'AI Icon Generator', description: 'Design custom icons for apps and websites.', icon: 'Shapes', path: '/ai-icon-generator', category: 'AI', isAI: true },
  { id: 'ai-qr-art', name: 'AI QR Art Generator', description: 'Generate artistic QR code designs with AI.', icon: 'QrCode', path: '/ai-qr-art-generator', category: 'AI', isAI: true },
  // AI Education & Learning Tools
  { id: 'ai-quiz', name: 'AI Quiz Generator', description: 'Generate custom quizzes based on any topic or grade level.', icon: 'ListChecks', path: '/ai-quiz-generator', category: 'AI', isAI: true },
  { id: 'ai-flashcard', name: 'AI Flashcard Generator', description: 'Create front-and-back study flashcards for active recall.', icon: 'BookOpen', path: '/ai-flashcard-generator', category: 'AI', isAI: true },
  { id: 'ai-study-guide', name: 'AI Study Guide Generator', description: 'Produce structured, comprehensive exam study materials.', icon: 'GraduationCap', path: '/ai-study-guide-generator', category: 'AI', isAI: true },
  { id: 'ai-lesson-plan', name: 'AI Lesson Plan Generator', description: 'Generate detailed teaching materials and curricula.', icon: 'Presentation', path: '/ai-lesson-plan-generator', category: 'AI', isAI: true },
  { id: 'ai-explanation', name: 'AI Explanation Simplifier', description: 'Break down complex topics into simple, clear explanations.', icon: 'BrainCircuit', path: '/ai-explanation-simplifier', category: 'AI', isAI: true },
  { id: 'ai-practice-problem', name: 'AI Practice Problem Generator', description: 'Generate math and science problems with step-by-step solutions.', icon: 'Calculator', path: '/ai-practice-problem-generator', category: 'AI', isAI: true },
  { id: 'ai-essay-grader', name: 'AI Essay Grader', description: 'Get automated scoring and constructive feedback on essays.', icon: 'FileCheck', path: '/ai-essay-grader', category: 'AI', isAI: true },
  { id: 'ai-citation', name: 'AI Citation Generator', description: 'Generate perfect APA, MLA, and Chicago style citations.', icon: 'Quote', path: '/ai-citation-generator', category: 'AI', isAI: true },
  { id: 'ai-research-question', name: 'AI Research Question Generator', description: 'Generate insightful research ideas for any topic.', icon: 'FileSearch', path: '/ai-research-question-generator', category: 'AI', isAI: true },
  { id: 'ai-thesis', name: 'AI Thesis Statement Generator', description: 'Draft strong, arguable thesis statements for essays.', icon: 'PenTool', path: '/ai-thesis-statement-generator', category: 'AI', isAI: true },
  { id: 'ai-annotated-bib', name: 'AI Annotated Bibliography', description: 'Summarize sources with evaluations and formal citations.', icon: 'Library', path: '/ai-annotated-bibliography', category: 'AI', isAI: true },
  { id: 'ai-mind-map', name: 'AI Mind Map Generator', description: 'Create visual, hierarchical outlines for structured learning.', icon: 'Network', path: '/ai-mind-map-generator', category: 'AI', isAI: true },
  { id: 'ai-mnemonic', name: 'AI Mnemonic Device Generator', description: 'Create effective memory aids and acronyms for concepts.', icon: 'Brain', path: '/ai-mnemonic-generator', category: 'AI', isAI: true },
  { id: 'ai-language-tutor', name: 'AI Language Learning Tutor', description: 'Practice vocabulary and grammar in any target language.', icon: 'Languages', path: '/ai-language-learning-tutor', category: 'AI', isAI: true },
  { id: 'ai-analogy', name: 'AI Analogy Generator', description: 'Explain abstract concepts with vivid, relatable analogies.', icon: 'ArrowRightLeft', path: '/ai-analogy-generator', category: 'AI', isAI: true },
];

// Category metadata (auto-calculated counts)
export const categories = [
  { id: 'finance', name: 'Finance', icon: 'DollarSign', color: '#22c55e', count: allTools.filter(t => t.category === 'Finance').length },
  { id: 'health', name: 'Health', icon: 'Heart', color: '#ef4444', count: allTools.filter(t => t.category === 'Health').length },
  { id: 'math', name: 'Math', icon: 'Calculator', color: '#3b82f6', count: allTools.filter(t => t.category === 'Math').length },
  { id: 'converter', name: 'Converter', icon: 'ArrowLeftRight', color: '#f59e0b', count: allTools.filter(t => t.category === 'Converter').length },
  { id: 'ai', name: 'AI Tools', icon: 'Sparkles', color: '#a78bfa', count: allTools.filter(t => t.category === 'AI').length },
  { id: 'fun', name: 'Fun', icon: 'Gamepad2', color: '#ec4899', count: allTools.filter(t => t.category === 'Fun').length },
  { id: 'other', name: 'Other', icon: 'Grid3x3', color: '#6366f1', count: allTools.filter(t => t.category === 'Other').length },
  { id: 'real-estate', name: 'Real Estate', icon: 'Home', color: '#14b8a6', count: allTools.filter(t => t.category === 'Real Estate').length },
  { id: 'sustainability', name: 'Sustainability', icon: 'Leaf', color: '#22c55e', count: allTools.filter(t => t.category === 'Sustainability').length },
  { id: 'tech', name: 'Tech', icon: 'Cpu', color: '#8b5cf6', count: allTools.filter(t => t.category === 'Tech').length },
  { id: 'text', name: 'Text', icon: 'Type', color: '#64748b', count: allTools.filter(t => t.category === 'Text').length },
];

// Helper functions
export const getToolsByCategory = (category: ToolCategory) => 
  allTools.filter(tool => tool.category === category);

export const getAITools = () => 
  allTools.filter(tool => tool.isAI);

export const searchTools = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return allTools.filter(tool => 
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.category.toLowerCase().includes(lowerQuery)
  );
};

// Get trending/featured tools
export const getTrendingTools = () => [
  allTools.find(t => t.id === 'bmi'),
  allTools.find(t => t.id === 'compound-interest'),
  allTools.find(t => t.id === 'ai-code'),
  allTools.find(t => t.id === 'tip'),
  allTools.find(t => t.id === 'ai-quiz'),
  allTools.find(t => t.id === 'percentage'),
  allTools.find(t => t.id === 'fire'),
  allTools.find(t => t.id === 'ai-image'),
].filter(Boolean) as Tool[];

// Get new/latest tools
export const getLatestTools = () => [
  allTools.find(t => t.id === 'ai-quiz'),
  allTools.find(t => t.id === 'ai-flashcard'),
  allTools.find(t => t.id === 'ai-study-guide'),
  allTools.find(t => t.id === 'ai-essay-grader'),
  allTools.find(t => t.id === 'ai-image'),
  allTools.find(t => t.id === 'ai-video'),
  allTools.find(t => t.id === 'ai-code'),
  allTools.find(t => t.id === 'ai-analogy'),
].filter(Boolean) as Tool[];

// Get tool by ID
export const getToolById = (id: string) => 
  allTools.find(tool => tool.id === id);

// Get tool by path
export const getToolByPath = (path: string) => 
  allTools.find(tool => tool.path === path);

// Total tools count
export const TOTAL_TOOLS_COUNT = allTools.length;
