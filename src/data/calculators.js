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
    Building2,
    FileSpreadsheet,
    Cuboid,
    Clock3,
    ShoppingCart
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
    {
        name: 'Auto Loan Calculator',
        description: 'Calculate auto loan payments with down payment and trade-in values.',
        icon: Car,
        path: '/auto-loan-calculator',
        category: 'Finance'
    },
    {
        name: 'Interest Calculator',
        description: 'Calculate simple and compound interest with various frequencies.',
        icon: Percent,
        path: '/interest-calculator',
        category: 'Finance'
    },
    {
        name: 'Payment Calculator',
        description: 'Calculate loan payments for monthly, bi-weekly, or weekly schedules.',
        icon: DollarSign,
        path: '/payment-calculator',
        category: 'Finance'
    },
    {
        name: 'Retirement Calculator',
        description: 'Plan retirement savings and estimate future income with the 4% rule.',
        icon: Landmark,
        path: '/retirement-calculator',
        category: 'Finance'
    },
    {
        name: 'Amortization Calculator',
        description: 'Calculate loan amortization and see how extra payments save money.',
        icon: FileSpreadsheet,
        path: '/amortization-calculator',
        category: 'Finance'
    },
    {
        name: 'Inflation Calculator',
        description: 'Calculate how inflation affects purchasing power over time.',
        icon: TrendingUp,
        path: '/inflation-calculator',
        category: 'Finance'
    },
    {
        name: 'Finance Calculator',
        description: 'General purpose financial calculations for loans, savings, and present value.',
        icon: Calculator,
        path: '/finance-calculator',
        category: 'Finance'
    },
    {
        name: 'Income Tax Calculator',
        description: 'Estimate federal income tax using 2024 US tax brackets.',
        icon: Receipt,
        path: '/income-tax-calculator',
        category: 'Finance'
    },
    {
        name: 'Interest Rate Calculator',
        description: 'Calculate the interest rate needed to reach your financial goal.',
        icon: Percent,
        path: '/interest-rate-calculator',
        category: 'Finance'
    },
    {
        name: 'Sales Tax Calculator',
        description: 'Calculate sales tax or reverse calculate from total price.',
        icon: ShoppingCart,
        path: '/sales-tax-calculator',
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
    {
        name: 'Pace Calculator',
        description: 'Calculate running/cycling pace and speed from distance and time.',
        icon: Timer,
        path: '/pace-calculator',
        category: 'Health'
    },
    {
        name: 'Pregnancy Calculator',
        description: 'Calculate due date and track pregnancy progress week by week.',
        icon: Baby,
        path: '/pregnancy-calculator',
        category: 'Health'
    },
    {
        name: 'Conception Calculator',
        description: 'Estimate conception date from your due date.',
        icon: Heart,
        path: '/conception-calculator',
        category: 'Health'
    },
    {
        name: 'Due Date Calculator',
        description: 'Calculate pregnancy due date using multiple methods.',
        icon: Calendar,
        path: '/due-date-calculator',
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
    {
        name: 'Random Number Generator',
        description: 'Generate random numbers with custom range and quantity options.',
        icon: Shuffle,
        path: '/random-number-generator',
        category: 'Math'
    },
    {
        name: 'Triangle Calculator',
        description: 'Calculate triangle area, perimeter, angles, and type from side lengths.',
        icon: Triangle,
        path: '/triangle-calculator',
        category: 'Math'
    },
    {
        name: 'Standard Deviation Calculator',
        description: 'Calculate mean, variance, standard deviation, and other statistics.',
        icon: BarChart3,
        path: '/standard-deviation-calculator',
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
    {
        name: 'Time Calculator',
        description: 'Add or subtract time durations with multiple format outputs.',
        icon: Clock,
        path: '/time-calculator',
        category: 'Other'
    },
    {
        name: 'Hours Calculator',
        description: 'Calculate work hours and earnings from time entries.',
        icon: Clock3,
        path: '/hours-calculator',
        category: 'Other'
    },
    {
        name: 'Grade Calculator',
        description: 'Calculate grades, percentages, GPA, and weighted averages.',
        icon: GraduationCap,
        path: '/grade-calculator',
        category: 'Other'
    },
    {
        name: 'Concrete Calculator',
        description: 'Calculate concrete volume needed for slabs, columns, and footings.',
        icon: Cuboid,
        path: '/concrete-calculator',
        category: 'Other'
    },
    {
        name: 'Subnet Calculator',
        description: 'Calculate subnet mask, network address, and available hosts.',
        icon: Network,
        path: '/subnet-calculator',
        category: 'Other'
    },
    {
        name: 'Conversion Calculator',
        description: 'Convert between different units of measurement.',
        icon: ArrowLeftRight,
        path: '/conversion-calculator',
        category: 'Converter'
    },
]

export const financeCalculators = allCalculators.filter(c => c.category === 'Finance')
export const healthCalculators = allCalculators.filter(c => c.category === 'Health')
export const mathCalculators = allCalculators.filter(c => c.category === 'Math')
export const converterCalculators = allCalculators.filter(c => c.category === 'Converter')
export const otherCalculators = allCalculators.filter(c => c.category === 'Other')

