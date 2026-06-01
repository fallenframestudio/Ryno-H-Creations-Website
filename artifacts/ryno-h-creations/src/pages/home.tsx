import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PaintingCard } from "@/components/painting-card";
import { useGetFeaturedPaintings, useGetPaintingStats } from "@workspace/api-client-react";

export default function Home() {
  const { data: featuredPaintings, isLoading: isFeaturedLoading } = useGetFeaturedPaintings();
  const { data: stats, isLoading: isStatsLoading } = useGetPaintingStats();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        
        <div className="container px-4 md:px-8 relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="text-primary font-medium tracking-[0.25em] uppercase text-xs md:text-sm">Fine Art Gallery</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground leading-tight">
            Light, Shadow &<br />
            <span className="italic text-muted-foreground">Emotion</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
            The digital home of Ryno H Creations. A curated collection of original works spanning bold acrylics to delicate oils.
          </p>
          <div className="flex gap-4 pt-4">
            <Button asChild size="lg" className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-medium tracking-wide">
              <Link href="/gallery">View Gallery</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none border-primary/20 hover:border-primary text-foreground px-8 font-medium tracking-wide">
              <Link href="/about">The Artist</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Works count strip */}
      <section className="py-8 border-y border-border/40 bg-card">
        <div className="container px-4 md:px-8 text-center">
          <p className="text-sm tracking-widest uppercase text-muted-foreground font-medium">
            {isStatsLoading ? "" : `${stats?.total || 0} Original Works Available`}
          </p>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Featured Works</h2>
              <p className="text-muted-foreground max-w-lg font-light leading-relaxed">
                A selection of Ryno's most compelling recent pieces, hand-picked for their exceptional composition and emotional resonance.
              </p>
            </div>
            <Button asChild variant="link" className="text-primary p-0 h-auto font-medium tracking-wide">
              <Link href="/gallery">Explore full collection &rarr;</Link>
            </Button>
          </div>

          {isFeaturedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] bg-muted animate-pulse" />
              ))}
            </div>
          ) : featuredPaintings && featuredPaintings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPaintings.map((painting) => (
                <PaintingCard key={painting.id} painting={painting} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-card border border-border/40">
              <p className="font-serif italic text-muted-foreground text-lg">No featured works available at this time.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
