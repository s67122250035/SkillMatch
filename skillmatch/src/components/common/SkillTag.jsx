export default function SkillTag({ name, hit, active, onClick }) {
  if (onClick) {
    return (
      <button type="button" className={`tag btnlike ${active ? 'on' : ''}`} onClick={onClick}>
        {active && '✓ '}{name}
      </button>
    )
  }
  return <span className={`tag ${hit ? 'hit' : ''}`}>{hit && '✓ '}{name}</span>
}
