import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import PricingSection from '../components/PricingSection';
import FeaturedInSection from '../components/FeaturedInSection';
import ClientReviews from '../components/ClientReviews';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseUs />
      <PricingSection />
      <FeaturedInSection />
      <ClientReviews />
      <Footer />
    </>
  );
};

export default HomePage;
