import { Phone, Mail, MapPin, Send, CheckCircle, Heart, Droplets } from "lucide-react";
import { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
      setTimeout(() => setSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Floating Heart Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <Heart
            key={i}
            className="absolute w-4 h-4 text-red-200 opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Floating Droplets */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <Droplets
            key={i}
            className="absolute w-3 h-3 text-red-300 opacity-20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 1}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Heart className="w-12 h-12 text-red-500 animate-pulse" />
            <h2 className="text-6xl font-black bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
              Contact Us
            </h2>
            <Droplets className="w-12 h-12 text-red-500 animate-pulse" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to save lives? Get in touch with our blood donation team. Every donation counts!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <div className="relative bg-white p-8 rounded-2xl border border-red-100 shadow-2xl hover:shadow-red-100 transition-all duration-300">
              <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-800 placeholder-transparent focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all duration-300"
                  />
                  <label className="absolute left-4 -top-2.5 text-sm text-red-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-red-500 bg-white px-1 rounded font-medium">
                    Full Name
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-800 placeholder-transparent focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all duration-300"
                  />
                  <label className="absolute left-4 -top-2.5 text-sm text-red-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-red-500 bg-white px-1 rounded font-medium">
                    Email Address
                  </label>
                </div>

                <div className="relative group">
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder=" "
                    className="peer w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-800 placeholder-transparent focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all duration-300 resize-none"
                  />
                  <label className="absolute left-4 -top-2.5 text-sm text-red-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-red-500 bg-white px-1 rounded font-medium">
                    Your Message
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </span>
                </button>

                {success && (
                  <div className="flex items-center gap-2 text-green-600 font-medium text-center justify-center animate-bounce bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-6">
            {[
              { icon: Phone, title: "Emergency Hotline", info: "+880 1234 567 890", color: "from-red-500 to-red-600" },
              { icon: Mail, title: "Blood Bank Email", info: "bloodbank@redaid.com", color: "from-red-400 to-red-500" },
              { icon: MapPin, title: "Blood Center", info: "123 RedAid Blood Center, Dhaka, Bangladesh", color: "from-red-600 to-red-700" }
            ].map((contact, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-red-100 hover:border-red-200 shadow-lg hover:shadow-red-100 transition-all duration-300 transform hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${contact.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${contact.color} shadow-lg`}>
                    <contact.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-1">{contact.title}</h4>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{contact.info}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Blood Donation Hours */}
            <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-red-100 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-red-100 opacity-30"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-6 h-6 text-red-500" />
                  <h4 className="font-bold text-lg text-gray-800">Blood Donation Hours</h4>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                  <p>Saturday: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: 10:00 AM - 4:00 PM</p>
                  <p className="text-red-600 font-medium mt-3 bg-red-50 p-2 rounded-lg">🩸 Emergency donations: 24/7</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-red-100 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-red-100 opacity-30"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Droplets className="w-6 h-6 text-red-500" />
                  <h4 className="font-bold text-lg text-gray-800">Impact Stats</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center hover:bg-red-100 transition-colors duration-300">
                    <div className="text-3xl font-bold text-red-600 mb-1">5,000+</div>
                    <div className="text-sm text-gray-600 font-medium">Lives Saved</div>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center hover:bg-red-100 transition-colors duration-300">
                    <div className="text-3xl font-bold text-red-600 mb-1">1,200+</div>
                    <div className="text-sm text-gray-600 font-medium">Active Donors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;