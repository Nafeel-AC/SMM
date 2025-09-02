import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import TargetAudience from '../components/TargetAudience';
import AboutSection from '../components/AboutSection';
import WorkSection from '../components/Work';
import WhyChooseUs from '../components/WhyChooseUs';
import PricingSection from '../components/PricingSection';
import FeaturedInSection from '../components/FeaturedInSection';
import ClientReviews from '../components/ClientReviews';


const HomePage = () => {
  const { user, loading, getNextUserFlowStep } = useAuth();
  const navigate = useNavigate();

  // Redirect to appropriate step if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      const nextStep = getNextUserFlowStep();
      navigate(nextStep);
    }
  }, [user, loading, navigate, getNextUserFlowStep]);

  // If still loading or user is not logged in, show the homepage
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <AboutSection />
      <TargetAudience />
      <ClientReviews />
      <PricingSection />
      {/* <WorkSection /> */}
      {/* <WhyChooseUs /> */}
      {/* <FeaturedInSection /> */}
    </>
  );
};

export default HomePage;
