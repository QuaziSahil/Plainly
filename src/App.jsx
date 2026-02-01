import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import AllCalculators from './pages/AllCalculators'
import FinanceCategory from './pages/categories/FinanceCategory'
import HealthCategory from './pages/categories/HealthCategory'
import MathCategory from './pages/categories/MathCategory'
import ConverterCategory from './pages/categories/ConverterCategory'
import AICategory from './pages/categories/AICategory'

// Company Pages
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import Sitemap from './pages/Sitemap'
import QATestPage from './pages/QATestPage'

// Financial Calculators (38)
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
import BudgetCalculator from './pages/calculators/finance/BudgetCalculator'
import CAGRCalculator from './pages/calculators/finance/CAGRCalculator'
import StockProfitCalculator from './pages/calculators/finance/StockProfitCalculator'
import DividendCalculator from './pages/calculators/finance/DividendCalculator'
import BondYieldCalculator from './pages/calculators/finance/BondYieldCalculator'
import DebtPayoffCalculator from './pages/calculators/finance/DebtPayoffCalculator'
import EmergencyFundCalculator from './pages/calculators/finance/EmergencyFundCalculator'
import SavingsGoalCalculator from './pages/calculators/finance/SavingsGoalCalculator'
import HomeAffordabilityCalculator from './pages/calculators/finance/HomeAffordabilityCalculator'
import RuleOf72Calculator from './pages/calculators/finance/RuleOf72Calculator'
import CompoundGrowthCalculator from './pages/calculators/finance/CompoundGrowthCalculator'
// Finance 2.0 Calculators (25 NEW)
import FIRECalculator from './pages/calculators/finance/FIRECalculator'
import CoastFIRECalculator from './pages/calculators/finance/CoastFIRECalculator'
import LeanFIRECalculator from './pages/calculators/finance/LeanFIRECalculator'
import FatFIRECalculator from './pages/calculators/finance/FatFIRECalculator'
import CryptoPortfolioCalculator from './pages/calculators/finance/CryptoPortfolioCalculator'
import DeFiYieldCalculator from './pages/calculators/finance/DeFiYieldCalculator'
import NFTProfitCalculator from './pages/calculators/finance/NFTProfitCalculator'
import StakingRewardsCalculator from './pages/calculators/finance/StakingRewardsCalculator'
import GasFeeCalculator from './pages/calculators/finance/GasFeeCalculator'
import DollarCostAveragingCalculator from './pages/calculators/finance/DollarCostAveragingCalculator'
import SideHustleCalculator from './pages/calculators/finance/SideHustleCalculator'
import FreelanceRateCalculator from './pages/calculators/finance/FreelanceRateCalculator'
import InvoiceGeneratorCalculator from './pages/calculators/finance/InvoiceGeneratorCalculator'
import HourlyToSalaryConverter from './pages/calculators/finance/HourlyToSalaryConverter'
import TakeHomePayCalculator from './pages/calculators/finance/TakeHomePayCalculator'
import PaycheckCalculator from './pages/calculators/finance/PaycheckCalculator'
import OvertimeCalculator from './pages/calculators/finance/OvertimeCalculator'
import CommissionCalculator from './pages/calculators/finance/CommissionCalculator'
import SubscriptionCostCalculator from './pages/calculators/finance/SubscriptionCostCalculator'
import CostPerUseCalculator from './pages/calculators/finance/CostPerUseCalculator'
import RentAffordabilityCalculator from './pages/calculators/finance/RentAffordabilityCalculator'
import UtilityBillSplitter from './pages/calculators/finance/UtilityBillSplitter'
import WealthTaxCalculator from './pages/calculators/finance/WealthTaxCalculator'
import EstateTaxCalculator from './pages/calculators/finance/EstateTaxCalculator'
import GiftTaxCalculator from './pages/calculators/finance/GiftTaxCalculator'

// Health Calculators (27)
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
import CaffeineCalculator from './pages/calculators/health/CaffeineCalculator'
import CalorieBurnCalculator from './pages/calculators/health/CalorieBurnCalculator'
import LeanBodyMassCalculator from './pages/calculators/health/LeanBodyMassCalculator'
import SleepCycleCalculator from './pages/calculators/health/SleepCycleCalculator'
import VO2MaxCalculator from './pages/calculators/health/VO2MaxCalculator'
import RunningCalorieCalculator from './pages/calculators/health/RunningCalorieCalculator'
import PregnancyWeightCalculator from './pages/calculators/health/PregnancyWeightCalculator'

