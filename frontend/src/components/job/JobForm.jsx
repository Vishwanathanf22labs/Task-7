import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { jobSchema } from '../../utils/validation'
import { JOB_TYPES, LOCATIONS } from '../../utils/constants'
import Button from '../ui/Button'
import Input from '../ui/Input'

const JobForm = ({ job, onSubmit, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: job || {
      title: '',
      company: '',
      description: '',
      location: '',
      salary: '',
      jobType: '',
      requirements: ''
    }
  })

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      salary: Number(data.salary)
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Job Title"
          {...register('title')}
          error={errors.title?.message}
          placeholder="e.g. Senior Software Engineer"
        />

        <Input
          label="Company"
          {...register('company')}
          error={errors.company?.message}
          placeholder="e.g. Tech Corp"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            {...register('location')}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.location ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select Location</option>
            {LOCATIONS.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Type
          </label>
          <select
            {...register('jobType')}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.jobType ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select Job Type</option>
            {JOB_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.jobType && (
            <p className="mt-1 text-sm text-red-600">{errors.jobType.message}</p>
          )}
        </div>

        <Input
          label="Salary (₹)"
          type="number"
          {...register('salary', { valueAsNumber: true })}
          error={errors.salary?.message}
          placeholder="e.g. 800000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Description
        </label>
        <textarea
          {...register('description')}
          rows={6}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-500' : ''
          }`}
          placeholder="Describe the job role, responsibilities, and what you're looking for..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Requirements
        </label>
        <textarea
          {...register('requirements')}
          rows={4}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.requirements ? 'border-red-500' : ''
          }`}
          placeholder="List the required skills, experience, qualifications..."
        />
        {errors.requirements && (
          <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          {job ? 'Update Job' : 'Post Job'}
        </Button>
      </div>
    </form>
  )
}

export default JobForm