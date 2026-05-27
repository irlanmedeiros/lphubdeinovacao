import { createFileRoute } from "@tanstack/react-router";
import { Header, Hero, EditalInfo, Eixos, Timeline, Origin, About, FAQ, Footer } from "@/components/landing/Sections";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <EditalInfo />
        <Eixos />
        <Timeline />
        <Origin />
        <About />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