// Math Calculators (28)
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
import CircleCalculator from './pages/calculators/math/CircleCalculator'
import FactorialCalculator from './pages/calculators/math/FactorialCalculator'
import MeanMedianModeCalculator from './pages/calculators/math/MeanMedianModeCalculator'
import ProbabilityCalculator from './pages/calculators/math/ProbabilityCalculator'
import PythagoreanCalculator from './pages/calculators/math/PythagoreanCalculator'
import QuadraticSolver from './pages/calculators/math/QuadraticSolver'
import RomanNumeralConverter from './pages/calculators/math/RomanNumeralConverter'
import SphereCalculator from './pages/calculators/math/SphereCalculator'
import TrigonometryCalculator from './pages/calculators/math/TrigonometryCalculator'
import GCDLCMCalculator from './pages/calculators/math/GCDLCMCalculator'

// Text Tools (11)
import WordCounter from './pages/calculators/text/WordCounter'
import LoremIpsumGenerator from './pages/calculators/text/LoremIpsumGenerator'
import UUIDGenerator from './pages/calculators/text/UUIDGenerator'
import ColorPicker from './pages/calculators/text/ColorPicker'
import JSONFormatter from './pages/calculators/text/JSONFormatter'
import ReadabilityCalculator from './pages/calculators/text/ReadabilityCalculator'
import SlugGenerator from './pages/calculators/text/SlugGenerator'
import TextScrambler from './pages/calculators/text/TextScrambler'
import DuplicateRemover from './pages/calculators/text/DuplicateRemover'
import TextReverser from './pages/calculators/text/TextReverser'
import TextSorter from './pages/calculators/text/TextSorter'

// Tech Tools (13)
import QRCodeGenerator from './pages/calculators/tech/QRCodeGenerator'
import HashGenerator from './pages/calculators/tech/HashGenerator'
import IPSubnetCalculator from './pages/calculators/tech/IPSubnetCalculator'
import JSONFormatterCalculator from './pages/calculators/tech/JSONFormatterCalculator'
import HashGeneratorCalculator from './pages/calculators/tech/HashGeneratorCalculator'
import PowerCalculator from './pages/calculators/tech/PowerCalculator'
import Base64Encoder from './pages/calculators/tech/Base64Encoder'
import ColorConverter from './pages/calculators/tech/ColorConverter'
import MarkdownPreviewer from './pages/calculators/tech/MarkdownPreviewer'
import NumberBaseConverter from './pages/calculators/tech/NumberBaseConverter'
import TechPasswordGenerator from './pages/calculators/tech/PasswordGenerator'
import RegexTester from './pages/calculators/tech/RegexTester'
import URLEncoder from './pages/calculators/tech/URLEncoder'

// Sustainability Tools (9)
import SolarPanelCalculator from './pages/calculators/sustainability/SolarPanelCalculator'
import EVSavingsCalculator from './pages/calculators/sustainability/EVSavingsCalculator'
import CompostCalculator from './pages/calculators/sustainability/CompostCalculator'
import SolarROICalculator from './pages/calculators/sustainability/SolarROICalculator'
import RainwaterCalculator from './pages/calculators/sustainability/RainwaterCalculator'
import PlasticFootprintCalculator from './pages/calculators/sustainability/PlasticFootprintCalculator'
import ElectricityUsageCalculator from './pages/calculators/sustainability/ElectricityUsageCalculator'
import TreeCarbonCalculator from './pages/calculators/sustainability/TreeCarbonCalculator'
import RainwaterHarvestCalculator from './pages/calculators/sustainability/RainwaterHarvestCalculator'

// Real Estate Tools (7)
import FlooringCalculator from './pages/calculators/realestate/FlooringCalculator'
import RentalYieldCalculator from './pages/calculators/realestate/RentalYieldCalculator'
import FenceCalculator from './pages/calculators/realestate/FenceCalculator'
import TileCalculator from './pages/calculators/realestate/TileCalculator'
import WallpaperCalculator from './pages/calculators/realestate/WallpaperCalculator'
import MulchCalculator from './pages/calculators/realestate/MulchCalculator'
import PoolVolumeCalculator from './pages/calculators/realestate/PoolVolumeCalculator'

// Fun Tools (17)
import DiceRoller from './pages/calculators/fun/DiceRoller'
import RandomPicker from './pages/calculators/fun/RandomPicker'
import CoinFlip from './pages/calculators/fun/CoinFlip'
import NumerologyCalculator from './pages/calculators/fun/NumerologyCalculator'

