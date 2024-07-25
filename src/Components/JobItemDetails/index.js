import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill, BsFillSlashSquareFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import SimilarJobItem from '../SimilarJobItem'

import './index.css'

const jobDetailsConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class JobItemDetails extends Component {
  state = {
    jobDetails: '',
    skillsDetails: '',
    similarDataDetails: '',
    jobDetailsStatus: jobDetailsConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({
      jobDetailsStatus: jobDetailsConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jobDetailsAPI = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobDetailsAPI, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const jobDetailsData = {
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        id: fetchedData.job_details.id,
        lifeAtCompany: {
          description: fetchedData.job_details.life_at_company.description,
          imageUrl: fetchedData.job_details.life_at_company.image_url,
        },
        jobDescription: fetchedData.job_details.job_description,
        location: fetchedData.job_details.location,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
        rating: fetchedData.job_details.rating,
        title: fetchedData.job_details.title,
      }
      const skillsData = fetchedData.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      const similarData = fetchedData.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobDetails: jobDetailsData,
        skillsDetails: skillsData,
        similarDataDetails: similarData,
        jobDetailsStatus: jobDetailsConstants.success,
      })
    } else {
      this.setState({
        jobDetailsStatus: jobDetailsConstants.failure,
      })
    }
  }

  getSkillsDetails = () => {
    const {skillsDetails} = this.state
    return (
      <ul className="skills-container">
        {skillsDetails.map(each => {
          const {imageUrl, name} = each
          return (
            <li className="skills-item-container" key={name}>
              <img src={imageUrl} className="skills-img" alt={name} />
              <p className="skills-name">{name}</p>
            </li>
          )
        })}
      </ul>
    )
  }

  getSimilarItemsDetails = () => {
    const {similarDataDetails} = this.state
    return (
      <>
        <h1 className="description-heading">Similar Jobs</h1>
        <ul className="similar-card-container">
          {similarDataDetails.map(each => (
            <SimilarJobItem similarDataItem={each} key={each.id} />
          ))}
        </ul>
      </>
    )
  }

  getLifeAtCompany = () => {
    const {jobDetails} = this.state
    const {lifeAtCompany} = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="life-at-company-container">
        <div>
          <h1 className="description-heading">Life at Company</h1>
          <p className="details-description">{description}</p>
        </div>
        <img src={imageUrl} alt="life at company" className="details-img" />
      </div>
    )
  }

  onJobDetailsRetry = () => this.getJobItemDetails()

  onRenderJobItemDetails = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    return (
      <>
        <div className="job-details-main-container">
          <div className="job-details-header-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="job-sub-header-container">
              <h1 className="title">{title}</h1>
              <div className="details-star-rating-container">
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
            <p className="packagePerAnnum">{packagePerAnnum}</p>
          </div>
          <hr className="separate-line" />
          <div className="description-visit-site-container">
            <h1 className="description-heading">Description</h1>
            <a
              className="visit-site-container"
              href={companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              <p className="visit-title">Visit</p>
              <BsFillSlashSquareFill className="visit-icon" />
            </a>
          </div>
          <p className="details-description">{jobDescription}</p>
          <h1 className="description-heading">Skills</h1>
          {this.getSkillsDetails()}
          {this.getLifeAtCompany()}
        </div>
        {this.getSimilarItemsDetails()}
      </>
    )
  }

  onRenderLoader = () => (
    <div className="details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRenderJobDetailsFailure = () => (
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
        <button
          className="retry-btn"
          type="button"
          onClick={this.onJobDetailsRetry}
        >
          Retry
        </button>
      </div>
    </div>
  )

  onRenderJobDetailsView = () => {
    const {jobDetailsStatus} = this.state
    switch (jobDetailsStatus) {
      case jobDetailsConstants.inProgress:
        return this.onRenderLoader()
      case jobDetailsConstants.success:
        return this.onRenderJobItemDetails()
      case jobDetailsConstants.failure:
        return this.onRenderJobDetailsFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-container">
        {this.onRenderJobDetailsView()}
      </div>
    )
  }
}
export default JobItemDetails
