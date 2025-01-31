import './GradientText.css'

const GradientText = ({
  children,
  colors = ['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa'], // Default colors
  animationSpeed = 8, // Default animation speed in seconds
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
  }

  return (
    <div className="text-content" style={gradientStyle}>
      {children}
    </div>
  )
}

export default GradientText