import BabyNameGenerator from './pages/calculators/fun/BabyNameGenerator'
import LotteryOddsCalculator from './pages/calculators/fun/LotteryOddsCalculator'
import SpinTheWheel from './pages/calculators/fun/SpinTheWheel'
import SecretSantaGenerator from './pages/calculators/fun/SecretSantaGenerator'
import DogAgeCalculator from './pages/calculators/fun/DogAgeCalculator'
import CompatibilityCalculator from './pages/calculators/fun/CompatibilityCalculator'
import ReactionTimeGame from './pages/calculators/fun/ReactionTimeGame'
import TeamRandomizer from './pages/calculators/fun/TeamRandomizer'
import WouldYouRather from './pages/calculators/fun/WouldYouRather'
import ScoreKeeper from './pages/calculators/fun/ScoreKeeper'
import BracketGenerator from './pages/calculators/fun/BracketGenerator'
import MagicEightBall from './pages/calculators/fun/MagicEightBall'

// AI Tools (5)
import ParagraphGenerator from './pages/calculators/ai/ParagraphGenerator'
import TextSummarizer from './pages/calculators/ai/TextSummarizer'
import AITranslator from './pages/calculators/ai/AITranslator'
import BusinessNameGenerator from './pages/calculators/ai/BusinessNameGenerator'
import HashtagGenerator from './pages/calculators/ai/HashtagGenerator'
import AIEmailGenerator from './pages/calculators/ai/AIEmailGenerator'
import AICoverLetterGenerator from './pages/calculators/ai/AICoverLetterGenerator'
import AIResumeSummaryGenerator from './pages/calculators/ai/AIResumeSummaryGenerator'
import AIProductDescriptionGenerator from './pages/calculators/ai/AIProductDescriptionGenerator'
import AISloganGenerator from './pages/calculators/ai/AISloganGenerator'
import AITweetGenerator from './pages/calculators/ai/AITweetGenerator'
import AIInstagramCaptionGenerator from './pages/calculators/ai/AIInstagramCaptionGenerator'
import AIYouTubeTitleGenerator from './pages/calculators/ai/AIYouTubeTitleGenerator'
import AIBlogPostGenerator from './pages/calculators/ai/AIBlogPostGenerator'
import AIMetaDescriptionGenerator from './pages/calculators/ai/AIMetaDescriptionGenerator'
import AIParaphraser from './pages/calculators/ai/AIParaphraser'
import AILinkedInPostGenerator from './pages/calculators/ai/AILinkedInPostGenerator'
import AIGrammarChecker from './pages/calculators/ai/AIGrammarChecker'
import AIVoiceTransformer from './pages/calculators/ai/AIVoiceTransformer'
import AISentenceExpander from './pages/calculators/ai/AISentenceExpander'
import AISentenceShortener from './pages/calculators/ai/AISentenceShortener'
import AIEssayOutlineGenerator from './pages/calculators/ai/AIEssayOutlineGenerator'
import AIMeetingNotesGenerator from './pages/calculators/ai/AIMeetingNotesGenerator'
import AIStoryStarterGenerator from './pages/calculators/ai/AIStoryStarterGenerator'
import AIPlotGenerator from './pages/calculators/ai/AIPlotGenerator'
import AIPoemGenerator from './pages/calculators/ai/AIPoemGenerator'
import AISongLyricsGenerator from './pages/calculators/ai/AISongLyricsGenerator'
import AIJokeGenerator from './pages/calculators/ai/AIJokeGenerator'
import AIQuoteGenerator from './pages/calculators/ai/AIQuoteGenerator'
import AIPickupLineGenerator from './pages/calculators/ai/AIPickupLineGenerator'
import AIBandNameGenerator from './pages/calculators/ai/AIBandNameGenerator'
import AIRapNameGenerator from './pages/calculators/ai/AIRapNameGenerator'
import AIUsernameGenerator from './pages/calculators/ai/AIUsernameGenerator'
import AIColorPaletteGenerator from './pages/calculators/ai/AIColorPaletteGenerator'
import AIMeetingAgendaGenerator from './pages/calculators/ai/AIMeetingAgendaGenerator'
// AI Code & Development Tools (20 NEW)
import AICodeGenerator from './pages/calculators/ai/AICodeGenerator'
import AICodeDebugger from './pages/calculators/ai/AICodeDebugger'
import AICodeExplainer from './pages/calculators/ai/AICodeExplainer'
import AICodeConverter from './pages/calculators/ai/AICodeConverter'
import AISQLGenerator from './pages/calculators/ai/AISQLGenerator'
import AIRegexGenerator from './pages/calculators/ai/AIRegexGenerator'
import AIGitCommitGenerator from './pages/calculators/ai/AIGitCommitGenerator'
import AIAPIDocGenerator from './pages/calculators/ai/AIAPIDocGenerator'
import AIUnitTestGenerator from './pages/calculators/ai/AIUnitTestGenerator'
import AICodeCommentGenerator from './pages/calculators/ai/AICodeCommentGenerator'
import AICodeReviewAssistant from './pages/calculators/ai/AICodeReviewAssistant'
import AIVariableNameGenerator from './pages/calculators/ai/AIVariableNameGenerator'
import AICSSGenerator from './pages/calculators/ai/AICSSGenerator'
import AIHTMLGenerator from './pages/calculators/ai/AIHTMLGenerator'
import AIReactComponentGenerator from './pages/calculators/ai/AIReactComponentGenerator'
import AIRESTAPIDesigner from './pages/calculators/ai/AIRESTAPIDesigner'
import AIDatabaseSchemaGenerator from './pages/calculators/ai/AIDatabaseSchemaGenerator'
import AIAlgorithmSelector from './pages/calculators/ai/AIAlgorithmSelector'
import AITechStackRecommender from './pages/calculators/ai/AITechStackRecommender'
import AIFunctionNameGenerator from './pages/calculators/ai/AIFunctionNameGenerator'
import AICodePreview from './pages/calculators/ai/AICodePreview'
import AICodeRunner from './pages/calculators/ai/AICodeRunner'

