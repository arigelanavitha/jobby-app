import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {BsSearch, BsFillBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileApiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}
const jobItemsStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}
class Jobs extends Component {
  state = {
    searchInput: '',
    profileData: '',
    jobsItemsData: '',
    profileStatus: profileApiStatus.initial,
    jobsStatus: jobItemsStatus.initial,
    radioLabel: '',
    checked: [],
  }

  componentDidMount() {
    this.onGetProfileDetails()
    this.onGetJobItemsData()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onCheckedCheckbox = event => {
    const {checked} = this.state
    if (checked.includes(event.target.value)) {
      const filteredValues = checked.filter(each => each !== event.target.value)
      this.setState(
        {
          checked: [...filteredValues],
        },
        this.onGetJobItemsData,
      )
    } else {
      this.setState(
        {
          checked: [...checked, event.target.value],
        },
        this.onGetJobItemsData,
      )
    }
  }

  onRadioBtn = event => {
    this.setState(
      {
        radioLabel: event.target.value,
      },
      this.onGetJobItemsData,
    )
  }

  onProfileRetry = () => this.onGetProfileDetails()

  onJobsRetry = () => this.onGetJobItemsData()

  onGetProfileDetails = async () => {
    this.setState({
      profileStatus: profileApiStatus.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(profileUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const profileDetails = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        profileData: profileDetails,
        profileStatus: profileApiStatus.success,
      })
    } else {
      this.setState({
        profileStatus: profileApiStatus.failure,
      })
    }
  }

  onRenderProfile = () => {
    const {profileData} = this.state
    const {profileImageUrl, name, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-short-bio">{shortBio}</p>
      </div>
    )
  }

  onGetJobItemsData = async () => {
    this.setState({
      jobsStatus: jobItemsStatus.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {radioLabel, checked, searchInput} = this.state
    const values = checked.join(',')
    const jobsUrl = `https://apis.ccbp.in/jobs/?employment_type=${values}&minimum_package=${radioLabel}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(jobsUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const jobsDetails = fetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsItemsData: jobsDetails,
        jobsStatus: jobItemsStatus.success,
      })
    } else {
      this.setState({
        jobsStatus: jobItemsStatus.failure,
      })
    }
  }

  onRenderJobsItem = () => {
    const {jobsItemsData} = this.state
    return (
      <ul className="job-list-container">
        {jobsItemsData.map(each => {
          const {
            companyLogoUrl,
            employmentType,
            id,
            jobDescription,
            location,
            packagePerAnnum,
            rating,
            title,
          } = each
          return (
            <Link to={`jobs/${id}/`} className="job-item-link" key={id}>
              <li className="job-list-item-container">
                <div className="job-header-container">
                  <img
                    src={companyLogoUrl}
                    alt="company logo"
                    className="company-logo"
                  />
                  <div className="job-sub-header-container">
                    <h1 className="title">{title}</h1>
                    <div className="star-rating-container">
                      <AiFillStar className="star-icon" />
                      <p className="rating">{rating}</p>
                    </div>
                  </div>
                </div>
                <div className="employee-sub-header-container">
                  <ul className="type-and-location-container">
                    <li className="item-container">
                      <MdLocationOn className="items-icon" />
                      <p className="item-name">{location}</p>
                    </li>
                    <li className="item-container">
                      <BsFillBriefcaseFill className="header-sm-icons" />
                      <p className="item-name">{employmentType}</p>
                    </li>
                  </ul>
                  <h1 className="packagePerAnnum">{packagePerAnnum}</h1>
                </div>
                <hr className="separate-line" />
                <h1 className="description-heading">Description</h1>
                <p className="description">{jobDescription}</p>
              </li>
            </Link>
          )
        })}
      </ul>
    )
  }

  onRenderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRenderFailure = () => (
    <div className="retry-btn-container">
      <button className="retry-btn" type="button" onClick={this.onProfileRetry}>
        Retry
      </button>
    </div>
  )

  onRenderProfileView = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case profileApiStatus.inProgress:
        return this.onRenderLoader()
      case profileApiStatus.success:
        return this.onRenderProfile()
      case profileApiStatus.failure:
        return this.onRenderFailure()
      default:
        return null
    }
  }

  onRenderJobsFailure = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <div className="retry-btn-container">
        <button className="retry-btn" type="button" onClick={this.onJobsRetry}>
          Retry
        </button>
      </div>
    </div>
  )

  onRenderNoJobs = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="no-jobs-img"
        alt="no jobs"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  onRenderJobsSuccessData = () => {
    const {jobsItemsData} = this.state
    return jobsItemsData.length > 0
      ? this.onRenderJobsItem()
      : this.onRenderNoJobs()
  }

  onRenderJobItemsView = () => {
    const {jobsStatus} = this.state
    switch (jobsStatus) {
      case jobItemsStatus.inProgress:
        return this.onRenderLoader()
      case jobItemsStatus.failure:
        return this.onRenderJobsFailure()
      case jobItemsStatus.success:
        return this.onRenderJobsSuccessData()
      default:
        return null
    }
  }

  onRenderEmployeeType = () => (
    <ul className="filter-items-container">
      {employmentTypesList.map(each => {
        const {label, employmentTypeId} = each
        return (
          <li className="filter-item-container" key={employmentTypeId}>
            <input
              type="checkbox"
              className="check-box"
              id={employmentTypeId}
              value={employmentTypeId}
              onChange={this.onCheckedCheckbox}
            />
            <label className="filter-item" htmlFor={employmentTypeId}>
              {label}
            </label>
          </li>
        )
      })}
    </ul>
  )

  onRenderSalaryRange = () => (
    <div className="filter-items-container">
      {salaryRangesList.map(each => {
        const {label, salaryRangeId} = each
        return (
          <li className="filter-item-container" key={salaryRangeId}>
            <input
              type="radio"
              value={salaryRangeId}
              name="radio"
              className="check-box"
              onChange={this.onRadioBtn}
              id={salaryRangeId}
            />
            <label className="filter-item" htmlFor={salaryRangeId}>
              {label}
            </label>
          </li>
        )
      })}
    </div>
  )

  onEnterKeyDown = event => {
    if (event.key === 'Enter') {
      this.onGetJobItemsData()
    }
  }

  onClickSearchIcon = () => {
    this.onGetJobItemsData()
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="jobs-container">
        <div className="jobs-filters-container">
          <div className="jobs-search-sm-container">
            <input
              type="search"
              value={searchInput}
              placeholder="Search"
              onChange={this.onChangeSearchInput}
              className="jobs-search-input"
              onKeyDown={this.onEnterKeyDown}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-icon-btn"
              onClick={this.onClickSearchIcon}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          {this.onRenderProfileView()}
          <hr className="separate-line" />
          <h1 className="filter-heading">Type of Employment</h1>
          {this.onRenderEmployeeType()}
          <hr className="separate-line" />
          <h1 className="filter-heading">Salary Range</h1>
          {this.onRenderSalaryRange()}
        </div>
        <div className="jobs-cards-container">
          <div className="jobs-search-lg-container">
            <input
              type="search"
              value={searchInput}
              placeholder="Search"
              onChange={this.onChangeSearchInput}
              className="jobs-search-input"
              onKeyDown={this.onEnterKeyDown}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-icon-btn"
              onClick={this.onClickSearchIcon}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          {this.onRenderJobItemsView()}
        </div>
      </div>
    )
  }
}
export default Jobs
