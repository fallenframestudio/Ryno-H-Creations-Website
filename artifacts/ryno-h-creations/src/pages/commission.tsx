import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Commission() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message =
      `Hi Ryno, I would like to commission a custom painting.\n\n` +
      `Name: ${name}\n` +
      `Contact: ${contact}\n` +
      (size ? `Size / Format: ${size}\n` : "") +
      `\nDescription:\n${description}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/27817724975?text=${encoded}`, "_blank");
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <section
        className="relative py-28 md:py-40 border-b border-border/40 overflow-hidden"
        style={{ backgroundImage: "url('/hero-bg.jpeg')", backgroundSize: "cover", backgroundPosition: "center top" }}
      >
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />
        <div className="container px-4 md:px-8 mx-auto max-w-3xl text-center space-y-6 relative z-10">
          <span className="text-[#c9a84c] font-medium tracking-[0.25em] uppercase text-xs">
            Bespoke Artwork
          </span>
          <h1 className="text-4xl md:text-6xl font-serif leading-tight text-white">
            Commission a Painting
          </h1>
          <p className="text-white/75 font-light leading-relaxed text-lg max-w-xl mx-auto">
            Have something specific in mind? Ryno Henning takes on select commission work — a portrait, a landscape, a memory, or a vision entirely your own.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 border-b border-border/40 bg-background">
        <div className="container px-4 md:px-8 mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-serif text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full border border-primary/40 flex items-center justify-center mx-auto">
                <span className="font-serif text-primary text-lg">1</span>
              </div>
              <h3 className="font-serif text-lg">Share Your Vision</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                Describe what you would like painted — a place, a person, a feeling. The more detail, the better.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full border border-primary/40 flex items-center justify-center mx-auto">
                <span className="font-serif text-primary text-lg">2</span>
              </div>
              <h3 className="font-serif text-lg">Ryno Gets in Touch</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                Ryno will respond via WhatsApp to discuss your request, agree on dimensions, and provide a quote.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full border border-primary/40 flex items-center justify-center mx-auto">
                <span className="font-serif text-primary text-lg">3</span>
              </div>
              <h3 className="font-serif text-lg">Your Artwork is Created</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                Once agreed, Ryno begins the work. You receive a one-of-a-kind original painting made with care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container px-4 md:px-8 mx-auto max-w-2xl">
          {submitted ? (
            <div className="text-center space-y-6 py-16 animate-in fade-in duration-700">
              <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center mx-auto">
                <span className="font-serif text-primary text-2xl">&#10003;</span>
              </div>
              <h2 className="text-3xl font-serif">Request Sent</h2>
              <p className="text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
                Your commission request has been sent to Ryno via WhatsApp. He will be in touch with you shortly to discuss the details.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                data-testid="button-submit-another"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-2xl md:text-3xl font-serif">Tell Ryno What You Have in Mind</h2>
                <p className="text-muted-foreground text-sm font-light">
                  Your request will be sent directly to Ryno via WhatsApp.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="commission-name">Your Name *</Label>
                    <Input
                      id="commission-name"
                      data-testid="input-name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder="e.g. Sarah van der Berg"
                      className="rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commission-contact">WhatsApp / Email *</Label>
                    <Input
                      id="commission-contact"
                      data-testid="input-contact"
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                      required
                      placeholder="e.g. 082 123 4567"
                      className="rounded-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commission-size">Preferred Size / Format <span className="text-muted-foreground font-light">(optional)</span></Label>
                  <Input
                    id="commission-size"
                    data-testid="input-size"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    placeholder="e.g. A3 canvas, 60x80cm, or I'm not sure yet"
                    className="rounded-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commission-description">Describe Your Painting *</Label>
                  <Textarea
                    id="commission-description"
                    data-testid="input-description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    rows={6}
                    placeholder="Describe what you would like painted — a landscape, a portrait, a special moment, a place that means something to you. Any reference photos or colour preferences are welcome."
                    className="rounded-none resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  data-testid="button-submit"
                  className="w-full rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-medium tracking-wide"
                >
                  Send Commission Request via WhatsApp
                </Button>

                <p className="text-xs text-muted-foreground text-center font-light">
                  Clicking the button will open WhatsApp with your request pre-filled. Ryno aims to respond within 24 hours.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
