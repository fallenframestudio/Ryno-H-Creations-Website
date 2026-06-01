import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-[80vh] bg-background">
      <section
        className="relative py-28 md:py-40 overflow-hidden"
        style={{ backgroundImage: "url('/hero-bg.jpeg')", backgroundSize: "cover", backgroundPosition: "center top" }}
      >
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Get in Touch</h1>
          <div className="h-px w-24 bg-[#c9a84c] mx-auto" />
        </div>
      </section>
      <div className="container px-4 md:px-8 mx-auto max-w-3xl py-16">
        <div className="bg-card border border-border/40 p-8 md:p-16 text-center shadow-sm">
          <h1 className="sr-only">Get in Touch</h1>
          <p className="text-muted-foreground font-light mb-12 max-w-lg mx-auto">
            Whether you are interested in acquiring a piece, commissioning a custom work, or simply discussing the art, Ryno welcomes your inquiry.
          </p>

          <div className="space-y-10">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">WhatsApp</p>
              <a 
                href="https://wa.me/27817724975" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl font-serif text-primary hover:text-foreground transition-colors"
              >
                081 772 4975
              </a>
            </div>

            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">Email</p>
              <a 
                href="mailto:rynohcreations@gmail.com" 
                className="text-xl text-foreground hover:text-primary transition-colors"
              >
                rynohcreations@gmail.com
              </a>
            </div>

            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">Studio Location</p>
              <p className="text-lg text-foreground">
                Bloemfontein, Free State<br />
                South Africa
              </p>
            </div>
          </div>

          <div className="mt-16">
            <Button asChild size="lg" className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground px-12 font-medium">
              <a href="https://wa.me/27817724975" target="_blank" rel="noopener noreferrer">
                Message on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
