import {
    DollarSign,
    Home,
    Car,
    Percent,
    CreditCard,
    TrendingUp,
    PiggyBank,
    Landmark,
    Wallet,
    Receipt,
    Calculator,
    Heart,
    Activity,
    Flame,
    Scale,
    Dumbbell,
    Timer,
    Baby,
    Calendar,
    Pi,
    Divide,
    Hash,
    Shuffle,
    Triangle,
    BarChart3,
    Plus,
    ArrowLeftRight,
    Clock,
    CalendarDays,
    Timer as TimerIcon,
    GraduationCap,
    Ruler,
    Network,
    Key,
    BadgePercent,
    Building2
} from 'lucide-react'

export const allCalculators = [
    // Finance Calculators
    {
        name: 'Mortgage Calculator',
        description: 'Calculate monthly payments, total interest, and amortization for home loans.',
        icon: Home,
        path: '/mortgage-calculator',
        category: 'Finance'
    },
    {
        name: 'Loan Calculator',
        description: 'Compute loan payments, interest rates, and payoff schedules.',
        icon: CreditCard,
        path: '/loan-calculator',
        category: 'Finance'
    },
    {
        name: 'Compound Interest',
        description: 'Visualize exponential growth through compounding interest calculations.',
        icon: TrendingUp,
        path: '/compound-interest-calculator',
        category: 'Finance'
    },
    {
        name: 'Investment Calculator',
        description: 'Project investment growth with regular contributions and returns.',
        icon: PiggyBank,
        path: '/investment-calculator',
        category: 'Finance'
    },
    {
        name: 'Salary Calculator',
        description: 'Convert between hourly, monthly, and annual salary figures.',
        icon: Wallet,
        path: '/salary-calculator',
        category: 'Finance'
    },
    {
        name: 'Tip Calculator',
        description: 'Calculate tips and split bills among multiple people.',
        icon: Receipt,
        path: '/tip-calculator',
        category: 'Finance'
    },

    // Health Calculators
    {
        name: 'BMI Calculator',
        description: 'Calculate Body Mass Index and understand your weight category.',
        icon: Scale,
        path: '/bmi-calculator',
        category: 'Health'
    },
    {
        name: 'Calorie Calculator',
        description: 'Estimate daily caloric needs based on your activity level.',
        icon: Flame,
        path: '/calorie-calculator',
        category: 'Health'
    },
    {
        name: 'BMR Calculator',
        description: 'Calculate your Basal Metabolic Rate for fitness planning.',
        icon: Activity,
        path: '/bmr-calculator',
        category: 'Health'
    },
    {
        name: 'Body Fat Calculator',
        description: 'Estimate body fat percentage using various methods.',
        icon: Dumbbell,
        path: '/body-fat-calculator',
        category: 'Health'
    },
    {
        name: 'Ideal Weight',
        description: 'Find your ideal body weight based on height and frame.',
        icon: Heart,
        path: '/ideal-weight-calculator',
        category: 'Health'
    },

    // Math Calculators
    {
        name: 'Scientific Calculator',
        description: 'Advanced calculations with trigonometry, logarithms, and more.',
        icon: Calculator,
        path: '/scientific-calculator',
        category: 'Math'
    },
    {
        name: 'Percentage Calculator',
        description: 'Calculate percentages, increases, decreases, and differences.',
        icon: Percent,
        path: '/percentage-calculator',
        category: 'Math'
    },
    {
        name: 'Fraction Calculator',
        description: 'Add, subtract, multiply, and divide fractions easily.',
        icon: Divide,
        path: '/fraction-calculator',
        category: 'Math'
    },

    // Other/Converter Calculators
    {
        name: 'Unit Converter',
        description: 'Convert between length, weight, temperature, speed, and more.',
        icon: ArrowLeftRight,
        path: '/unit-converter',
        category: 'Converter'
    },
    {
        name: 'Age Calculator',
        description: 'Calculate exact age in years, months, and days.',
        icon: CalendarDays,
        path: '/age-calculator',
        category: 'Other'
    },
    {
        name: 'Date Calculator',
        description: 'Find the difference between dates or add/subtract days.',
        icon: Calendar,
        path: '/date-calculator',
        category: 'Other'
    },
    {
        name: 'Password Generator',
        description: 'Generate secure, random passwords with custom options.',
        icon: Key,
        path: '/password-generator',
        category: 'Other'
    },
    {
        name: 'GPA Calculator',
        description: 'Calculate Grade Point Average for academic planning.',
        icon: GraduationCap,
        path: '/gpa-calculator',
        category: 'Other'
    },
    {
        name: 'Discount Calculator',
        description: 'Calculate sale prices and savings from discounts.',
        icon: BadgePercent,
        path: '/discount-calculator',
        category: 'Other'
    },
]

export const financeCalculators = allCalculators.filter(c => c.category === 'Finance')
export const healthCalculators = allCalculators.filter(c => c.category === 'Health')
export const mathCalculators = allCalculators.filter(c => c.category === 'Math')
export const converterCalculators = allCalculators.filter(c => c.category === 'Converter')
export const otherCalculators = allCalculators.filter(c => c.category === 'Other')
