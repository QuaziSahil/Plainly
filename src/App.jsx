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
import Sitemap from './pages/Sitemap'

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
import EMICalculator from './pages/calculators/finance/EMICalculator'
import SIPCalculator from './pages/calculators/finance/SIPCalculator'
import GSTCalculator from './pages/calculators/finance/GSTCalculator'
import ProfitMarginCalculator from './pages/calculators/finance/ProfitMarginCalculator'
import BreakEvenCalculator from './pages/calculators/finance/BreakEvenCalculator'
import ROICalculator from './pages/calculators/finance/ROICalculator'
import RentVsBuyCalculator from './pages/calculators/finance/RentVsBuyCalculator'
import Calculator401k from './pages/calculators/finance/Calculator401k'
import NetWorthCalculator from './pages/calculators/finance/NetWorthCalculator'
import CurrencyConverter from './pages/calculators/finance/CurrencyConverter'
import CryptoConverter from './pages/calculators/finance/CryptoConverter'

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
import WaterIntakeCalculator from './pages/calculators/health/WaterIntakeCalculator'
import MacroCalculator from './pages/calculators/health/MacroCalculator'
import SleepCalculator from './pages/calculators/health/SleepCalculator'
import TDEECalculator from './pages/calculators/health/TDEECalculator'
import OneRepMaxCalculator from './pages/calculators/health/OneRepMaxCalculator'
import HeartRateZoneCalculator from './pages/calculators/health/HeartRateZoneCalculator'
import OvulationCalculator from './pages/calculators/health/OvulationCalculator'
import PeriodCalculator from './pages/calculators/health/PeriodCalculator'
import BACCalculator from './pages/calculators/health/BACCalculator'
import WeightLossCalculator from './pages/calculators/health/WeightLossCalculator'

// Math Calculators
import ScientificCalculator from './pages/calculators/math/ScientificCalculator'
import PercentageCalculator from './pages/calculators/math/PercentageCalculator'
import FractionCalculator from './pages/calculators/math/FractionCalculator'
import RandomNumberGenerator from './pages/calculators/math/RandomNumberGenerator'
import TriangleCalculator from './pages/calculators/math/TriangleCalculator'
import StandardDeviationCalculator from './pages/calculators/math/StandardDeviationCalculator'
import QuadraticCalculator from './pages/calculators/math/QuadraticCalculator'
import PrimeChecker from './pages/calculators/math/PrimeChecker'
import LCMGCDCalculator from './pages/calculators/math/LCMGCDCalculator'
import BinaryHexConverter from './pages/calculators/math/BinaryHexConverter'
import LogarithmCalculator from './pages/calculators/math/LogarithmCalculator'
import ExponentCalculator from './pages/calculators/math/ExponentCalculator'
import PermutationCombinationCalculator from './pages/calculators/math/PermutationCombinationCalculator'
import MatrixCalculator from './pages/calculators/math/MatrixCalculator'
import WaveCalculator from './pages/calculators/math/WaveCalculator'
import VectorCalculator from './pages/calculators/math/VectorCalculator'
import PermutationCalculator from './pages/calculators/math/PermutationCalculator'

// Text Tools
import WordCounter from './pages/calculators/text/WordCounter'
import LoremIpsumGenerator from './pages/calculators/text/LoremIpsumGenerator'
import UUIDGenerator from './pages/calculators/text/UUIDGenerator'
import ColorPicker from './pages/calculators/text/ColorPicker'
import JSONFormatter from './pages/calculators/text/JSONFormatter'
import ReadabilityCalculator from './pages/calculators/text/ReadabilityCalculator'
import SlugGenerator from './pages/calculators/text/SlugGenerator'
import TextScrambler from './pages/calculators/text/TextScrambler'

