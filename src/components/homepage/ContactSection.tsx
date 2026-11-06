'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Clock, Mail, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-20 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border border-border rounded-3xl p-8 sm:p-12 shadow-card grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="space-y-6">
            <span className="text-xs uppercase font-mono tracking-widest font-bold text-accent">
              Visit The Kitchen
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground">
              Say Hello at BOWL LAB
            </h2>
            <p className="text-secondary text-sm leading-relaxed">
              Drop by our flagship kitchen for takeaway pickup, or order online for direct doorstep delivery across the city.
            </p>

            <div className="space-y-4 pt-2 text-sm text-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="font-bold">BOWL LAB Flagship</p>
                  <p className="text-secondary text-xs">12th Main, 100ft Road, Indiranagar, Bengaluru, KA 560038</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-bold">Opening Hours</p>
                  <p className="text-secondary text-xs">11:00 AM – 11:00 PM Daily</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-bold">Phone &amp; WhatsApp</p>
                  <p className="text-secondary text-xs font-mono">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-bold">Orders &amp; Feedback</p>
                  <p className="text-secondary text-xs font-mono">hello@bowllab.in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick feedback/inquiry mini-card */}
          <form onSubmit={handleSubmit} className="bg-cream-50 border border-border rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                Have a special dietary question?
              </h3>
              <p className="text-xs text-secondary leading-relaxed mb-4">
                We accommodate keto, paleo, vegan, and specific allergen requests. Leave your email or reach out directly to the chef.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:border-accent"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:border-accent"
                />
                <textarea
                  rows={3}
                  required
                  placeholder="How can we help your bowl experience?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {submitted ? (
              <div className="mt-4 p-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! We will reach out shortly.</span>
              </div>
            ) : (
              <button
                type="submit"
                className="mt-4 w-full py-3 rounded-xl bg-foreground hover:bg-black text-background text-xs font-bold transition-colors"
              >
                Send Message
              </button>
            )}
          </form>

        </div>
      </div>
    </section>
  );
}
