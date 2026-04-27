function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-wrap">
      <span className="loader-spinner" />
      <p>{text}</p>
    </div>
  )
}

export default Loader
