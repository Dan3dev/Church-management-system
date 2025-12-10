import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Church,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Heart,
  MessageCircle,
  BookOpen
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Users,
      title: 'Member Management',
      description: 'Comprehensive profiles, directories, and contact management for your entire congregation.'
    },
    {
      icon: Calendar,
      title: 'Event Planning',
      description: 'Schedule services, events, and ministries with automated notifications and registrations.'
    },
    {
      icon: DollarSign,
      title: 'Financial Tracking',
      description: 'Monitor tithes, offerings, donations, and expenses with detailed reporting and analytics.'
    },
    {
      icon: TrendingUp,
      title: 'AI Analytics',
      description: 'Get actionable insights about growth, engagement, and trends in your community.'
    },
    {
      icon: Globe,
      title: 'Multi-Campus',
      description: 'Seamlessly manage multiple locations, services, and ministries across different campuses.'
    },
    {
      icon: MessageCircle,
      title: 'Communication Hub',
      description: 'Send announcements, newsletters, and direct messages to segments of your congregation.'
    }
  ];

  const testimonials = [
    {
      name: 'Pastor James Wilson',
      church: 'Grace Community Church',
      text: 'ChurchHub has transformed how we manage our operations. What used to take hours now takes minutes.'
    },
    {
      name: 'Maria Rodriguez',
      church: 'Hope Chapel',
      text: 'The member tracking and event management features are incredible. Our congregation loves the app.'
    },
    {
      name: 'David Chen',
      church: 'City Light Fellowship',
      text: 'Best decision we made was switching to ChurchHub. The support team is outstanding.'
    }
  ];

  const stats = [
    { number: '2,500+', label: 'Churches using ChurchHub' },
    { number: '500K+', label: 'Members managed' },
    { number: '99.9%', label: 'System uptime' },
    { number: '24/7', label: 'Customer support' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg shadow-lg">
                <Church className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">ChurchHub</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Testimonials</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</a>
              <button onClick={() => navigate('/login')} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Sign In</button>
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 font-medium"
              >
                Start Free
              </button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 font-medium py-2">Features</a>
              <a href="#testimonials" className="block text-gray-700 font-medium py-2">Testimonials</a>
              <a href="#pricing" className="block text-gray-700 font-medium py-2">Pricing</a>
              <button onClick={() => navigate('/login')} className="block text-gray-700 font-medium py-2">Sign In</button>
              <button onClick={() => navigate('/login')} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2.5 rounded-lg font-medium">Start Free</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2.5 rounded-full text-sm font-bold border border-blue-200">
                <Zap className="h-4 w-4" />
                <span>14-day free trial • No credit card needed</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-black leading-tight text-gray-900">
                Church Management
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Made Simple</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Streamline operations, engage your congregation, and grow your community with the all-in-one platform built for churches. Manage members, track attendance, handle finances, and communicate effortlessly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all text-lg font-bold transform hover:scale-105"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-900 hover:border-blue-600 hover:text-blue-600 transition-all text-lg font-bold">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 aspect-square flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="inline-block p-6 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Church className="h-20 w-20 mx-auto mb-4" />
                    <p className="text-2xl font-bold">Complete Church</p>
                    <p className="text-lg opacity-90">Management Suite</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{stat.number}</p>
                <p className="text-gray-600 font-medium mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to manage your church effectively in one intuitive platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all hover:border-blue-300"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-6 group-hover:shadow-lg transition-all">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6">Loved by Church Leaders</h2>
            <p className="text-xl text-gray-600">See what thousands of churches are saying about ChurchHub</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:shadow-lg transition-all">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.church}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6">Simple Pricing</h2>
            <p className="text-xl text-gray-600">All plans include 14-day free trial</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Starter', price: 0, color: 'from-gray-600 to-gray-700', features: ['Up to 50 members', 'Basic tracking', 'Email support'] },
              { name: 'Growth', price: 29, color: 'from-blue-600 to-cyan-600', features: ['Up to 300 members', 'Advanced features', 'SMS support', 'Popular'], popular: true },
              { name: 'Professional', price: 79, color: 'from-blue-600 to-cyan-600', features: ['Up to 1000 members', 'All features', '24/7 support', 'API access'] },
              { name: 'Enterprise', price: 199, color: 'from-blue-600 to-cyan-600', features: ['Unlimited members', 'White-label', 'Dedicated support'] }
            ].map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 relative transition-all hover:shadow-2xl ${
                  plan.popular
                    ? `bg-gradient-to-br ${plan.color} text-white scale-105 shadow-2xl`
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                <div className="mb-8">
                  <span className="text-5xl font-black">${plan.price}</span>
                  <span className={`text-lg ml-2 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>/month</span>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-3 px-6 rounded-xl font-bold mb-8 transition-all ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Start Free Trial
                </button>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={`${plan.popular ? 'text-blue-50' : 'text-gray-700'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black text-white mb-6">Ready to Transform Your Church?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join thousands of churches using ChurchHub to streamline operations and grow their communities</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:shadow-2xl transition-all text-lg font-bold inline-flex items-center space-x-2 transform hover:scale-105"
          >
            <span>Start Your Free Trial Today</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Church className="h-6 w-6 text-blue-400" />
                <span className="font-bold text-white text-lg">ChurchHub</span>
              </div>
              <p className="text-sm">The all-in-one platform for modern churches.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 ChurchHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
