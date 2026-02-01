import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { allCalculators } from '../data/calculators'

function QATestPage() {
    const [testResults, setTestResults] = useState({})

    const [filter, setFilter] = useState('all')



    // Group calculators by category
    const categories = [...new Set(allCalculators.map(c => c.category))]

    const getStatusIcon = (status) => {
        if (status === 'pass') return <CheckCircle size={18} color="#10b981" />
        if (status === 'fail') return <XCircle size={18} color="#ef4444" />
        if (status === 'warning') return <AlertCircle size={18} color="#f59e0b" />
        return <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#333' }} />
    }

    const stats = {
        total: allCalculators.length,
        tested: Object.keys(testResults).length,
        passed: Object.values(testResults).filter(r => r.status === 'pass').length,
        failed: Object.values(testResults).filter(r => r.status === 'fail').length,
        warnings: Object.values(testResults).filter(r => r.status === 'warning').length
    }

    const filteredCalculators = allCalculators.filter(calc => {
        if (filter === 'all') return true
        if (filter === 'untested') return !testResults[calc.path]
        if (filter === 'passed') return testResults[calc.path]?.status === 'pass'
        if (filter === 'failed') return testResults[calc.path]?.status === 'fail'
        if (filter === 'warnings') return testResults[calc.path]?.status === 'warning'
        return calc.category === filter
    })

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            color: 'white',
            padding: '24px'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div>
                        <h1 style={{ fontSize: '28px', margin: 0 }}>🧪 QA Test Dashboard</h1>
                        <p style={{ opacity: 0.6, marginTop: '8px' }}>
                            Test and verify all {allCalculators.length} calculators
                        </p>
                    </div>
                    <Link to="/" style={{
                        color: '#a78bfa',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        ← Back to Home
                    </Link>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px'
                }}>
                    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.total}</div>
                        <div style={{ opacity: 0.6, fontSize: '14px' }}>Total Tools</div>
                    </div>
                    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{stats.passed}</div>
                        <div style={{ opacity: 0.6, fontSize: '14px' }}>Passed</div>
                    </div>
                    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.warnings}</div>
                        <div style={{ opacity: 0.6, fontSize: '14px' }}>Warnings</div>
                    </div>
                    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{stats.failed}</div>
                        <div style={{ opacity: 0.6, fontSize: '14px' }}>Failed</div>
                    </div>
                    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1' }}>
                            {stats.total - stats.tested}
                        </div>
                        <div style={{ opacity: 0.6, fontSize: '14px' }}>Untested</div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '24px',
                    flexWrap: 'wrap'
                }}>
                    {['all', 'untested', 'passed', 'warnings', 'failed', ...categories].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '8px 16px',
                                background: filter === f ? '#6366f1' : '#222',
                                border: 'none',
                                borderRadius: '20px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '14px',
                                textTransform: 'capitalize'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Required Features Checklist */}
                <div style={{
                    background: '#1a1a1a',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    marginBottom: '24px'
                }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                        ✅ Required Features for Each Calculator:
                    </div>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '14px', opacity: 0.8 }}>
                        <span>• Input fields that work</span>
                        <span>• Shows calculated result</span>
                        <span>• Has reset/regenerate option</span>
                        <span>• No console errors</span>
                        <span>• Mobile responsive</span>
                    </div>
                </div>

                {/* Calculator List */}
                <div style={{
                    display: 'grid',
                    gap: '8px'
                }}>
                    {filteredCalculators.map((calc, i) => {
                        const result = testResults[calc.path]
                        return (
                            <div
                                key={calc.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    background: '#1a1a1a',
                                    padding: '16px 20px',
                                    borderRadius: '8px',
                                    borderLeft: `3px solid ${result?.status === 'pass' ? '#10b981' :
                                        result?.status === 'fail' ? '#ef4444' :
                                            result?.status === 'warning' ? '#f59e0b' : '#333'
                                        }`
                                }}
                            >
                                <div style={{ width: '30px', textAlign: 'center', opacity: 0.4 }}>
                                    {i + 1}
                                </div>
                                {getStatusIcon(result?.status)}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '500' }}>{calc.name}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.5 }}>
                                        {calc.category} • {calc.path}
                                    </div>
                                </div>
                                {result?.notes && (
                                    <div style={{
                                        fontSize: '12px',
                                        color: result.status === 'fail' ? '#ef4444' : '#f59e0b',
                                        maxWidth: '200px'
                                    }}>
                                        {result.notes}
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Link
                                        to={calc.path}
                                        target="_blank"
                                        style={{
                                            padding: '8px 12px',
                                            background: '#333',
                                            borderRadius: '6px',
                                            color: 'white',
                                            textDecoration: 'none',
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <ExternalLink size={14} />
                                        Open
                                    </Link>
                                    <button
                                        onClick={() => {
                                            const status = prompt(
                                                `Mark "${calc.name}" as:\n1 = Pass\n2 = Warning\n3 = Fail\n\nEnter 1, 2, or 3:`,
                                                '1'
                                            )
                                            if (status) {
                                                const notes = status !== '1' ? prompt('Add notes (optional):') : ''
                                                setTestResults(prev => ({
                                                    ...prev,
                                                    [calc.path]: {
                                                        status: status === '1' ? 'pass' : status === '2' ? 'warning' : 'fail',
                                                        notes: notes || '',
                                                        testedAt: new Date().toISOString()
                                                    }
                                                }))
                                            }
                                        }}
                                        style={{
                                            padding: '8px 12px',
                                            background: '#6366f1',
                                            border: 'none',
                                            borderRadius: '6px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Test
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Legend */}
                <div style={{
                    marginTop: '32px',
                    padding: '20px',
                    background: '#1a1a1a',
                    borderRadius: '12px',
                    fontSize: '14px'
                }}>
                    <div style={{ fontWeight: '600', marginBottom: '12px' }}>Quick Testing Guide:</div>
                    <ol style={{ margin: 0, paddingLeft: '20px', opacity: 0.8, lineHeight: 1.8 }}>
                        <li>Click "Open" to view the calculator in a new tab</li>
                        <li>Test: Change inputs, verify result updates</li>
                        <li>Check for reset/regenerate button</li>
                        <li>Open browser console (F12) - check for errors</li>
                        <li>Click "Test" to mark status</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}

export default QATestPage
