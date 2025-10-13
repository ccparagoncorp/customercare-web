import { Header, FooterSection } from '@/components';
import { FAQHeroSection, FAQList, StillNeedHelpSection } from '@/components/faq';

export default function FAQ() {
  return (
    <>
      <Header />
      <FAQHeroSection />
      <FAQList />
      <StillNeedHelpSection />
      <FooterSection />
    </>
  );
}
