import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class GithubPopularRepos extends Component {
  state = {
    activeFilter: languageFiltersData[0].id,
    repoList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRepoList()
  }

  setActiveFilter = id => {
    this.setState({activeFilter: id}, this.getRepoList)
  }

  getRepoList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activeFilter} = this.state
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeFilter}`

    const response = await fetch(apiUrl)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.popular_repos.map(item => ({
        name: item.name,
        id: item.id,
        issuesCount: item.issues_count,
        forksCount: item.forks_count,
        imageUrl: item.avatar_url,
        starsCount: item.stars_count,
      }))
      this.setState({
        repoList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div testid="loader">
      <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="error-message">Something Went Wrong</h1>
    </div>
  )

  renderRepositoriesListView = () => {
    const {repoList} = this.state

    return (
      <ul className="repositories-list">
        {repoList.map(eachRepository => (
          <RepositoryItem
            key={eachRepository.id}
            repoDetails={eachRepository}
          />
        ))}
      </ul>
    )
  }

  renderRepositories = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderRepositoriesListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeFilter} = this.state

    return (
      <div className="app-container">
        <div className="responsive-container">
          <h1 className="main-heading">Popular</h1>
          <ul className="filter-list">
            {languageFiltersData.map(eachFilter => (
              <LanguageFilterItem
                key={eachFilter.id}
                filterDetails={eachFilter}
                setActiveFilter={this.setActiveFilter}
                isActive={eachFilter.language === activeFilter}
              />
            ))}
          </ul>
          {this.renderRepositories()}
        </div>
      </div>
    )
  }
}

export default GithubPopularRepos
