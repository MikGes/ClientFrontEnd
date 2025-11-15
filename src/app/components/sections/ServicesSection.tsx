// components/sections/ServicesSection.tsx
import { FaHome, FaChair, FaPaintBrush, FaBed, FaStar } from 'react-icons/fa';

// Note: FaIdeal doesn't exist — replace with FaLightbulb or similar
import { FaLightbulb as FaIdeal } from 'react-icons/fa';

export default function ServicesSection() {
  const services = [
    { icon: <FaHome />, title: 'Architectural Design', desc: 'Transform your home into a sanctuary of comfort and style with our bespoke architectural design services.' },
    { icon: <FaChair />, title: 'Custom Furniture', desc: 'Commission unique, handcrafted furniture pieces designed exclusively for your space and needs.' },
    { icon: <FaPaintBrush />, title: 'Full Renovation', desc: 'Complete interior renovation services from concept to completion with our expert design team.' },
    { icon: <FaBed />, title: 'Space Planning', desc: 'Optimize your space with intelligent layouts that maximize functionality and aesthetic appeal.' },
    { icon: <FaIdeal />, title: 'Lighting Design', desc: 'Create ambiance and highlight architectural features with our specialized lighting solutions.' },
    { icon: <FaStar />, title: 'Styling Consultation', desc: 'Refresh your space with expert styling advice and curated product selections.' },
  ];

  return (
    <section id="services" className="py-16 bg-amber-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900">Our Premium Services</h2>
          <p className="mt-4 text-amber-700 max-w-2xl mx-auto">
            We offer comprehensive interior solutions tailored to your unique space and style preferences.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-amber-700 rounded-lg flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-3">{service.title}</h3>
              <p className="text-amber-700">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}