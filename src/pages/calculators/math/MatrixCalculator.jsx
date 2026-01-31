import { useState, useMemo } from 'react'
import { Grid3x3 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function MatrixCalculator() {
    const [matrixA, setMatrixA] = useState([[1, 2], [3, 4]])
    const [matrixB, setMatrixB] = useState([[5, 6], [7, 8]])
    const [operation, setOperation] = useState('add')

    const updateCell = (matrix, setMatrix, row, col, value) => {
        const newMatrix = matrix.map((r, i) =>
            r.map((c, j) => (i === row && j === col) ? Number(value) || 0 : c)
        )
        setMatrix(newMatrix)
    }

    const results = useMemo(() => {
        const a = matrixA
        const b = matrixB
        let result = []

        try {
            if (operation === 'add') {
                result = a.map((row, i) => row.map((val, j) => val + b[i][j]))
            } else if (operation === 'subtract') {
                result = a.map((row, i) => row.map((val, j) => val - b[i][j]))
            } else if (operation === 'multiply') {
                // Matrix multiplication
                result = a.map((row, i) =>
                    b[0].map((_, j) =>
                        row.reduce((sum, val, k) => sum + val * b[k][j], 0)
                    )
                )
            } else if (operation === 'determinant') {
                const det = a[0][0] * a[1][1] - a[0][1] * a[1][0]
                return { determinant: det }
            } else if (operation === 'transpose') {
                result = a[0].map((_, i) => a.map(row => row[i]))
            }
            return { matrix: result }
        } catch {
            return { error: 'Invalid operation' }
        }
    }, [matrixA, matrixB, operation])

    const renderMatrix = (matrix, setMatrix, label) => (
        <div style={{ marginBottom: '16px' }}>
            <label className="input-label">{label}</label>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${matrix[0].length}, 60px)`, gap: '4px' }}>
                {matrix.map((row, i) =>
                    row.map((cell, j) => (
                        <input
                            key={`${i}-${j}`}
                            type="number"
                            value={cell}
                            onChange={(e) => updateCell(matrix, setMatrix, i, j, e.target.value)}
                            style={{ width: '60px', textAlign: 'center', padding: '8px' }}
                        />
                    ))
                )}
            </div>
        </div>
    )

    return (
        <CalculatorLayout
            title="Matrix Calculator"
            description="Add, subtract, multiply matrices"
            category="Math"
            categoryPath="/math"
            icon={Grid3x3}
            result={results.determinant !== undefined ? results.determinant : 'Calculated'}
            resultLabel={results.determinant !== undefined ? 'Determinant' : 'Result'}
        >
            <div className="input-group">
                <label className="input-label">Operation</label>
                <select value={operation} onChange={(e) => setOperation(e.target.value)}>
                    <option value="add">Add (A + B)</option>
                    <option value="subtract">Subtract (A - B)</option>
                    <option value="multiply">Multiply (A × B)</option>
                    <option value="determinant">Determinant (A)</option>
                    <option value="transpose">Transpose (A)</option>
                </select>
            </div>
            {renderMatrix(matrixA, setMatrixA, 'Matrix A (2×2)')}
            {!['determinant', 'transpose'].includes(operation) && renderMatrix(matrixB, setMatrixB, 'Matrix B (2×2)')}

            {results.matrix && (
                <div className="result-details">
                    <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px' }}>Result:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${results.matrix[0].length}, 60px)`, gap: '4px' }}>
                        {results.matrix.map((row, i) =>
                            row.map((cell, j) => (
                                <div key={`${i}-${j}`} style={{
                                    background: '#333',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                    fontFamily: 'monospace'
                                }}>
                                    {cell}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default MatrixCalculator
