import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import AllCalculators from './pages/AllCalculators'
import FinanceCategory from './pages/categories/FinanceCategory'
import HealthCategory from './pages/categories/HealthCategory'
import MathCategory from './pages/categories/MathCategory'
import ConverterCategory from './pages/categories/ConverterCategory'

// Company Pages
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'

// Financial Calculators
import MortgageCalculator from './pages/calculators/finance/MortgageCalculator'
import LoanCalculator from './pages/calculators/finance/LoanCalculator'
import CompoundInterestCalculator from './pages/calculators/finance/CompoundInterestCalculator'
import InvestmentCalculator from './pages/calculators/finance/InvestmentCalculator'
import SalaryCalculator from './pages/calculators/finance/SalaryCalculator'
import TipCalculator from './pages/calculators/finance/TipCalculator'
import AutoLoanCalculator from './pages/calculators/finance/AutoLoanCalculator'
import InterestCalculator from './pages/calculators/finance/InterestCalculator'
import PaymentCalculator from './pages/calculators/finance/PaymentCalculator'
import RetirementCalculator from './pages/calculators/finance/RetirementCalculator'
import AmortizationCalculator from './pages/calculators/finance/AmortizationCalculator'
import InflationCalculator from './pages/calculators/finance/InflationCalculator'
import FinanceCalculator from './pages/calculators/finance/FinanceCalculator'
import IncomeTaxCalculator from './pages/calculators/finance/IncomeTaxCalculator'
import InterestRateCalculator from './pages/calculators/finance/InterestRateCalculator'
import SalesTaxCalculator from './pages/calculators/finance/SalesTaxCalculator'

// Health Calculators
import BMICalculator from './pages/calculators/health/BMICalculator'
import CalorieCalculator from './pages/calculators/health/CalorieCalculator'
import BMRCalculator from './pages/calculators/health/BMRCalculator'
import BodyFatCalculator from './pages/calculators/health/BodyFatCalculator'
import IdealWeightCalculator from './pages/calculators/health/IdealWeightCalculator'
import PaceCalculator from './pages/calculators/health/PaceCalculator'
import PregnancyCalculator from './pages/calculators/health/PregnancyCalculator'
import PregnancyConceptionCalculator from './pages/calculators/health/PregnancyConceptionCalculator'
import DueDateCalculator from './pages/calculators/health/DueDateCalculator'

// Math Calculators
import ScientificCalculator from './pages/calculators/math/ScientificCalculator'
import PercentageCalculator from './pages/calculators/math/PercentageCalculator'
import FractionCalculator from './pages/calculators/math/FractionCalculator'
import RandomNumberGenerator from './pages/calculators/math/RandomNumberGenerator'
import TriangleCalculator from './pages/calculators/math/TriangleCalculator'
import StandardDeviationCalculator from './pages/calculators/math/StandardDeviationCalculator'

// Other Calculators
import UnitConverter from './pages/calculators/other/UnitConverter'
import AgeCalculator from './pages/calculators/other/AgeCalculator'
import DateCalculator from './pages/calculators/other/DateCalculator'
import PasswordGenerator from './pages/calculators/other/PasswordGenerator'
import GPACalculator from './pages/calculators/other/GPACalculator'
import DiscountCalculator from './pages/calculators/other/DiscountCalculator'
import TimeCalculator from './pages/calculators/other/TimeCalculator'
import HoursCalculator from './pages/calculators/other/HoursCalculator'
import GradeCalculator from './pages/calculators/other/GradeCalculator'
import ConcreteCalculator from './pages/calculators/other/ConcreteCalculator'
import SubnetCalculator from './pages/calculators/other/SubnetCalculator'
import ConversionCalculator from './pages/calculators/other/ConversionCalculator'

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                {/* Main Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/calculators" element={<AllCalculators />} />

                {/* Company Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />

                {/* Category Pages */}
                <Route path="/finance" element={<FinanceCategory />} />
                <Route path="/health" element={<HealthCategory />} />
                <Route path="/math" element={<MathCategory />} />
                <Route path="/converter" element={<ConverterCategory />} />

                {/* Financial Calculators */}
                <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
                <Route path="/loan-calculator" element={<LoanCalculator />} />
                <Route path="/compound-interest-calculator" element={<CompoundInterestCalculator />} />
                <Route path="/investment-calculator" element={<InvestmentCalculator />} />
                <Route path="/salary-calculator" element={<SalaryCalculator />} />
                <Route path="/tip-calculator" element={<TipCalculator />} />
                <Route path="/auto-loan-calculator" element={<AutoLoanCalculator />} />
                <Route path="/interest-calculator" element={<InterestCalculator />} />
                <Route path="/payment-calculator" element={<PaymentCalculator />} />
                <Route path="/retirement-calculator" element={<RetirementCalculator />} />
                <Route path="/amortization-calculator" element={<AmortizationCalculator />} />
                <Route path="/inflation-calculator" element={<InflationCalculator />} />
                <Route path="/finance-calculator" element={<FinanceCalculator />} />
                <Route path="/income-tax-calculator" element={<IncomeTaxCalculator />} />
                <Route path="/interest-rate-calculator" element={<InterestRateCalculator />} />
                <Route path="/sales-tax-calculator" element={<SalesTaxCalculator />} />

                {/* Health Calculators */}
                <Route path="/bmi-calculator" element={<BMICalculator />} />
                <Route path="/calorie-calculator" element={<CalorieCalculator />} />
                <Route path="/bmr-calculator" element={<BMRCalculator />} />
                <Route path="/body-fat-calculator" element={<BodyFatCalculator />} />
                <Route path="/ideal-weight-calculator" element={<IdealWeightCalculator />} />
                <Route path="/pace-calculator" element={<PaceCalculator />} />
                <Route path="/pregnancy-calculator" element={<PregnancyCalculator />} />
                <Route path="/conception-calculator" element={<PregnancyConceptionCalculator />} />
                <Route path="/due-date-calculator" element={<DueDateCalculator />} />

                {/* Math Calculators */}
                <Route path="/scientific-calculator" element={<ScientificCalculator />} />
                <Route path="/percentage-calculator" element={<PercentageCalculator />} />
                <Route path="/fraction-calculator" element={<FractionCalculator />} />
                <Route path="/random-number-generator" element={<RandomNumberGenerator />} />
                <Route path="/triangle-calculator" element={<TriangleCalculator />} />
                <Route path="/standard-deviation-calculator" element={<StandardDeviationCalculator />} />

                {/* Other Calculators */}
                <Route path="/unit-converter" element={<UnitConverter />} />
                <Route path="/age-calculator" element={<AgeCalculator />} />
                <Route path="/date-calculator" element={<DateCalculator />} />
                <Route path="/password-generator" element={<PasswordGenerator />} />
                <Route path="/gpa-calculator" element={<GPACalculator />} />
                <Route path="/discount-calculator" element={<DiscountCalculator />} />
                <Route path="/time-calculator" element={<TimeCalculator />} />
                <Route path="/hours-calculator" element={<HoursCalculator />} />
                <Route path="/grade-calculator" element={<GradeCalculator />} />
                <Route path="/concrete-calculator" element={<ConcreteCalculator />} />
                <Route path="/subnet-calculator" element={<SubnetCalculator />} />
                <Route path="/conversion-calculator" element={<ConversionCalculator />} />
            </Route>
        </Routes>
    )
}

export default App

