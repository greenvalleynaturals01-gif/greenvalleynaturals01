'use client';

import React, { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation';
import { NotificationContext } from '@/context/NotificationContext'
import { Mail, Phone, Clock, MapPin, Send, CheckCircle, AlertCircle, MessageCircle, HelpCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'

const ContactPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Product Inquiry',
    message: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const { success, error: showError } = useContext(NotificationContext)

  const subjects = [
    'Product Inquiry',
    'Bulk / Wholesale Order',
    'Business Partnership',
    'Media / Collaboration',
    'General Question'
  ]

  // Initialize EmailJS on component mount
  useEffect(() => {
    const userId = process.env.NEXT_PUBLIC_EMAILJS_USER
    if (userId) {
      emailjs.init(userId)
    }
  }, [])

  /**
   * Validate form fields
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

    if (!formData.subject) {
      errors.subject = 'Please select a subject'
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
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      showError('Please fix the errors above')
      return
    }

    setIsLoading(true)

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE
      const userId = process.env.NEXT_PUBLIC_EMAILJS_USER

      if (!serviceId || !templateId || !userId) {
        throw new Error('EmailJS not configured')
      }

      const templateParams = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        time: new Date().toLocaleString('en-IN', { 
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }

      // Send email via EmailJS
      await emailjs.send(serviceId, templateId, templateParams, userId)

      // Show success state
      setSubmitSuccess(true)

      // Show success notification
      success('Thank you for contacting us! Our team will respond within 24–48 hours.')

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Product Inquiry',
          message: ''
        })
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('EmailJS error:', error)
      showError(error.message || 'Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle WhatsApp quick contact
   */
  const handleWhatsApp = () => {
    const { name, email, message } = formData
    
    if (!message.trim()) {
      showError('Please write a message before sending')
      return
    }

    const whatsappMessage = `Hi Green Valley Naturals!\n\nName: ${name || 'Not provided'}\nEmail: ${email || 'Not provided'}\n\nMessage:\n${message}`
    const encodedMessage = encodeURIComponent(whatsappMessage)
    // WhatsApp number format: country code + number without + or spaces
    const whatsappUrl = `https://wa.me/919876543210?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
    success('Opening WhatsApp...')
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
          <motion.h1 
            className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            Contact us
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Have a question or business inquiry? We'd love to hear from you. Our team will respond within 24-48 hours.
          </motion.p>
        </div>
      </motion.section>

      {/* Support Information Cards */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Email Card */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <a
                href="mailto:support@greenvalleynaturals.com"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                support@greenvalleynaturals.com
              </a>
            </motion.div>

            {/* Phone Card */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
              <a
                href="tel:+919876543210"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                +91 98765 43210
              </a>
            </motion.div>

            {/* Business Hours Card */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
              <p className="text-sm text-gray-600">
                Mon - Fri: 9 AM - 6 PM IST
                <br />
                Sat - Sun: Closed
              </p>
            </motion.div>

            {/* Track Order Card */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Order</h3>
              <button
                onClick={() => router.push('/orders')}
                className="text-gray-900 hover:text-gray-700 font-semibold transition-colors text-sm"
              >
                View Orders →
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Send us a message</h2>
            <p className="text-lg text-gray-600">We'd love to hear from you. Drop us a line and we'll be in touch shortly.</p>
          </motion.div>

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
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Thank you!</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Thank you for contacting us! Our team will respond within 24–48 hours.
              </p>
            </motion.div>
          ) : (
            // Contact Form
            <motion.form 
              className="bg-white rounded-lg shadow-sm p-8 border border-gray-200"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Full Name */}
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

                {/* Email */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Phone */}
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                </motion.div>

                {/* Subject */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none ${
                      formErrors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000000' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      paddingRight: '2.5rem'
                    }}
                  >
                    {subjects.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                  {formErrors.subject && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.subject}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Message */}
              <motion.div className="mb-6" variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your inquiry..."
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

              {/* Form Actions */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
                variants={itemVariants}
              >
                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>

                {/* WhatsApp Button */}
                <motion.button
                  type="button"
                  onClick={handleWhatsApp}
                  className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </motion.button>
              </motion.div>

              <p className="text-xs text-gray-500 text-center font-medium">
                By submitting this form, you agree to our contact policy. We'll respond within 24 business hours.
              </p>
            </motion.form>
          )}
        </div>
      </section>

      {/* Need Help Section */}
      <section className="py-16 sm:py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
                <HelpCircle className="w-6 h-6 text-gray-900" strokeWidth={1.5} />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Need help with an order?
                </h2>
              </div>
              <p className="text-gray-600 mb-6">
                Visit our dedicated support section for order tracking, returns, refund status, and more.
              </p>
            </div>
            <motion.button
              onClick={() => router.push('/help-support')}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go to Support
            </motion.button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default ContactPage;
