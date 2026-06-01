import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Painting } from "@workspace/api-client-react";

export function PaintingCard({ painting }: { painting: Painting }) {
  const formattedPrice = painting.price.toLocaleString('en-ZA');
  const whatsappUrl = `https://wa.me/27817724975?text=Hi%20Ryno%2C%20I%27m%20interested%20in%20${encodeURIComponent(painting.title)}%20(R%20${painting.price})`;

  return (
    <Card className="overflow-hidden border-border/40 bg-card rounded-none shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full">
      <div className="aspect-[4/5] relative overflow-hidden bg-muted">
        {painting.imageUrl ? (
          <img
            src={painting.imageUrl}
            alt={painting.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif italic text-sm">
            Image forthcoming
          </div>
        )}
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="font-serif text-lg font-medium text-foreground tracking-tight">{painting.title}</h3>
        {painting.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">{painting.description}</p>
        )}
        <div className="mt-auto pt-6 flex justify-between items-center">
          <span className="font-medium text-foreground tracking-wide">R {formattedPrice}</span>
          <Button asChild variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Enquire
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
