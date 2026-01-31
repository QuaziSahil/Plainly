import { useState, useMemo } from 'react'
import { Network } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SubnetCalculator() {
    const [ipAddress, setIpAddress] = useState('192.168.1.0')
    const [cidr, setCidr] = useState(24)

    const results = useMemo(() => {
        // Parse IP address
        const parts = ipAddress.split('.').map(Number)

        if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
            return {
                valid: false,
                networkAddress: 'Invalid IP',
                broadcastAddress: '-',
                subnetMask: '-',
                firstHost: '-',
                lastHost: '-',
                totalHosts: 0,
                usableHosts: 0,
                ipClass: '-',
                ipType: '-'
            }
        }

        // Calculate subnet mask
        const maskBits = cidr
        let mask = 0xFFFFFFFF << (32 - maskBits)
        mask = mask >>> 0 // Convert to unsigned

        const subnetMask = [
            (mask >>> 24) & 255,
            (mask >>> 16) & 255,
            (mask >>> 8) & 255,
            mask & 255
        ].join('.')

        // Calculate network address
        const ipInt = (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]
        const networkInt = (ipInt & mask) >>> 0

        const networkAddress = [
            (networkInt >>> 24) & 255,
            (networkInt >>> 16) & 255,
            (networkInt >>> 8) & 255,
            networkInt & 255
        ].join('.')

        // Calculate broadcast address
        const broadcastInt = (networkInt | (~mask >>> 0)) >>> 0

        const broadcastAddress = [
            (broadcastInt >>> 24) & 255,
            (broadcastInt >>> 16) & 255,
            (broadcastInt >>> 8) & 255,
            broadcastInt & 255
        ].join('.')

        // Calculate hosts
        const totalHosts = Math.pow(2, 32 - cidr)
        const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2

        // First and last usable host
        const firstHostInt = cidr === 32 ? networkInt : networkInt + 1
        const lastHostInt = cidr === 32 ? networkInt : broadcastInt - 1

        const firstHost = [
            (firstHostInt >>> 24) & 255,
            (firstHostInt >>> 16) & 255,
            (firstHostInt >>> 8) & 255,
            firstHostInt & 255
        ].join('.')

        const lastHost = [
            (lastHostInt >>> 24) & 255,
            (lastHostInt >>> 16) & 255,
            (lastHostInt >>> 8) & 255,
            lastHostInt & 255
        ].join('.')

        // IP Class
        let ipClass = 'A'
        if (parts[0] >= 128 && parts[0] <= 191) ipClass = 'B'
        else if (parts[0] >= 192 && parts[0] <= 223) ipClass = 'C'
        else if (parts[0] >= 224 && parts[0] <= 239) ipClass = 'D (Multicast)'
        else if (parts[0] >= 240) ipClass = 'E (Reserved)'

        // Private or Public
        let ipType = 'Public'
        if (parts[0] === 10 ||
            (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
            (parts[0] === 192 && parts[1] === 168)) {
            ipType = 'Private'
        }

        return {
            valid: true,
            networkAddress,
            broadcastAddress,
            subnetMask,
            firstHost,
            lastHost,
            totalHosts,
            usableHosts,
            ipClass,
            ipType
        }
    }, [ipAddress, cidr])

    return (
        <CalculatorLayout
            title="Subnet Calculator"
            description="Calculate subnet mask, network address, and available hosts"
            category="Other"
            categoryPath="/other"
            icon={Network}
            result={results.networkAddress}
            resultLabel="Network Address"
        >
            <div className="input-group">
                <label className="input-label">IP Address</label>
                <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.1.0"
                />
            </div>

            <div className="input-group">
                <label className="input-label">CIDR Prefix (/{cidr})</label>
                <input
                    type="range"
                    value={cidr}
                    onChange={(e) => setCidr(Number(e.target.value))}
                    min={0}
                    max={32}
                    style={{
                        width: '100%',
                        height: '6px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-full)'
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/0</span>
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>/{cidr}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/32</span>
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Subnet Mask</span>
                    <span className="result-detail-value">{results.subnetMask}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Network Address</span>
                    <span className="result-detail-value">{results.networkAddress}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Broadcast Address</span>
                    <span className="result-detail-value">{results.broadcastAddress}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">First Host</span>
                    <span className="result-detail-value">{results.firstHost}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Last Host</span>
                    <span className="result-detail-value">{results.lastHost}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Hosts</span>
                    <span className="result-detail-value">{results.totalHosts.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Usable Hosts</span>
                    <span className="result-detail-value">{results.usableHosts.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">IP Class / Type</span>
                    <span className="result-detail-value">{results.ipClass} ({results.ipType})</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default SubnetCalculator
