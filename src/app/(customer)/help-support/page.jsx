'use client';

import React, { useState, useContext, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { NotificationContext } from '@/context/NotificationContext'
import { HeadsetIcon, Zap, Package, RotateCcw, AlertTriangle, HelpCircle, Upload, CheckCircle, AlertCircle, Send } from 'lucide-react'
import emailjs from '@emailjs/browser'
import axios from 'axios'

const HelpSupportPage = () => {
  const { success, error: showError } = useContext(NotificationContext)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [ticketId, setTicketId] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderId: '',
    category: '',
    message: '',
    attachment: null
  })

  // Support categories
  const categories = [
    {
      id: 'order_issue',
      label: 'Order Issue',
      icon: Package,
      description: 'Issue with your order',
      color: '#3B82F6'
    },
    {
      id: 'delivery_problem',
      label: 'Delivery Problem',
      icon: Zap,
      description: 'Delivery delay or issue',
      color: '#F59E0B'
    },
    {
      id: 'return_refund',
      label: 'Return / Refund',
      icon: RotateCcw,
      description: 'Return or refund request',
      color: '#8B5CF6'
    },
    {
      id: 'exchange',
      label: 'Exchange',
      icon: Package,
      description: 'Product exchange request',
      color: '#10B981'
    },
    {
      id: 'damaged_item',
      label: 'Damaged / Wrong Item',
      icon: AlertTriangle,
      description: 'Damaged or wrong item received',
      color: '#EF4444'
    },
    {
      id: 'other_support',
      label: 'Other Support',
      icon: HelpCircle,
      description: 'General support inquiry',
      color: '#6366F1'
    }
  ]

  // Initialize EmailJS
  useEffect(() => {
    const userId = process.env.NEXT_PUBLIC_EMAILJS_USER
    if (userId) {
      emailjs.init(userId)
    }
  }, [])

  /**
   * Generate unique ticket ID
   */
  const generateTicketId = () => {
    const date = new Date()
    const year = String(date.getFullYear()).slice(-2)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `SUP-${year}${month}${random}`
  }

  /**
   * Get priority based on category
   */
  const getPriority = (categoryId) => {
    if (['delivery_problem', 'damaged_item'].includes(categoryId)) return 'High'
    if (['return_refund', 'exchange'].includes(categoryId)) return 'Medium'
    return 'Normal'
  }

  /**
   * Handle category selection
   */
  const handleCategorySelect = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    setSelectedCategory(categoryId)
    setFormData(prev => ({ ...prev, category: category.label }))

    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!selectedCategory) {
      errors.category = 'Please select a category'
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === 'attachment' && files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))

      // Clear error for this field
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: ''
        }))
      }
    }
  }

  /**
   * Handle form submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      showError('Please fix the errors above')
      return
    }

    setIsLoading(true)

    try {
      const ticketNumber = generateTicketId()
      const priority = getPriority(selectedCategory)

      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE
      const userId = process.env.NEXT_PUBLIC_EMAILJS_USER

      if (!serviceId || !templateId || !userId) {
        throw new Error('EmailJS not configured')
      }

      // Prepare email template data
      const templateParams = {
        ticketId: ticketNumber,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        orderId: formData.orderId || 'Not provided',
        category: formData.category,
        priority: priority,
        message: formData.message,
        time: new Date().toLocaleString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }

      // Send email
      await emailjs.send(serviceId, templateId, templateParams, userId)

      // Show success state
      setTicketId(ticketNumber)
      setSubmitSuccess(true)

      // Show success notification
      success(`Support ticket ${ticketNumber} created successfully! We'll help you soon.`)

      // Reset after 4 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          orderId: '',
          category: '',
          message: '',
          attachment: null
        })
        setSelectedCategory(null)
        setSubmitSuccess(false)
        setTicketId(null)
      }, 4000)
    } catch (error) {
      console.error('Error:', error)
      showError(error.message || 'Failed to create ticket. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  const categoryVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -4,
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <motion.section 
        className="bg-white border-b border-gray-200 py-16 sm:py-20"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="bg-blue-50 p-3 rounded-full">
              <HeadsetIcon className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            Help & Support
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            We're here to help! Select your issue type to get support from our team.
          </motion.p>
        </div>
      </motion.section>

      {/* Category Selection Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">What's your issue?</h2>
            <p className="text-gray-600 mt-2">Select a category to get started</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.id

              return (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-6 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-gray-900 bg-white shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  variants={categoryVariants}
                  whileHover="hover"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <Icon 
                        className="w-6 h-6" 
                        style={{ color: category.color }}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {category.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0 mt-1"
                      >
                        <div className="bg-gray-900 rounded-full p-1">
                          <CheckCircle className="w-5 h-5 text-white" strokeWidth={3} />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Support Form Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitSuccess ? (
            // Success State
            <motion.div 
              className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="flex justify-center mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <CheckCircle className="w-20 h-20 text-gray-900" strokeWidth={1.2} />
              </motion.div>
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Ticket Created!</h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Your support ticket has been created successfully.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Ticket ID</p>
                <p className="text-3xl font-bold text-gray-900 font-mono">{ticketId}</p>
              </div>
              <p className="text-gray-600 text-sm">
                Please save your ticket ID for future reference. We'll respond within 24-48 hours.
              </p>
            </motion.div>
          ) : (
            // Support Form
            <motion.form 
              ref={formRef}
              className="bg-gray-50 rounded-lg p-8 border border-gray-200"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {selectedCategory ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
                    Create a Support Ticket
                  </h2>

                  <div className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                            formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                          }`}
                        />
                        {formErrors.name && (
                          <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-4 h-4" />
                            {formErrors.name}
                          </p>
                        )}
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                            formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                          }`}
                        />
                        {formErrors.email && (
                          <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-4 h-4" />
                            {formErrors.email}
                          </p>
                        )}
                      </motion.div>
                    </div>

                    {/* Phone & Order ID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 (optional)"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Order ID (if applicable)
                        </label>
                        <input
                          type="text"
                          name="orderId"
                          value={formData.orderId}
                          onChange={handleChange}
                          placeholder="Your order ID"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
                        />
                      </motion.div>
                    </div>

                    {/* Message */}
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Describe Your Issue <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please describe your issue in detail..."
                        rows="5"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none ${
                          formErrors.message ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        {formData.message.length}/2000 characters
                      </p>
                      {formErrors.message && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.message}
                        </p>
                      )}
                    </motion.div>

                    {/* File Upload */}
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Attach Screenshots or Documents (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          name="attachment"
                          onChange={handleChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label 
                          htmlFor="file-upload" 
                          className="cursor-pointer text-sm font-medium text-gray-900 hover:text-gray-700"
                        >
                          Click to upload
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.attachment
                            ? `File: ${formData.attachment.name}`
                            : 'PNG, JPG, PDF up to 10MB'}
                        </p>
                      </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading || !selectedCategory}
                      className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Ticket...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Create Support Ticket
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600 mb-4">
                    Please select a support category above to get started.
                  </p>
                  <p className="text-sm text-gray-500">
                    Your issue type helps us prioritize and route your request faster.
                  </p>
                </div>
              )}
            </motion.form>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Find answers to common questions below
            </p>
          </motion.div>

          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                q: 'How long does it take to receive a response?',
                a: 'We respond to all support tickets within 24-48 business hours. Urgent issues (damaged or wrong items) are prioritized.'
              },
              {
                q: 'Can I modify my order after placing it?',
                a: 'If your order hasn\'t been confirmed yet, please contact us immediately. We can help modify or cancel it within a short time window.'
              },
              {
                q: 'What is your return policy?',
                a: 'We offer a 7-day return policy for unused products in original packaging. Damaged or wrong items can be returned anytime.'
              },
              {
                q: 'How can I track my order?',
                a: 'You can track your order from the "My Orders" section in your account. You\'ll receive email updates at each stage.'
              }
            ].map((faq, idx) => (
              <motion.div 
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                variants={itemVariants}
                whileHover={{ y: -2 }}
              >
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default HelpSupportPage;
