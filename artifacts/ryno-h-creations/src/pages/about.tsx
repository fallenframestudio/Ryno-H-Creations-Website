export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="py-20 md:py-32 container px-4 md:px-8 mx-auto max-w-4xl">
        <div className="space-y-12">
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-6xl font-serif">The Artist</h1>
            <div className="h-px w-24 bg-primary mx-auto" />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:font-light prose-p:leading-loose prose-p:text-muted-foreground mx-auto font-sans">
            <p className="text-xl md:text-2xl text-foreground font-serif italic mb-10 text-center leading-relaxed">
              "Ryno Hellestrand discovered his remarkable gift for painting at the age of 50 — proof that creativity has no expiry date."
            </p>

            <p>
              Born with a keen eye for colour and composition, it was only in the second half of his life that he picked up a brush and let his imagination speak.
            </p>

            <p>
              Based in Bloemfontein, in the heart of South Africa, Ryno paints with a passion that is both disciplined and deeply emotional. Each canvas is a conversation — between light and shadow, between feeling and form. His work spans bold acrylics to delicate oils, capturing landscapes, still life, and abstract expressions that resonate long after you have looked away.
            </p>

            <div className="my-16 border-l-2 border-primary pl-8 py-2">
              <p className="text-xl text-foreground font-medium m-0">
                Ryno H Creations is more than a business — it is a testament to the belief that it is never too late to begin, never too late to create, and never too late to share your gift with the world.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
