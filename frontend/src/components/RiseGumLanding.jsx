import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Heart, 
  Zap, 
  Clock, 
  X, 
  Minus, 
  CheckCircle, 
  Instagram, 
  Twitter, 
  Linkedin, 
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Star,
  TrendingUp
} from 'lucide-react';
import { waitlistAPI, contentAPI } from '../services/api';
// Import mock data as fallback
import { 
  testimonials as mockTestimonials, 
  socialProofStats as mockSocialProofStats, 
  productBenefits as mockProductBenefits,
  problemPoints as mockProblemPoints,
  socialLinks as mockSocialLinks,
  contactInfo as mockContactInfo 
} from '../data/mock';

const RiseGumLanding = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for dynamic content
  const [content, setContent] = useState({
    testimonials: mockTestimonials,
    socialProofStats: mockSocialProofStats,
    productBenefits: mockProductBenefits,
    problemPoints: mockProblemPoints,
    socialLinks: mockSocialLinks,
    contactInfo: mockContactInfo
  });
  const [contentLoaded, setContentLoaded] = useState(false);

  // Load content from API on component mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const result = await contentAPI.getContent();
        if (result.success) {
          setContent(result.data);
          setContentLoaded(true);
        } else {
          console.warn('Failed to load content from API, using mock data');
          setContentLoaded(true);
        }
      } catch (error) {
        console.error('Error loading content:', error);
        setContentLoaded(true);
      }
    };

    loadContent();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear any previous error messages when user starts typing
    if (formStatus && !formStatus.includes('Thanks')) {
      setFormStatus('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.city.trim()) {
      setFormStatus('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setFormStatus('');
    
    try {
      // Call backend API
      const result = await waitlistAPI.addEntry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        city: formData.city.trim()
      });

      if (result.success) {
        setFormStatus(result.message);
        setFormData({ name: '', email: '', city: '' });
        console.log('Waitlist entry added successfully:', result.data);
      } else {
        // Handle specific error cases
        if (result.error.includes('already registered')) {
          setFormStatus('This email is already on our waitlist! We\'ll be in touch soon.');
        } else if (result.details && result.details.length > 0) {
          // Handle validation errors
          const fieldErrors = result.details.map(detail => detail.message).join(', ');
          setFormStatus(`Please check: ${fieldErrors}`);
        } else {
          setFormStatus(result.error || 'Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconComponents = {
    Heart, Zap, Clock, X, Minus, CheckCircle, Instagram, Twitter, Linkedin, MessageCircle
  };

  const getIcon = (iconName) => {
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="nav-header">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Rise Gum</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#problem" className="nav-link">Problem</a>
          <a href="#solution" className="nav-link">Solution</a>
          <a href="#waitlist" className="nav-link">Join Waitlist</a>
        </div>
        <Button className="btn-primary hidden md:inline-flex">
          Get Early Access
        </Button>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="mb-8 flex items-center justify-center">
            <div className="rise-logo-large">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center shadow-xl mb-4">
                <span className="text-white font-bold text-3xl">R</span>
              </div>
              <div className="text-sm font-medium text-green-600 tracking-wider uppercase">Rise Gum</div>
            </div>
          </div>
          
          <h1 className="heading-1 mb-6">
            Get Energy Anywhere
          </h1>
          
          <p className="body-large mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            India's first sugar-free caffeine gum for students & professionals. 
            Clean energy that fits in your pocket.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button className="btn-primary text-lg px-8 py-4">
              Join Waitlist <Mail className="w-5 h-5 ml-2" />
            </Button>
            <Button className="btn-secondary text-lg px-8 py-4">
              Learn More
            </Button>
          </div>

          {/* Brand Tagline */}
          <div className="text-center">
            <p className="text-lg font-medium text-green-600 mb-2">Fast, Portable, Smart Energy</p>
            <p className="text-sm text-gray-500">Revolutionizing how India gets energized</p>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="hero-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-24 px-6" style={{ backgroundColor: 'var(--bg-section)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="slide-in-up">
            <h2 className="heading-2 mb-4">
              90% of energy comes from unhealthy drinks
            </h2>
            <p className="body-large mb-16" style={{ color: 'var(--text-secondary)' }}>
              We're changing that.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.problemPoints.map((point, index) => (
              <Card key={point.id} className={`product-card text-center slide-in-up animate-delay-${(index + 1) * 100} ${
                point.type === 'problem' ? 'border-red-200 bg-red-50' :
                point.type === 'solution' ? 'border-green-200 bg-green-50' : ''
              }`}>
                <CardContent className="p-8">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-content transition-transform duration-300 hover:scale-110 ${
                    point.type === 'problem' ? 'bg-gradient-to-br from-red-400 to-red-500' :
                    point.type === 'solution' ? 'bg-gradient-to-br from-green-400 to-green-600' : 
                    'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    <div className="text-white w-full flex justify-center">
                      {getIcon(point.icon)}
                    </div>
                  </div>
                  <h3 className="heading-3 mb-3">{point.title}</h3>
                  <p className="body-small">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="fade-in">
            <h2 className="heading-2 mb-4">
              Rise Gum delivers clean energy in seconds
            </h2>
            <p className="body-large mb-16" style={{ color: 'var(--text-secondary)' }}>
              Everything you need for sustained focus and energy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.productBenefits.map((benefit, index) => (
              <Card key={benefit.id} className={`product-card text-center scale-in animate-delay-${(index + 1) * 200}`}>
                <CardContent className="p-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                    <div className="text-white">
                      {getIcon(benefit.icon)}
                    </div>
                  </div>
                  <h3 className="heading-3 mb-3">{benefit.title}</h3>
                  <p className="body-small">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 px-6" style={{ backgroundColor: 'var(--bg-section)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="slide-in-up">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-pulse-subtle">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="heading-2">
                {content.socialProofStats.interestedStudents}+ students already interested
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center scale-in animate-delay-100">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {content.socialProofStats.interestedStudents}+
              </div>
              <div className="body-small">Students</div>
            </div>
            <div className="text-center scale-in animate-delay-200">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {content.socialProofStats.universities}+
              </div>
              <div className="body-small">Universities</div>
            </div>
            <div className="text-center scale-in animate-delay-300">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {content.socialProofStats.cities}+
              </div>
              <div className="body-small">Cities</div>
            </div>
            <div className="text-center scale-in animate-delay-400">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {content.socialProofStats.growthRate}
              </div>
              <div className="body-small">Growth</div>
            </div>
          </div>

          {/* Enhanced Testimonial */}
          <Card className="product-card max-w-2xl mx-auto glass-morphism fade-in">
            <CardContent className="p-10">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400 hover:scale-110 transition-transform duration-200" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <blockquote className="body-large mb-6 italic font-medium">
                "{content.testimonials[0].quote}"
              </blockquote>
              <div className="text-center">
                <div className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                  {content.testimonials[0].name}
                </div>
                <div className="body-small">
                  {content.testimonials[0].role} • {content.testimonials[0].city}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section id="waitlist" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="fade-in">
            <h2 className="heading-2 mb-6">
              Be the first to try Rise Gum
            </h2>
            <p className="body-large mb-12" style={{ color: 'var(--text-secondary)' }}>
              Join our waitlist and get notified when we launch in your city.
            </p>
          </div>

          <Card className="product-card glass-morphism scale-in">
            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="rounded-full px-6 py-4 border-2 border-gray-200 focus:border-green-400 transition-all duration-300 text-lg"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="rounded-full px-6 py-4 border-2 border-gray-200 focus:border-green-400 transition-all duration-300 text-lg"
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <Input
                    type="text"
                    name="city"
                    placeholder="Your City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="rounded-full px-6 py-4 border-2 border-gray-200 focus:border-green-400 transition-all duration-300 text-lg"
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="btn-primary w-full py-5 text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Joining...
                    </>
                  ) : (
                    'Notify me when available'
                  )}
                </Button>
              </form>
              
              {formStatus && (
                <div className={`mt-6 p-4 rounded-2xl ${
                  formStatus.includes('Thanks') 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                } slide-in-up`}>
                  <p className="font-medium">{formStatus}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <span className="font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>Rise Gum</span>
              </div>
              <p className="body-medium mb-4">{contactInfo.address}</p>
              <p className="body-small" style={{ color: 'var(--text-muted)' }}>
                Revolutionizing energy consumption across India, one campus at a time.
              </p>
            </div>

            {/* Contact */}
            <div className="fade-in animate-delay-200">
              <h4 className="font-semibold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
                Contact
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 hover:text-green-600 transition-colors duration-200">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="body-small">{contactInfo.email}</span>
                </div>
                <div className="flex items-center space-x-3 hover:text-green-600 transition-colors duration-200">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="body-small">{contactInfo.phone}</span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="fade-in animate-delay-300">
              <h4 className="font-semibold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
                Follow Us
              </h4>
              <div className="flex space-x-3">
                {socialLinks.map((link, index) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center hover:from-green-400 hover:to-green-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {getIcon(link.icon)}
                  </a>
                ))}
              </div>
              <p className="body-small mt-4" style={{ color: 'var(--text-muted)' }}>
                Stay updated with our launch progress
              </p>
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="text-center fade-in animate-delay-400">
            <p className="body-small mb-2">
              © 2024 Rise Gum. All rights reserved. Made with ❤️ in India.
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Empowering India's next generation with clean, sustainable energy.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RiseGumLanding;