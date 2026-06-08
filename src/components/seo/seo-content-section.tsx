import React from 'react';

export function SeoContentSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section className="mt-20 max-w-4xl mx-auto w-full text-zinc-300">
      <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-yellow-500 hover:prose-a:text-yellow-400">
        <h2 className="text-white mb-6 pb-2 border-b border-zinc-800">{title}</h2>
        <div className="space-y-6 text-sm md:text-base leading-relaxed">
          {children}
        </div>
      </article>
    </section>
  );
}
