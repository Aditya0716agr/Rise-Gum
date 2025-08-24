// Mock data for Rise Gum Landing Page

// Waitlist entries storage
export const waitlistEntries = [];

// Add new waitlist entry
export const addWaitlistEntry = (entry) => {
  const newEntry = {
    id: Date.now() + Math.random(),
    ...entry,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
  waitlistEntries.push(newEntry);
  return newEntry;
};

// Get all waitlist entries
export const getWaitlistEntries = () => waitlistEntries;

// Mock testimonials
export const testimonials = [
  {
    id: 1,
    name: "Arjun Sharma",
    role: "Engineering Student, IIT Delhi",
    city: "Delhi",
    quote: "Finally, energy without the sugar crash! Perfect for those late-night study sessions.",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Medical Student",
    city: "Mumbai", 
    quote: "As a med student, I need clean energy. Rise Gum is a game-changer!",
    rating: 5
  },
  {
    id: 3,
    name: "Rohan Gupta",
    role: "Software Developer",
    city: "Bangalore",
    quote: "Convenient and effective. No more coffee stains on my laptop!",
    rating: 5
  }
];

// Social proof stats
export const socialProofStats = {
  interestedStudents: 1247,
  universities: 15,
  cities: 8,
  growthRate: '+12% weekly'
};

// Product benefits
export const productBenefits = [
  {
    id: 1,
    title: "Sugar-Free & Healthy",
    description: "Zero sugar, zero calories. All the energy, none of the crash.",
    icon: "Heart"
  },
  {
    id: 2,
    title: "Pocket-Sized Convenience", 
    description: "Fits anywhere. Perfect for exams, meetings, or long commutes.",
    icon: "Zap"
  },
  {
    id: 3,
    title: "Fast-Acting Energy",
    description: "Energy in seconds, not minutes. Powered by natural caffeine.",
    icon: "Clock"
  }
];

// Problem statements
export const problemPoints = [
  {
    id: 1,
    title: "Sugary Energy Drinks",
    description: "High sugar, crashes, unhealthy",
    icon: "X",
    type: "problem"
  },
  {
    id: 2,
    title: "Regular Gum",
    description: "No energy boost, just flavor",
    icon: "Minus", 
    type: "neutral"
  },
  {
    id: 3,
    title: "Rise Gum",
    description: "Clean energy, sugar-free, convenient",
    icon: "CheckCircle",
    type: "solution"
  }
];

// Footer social links
export const socialLinks = [
  { platform: "Instagram", icon: "Instagram", url: "#" },
  { platform: "Twitter", icon: "Twitter", url: "#" },
  { platform: "LinkedIn", icon: "Linkedin", url: "#" },
  { platform: "WhatsApp", icon: "MessageCircle", url: "#" }
];

// Contact information
export const contactInfo = {
  email: "hello@risegum.in",
  phone: "+91-9999-RISE-GUM",
  address: "Coming to campuses near you"
};