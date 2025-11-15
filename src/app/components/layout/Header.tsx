// components/layout/Header.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import Logo from '../../../../public/Logo.png'
import Image from 'next/image';
interface HeaderProps {
  activeSection: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  scrollToSection: (id: string) => void;
}

export default function Header({ activeSection, isMenuOpen, setIsMenuOpen, scrollToSection }: HeaderProps) {
  return (
    <header className="fixed w-full backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src={Logo} className="position:relative" alt='Logo' width={300} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className={`font-medium ${activeSection === 'home' ? 'text-amber-800 border-b-2 border-amber-700' : 'text-amber-700 hover:text-amber-900'}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className={`font-medium ${activeSection === 'products' ? 'text-amber-800 border-b-2 border-amber-700' : 'text-amber-700 hover:text-amber-900'}`}
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className={`font-medium ${activeSection === 'services' ? 'text-amber-800 border-b-2 border-amber-700' : 'text-amber-700 hover:text-amber-900'}`}
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`font-medium ${activeSection === 'contact' ? 'text-amber-800 border-b-2 border-amber-700' : 'text-amber-700 hover:text-amber-900'}`}
            >
              Contact
            </button>
            <Link
              href="/Login"
              className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
            >
              Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-amber-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  scrollToSection('home');
                  setIsMenuOpen(false);
                }}
                className="py-2 text-amber-800 font-medium border-b border-amber-200"
              >
                Home
              </button>
              <button
                onClick={() => {
                  scrollToSection('products');
                  setIsMenuOpen(false);
                }}
                className="py-2 text-amber-800 font-medium border-b border-amber-200"
              >
                Products
              </button>
              <button
                onClick={() => {
                  scrollToSection('services');
                  setIsMenuOpen(false);
                }}
                className="py-2 text-amber-800 font-medium border-b border-amber-200"
              >
                Services
              </button>
              <button
                onClick={() => {
                  scrollToSection('contact');
                  setIsMenuOpen(false);
                }}
                className="py-2 text-amber-800 font-medium border-b border-amber-200"
              >
                Contact
              </button>
              <Link
                href="/Login"
                className="bg-amber-700 text-white py-2 rounded-lg font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}