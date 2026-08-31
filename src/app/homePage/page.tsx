import Hero from './components/hero';
import VisageShowcase from './components/VisageShowcase';
import FAQ from './components/faq';
import CorpsShowcase from './components/CorpsShowcase';
import DiscountShowcase from './components/DiscountShowcase';
import BrandsSlider from './components/BrandsSlider';
import CapillaireShowcase from './components/CapillaireShowcase';
import HygieneShowcase from './components/hygieneShowcase';


export default function Home() {
  return (
    <main className="bg-[#F9F6F3] min-h-screen pb-0">
      <Hero />
      <BrandsSlider />
      <VisageShowcase />
      <CorpsShowcase />
      <DiscountShowcase />
      <CapillaireShowcase />
      <HygieneShowcase />
      <FAQ />
    </main>
  );
}

