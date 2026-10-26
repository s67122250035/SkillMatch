export default function InputField({ label, error, hint, as = 'input', children, id, ...rest }) {
  const Tag = as
  const fid = id || `f-${label}`
  return (
    <div className="field">
      {label && <label htmlFor={fid}>{label}</label>}
      <Tag id={fid} {...rest}>{children}</Tag>
      {hint && !error && <span className="hint">{hint}</span>}
      {error && <span className="err">{error}</span>}
    </div>
  )
}