// Tech Tools
import QRCodeGenerator from './pages/calculators/tech/QRCodeGenerator'
import HashGenerator from './pages/calculators/tech/HashGenerator'
import IPSubnetCalculator from './pages/calculators/tech/IPSubnetCalculator'
import JSONFormatterCalculator from './pages/calculators/tech/JSONFormatterCalculator'
import HashGeneratorCalculator from './pages/calculators/tech/HashGeneratorCalculator'
import PowerCalculator from './pages/calculators/tech/PowerCalculator'

// Sustainability Tools
import SolarPanelCalculator from './pages/calculators/sustainability/SolarPanelCalculator'
import EVSavingsCalculator from './pages/calculators/sustainability/EVSavingsCalculator'
import CompostCalculator from './pages/calculators/sustainability/CompostCalculator'
import SolarROICalculator from './pages/calculators/sustainability/SolarROICalculator'
import RainwaterCalculator from './pages/calculators/sustainability/RainwaterCalculator'
import PlasticFootprintCalculator from './pages/calculators/sustainability/PlasticFootprintCalculator'

// Real Estate Tools
import FlooringCalculator from './pages/calculators/realestate/FlooringCalculator'
import RentalYieldCalculator from './pages/calculators/realestate/RentalYieldCalculator'

// Fun Tools
import DiceRoller from './pages/calculators/fun/DiceRoller'
import RandomPicker from './pages/calculators/fun/RandomPicker'
import CoinFlip from './pages/calculators/fun/CoinFlip'
import NumerologyCalculator from './pages/calculators/fun/NumerologyCalculator'
import Magic8Ball from './pages/calculators/fun/Magic8Ball'
import BabyNameGenerator from './pages/calculators/fun/BabyNameGenerator'
import LotteryOddsCalculator from './pages/calculators/fun/LotteryOddsCalculator'
import SpinTheWheel from './pages/calculators/fun/SpinTheWheel'
import SecretSantaGenerator from './pages/calculators/fun/SecretSantaGenerator'
import DogAgeCalculator from './pages/calculators/fun/DogAgeCalculator'
import CompatibilityCalculator from './pages/calculators/fun/CompatibilityCalculator'
import ReactionTimeGame from './pages/calculators/fun/ReactionTimeGame'

