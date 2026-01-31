import { useState, useMemo } from 'react'
import { Hash } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PrimeChecker() {
    const [number, setNumber] = useState(17)

    const results = useMemo(() => {
        const n = Math.abs(Math.floor(number))

        if (n <= 1) return { isPrime: false, factors: [1], message: 'Not a prime number' }
        if (n <= 3) return { isPrime: true, factors: [1, n], message: 'Prime number!' }

        // Find all factors
        const factors = []
        for (let i = 1; i <= n; i++) {
            if (n % i === 0) factors.push(i)
        }

        const isPrime = factors.length === 2

        // Find prime factorization
        const primeFactors = []
        let temp = n
        for (let i = 2; i <= temp; i++) {
            while (temp % i === 0) {
                primeFactors.push(i)
                temp = temp / i
            }
        }

        // Find nearest primes
        const findNearestPrime = (start, direction) => {
            let num = start + direction
            while (num > 1) {
                let isPrimeCheck = true
                for (let i = 2; i <= Math.sqrt(num); i++) {
                    if (num % i === 0) { isPrimeCheck = false; break }
                }
                if (isPrimeCheck && num > 1) return num
                num += direction
            }
            return 2
        }

        return {
            isPrime,
            factors,
            primeFactors,
            message: isPrime ? 'Prime number!' : 'Not a prime number',
            nearestPrimeBefore: isPrime ? n : findNearestPrime(n, -1),
            nearestPrimeAfter: isPrime ? n : findNearestPrime(n, 1)
        }
    }, [number])

    return (
        <CalculatorLayout
            title="Prime Number Checker"
            description="Check if a number is prime and find factors"
            category="Math"
            categoryPath="/math"
            icon={Hash}
            result={results.message}
            resultLabel={`${number} is...`}
        >
            <div className="input-group">
                <label className="input-label">Enter Number</label>
                <input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} min={2} max={100000} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Is Prime?</span>
                    <span className="result-detail-value">{results.isPrime ? 'Yes ✓' : 'No ✗'}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Factors</span>
                    <span className="result-detail-value">{results.factors.slice(0, 8).join(', ')}{results.factors.length > 8 ? '...' : ''}</span>
                </div>
                {results.primeFactors && (
                    <div className="result-detail-row">
                        <span className="result-detail-label">Prime Factorization</span>
                        <span className="result-detail-value">{results.primeFactors.join(' × ')}</span>
                    </div>
                )}
                {!results.isPrime && (
                    <>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Previous Prime</span>
                            <span className="result-detail-value">{results.nearestPrimeBefore}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Next Prime</span>
                            <span className="result-detail-value">{results.nearestPrimeAfter}</span>
                        </div>
                    </>
                )}
            </div>
        </CalculatorLayout>
    )
}

export default PrimeChecker
