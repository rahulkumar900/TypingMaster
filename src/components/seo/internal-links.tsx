import React from 'react';
import Link from 'next/link';
import { Keyboard, Zap, Globe, Target } from 'lucide-react';

export function InternalLinks() {
  const links = [
    {
      title: 'Typing Test',
      href: '/typing-test',
      description: 'Check your standard WPM and accuracy.',
      icon: <Keyboard className="w-5 h-5 text-zinc-400 group-hover:text-yellow-500 transition-colors" />
    },
    {
      title: 'Typing Speed Test',
      href: '/typing-speed-test',
      description: 'Calculate your true gross and net WPM.',
      icon: <Zap className="w-5 h-5 text-zinc-400 group-hover:text-yellow-500 transition-colors" />
    },
    {
      title: 'Online Typing Test',
      href: '/online-typing-test',
      description: 'Take free typing assessments directly in your browser.',
      icon: <Globe className="w-5 h-5 text-zinc-400 group-hover:text-yellow-500 transition-colors" />
    },
    {
      title: 'Typing Practice',
      href: '/typing-practice',
      description: 'Drill weak keys and build typing muscle memory.',
      icon: <Target className="w-5 h-5 text-zinc-400 group-hover:text-yellow-500 transition-colors" />
    }
  ];

  return (
    <section className="mt-16 mb-8 max-w-4xl mx-auto w-full border-t border-zinc-900 pt-12">
      <h3 className="text-lg font-bold text-white mb-6">Explore Related Tools</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link) => (
          <Link 
            key={link.href} 
            href={link.href}
            className="group flex items-start gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all"
          >
            <div className="mt-0.5 bg-zinc-900 p-2 rounded-lg border border-zinc-800 group-hover:border-yellow-500/30 transition-colors">
              {link.icon}
            </div>
            <div>
              <h4 className="text-white font-semibold group-hover:text-yellow-500 transition-colors">{link.title}</h4>
              <p className="text-sm text-zinc-400 mt-1">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
