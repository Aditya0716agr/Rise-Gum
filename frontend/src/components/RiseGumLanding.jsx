import React, { useState } from 'react';
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
import { 
  addWaitlistEntry, 
  testimonials, 
  socialProofStats, 
  productBenefits,
  problemPoints,
  socialLinks,
  contactInfo 
} from '../data/mock';

const RiseGumLanding = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.city) {
      setFormStatus('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormStatus('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Add to mock storage
      const entry = addWaitlistEntry(formData);
      console.log('Waitlist entry added:', entry);
      
      setFormStatus('Thanks! We\'ll notify you when Rise Gum launches.');
      setFormData({ name: '', email: '', city: '' });
    } catch (error) {
      setFormStatus('Something went wrong. Please try again.');
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
          <Badge className="mb-4 px-3 py-1 bg-green-100 text-green-800 border-green-200">
            Fast, Portable, Smart Energy
          </Badge>
          
          <h1 className="heading-1 mb-6">
            Get Energy Anywhere
          </h1>
          
          <p className="body-large mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            India's first sugar-free caffeine gum for students & professionals. 
            Clean energy that fits in your pocket.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button className="btn-primary text-lg px-8 py-4 animate-pulse-subtle">
              Join Waitlist <Mail className="w-5 h-5 ml-2" />
            </Button>
            <Button className="btn-secondary text-lg px-8 py-4 hover:shadow-lg transition-all duration-300">
              Learn More
            </Button>
          </div>

          {/* Floating Energy Icons Animation */}
          <div className="relative w-full max-w-2xl mx-auto h-32 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="floating-icon floating-icon-1">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="floating-icon floating-icon-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="floating-icon floating-icon-3">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Heart className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
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
            {problemPoints.map((point, index) => (
              <Card key={point.id} className={`product-card text-center slide-in-up animate-delay-${(index + 1) * 100} ${
                point.type === 'problem' ? 'border-red-200 bg-red-50' :
                point.type === 'solution' ? 'border-green-200 bg-green-50' : ''
              }`}>
                <CardContent className="p-8">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110 ${
                    point.type === 'problem' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                    point.type === 'solution' ? 'bg-gradient-to-br from-green-400 to-green-600' : 
                    'bg-gradient-to-br from-gray-400 to-gray-600'
                  }`}>
                    <div className="text-white">
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
            {productBenefits.map((benefit, index) => (
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
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--bg-section)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="heading-2">
              {socialProofStats.interestedStudents}+ students already interested
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--accent-text)' }}>
                {socialProofStats.interestedStudents}+
              </div>
              <div className="body-small">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--accent-text)' }}>
                {socialProofStats.universities}+
              </div>
              <div className="body-small">Universities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--accent-text)' }}>
                {socialProofStats.cities}+
              </div>
              <div className="body-small">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--accent-text)' }}>
                {socialProofStats.growthRate}
              </div>
              <div className="body-small">Growth</div>
            </div>
          </div>

          {/* Testimonial */}
          <Card className="product-card max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="body-medium mb-4 italic">
                "{testimonials[0].quote}"
              </blockquote>
              <div className="text-center">
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {testimonials[0].name}
                </div>
                <div className="body-small">
                  {testimonials[0].role} • {testimonials[0].city}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section id="waitlist" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="heading-2 mb-4">
            Be the first to try Rise Gum
          </h2>
          <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
            Join our waitlist and get notified when we launch in your city.
          </p>

          <Card className="product-card">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="rounded-full px-4 py-3"
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded-full px-4 py-3"
                    required
                  />
                </div>
                <Input
                  type="text"
                  name="city"
                  placeholder="Your City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="rounded-full px-4 py-3"
                  required
                />
                
                <Button 
                  type="submit"
                  className="btn-primary w-full py-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Joining...' : 'Notify me when available'}
                </Button>
              </form>
              
              {formStatus && (
                <p className={`mt-4 text-sm ${
                  formStatus.includes('Thanks') 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formStatus}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Rise Gum</span>
              </div>
              <p className="body-small">{contactInfo.address}</p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Contact
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span className="body-small">{contactInfo.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span className="body-small">{contactInfo.phone}</span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Follow Us
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors"
                  >
                    {getIcon(link.icon)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="text-center">
            <p className="body-small">
              © 2024 Rise Gum. All rights reserved. Made with ❤️ in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RiseGumLanding;