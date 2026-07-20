import './StatCard.css'

const StatCard = ({ title, value, icon, variant = 'primary', description }) => {
  return (
    <div className={`stat-card-container stat-card-${variant}`}>
      <div className="stat-card-content">
        <span className="stat-card-title">{title}</span>
        <h3 className="stat-card-value">{value}</h3>
        {description && <span className="stat-card-desc">{description}</span>}
      </div>
      <div className="stat-card-icon-wrapper">
        {icon}
      </div>
    </div>
  )
}

export default StatCard
