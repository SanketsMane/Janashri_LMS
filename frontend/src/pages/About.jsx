import React from 'react';
import {
  AcademicCapIcon,
  EyeIcon,
  HeartIcon,
  StarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const values = [
    {
      icon: AcademicCapIcon,
      title: 'Flexible Learning',
      description: 'Distance and correspondence education designed for working professionals and busy learners',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: HeartIcon,
      title: 'Personalized Support',
      description: 'Guided admissions process with ongoing support throughout your educational journey',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: LightBulbIcon,
      title: 'University Partnerships',
      description: 'Access to recognized programs from reputed universities across India',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: UserGroupIcon,
      title: 'Career Advancement',
      description: 'Programs designed to help working professionals advance their careers',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const achievements = [
    { number: 'Karnataka', label: 'Based' },
    { number: '10+', label: 'Years of Excellence' },
    { number: '5000+', label: 'Students Guided' },
    { number: '25+', label: 'Partner Universities' },
    { number: '100+', label: 'Programs Available' },
    { number: '2', label: 'Office Locations' }
  ];

  const features = [
    'Distance and correspondence education facilitation',
    'Undergraduate, postgraduate, and diploma programs',
    'Flexible schedules for working professionals',
    'Guidance through admissions and university coordination',
    'Multiple program streams: BBA, MBA, BA, MA, B.Com, M.Com, B.Sc, M.Sc, Social Work, PhD',
    'Bangalore-based assistance with nationwide options'
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="hero relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-secondary-600/90"></div>
        <div className="container relative z-10 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <AcademicCapIcon className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              About Jnana Siri Educational Institute
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Your trusted partner for distance and correspondence education - facilitating 
              flexible learning pathways across undergraduate, postgraduate, and diploma programs
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
              Jnana Siri Educational Institute is a facilitator of distance and correspondence education 
              based in Karnataka. We specialize in providing flexible educational pathways across 
              undergraduate, postgraduate, and diploma programs offered by multiple universities, 
              emphasizing convenience and choice for learners.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Our approach is contact-first - we encourage visitors to connect with us via phone or email 
              to start their educational journey. We provide comprehensive guidance through admissions 
              and coordination with affiliated partner universities nationwide.
            </p>
          </div>

          {/* Achievement Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="dashboard-card hover:shadow-lg transition-all duration-300">
                  <div className="dashboard-stat text-primary-600 group-hover:scale-110 transition-transform">
                    {achievement.number}
                  </div>
                  <div className="dashboard-label">{achievement.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="card group hover:shadow-lg transition-all duration-300">
              <div className="card-body">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-soft group-hover:shadow-lg transition-all duration-300">
                  <EyeIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our Mission</h2>
                <p className="text-neutral-600 leading-relaxed text-lg">
                  To provide quality education that develops intellectual curiosity, 
                  critical thinking, and strong moral values in our students. We are 
                  committed to creating an environment where every student can thrive 
                  academically, socially, and personally.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="card group hover:shadow-lg transition-all duration-300">
              <div className="card-body">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 shadow-soft group-hover:shadow-lg transition-all duration-300">
                  <GlobeAltIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our Vision</h2>
                <p className="text-neutral-600 leading-relaxed text-lg">
                  To be recognized as a leading educational institution that prepares 
                  students for success in an ever-changing global society. We envision 
                  creating leaders who will make positive contributions to their 
                  communities and the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">
              <StarIcon className="w-4 h-4 mr-2" />
              Core Values
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Our values guide how we facilitate distance education and support our students' success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="card text-center group hover:shadow-lg transition-all duration-300 transform hover:scale-105" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="card-body">
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-lg transition-all duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-secondary-100 text-secondary-600 rounded-full text-sm font-semibold mb-4">
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                Why Choose Us
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
                Excellence in Every Aspect
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                We provide a holistic educational experience that goes beyond traditional 
                classroom learning. Our comprehensive approach ensures that every student 
                receives the support they need to succeed.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-success rounded-full flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-neutral-700 group-hover:text-neutral-900 transition-colors">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="card p-8 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6">Ready to Join Us?</h3>
                  <p className="text-white/90 mb-8 leading-relaxed">
                    Take the first step towards a brighter future. Apply for admission 
                    and become part of our excellence tradition.
                  </p>
                  <div className="space-y-4">
                    <button className="btn bg-white text-primary-600 hover:bg-neutral-100 w-full group">
                      Apply for Admission
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 w-full backdrop-blur-sm">
                      Download Brochure
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Background Decorations */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary-300/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-300/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
