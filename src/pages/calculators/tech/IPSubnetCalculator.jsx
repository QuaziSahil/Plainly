import { useState, useMemo } from 'react'
import { Server } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function IPSubnetCalculator() {
    const [ipAddress, setIpAddress] = useState('192.168.1.0')
    const [cidr, setCidr] = useState(24)

    const results = useMemo(() => {
        const ipParts = ipAddress.split('.').map(Number)
        if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
            return null
        }

        const ipInt = ipParts.reduce((acc, val, i) => acc + (val << (24 - i * 8)), 0) >>> 0

        // Subnet mask
        const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
        const maskParts = [
            (maskInt >>> 24) & 255,
            (maskInt >>> 16) & 255,
            (maskInt >>> 8) & 255,
            maskInt & 255
        ]

        // Network address
        const networkInt = (ipInt & maskInt) >>> 0
        const networkParts = [
            (networkInt >>> 24) & 255,
            (networkInt >>> 16) & 255,
            (networkInt >>> 8) & 255,
            networkInt & 255
        ]

        // Broadcast address
        const wildcardInt = ~maskInt >>> 0
        const broadcastInt = (networkInt | wildcardInt) >>> 0
        const broadcastParts = [
            (broadcastInt >>> 24) & 255,
            (broadcastInt >>> 16) & 255,
            (broadcastInt >>> 8) & 255,
            broadcastInt & 255
        ]

        // Wildcard mask
        const wildcardParts = [
            (wildcardInt >>> 24) & 255,
            (wildcardInt >>> 16) & 255,
            (wildcardInt >>> 8) & 255,
            wildcardInt & 255
        ]

        // Host range
        const firstHostInt = networkInt + 1
        const lastHostInt = broadcastInt - 1
        const firstHostParts = [
            (firstHostInt >>> 24) & 255,
            (firstHostInt >>> 16) & 255,
            (firstHostInt >>> 8) & 255,
            firstHostInt & 255
        ]
        const lastHostParts = [
            (lastHostInt >>> 24) & 255,
            (lastHostInt >>> 16) & 255,
            (lastHostInt >>> 8) & 255,
            lastHostInt & 255
        ]

        const totalHosts = Math.pow(2, 32 - cidr)
        const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2

        // IP class
        let ipClass
        if (ipParts[0] <= 127) ipClass = 'A'
        else if (ipParts[0] <= 191) ipClass = 'B'
        else if (ipParts[0] <= 223) ipClass = 'C'
        else if (ipParts[0] <= 239) ipClass = 'D (Multicast)'
        else ipClass = 'E (Reserved)'

        // Private/Public
        const isPrivate = (ipParts[0] === 10) ||
            (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) ||
            (ipParts[0] === 192 && ipParts[1] === 168) ||
            (ipParts[0] === 127)

        return {
            network: networkParts.join('.'),
            broadcast: broadcastParts.join('.'),
            mask: maskParts.join('.'),
            wildcard: wildcardParts.join('.'),
            firstHost: firstHostParts.join('.'),
            lastHost: lastHostParts.join('.'),
            totalHosts,
            usableHosts,
            ipClass,
            isPrivate
        }
    }, [ipAddress, cidr])

    return (
        <CalculatorLayout
            title="IP Subnet Calculator"
            description="Calculate subnet information"
            category="Tech"
            categoryPath="/calculators?category=Tech"
            icon={Server}
            result={results ? `${results.usableHosts.toLocaleString()} hosts` : 'Invalid IP'}
            resultLabel="Usable Hosts"
        >
            <div className="input-row">
                <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">IP Address</label>
                    <input
                        type="text"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        placeholder="192.168.1.0"
                    />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">CIDR</label>
                    <select value={cidr} onChange={(e) => setCidr(Number(e.target.value))}>
                        {Array.from({ length: 33 }, (_, i) => (
                            <option key={i} value={i}>/{i}</option>
                        ))}
                    </select>
                </div>
            </div>
            {results ? (
                <>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <div style={{
                            flex: 1,
                            background: '#1a1a2e',
                            padding: '12px',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#a78bfa' }}>Class {results.ipClass}</div>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>IP Class</div>
                        </div>
                        <div style={{
                            flex: 1,
                            background: results.isPrivate ? '#22c55e20' : '#f59e0b20',
                            padding: '12px',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '18px', fontWeight: 700 }}>{results.isPrivate ? 'Private' : 'Public'}</div>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>Type</div>
                        </div>
                    </div>
                    <div className="result-details">
                        <div className="result-detail-row">
                            <span className="result-detail-label">Network</span>
                            <span className="result-detail-value" style={{ fontFamily: 'monospace' }}>{results.network}/{cidr}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Subnet Mask</span>
                            <span className="result-detail-value" style={{ fontFamily: 'monospace' }}>{results.mask}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Wildcard Mask</span>
                            <span className="result-detail-value" style={{ fontFamily: 'monospace' }}>{results.wildcard}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Broadcast</span>
                            <span className="result-detail-value" style={{ fontFamily: 'monospace' }}>{results.broadcast}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">First Host</span>
                            <span className="result-detail-value" style={{ fontFamily: 'monospace' }}>{results.firstHost}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Last Host</span>
                            <span className="result-detail-value" style={{ fontFamily: 'monospace' }}>{results.lastHost}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Usable Hosts</span>
                            <span className="result-detail-value" style={{ color: '#22c55e' }}>{results.usableHosts.toLocaleString()}</span>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{
                    background: '#ef444420',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    Invalid IP address format
                </div>
            )}
        </CalculatorLayout>
    )
}

export default IPSubnetCalculator
