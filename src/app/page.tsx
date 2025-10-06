import { Header, HeroSection, LandingPageLayout, BrandsMarquee, ServicesSection, AchievementsSection, LocationsSection, FooterSection } from '@/components';

export default function Home() {
  return (
    <>
      <LandingPageLayout>
        <Header />
        <HeroSection />
      </LandingPageLayout>
      <BrandsMarquee />
      <ServicesSection />
      <AchievementsSection />
      <LocationsSection />
      <FooterSection />
    </>
  );
}