// Converter Tools
import CookingConverter from './pages/calculators/converter/CookingConverter'
import TemperatureConverter from './pages/calculators/converter/TemperatureConverter'
import LengthConverter from './pages/calculators/converter/LengthConverter'
import TimeConverter from './pages/calculators/converter/TimeConverter'
import PressureConverter from './pages/calculators/converter/PressureConverter'
import AngleConverter from './pages/calculators/converter/AngleConverter'
import RecipeScaler from './pages/calculators/converter/RecipeScaler'
import FrequencyConverter from './pages/calculators/converter/FrequencyConverter'

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
import FuelCostCalculator from './pages/calculators/other/FuelCostCalculator'
import ElectricityBillCalculator from './pages/calculators/other/ElectricityBillCalculator'
import CarbonFootprintCalculator from './pages/calculators/other/CarbonFootprintCalculator'
import PaintCalculator from './pages/calculators/other/PaintCalculator'
import PetAgeCalculator from './pages/calculators/other/PetAgeCalculator'
import TipSplitCalculator from './pages/calculators/other/TipCalculator'
import CGPACalculator from './pages/calculators/other/CGPACalculator'
import LoveCalculator from './pages/calculators/other/LoveCalculator'
import ZodiacFinder from './pages/calculators/other/ZodiacFinder'
import WorldClock from './pages/calculators/other/WorldClock'
import CountdownTimer from './pages/calculators/other/CountdownTimer'
import Stopwatch from './pages/calculators/other/Stopwatch'
import DistanceCalculator from './pages/calculators/other/DistanceCalculator'
import CountdownCalculator from './pages/calculators/other/CountdownCalculator'
import LifeStatsCalculator from './pages/calculators/other/LifeStatsCalculator'
import PackageDimensionCalculator from './pages/calculators/other/PackageDimensionCalculator'
import StopwatchCalculator from './pages/calculators/other/StopwatchCalculator'

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
                <Route path="/sitemap" element={<Sitemap />} />

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
                <Route path="/emi-calculator" element={<EMICalculator />} />
                <Route path="/sip-calculator" element={<SIPCalculator />} />
                <Route path="/gst-calculator" element={<GSTCalculator />} />
                <Route path="/profit-margin-calculator" element={<ProfitMarginCalculator />} />
                <Route path="/break-even-calculator" element={<BreakEvenCalculator />} />
                <Route path="/roi-calculator" element={<ROICalculator />} />
                <Route path="/rent-vs-buy-calculator" element={<RentVsBuyCalculator />} />
                <Route path="/401k-calculator" element={<Calculator401k />} />
                <Route path="/net-worth-calculator" element={<NetWorthCalculator />} />
                <Route path="/currency-converter" element={<CurrencyConverter />} />
                <Route path="/crypto-converter" element={<CryptoConverter />} />

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
                <Route path="/water-intake-calculator" element={<WaterIntakeCalculator />} />
                <Route path="/macro-calculator" element={<MacroCalculator />} />
                <Route path="/sleep-calculator" element={<SleepCalculator />} />
                <Route path="/tdee-calculator" element={<TDEECalculator />} />
                <Route path="/one-rep-max-calculator" element={<OneRepMaxCalculator />} />
                <Route path="/heart-rate-zone-calculator" element={<HeartRateZoneCalculator />} />
                <Route path="/ovulation-calculator" element={<OvulationCalculator />} />
                <Route path="/period-calculator" element={<PeriodCalculator />} />
                <Route path="/bac-calculator" element={<BACCalculator />} />
                <Route path="/weight-loss-calculator" element={<WeightLossCalculator />} />

                {/* Math Calculators */}
                <Route path="/scientific-calculator" element={<ScientificCalculator />} />
                <Route path="/percentage-calculator" element={<PercentageCalculator />} />
                <Route path="/fraction-calculator" element={<FractionCalculator />} />
                <Route path="/random-number-generator" element={<RandomNumberGenerator />} />
                <Route path="/triangle-calculator" element={<TriangleCalculator />} />
                <Route path="/standard-deviation-calculator" element={<StandardDeviationCalculator />} />
                <Route path="/quadratic-calculator" element={<QuadraticCalculator />} />
                <Route path="/prime-checker" element={<PrimeChecker />} />
                <Route path="/lcm-gcd-calculator" element={<LCMGCDCalculator />} />
                <Route path="/binary-hex-converter" element={<BinaryHexConverter />} />
                <Route path="/logarithm-calculator" element={<LogarithmCalculator />} />
                <Route path="/exponent-calculator" element={<ExponentCalculator />} />
                <Route path="/permutation-combination-calculator" element={<PermutationCombinationCalculator />} />
                <Route path="/matrix-calculator" element={<MatrixCalculator />} />
                <Route path="/wave-calculator" element={<WaveCalculator />} />
                <Route path="/vector-calculator" element={<VectorCalculator />} />
                <Route path="/permutation-calculator" element={<PermutationCalculator />} />

                {/* Text Tools */}
                <Route path="/word-counter" element={<WordCounter />} />
                <Route path="/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
                <Route path="/uuid-generator" element={<UUIDGenerator />} />
                <Route path="/color-picker" element={<ColorPicker />} />
                <Route path="/json-formatter" element={<JSONFormatter />} />
                <Route path="/readability-calculator" element={<ReadabilityCalculator />} />
                <Route path="/slug-generator" element={<SlugGenerator />} />
                <Route path="/text-scrambler" element={<TextScrambler />} />

                {/* Tech Tools */}
                <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
                <Route path="/hash-generator" element={<HashGenerator />} />
                <Route path="/ip-subnet-calculator" element={<IPSubnetCalculator />} />
                <Route path="/json-formatter-calculator" element={<JSONFormatterCalculator />} />
                <Route path="/hash-generator-calculator" element={<HashGeneratorCalculator />} />
                <Route path="/power-calculator" element={<PowerCalculator />} />

                {/* Sustainability Tools */}
                <Route path="/solar-panel-calculator" element={<SolarPanelCalculator />} />
                <Route path="/ev-savings-calculator" element={<EVSavingsCalculator />} />
                <Route path="/compost-calculator" element={<CompostCalculator />} />
                <Route path="/solar-roi-calculator" element={<SolarROICalculator />} />
                <Route path="/rainwater-calculator" element={<RainwaterCalculator />} />
                <Route path="/plastic-footprint-calculator" element={<PlasticFootprintCalculator />} />

                {/* Real Estate Tools */}
                <Route path="/flooring-calculator" element={<FlooringCalculator />} />
                <Route path="/rental-yield-calculator" element={<RentalYieldCalculator />} />

                {/* Fun Tools */}
                <Route path="/dice-roller" element={<DiceRoller />} />
                <Route path="/random-picker" element={<RandomPicker />} />
                <Route path="/coin-flip" element={<CoinFlip />} />
                <Route path="/numerology-calculator" element={<NumerologyCalculator />} />
                <Route path="/magic-8-ball" element={<Magic8Ball />} />
                <Route path="/baby-name-generator" element={<BabyNameGenerator />} />
                <Route path="/lottery-odds-calculator" element={<LotteryOddsCalculator />} />
                <Route path="/spin-the-wheel" element={<SpinTheWheel />} />
                <Route path="/secret-santa-generator" element={<SecretSantaGenerator />} />
                <Route path="/dog-age-calculator" element={<DogAgeCalculator />} />
                <Route path="/compatibility-calculator" element={<CompatibilityCalculator />} />
                <Route path="/reaction-time-game" element={<ReactionTimeGame />} />

                {/* Converter Tools */}
                <Route path="/cooking-converter" element={<CookingConverter />} />
                <Route path="/temperature-converter" element={<TemperatureConverter />} />
                <Route path="/length-converter" element={<LengthConverter />} />
                <Route path="/time-converter" element={<TimeConverter />} />
                <Route path="/pressure-converter" element={<PressureConverter />} />
                <Route path="/angle-converter" element={<AngleConverter />} />
                <Route path="/recipe-scaler" element={<RecipeScaler />} />
                <Route path="/frequency-converter" element={<FrequencyConverter />} />

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
                <Route path="/fuel-cost-calculator" element={<FuelCostCalculator />} />
                <Route path="/electricity-bill-calculator" element={<ElectricityBillCalculator />} />
                <Route path="/carbon-footprint-calculator" element={<CarbonFootprintCalculator />} />
                <Route path="/paint-calculator" element={<PaintCalculator />} />
                <Route path="/pet-age-calculator" element={<PetAgeCalculator />} />
                <Route path="/tip-split-calculator" element={<TipSplitCalculator />} />
                <Route path="/cgpa-calculator" element={<CGPACalculator />} />
                <Route path="/love-calculator" element={<LoveCalculator />} />
                <Route path="/zodiac-finder" element={<ZodiacFinder />} />
                <Route path="/world-clock" element={<WorldClock />} />
                <Route path="/countdown-timer" element={<CountdownTimer />} />
                <Route path="/stopwatch" element={<Stopwatch />} />
                <Route path="/distance-calculator" element={<DistanceCalculator />} />
                <Route path="/countdown-calculator" element={<CountdownCalculator />} />
                <Route path="/life-stats-calculator" element={<LifeStatsCalculator />} />
                <Route path="/package-dimension-calculator" element={<PackageDimensionCalculator />} />
                <Route path="/stopwatch-calculator" element={<StopwatchCalculator />} />
            </Route>
        </Routes>
    )
}

export default App
