'use client';

import { useState } from 'react';

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-accent text-white text-center py-2.5 px-6 text-sm font-medium relative">
      🎉 Limited Time: Use code <strong className="font-bold tracking-wide">FIRST30</strong> at checkout for <strong>30% off</strong> your playbook → <a href="#pricing" className="underline underline-offset-2 hover:text-accent-light">Get it for $27.30</a>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-lg"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