// Converter Tools (15)
import CookingConverter from './pages/calculators/converter/CookingConverter'
import TemperatureConverter from './pages/calculators/converter/TemperatureConverter'
import LengthConverter from './pages/calculators/converter/LengthConverter'
import TimeConverter from './pages/calculators/converter/TimeConverter'
import PressureConverter from './pages/calculators/converter/PressureConverter'
import AngleConverter from './pages/calculators/converter/AngleConverter'
import RecipeScaler from './pages/calculators/converter/RecipeScaler'
import FrequencyConverter from './pages/calculators/converter/FrequencyConverter'
import AreaConverter from './pages/calculators/converter/AreaConverter'
import DataStorageConverter from './pages/calculators/converter/DataStorageConverter'
import EnergyConverter from './pages/calculators/converter/EnergyConverter'
import SpeedConverter from './pages/calculators/converter/SpeedConverter'
import WeightConverter from './pages/calculators/converter/WeightConverter'
import VolumeConverter from './pages/calculators/converter/VolumeConverter'
import ConverterCurrencyConverter from './pages/calculators/converter/CurrencyConverter'
import ShoeSizeConverter from './pages/calculators/converter/ShoeSizeConverter'

// Other Calculators (39)
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
import CarDepreciationCalculator from './pages/calculators/other/CarDepreciationCalculator'
import MPGCalculator from './pages/calculators/other/MPGCalculator'
import ReadingSpeedCalculator from './pages/calculators/other/ReadingSpeedCalculator'
import TypingSpeedCalculator from './pages/calculators/other/TypingSpeedCalculator'
import TimezoneConverter from './pages/calculators/other/TimezoneConverter'
import UnixTimestampConverter from './pages/calculators/other/UnixTimestampConverter'
import WeightedGPACalculator from './pages/calculators/other/WeightedGPACalculator'
import WorkdaysCalculator from './pages/calculators/other/WorkdaysCalculator'
import ScreenTimeCalculator from './pages/calculators/other/ScreenTimeCalculator'

// Scroll to top on route change
function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}

