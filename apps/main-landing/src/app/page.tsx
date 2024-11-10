import {
  HeroSection,
  SuperpowersSection,
  ProductsSection,
  TokenSection,
  TopBar,
  Footer,
} from '@/components';

// ts-unused-exports:disable-next-line
export default function Home() {
  return (
    <>
      <TopBar />
      <main>
        <HeroSection />
        <SuperpowersSection />
        <ProductsSection />
        <TokenSection />
      </main>
      <Footer />
    </>
  );
}
