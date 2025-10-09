import { Header, AboutPageLayout, AboutHeroSection, AboutSection, CustomerValuesSection, LeadersSection, FooterSection } from '@/components';

export default function About() {
  return (
    <>
      <AboutPageLayout>
        <Header />
        <AboutHeroSection />
      </AboutPageLayout>
      <AboutSection />
      <CustomerValuesSection />
      <LeadersSection />
      <FooterSection />
    </>
  );
}