function App() {
    return (
        <>
            <ScrollToTop />
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
                    <Route path="/qa-test" element={<QATestPage />} />

                    {/* Category Pages */}
                    <Route path="/finance" element={<FinanceCategory />} />
                    <Route path="/health" element={<HealthCategory />} />
                    <Route path="/math" element={<MathCategory />} />
                    <Route path="/converter" element={<ConverterCategory />} />
                    <Route path="/ai" element={<AICategory />} />

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
                    <Route path="/budget-calculator" element={<BudgetCalculator />} />
                    <Route path="/cagr-calculator" element={<CAGRCalculator />} />
                    <Route path="/stock-profit-calculator" element={<StockProfitCalculator />} />
                    <Route path="/dividend-calculator" element={<DividendCalculator />} />
                    <Route path="/bond-yield-calculator" element={<BondYieldCalculator />} />
                    <Route path="/debt-payoff-calculator" element={<DebtPayoffCalculator />} />
                    <Route path="/emergency-fund-calculator" element={<EmergencyFundCalculator />} />
                    <Route path="/savings-goal-calculator" element={<SavingsGoalCalculator />} />
                    <Route path="/home-affordability-calculator" element={<HomeAffordabilityCalculator />} />
                    <Route path="/rule-of-72-calculator" element={<RuleOf72Calculator />} />
                    <Route path="/compound-growth-calculator" element={<CompoundGrowthCalculator />} />
                    {/* Finance 2.0 Calculators */}
                    <Route path="/fire-calculator" element={<FIRECalculator />} />
                    <Route path="/coast-fire-calculator" element={<CoastFIRECalculator />} />
                    <Route path="/lean-fire-calculator" element={<LeanFIRECalculator />} />
                    <Route path="/fat-fire-calculator" element={<FatFIRECalculator />} />
                    <Route path="/crypto-portfolio-calculator" element={<CryptoPortfolioCalculator />} />
                    <Route path="/defi-yield-calculator" element={<DeFiYieldCalculator />} />
                    <Route path="/nft-profit-calculator" element={<NFTProfitCalculator />} />
                    <Route path="/staking-rewards-calculator" element={<StakingRewardsCalculator />} />
                    <Route path="/gas-fee-calculator" element={<GasFeeCalculator />} />
                    <Route path="/dca-calculator" element={<DollarCostAveragingCalculator />} />
                    <Route path="/side-hustle-calculator" element={<SideHustleCalculator />} />
                    <Route path="/freelance-rate-calculator" element={<FreelanceRateCalculator />} />
                    <Route path="/invoice-generator" element={<InvoiceGeneratorCalculator />} />
                    <Route path="/hourly-to-salary-converter" element={<HourlyToSalaryConverter />} />
                    <Route path="/take-home-pay-calculator" element={<TakeHomePayCalculator />} />
                    <Route path="/paycheck-calculator" element={<PaycheckCalculator />} />
                    <Route path="/overtime-calculator" element={<OvertimeCalculator />} />
                    <Route path="/commission-calculator" element={<CommissionCalculator />} />
                    <Route path="/subscription-cost-calculator" element={<SubscriptionCostCalculator />} />
                    <Route path="/cost-per-use-calculator" element={<CostPerUseCalculator />} />
                    <Route path="/rent-affordability-calculator" element={<RentAffordabilityCalculator />} />
                    <Route path="/utility-bill-splitter" element={<UtilityBillSplitter />} />
                    <Route path="/wealth-tax-calculator" element={<WealthTaxCalculator />} />
                    <Route path="/estate-tax-calculator" element={<EstateTaxCalculator />} />
                    <Route path="/gift-tax-calculator" element={<GiftTaxCalculator />} />

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
                    <Route path="/caffeine-calculator" element={<CaffeineCalculator />} />
                    <Route path="/calorie-burn-calculator" element={<CalorieBurnCalculator />} />
                    <Route path="/lean-body-mass-calculator" element={<LeanBodyMassCalculator />} />
                    <Route path="/sleep-cycle-calculator" element={<SleepCycleCalculator />} />
                    <Route path="/vo2-max-calculator" element={<VO2MaxCalculator />} />
                    <Route path="/running-calorie-calculator" element={<RunningCalorieCalculator />} />
                    <Route path="/pregnancy-weight-calculator" element={<PregnancyWeightCalculator />} />

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
                    <Route path="/circle-calculator" element={<CircleCalculator />} />
                    <Route path="/factorial-calculator" element={<FactorialCalculator />} />
                    <Route path="/mean-median-mode-calculator" element={<MeanMedianModeCalculator />} />
                    <Route path="/probability-calculator" element={<ProbabilityCalculator />} />
                    <Route path="/pythagorean-calculator" element={<PythagoreanCalculator />} />
                    <Route path="/quadratic-solver" element={<QuadraticSolver />} />
                    <Route path="/roman-numeral-converter" element={<RomanNumeralConverter />} />
                    <Route path="/sphere-calculator" element={<SphereCalculator />} />
                    <Route path="/trigonometry-calculator" element={<TrigonometryCalculator />} />
                    <Route path="/gcd-lcm-calculator" element={<GCDLCMCalculator />} />

                    {/* Text Tools */}
                    <Route path="/word-counter" element={<WordCounter />} />
                    <Route path="/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
                    <Route path="/uuid-generator" element={<UUIDGenerator />} />
                    <Route path="/color-picker" element={<ColorPicker />} />
                    <Route path="/json-formatter" element={<JSONFormatter />} />
                    <Route path="/readability-calculator" element={<ReadabilityCalculator />} />
                    <Route path="/slug-generator" element={<SlugGenerator />} />
                    <Route path="/text-scrambler" element={<TextScrambler />} />
                    <Route path="/duplicate-remover" element={<DuplicateRemover />} />
                    <Route path="/text-reverser" element={<TextReverser />} />
                    <Route path="/text-sorter" element={<TextSorter />} />

                    {/* Tech Tools */}
                    <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
                    <Route path="/hash-generator" element={<HashGenerator />} />
                    <Route path="/ip-subnet-calculator" element={<IPSubnetCalculator />} />
                    <Route path="/json-formatter-calculator" element={<JSONFormatterCalculator />} />
                    <Route path="/hash-generator-calculator" element={<HashGeneratorCalculator />} />
                    <Route path="/power-calculator" element={<PowerCalculator />} />
                    <Route path="/base64-encoder" element={<Base64Encoder />} />
                    <Route path="/color-converter" element={<ColorConverter />} />
                    <Route path="/markdown-previewer" element={<MarkdownPreviewer />} />
                    <Route path="/number-base-converter" element={<NumberBaseConverter />} />
                    <Route path="/password-generator" element={<PasswordGenerator />} />
                    <Route path="/regex-tester" element={<RegexTester />} />
                    <Route path="/url-encoder" element={<URLEncoder />} />

                    {/* Sustainability Tools */}
                    <Route path="/solar-panel-calculator" element={<SolarPanelCalculator />} />
                    <Route path="/ev-savings-calculator" element={<EVSavingsCalculator />} />
                    <Route path="/compost-calculator" element={<CompostCalculator />} />
                    <Route path="/solar-roi-calculator" element={<SolarROICalculator />} />
                    <Route path="/rainwater-calculator" element={<RainwaterCalculator />} />
                    <Route path="/plastic-footprint-calculator" element={<PlasticFootprintCalculator />} />
                    <Route path="/electricity-usage-calculator" element={<ElectricityUsageCalculator />} />
                    <Route path="/tree-carbon-calculator" element={<TreeCarbonCalculator />} />
                    <Route path="/rainwater-harvest-calculator" element={<RainwaterHarvestCalculator />} />

                    {/* Real Estate Tools */}
                    <Route path="/flooring-calculator" element={<FlooringCalculator />} />
                    <Route path="/rental-yield-calculator" element={<RentalYieldCalculator />} />
                    <Route path="/fence-calculator" element={<FenceCalculator />} />
                    <Route path="/tile-calculator" element={<TileCalculator />} />
                    <Route path="/wallpaper-calculator" element={<WallpaperCalculator />} />
                    <Route path="/paint-calculator" element={<PaintCalculator />} />
                    <Route path="/concrete-calculator" element={<ConcreteCalculator />} />
                    <Route path="/mulch-calculator" element={<MulchCalculator />} />
                    <Route path="/pool-volume-calculator" element={<PoolVolumeCalculator />} />

                    {/* Fun Tools */}
                    <Route path="/dice-roller" element={<DiceRoller />} />
                    <Route path="/random-picker" element={<RandomPicker />} />
                    <Route path="/coin-flip" element={<CoinFlip />} />
                    <Route path="/numerology-calculator" element={<NumerologyCalculator />} />
                    <Route path="/magic-8-ball" element={<MagicEightBall />} />
                    <Route path="/baby-name-generator" element={<BabyNameGenerator />} />
                    <Route path="/lottery-odds-calculator" element={<LotteryOddsCalculator />} />
                    <Route path="/spin-the-wheel" element={<SpinTheWheel />} />
                    <Route path="/secret-santa-generator" element={<SecretSantaGenerator />} />
                    <Route path="/dog-age-calculator" element={<DogAgeCalculator />} />
                    <Route path="/compatibility-calculator" element={<CompatibilityCalculator />} />
                    <Route path="/reaction-time-game" element={<ReactionTimeGame />} />
                    <Route path="/team-randomizer" element={<TeamRandomizer />} />
                    <Route path="/would-you-rather" element={<WouldYouRather />} />
                    <Route path="/score-keeper" element={<ScoreKeeper />} />
                    <Route path="/bracket-generator" element={<BracketGenerator />} />
                    <Route path="/magic-eight-ball" element={<MagicEightBall />} />
                    <Route path="/love-calculator" element={<LoveCalculator />} />
                    <Route path="/zodiac-finder" element={<ZodiacFinder />} />
                    <Route path="/pet-age-calculator" element={<PetAgeCalculator />} />

                    {/* AI Tools */}
                    <Route path="/ai-paragraph-generator" element={<ParagraphGenerator />} />
                    <Route path="/ai-text-summarizer" element={<TextSummarizer />} />
                    <Route path="/ai-translator" element={<AITranslator />} />
                    <Route path="/ai-business-name-generator" element={<BusinessNameGenerator />} />
                    <Route path="/ai-hashtag-generator" element={<HashtagGenerator />} />
                    <Route path="/ai-email-generator" element={<AIEmailGenerator />} />
                    <Route path="/ai-cover-letter-generator" element={<AICoverLetterGenerator />} />
                    <Route path="/ai-resume-summary-generator" element={<AIResumeSummaryGenerator />} />
                    <Route path="/ai-product-description-generator" element={<AIProductDescriptionGenerator />} />
                    <Route path="/ai-slogan-generator" element={<AISloganGenerator />} />
                    <Route path="/ai-tweet-generator" element={<AITweetGenerator />} />
                    <Route path="/ai-instagram-caption-generator" element={<AIInstagramCaptionGenerator />} />
                    <Route path="/ai-youtube-title-generator" element={<AIYouTubeTitleGenerator />} />
                    <Route path="/ai-blog-post-generator" element={<AIBlogPostGenerator />} />
                    <Route path="/ai-meta-description-generator" element={<AIMetaDescriptionGenerator />} />
                    <Route path="/ai-paraphraser" element={<AIParaphraser />} />
                    <Route path="/ai-linkedin-post-generator" element={<AILinkedInPostGenerator />} />
                    <Route path="/ai-grammar-checker" element={<AIGrammarChecker />} />
                    <Route path="/ai-voice-transformer" element={<AIVoiceTransformer />} />
                    <Route path="/ai-sentence-expander" element={<AISentenceExpander />} />
                    <Route path="/ai-sentence-shortener" element={<AISentenceShortener />} />
                    <Route path="/ai-essay-outline-generator" element={<AIEssayOutlineGenerator />} />
                    <Route path="/ai-meeting-notes-generator" element={<AIMeetingNotesGenerator />} />
                    <Route path="/ai-story-starter-generator" element={<AIStoryStarterGenerator />} />
                    <Route path="/ai-plot-generator" element={<AIPlotGenerator />} />
                    <Route path="/ai-poem-generator" element={<AIPoemGenerator />} />
                    <Route path="/ai-song-lyrics-generator" element={<AISongLyricsGenerator />} />
                    <Route path="/ai-joke-generator" element={<AIJokeGenerator />} />
                    <Route path="/ai-quote-generator" element={<AIQuoteGenerator />} />
                    <Route path="/ai-pickup-line-generator" element={<AIPickupLineGenerator />} />
                    <Route path="/ai-band-name-generator" element={<AIBandNameGenerator />} />
                    <Route path="/ai-rap-name-generator" element={<AIRapNameGenerator />} />
                    <Route path="/ai-username-generator" element={<AIUsernameGenerator />} />
                    <Route path="/ai-color-palette-generator" element={<AIColorPaletteGenerator />} />
                    <Route path="/ai-meeting-agenda-generator" element={<AIMeetingAgendaGenerator />} />
                    {/* AI Code & Development Tools (20 NEW) */}
                    <Route path="/ai-code-generator" element={<AICodeGenerator />} />
                    <Route path="/ai-code-debugger" element={<AICodeDebugger />} />
                    <Route path="/ai-code-explainer" element={<AICodeExplainer />} />
                    <Route path="/ai-code-converter" element={<AICodeConverter />} />
                    <Route path="/ai-sql-generator" element={<AISQLGenerator />} />
                    <Route path="/ai-regex-generator" element={<AIRegexGenerator />} />
                    <Route path="/ai-git-commit-generator" element={<AIGitCommitGenerator />} />
                    <Route path="/ai-api-doc-generator" element={<AIAPIDocGenerator />} />
                    <Route path="/ai-unit-test-generator" element={<AIUnitTestGenerator />} />
                    <Route path="/ai-code-comment-generator" element={<AICodeCommentGenerator />} />
                    <Route path="/ai-code-review-assistant" element={<AICodeReviewAssistant />} />
                    <Route path="/ai-variable-name-generator" element={<AIVariableNameGenerator />} />
                    <Route path="/ai-css-generator" element={<AICSSGenerator />} />
                    <Route path="/ai-html-generator" element={<AIHTMLGenerator />} />
                    <Route path="/ai-react-component-generator" element={<AIReactComponentGenerator />} />
                    <Route path="/ai-rest-api-designer" element={<AIRESTAPIDesigner />} />
                    <Route path="/ai-database-schema-generator" element={<AIDatabaseSchemaGenerator />} />
                    <Route path="/ai-algorithm-selector" element={<AIAlgorithmSelector />} />
                    <Route path="/ai-tech-stack-recommender" element={<AITechStackRecommender />} />
                    <Route path="/ai-function-name-generator" element={<AIFunctionNameGenerator />} />
                    <Route path="/ai-code-preview" element={<AICodePreview />} />
                    <Route path="/ai-code-runner" element={<AICodeRunner />} />

                    {/* Converter Tools */}
                    <Route path="/cooking-converter" element={<CookingConverter />} />
                    <Route path="/temperature-converter" element={<TemperatureConverter />} />
                    <Route path="/length-converter" element={<LengthConverter />} />
                    <Route path="/time-converter" element={<TimeConverter />} />
                    <Route path="/pressure-converter" element={<PressureConverter />} />
                    <Route path="/angle-converter" element={<AngleConverter />} />
                    <Route path="/recipe-scaler" element={<RecipeScaler />} />
                    <Route path="/frequency-converter" element={<FrequencyConverter />} />
                    <Route path="/area-converter" element={<AreaConverter />} />
                    <Route path="/data-storage-converter" element={<DataStorageConverter />} />
                    <Route path="/energy-converter" element={<EnergyConverter />} />
                    <Route path="/speed-converter" element={<SpeedConverter />} />
                    <Route path="/weight-converter" element={<WeightConverter />} />
                    <Route path="/volume-converter" element={<VolumeConverter />} />
                    <Route path="/unit-converter" element={<UnitConverter />} />
                    <Route path="/conversion-calculator" element={<ConversionCalculator />} />

                    {/* Other Calculators */}
                    <Route path="/age-calculator" element={<AgeCalculator />} />
                    <Route path="/date-calculator" element={<DateCalculator />} />
                    <Route path="/gpa-calculator" element={<GPACalculator />} />
                    <Route path="/discount-calculator" element={<DiscountCalculator />} />
                    <Route path="/time-calculator" element={<TimeCalculator />} />
                    <Route path="/hours-calculator" element={<HoursCalculator />} />
                    <Route path="/grade-calculator" element={<GradeCalculator />} />
                    <Route path="/subnet-calculator" element={<SubnetCalculator />} />
                    <Route path="/fuel-cost-calculator" element={<FuelCostCalculator />} />
                    <Route path="/electricity-bill-calculator" element={<ElectricityBillCalculator />} />
                    <Route path="/carbon-footprint-calculator" element={<CarbonFootprintCalculator />} />
                    <Route path="/tip-split-calculator" element={<TipSplitCalculator />} />
                    <Route path="/cgpa-calculator" element={<CGPACalculator />} />
                    <Route path="/world-clock" element={<WorldClock />} />
                    <Route path="/countdown-timer" element={<CountdownTimer />} />
                    <Route path="/stopwatch" element={<Stopwatch />} />
                    <Route path="/distance-calculator" element={<DistanceCalculator />} />
                    <Route path="/countdown-calculator" element={<CountdownCalculator />} />
                    <Route path="/life-stats-calculator" element={<LifeStatsCalculator />} />
                    <Route path="/package-dimension-calculator" element={<PackageDimensionCalculator />} />
                    <Route path="/stopwatch-calculator" element={<StopwatchCalculator />} />
                    <Route path="/car-depreciation-calculator" element={<CarDepreciationCalculator />} />
                    <Route path="/mpg-calculator" element={<MPGCalculator />} />
                    <Route path="/reading-speed-calculator" element={<ReadingSpeedCalculator />} />
                    <Route path="/typing-speed-calculator" element={<TypingSpeedCalculator />} />
                    <Route path="/timezone-converter" element={<TimezoneConverter />} />
                    <Route path="/unix-timestamp-converter" element={<UnixTimestampConverter />} />
                    <Route path="/weighted-gpa-calculator" element={<WeightedGPACalculator />} />
                    <Route path="/workdays-calculator" element={<WorkdaysCalculator />} />
                    <Route path="/screen-time-calculator" element={<ScreenTimeCalculator />} />
                    <Route path="/shoe-size-converter" element={<ShoeSizeConverter />} />
                </Route>
            </Routes>
        </>
    )
}

export default App
