import { useListPaintings } from "@workspace/api-client-react";
import { PaintingCard } from "@/components/painting-card";

export default function Gallery() {
  const { data: paintings, isLoading } = useListPaintings();

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <section
        className="relative py-28 md:py-40 border-b border-border/40 overflow-hidden"
        style={{ backgroundImage: "url('/hero-bg.jpeg')", backgroundSize: "cover", backgroundPosition: "center top" }}
      >
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />
        <div className="container px-4 md:px-8 text-center max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif mb-6 text-white">The Gallery</h1>
          <p className="text-lg text-white/75 font-light leading-relaxed">
            Browse the complete collection of Ryno's available works. Each piece represents a unique conversation between light, shadow, feeling, and form.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-[4/5] bg-muted animate-pulse" />
              ))}
            </div>
          ) : paintings && paintings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paintings.map((painting) => (
                <PaintingCard key={painting.id} painting={painting} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="font-serif italic text-muted-foreground text-xl">The gallery is currently empty.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
