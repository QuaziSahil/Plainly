import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import './Card.css'

function Card({
    icon: Icon,
    title,
    description,
    path,
    tag,
    featured = false
}) {
    const CardWrapper = path ? Link : 'div'
    const wrapperProps = path ? { to: path } : {}

    return (
        <CardWrapper className={`calc-card ${featured ? 'featured' : ''}`} {...wrapperProps}>
            {Icon && (
                <div className="calc-card-icon">
                    <Icon size={20} />
                </div>
            )}

            <h3 className="calc-card-title">{title}</h3>

            {description && (
                <p className="calc-card-description">{description}</p>
            )}

            <div className="calc-card-footer">
                <span className="calc-card-complexity">STANDARD</span>
                <span className="calc-card-action">
                    LAUNCH <ArrowRight size={14} />
                </span>
            </div>
        </CardWrapper>
    )
}

export default Card
