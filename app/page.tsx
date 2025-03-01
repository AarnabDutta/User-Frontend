'use client';

import { Button } from '@/components/ui/button';
import { MoveRight, Users, Share2, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar } from '@/components/ui/avatar';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2 animate-fade-in">
            <div className="bg-primary/10 p-1.5 rounded-full">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">FILxCONNECT</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="hover-scale">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="hover-scale">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 className={`text-4xl md:text-6xl font-bold tracking-tighter transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Connect. Share. Grow.
              <br />
              <span className="text-primary">Your Professional Journey Starts Here</span>
            </h1>
            <p className={`text-xl text-muted-foreground max-w-[600px] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Join the next generation of professional networking. Build meaningful connections,
              share your expertise, and discover new opportunities.
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link href="/signup">
                <Button size="lg" className="group hover-scale">
                  Join Now
                  <MoveRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="hover-scale">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 animate-slide-up">Why Choose FILxCONNECT?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm hover-scale transition-all animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-primary/10 p-4 rounded-full mb-4 animate-pulse-slow">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect with Professionals</h3>
              <p className="text-muted-foreground">
                Build your network with industry leaders and like-minded professionals.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm hover-scale transition-all animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-primary/10 p-4 rounded-full mb-4 animate-pulse-slow">
                <Share2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Story</h3>
              <p className="text-muted-foreground">
                Share your achievements, insights, and experiences with a global audience.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm hover-scale transition-all animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-primary/10 p-4 rounded-full mb-4 animate-pulse-slow">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Grow Your Career</h3>
              <p className="text-muted-foreground">
                Discover opportunities and advance your professional journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 animate-slide-up">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border hover-scale transition-all animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="Sarah Wilson" />
                </Avatar>
                <div>
                  <h4 className="font-semibold">Sarah Wilson</h4>
                  <p className="text-sm text-muted-foreground">Software Engineer</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "FILxCONNECT has transformed how I network professionally. I've made valuable connections that led to exciting collaboration opportunities."
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border hover-scale transition-all animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" alt="Alex Johnson" />
                </Avatar>
                <div>
                  <h4 className="font-semibold">Alex Johnson</h4>
                  <p className="text-sm text-muted-foreground">Product Manager</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "The platform's focus on meaningful professional connections sets it apart from other networks. It's become an essential tool for my career growth."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold animate-slide-up">
              Ready to Take Your Career to the Next Level?
            </h2>
            <p className="text-xl max-w-[600px] text-primary-foreground/80 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Join thousands of professionals who are already connecting, sharing, and growing with FILxCONNECT.
            </p>
            <Link href="/signup" className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button size="lg" variant="secondary" className="group hover-scale">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold">FILxCONNECT</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-primary transition-colors">About</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            © 2025 FILxCONNECT. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}