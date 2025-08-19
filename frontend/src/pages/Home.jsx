import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon,
  UserGroupIcon,
  TrophyIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Excellence in Education',
      description: 'Comprehensive curriculum designed to nurture academic excellence and character development with personalized attention.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: UserGroupIcon,
      title: 'Expert Faculty',
      description: 'Dedicated and experienced teachers committed to student success, growth, and mentorship.',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: TrophyIcon,
      title: 'Proven Results',
      description: '100% pass rate in board examinations with outstanding academic achievements and university placements.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: SparklesIcon,
      title: 'Modern Facilities',
      description: 'State-of-the-art infrastructure with computer labs, library, sports facilities, and smart classrooms.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const achievements = [
    { number: '15+', label: 'Years of Excellence', icon: CheckBadgeIcon },
    { number: '2000+', label: 'Students Graduated', icon: AcademicCapIcon },
    { number: '100%', label: 'Pass Rate', icon: TrophyIcon },
    { number: '50+', label: 'Expert Faculty', icon: UserGroupIcon }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-secondary-600/90"></div>
        <div className="container relative z-10">
          <div className="text-center max-w-5xl mx-auto animate-fade-in">
            <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to 
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Janashiri Institute
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed">
              Excellence in Education Since 2010 - Nurturing Future Leaders with 
              Innovation, Integrity, and Inspiration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admission"
                className="btn bg-white text-primary-600 hover:bg-neutral-100 shadow-lg hover:shadow-xl font-semibold text-lg px-8 py-4 group"
              >
                Apply for Admission
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold text-lg px-8 py-4 group backdrop-blur-sm"
              >
                Learn More
                <GlobeAltIcon className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">
              <LightBulbIcon className="w-4 h-4 mr-2" />
              Why Choose Us
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Excellence in Every Aspect
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              We provide comprehensive education with a focus on academic excellence, 
              character building, and holistic development for the leaders of tomorrow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card card-body text-center group hover:transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-lg transition-all duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievement Stats Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Our Achievements Speak
            </h2>
            <p className="text-lg text-neutral-600">
              Numbers that reflect our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="dashboard-card text-center group">
                  <Icon className="w-12 h-12 text-primary-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <div className="dashboard-stat text-primary-600 mb-2">{stat.number}</div>
                  <div className="dashboard-label">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-500/20"></div>
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-10 opacity-95 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who have achieved their dreams with us. 
            Your success story begins here.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/admission"
              className="btn bg-white text-primary-600 hover:bg-neutral-100 font-semibold text-lg px-8 py-4 shadow-lg hover:shadow-xl group"
            >
              Apply Now
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold text-lg px-8 py-4 backdrop-blur-sm group"
            >
              Contact Us
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-secondary-300/20 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
};

export default Home;
