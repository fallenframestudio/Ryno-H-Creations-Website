import React from "react";
import { Link } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="group flex flex-col">
            <span className="font-serif text-2xl font-semibold tracking-tight text-primary transition-colors group-hover:text-foreground">
              Ryno H
            </span>
            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground font-medium">
              Creations
            </span>
          </Link>
          <nav className="flex items-center gap-8 text-sm font-medium tracking-wide">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
            <Link href="/commission" className="hover:text-primary transition-colors">Commission</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t border-border py-12 md:py-16 mt-auto bg-card">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-serif text-xl font-semibold text-primary">Ryno H Creations</span>
            <span className="text-sm text-muted-foreground mt-2">Bloemfontein, Free State, South Africa</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
