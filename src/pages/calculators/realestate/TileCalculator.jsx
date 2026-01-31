import { useState, useMemo } from 'react'
import { Ruler } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TileCalculator() {
    const [roomLength, setRoomLength] = useState(12)
    const [roomWidth, setRoomWidth] = useState(10)
    const [tileLength, setTileLength] = useState(12)
    const [tileWidth, setTileWidth] = useState(12)
    const [tilePrice, setTilePrice] = useState(3)
    const [wastage, setWastage] = useState(10)

    const results = useMemo(() => {
        const roomAreaSqFt = roomLength * roomWidth
        const tileAreaSqFt = (tileLength * tileWidth) / 144 // convert sq inches to sq feet
        const tilesNeeded = Math.ceil(roomAreaSqFt / tileAreaSqFt)
        const tilesWithWastage = Math.ceil(tilesNeeded * (1 + wastage / 100))
        const totalCost = tilesWithWastage * tilePrice

        return { roomAreaSqFt, tileAreaSqFt, tilesNeeded, tilesWithWastage, totalCost }
    }, [roomLength, roomWidth, tileLength, tileWidth, tilePrice, wastage])

    return (
        <CalculatorLayout
            title="Tile Calculator"
            description="Calculate tiles needed for a room"
            category="Real Estate"
            categoryPath="/calculators?category=Real%20Estate"
            icon={Ruler}
            result={results.tilesWithWastage.toString()}
            resultLabel="Tiles Needed"
        >
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>ROOM DIMENSIONS (feet)</div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Length (ft)</label>
                    <input type="number" value={roomLength} onChange={(e) => setRoomLength(Number(e.target.value))} min={0} step={0.5} />
                </div>
                <div className="input-group">
                    <label className="input-label">Width (ft)</label>
                    <input type="number" value={roomWidth} onChange={(e) => setRoomWidth(Number(e.target.value))} min={0} step={0.5} />
                </div>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.6, margin: '16px 0 8px' }}>TILE SIZE (inches)</div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Tile Length (in)</label>
                    <input type="number" value={tileLength} onChange={(e) => setTileLength(Number(e.target.value))} min={1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Tile Width (in)</label>
                    <input type="number" value={tileWidth} onChange={(e) => setTileWidth(Number(e.target.value))} min={1} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Price per Tile ($)</label>
                    <input type="number" value={tilePrice} onChange={(e) => setTilePrice(Number(e.target.value))} min={0} step={0.01} />
                </div>
                <div className="input-group">
                    <label className="input-label">Wastage (%)</label>
                    <input type="number" value={wastage} onChange={(e) => setWastage(Number(e.target.value))} min={0} max={50} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Room Area</span>
                    <span className="result-detail-value">{results.roomAreaSqFt.toFixed(1)} sq ft</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Tiles (exact)</span>
                    <span className="result-detail-value">{results.tilesNeeded}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Tiles (with wastage)</span>
                    <span className="result-detail-value">{results.tilesWithWastage}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Cost</span>
                    <span className="result-detail-value">${results.totalCost.toFixed(2)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default TileCalculator
