// app/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Section Components
import HeroSection from './components/sections/HeroSection';
import ProductsSection from './components/sections/ProductsSection';
import ServicesSection from './components/sections/ServicesSection';
import AboutSection from './components/sections/AboutSection';
import ContactSection from './components/sections/ContactSection';
import NewsletterSection from './components/sections/NewsLetterSection';

// UI Components
import ProductModal from './ui/ProductModal';

// Static Data
import { interiorProducts } from './data/products';

// Types
interface FurnitureItem {
  _id: string;
  furniture_name: string;
  furniture_type: string;
  furniture_price: string;
  furniture_description: string;
  special_description: string;
}

interface ContactForm {
  name: string;
  phone: string;
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<FurnitureItem | null>(null);
  const [furnitures, setFurnitures] = useState<FurnitureItem[]>([]);
  const [contactForm, setContactForm] = useState<ContactForm>({ name: '', phone: '' });
  const [formErrors, setFormErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Fetch furniture data + scroll tracking
  useEffect(() => {
    const getFurniture = async () => {
      try {
        const res = await fetch('http://localhost:4000/users/furnitures');
        const result = await res.json();
        if (result.success) {
          setFurnitures(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch furniture:', err);
      }
    };
    getFurniture();

    // Scroll tracking
    const handleScroll = () => {
      const sections = ['home', 'products', 'services', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const categorizedFurniture = useMemo(() => {
    return furnitures.reduce((acc: any, item) => {
      const category = item.furniture_type || 'Uncategorized';
      acc[category] = acc[category] || [];
      acc[category].push(item);
      return acc;
    }, {});
  }, [furnitures]);

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const openProductModal = (product: FurnitureItem) => {
    setSelectedProduct(product);
    setContactForm({ name: '', phone: '' });
    setFormErrors({});
    setSubmitSuccess(false);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  const validateForm = () => {
    const errors: Partial<ContactForm> = {};
    if (!contactForm.name.trim()) errors.name = 'Name is required';
    if (!contactForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(contactForm.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const closeModal = () => setIsModalOpen(false);
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      console.log('Submitted:', { ...contactForm, product: selectedProduct });
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ContactForm]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name as keyof ContactForm];
        return updated;
      });
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      <Header
        activeSection={activeSection}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrollToSection={scrollToSection}
      />

      <main>
        <HeroSection
          onViewProducts={() => scrollToSection('products')}
          onContactClick={() => scrollToSection('contact')}
        />
        <div className="py-8 bg-yellow-100">
          <NewsletterSection />
        </div>
        <div>
          {/* Category Cards */}
          <div id="products" className="py-8 px-4 bg-amber-900">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Shop by Category</h2>

            {/* 3-column responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Object.keys(categorizedFurniture).map((category) => {
                // Optional: Get first product image as category thumbnail
                const sampleItem = categorizedFurniture[category][0];
                const imageUrl = sampleItem?.furniture_image || '/placeholder-furniture.jpg'; // fallback image

                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className="group flex flex-col overflow-hidden rounded-xl bg-amber-50 border border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75"
                    aria-label={`View ${category} collection`}
                  >
                    {/* Image Container */}
                    <div className="aspect-square w-full bg-amber-100 flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${category} furniture`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"

                        />
                      ) : (
                        <div className="text-amber-500 text-4xl">🪑</div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col items-center justify-center bg-white">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{category}</h3>
                      <p className="text-amber-700 font-medium">
                        {categorizedFurniture[category].length} item{categorizedFurniture[category].length !== 1 ? 's' : ''}
                      </p>

                      <span className="mt-3 inline-block px-4 py-1.5 text-sm font-medium text-amber-700 bg-amber-100 rounded-full transition-colors">
                        View Collection
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && selectedCategory && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-40 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <div
                className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl transform transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button (Top Right) */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-80 text-gray-600 hover:bg-amber-100 hover:text-amber-700 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Modal Header */}
                <div className="px-6 pt-8 pb-4 border-b border-amber-100">
                  <h2
                    id="modal-title"
                    className="text-2xl font-bold text-gray-800 text-center"
                  >
                    {selectedCategory} Collection
                  </h2>
                </div>


                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  <ProductsSection
                    furnitures={categorizedFurniture[selectedCategory]}
                    openProductModal={openProductModal}
                  // interiorProducts={interiorProducts}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <ServicesSection />
        <AboutSection />
        <ContactSection />
        <div className="py-8 bg-yellow-100">
          <NewsletterSection />
        </div>
      </main>

      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={closeProductModal}
        />
      )}
    </div>
  );
}