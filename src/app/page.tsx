import Hero from "@/components/Hero";
import Services from "@/components/Services";
import SmartHealthSection from "@/components/SmartHealthSection";
import ArticleSlider from "@/components/ArticleSlider";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <Services />
      <SmartHealthSection />
      <ArticleSlider />
    </main>
  );
}
