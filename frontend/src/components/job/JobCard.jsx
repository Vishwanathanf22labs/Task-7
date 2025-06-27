import React from 'react'
import { MapPin, Clock, DollarSign, Building } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

const JobCard = ({ job, onApply, showApplyButton, applied }) => {
  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(salary)
  }

  const formatJobType = (type) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div onClick={() =>navigate(`/jobs/${job.id}`, {state: {applied: applied}})} className="cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
          </div>
          <div className="flex items-center text-gray-600 mt-1">
            <Building className="h-4 w-4 mr-1" />
            <span>{job.company}</span>
          </div>
        </div>
        {job.status && (
          <span className={`px-2 py-1 text-xs rounded-full ${
            job.status === 'approved' ? 'bg-green-100 text-green-800' : 
            job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {job.status}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatJobType(job.jobType)}</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          <span>{formatSalary(job.salary)}</span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {job.description}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        {showApplyButton && onApply && (
          <Button size="sm" onClick={() => onApply(job)}>
            Apply Now
          </Button>
        )}
      </div>
    </div>
  )
}

export default JobCard