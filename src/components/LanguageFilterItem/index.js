// Write your code here
import './index.css'

const LanguageFilterItem = props => {
  const {filterDetails, isActive, setActiveFilter} = props
  const {language, id} = filterDetails
  const activeClass = isActive ? 'active' : ''
  console.log(isActive)
  const changeFilter = () => {
    setActiveFilter(id)
    // console.log(language)
  }

  return (
    <li>
      <button
        className={`filter-button ${activeClass}`}
        type="button"
        onClick={changeFilter}
      >
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
