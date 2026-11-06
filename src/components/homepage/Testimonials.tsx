import React from 'react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Rohan Mehra',
      role: 'Product Designer',
      text: 'Building my bowl online felt like an interactive art piece! Squeezing the spicy mayo with the animated bottle is pure genius. Arrived hot and sealed fresh.',
      stars: '★★★★★',
    },
    {
      name: 'Dr. Sneha Rao',
      role: 'Clinical Nutritionist',
      text: 'Finally a poke brand where I can track the exact proteins and vegetables going into my bowl. Clean sashimi, crisp greens, zero weird additives.',
      stars: '★★★★★',
    },
    {
      name: 'Aditya K.',
      role: 'Software Engineer',
      text: 'The lid lifting open and sealing closed is so satisfying. The Cash on Delivery checkout was completely seamless. Ordering again today!',
      stars: '★★★★★',
    },
  ];

  return (
    <section className="py-20 bg-cream-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest font-bold text-accent">
            Customer Love
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground">
            What Bowl Lovers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-3xl p-6 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="text-amber-500 text-sm tracking-widest mb-3">{r.stars}</div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                  &ldquo;{r.text}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/80">
                <p className="font-bold text-xs text-foreground">{r.name}</p>
                <p className="text-[11px] text-secondary font-mono">{r.role}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

