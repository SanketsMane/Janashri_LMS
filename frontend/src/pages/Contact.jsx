import React, { useState } from 'react';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  ChatBubbleBottomCenterTextIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone Number',
      details: ['+91 98765 43210', '+91 98765 43211'],
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Address',
      details: ['info@janashiriinstitute.edu', 'admissions@janashiriinstitute.edu'],
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: MapPinIcon,
      title: 'Location',
      details: ['123 Education Street', 'Mumbai, Maharashtra 400001'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: ClockIcon,
      title: 'Office Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 2:00 PM'],
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="hero relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-secondary-600/90"></div>
        <div className="container relative z-10 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <ChatBubbleBottomCenterTextIcon className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Get in touch with us for any inquiries, admissions guidance, or support. 
              We're here to help you on your educational journey.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Send us a Message</h2>
              <p className="text-neutral-600 text-lg leading-relaxed">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="alert-success animate-slide-up">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-semibold">Message Sent Successfully!</h4>
                    <p className="text-sm">Thank you for contacting us. We'll respond within 24 hours.</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="card">
              <div className="card-body space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="admission">Admission Inquiry</option>
                      <option value="courses">Course Information</option>
                      <option value="fees">Fee Structure</option>
                      <option value="facilities">Facilities</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Get in Touch</h2>
              <p className="text-neutral-600 text-lg leading-relaxed">
                We're always here to help. Reach out to us through any of these channels.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="card group hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="card-body">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-lg transition-all duration-300 flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-neutral-900 mb-2">{info.title}</h3>
                          <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-neutral-600">{detail}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-bold text-neutral-900">Find Us on Map</h3>
                </div>
              </div>
              <div className="relative h-64 bg-neutral-200 rounded-b-2xl overflow-hidden">
                {/* Map placeholder - Replace with actual Google Maps embed */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-300 to-neutral-400">
                  <div className="text-center">
                    <MapPinIcon className="w-12 h-12 text-neutral-600 mx-auto mb-2" />
                    <p className="text-neutral-700 font-semibold">Interactive Map</p>
                    <p className="text-sm text-neutral-600">Google Maps integration</p>
                  </div>
                </div>
                
                {/* Overlay with address */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-soft">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                      <BuildingOfficeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Janashiri Institute</p>
                      <p className="text-sm text-neutral-600">123 Education Street, Mumbai</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-bold text-neutral-900">Quick Information</h3>
              </div>
              <div className="card-body space-y-4">
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="w-5 h-5 text-primary-600" />
                  <span className="text-neutral-700">www.janashiriinstitute.edu</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-secondary-600" />
                  <span className="text-neutral-700">Emergency Contact: +91 98765 43212</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-5 h-5 text-orange-600" />
                  <span className="text-neutral-700">Response Time: Within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
