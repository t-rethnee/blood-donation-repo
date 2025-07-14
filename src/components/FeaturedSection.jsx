import { Heart, Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const headerVariant = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const ctaVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { delay: 1, duration: 0.5 } },
};

const FeaturedSection = () => {
  const features = [
    {
      icon: <Heart className="h-16 w-16 text-white" />,
      title: "Save Lives",
      desc: "Join thousands of donors helping save lives through blood donation.",
      gradient: "from-red-500 via-red-600 to-rose-700",
    },
    {
      icon: <Users className="h-16 w-16 text-white" />,
      title: "Community Support",
      desc: "Connect with donors and recipients across your district and upazila.",
      gradient: "from-red-600 via-rose-600 to-pink-700",
    },
    {
      icon: <ShieldCheck className="h-16 w-16 text-white" />,
      title: "Safe & Trusted",
      desc: "All donors are verified, ensuring safe and reliable blood donation process.",
      gradient: "from-rose-500 via-red-600 to-red-700",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50 px-6 py-24">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-rose-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-50 rounded-full opacity-30 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="inline-block">
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-600 via-red-500 to-rose-600 bg-clip-text text-transparent mb-4">
              Why Choose
            </h2>
            <div className="text-5xl md:text-6xl font-black text-red-600 relative">
              RedAid?
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-full"></div>
            </div>
          </div>
          <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
            Experience the future of blood donation with cutting-edge technology and community care
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map(({ icon, title, desc, gradient }, idx) => (
            <motion.div
              key={idx}
              className="group relative"
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>

              <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 h-full transform group-hover:scale-[1.02] transition-all duration-500 shadow-xl group-hover:shadow-2xl">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} mb-6 group-hover:rotate-6 transition-transform duration-500 shadow-lg`}>
                  {icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {desc}
                </p>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          className="text-center"
          variants={ctaVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <button
            onClick={() => window.location.href = "/register"}
            className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-red-600 to-rose-600 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <span className="relative z-10 flex items-center">
              <Heart className="w-5 h-5 mr-3 group-hover:animate-pulse" />
              Become a Donor
              <div className="ml-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </span>
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 group-hover:animate-ping"></div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSection;
