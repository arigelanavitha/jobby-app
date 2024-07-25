import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobItem = props => {
  const {similarDataItem} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarDataItem
  return (
    <li className="similar-job-list-item-container">
      <div className="job-header-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
      <h1 className="description-heading">Description</h1>
      <p className="description">{jobDescription}</p>
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
    </li>
  )
}
export default SimilarJobItem
