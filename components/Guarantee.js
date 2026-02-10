export default function Guarantee() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-[700px] mx-auto bg-white rounded-3xl border-2 border-accent/20 p-10 md:p-14 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-accent-light to-accent" />
        
        <div className="text-6xl mb-5">🛡️</div>
        
        <h2 className="font-serif text-3xl md:text-4xl mb-4">
          100% Money-Back Guarantee
        </h2>
        
        <p className="text-muted text-lg leading-relaxed mb-6 max-w-[520px] mx-auto">
          If your playbook doesn't give you the confidence and strategy to negotiate better, 
          email us within 7 days and we'll refund every penny. No questions asked.
        </p>
        
        <div className="flex justify-center gap-8 flex-wrap text-sm text-muted">
          <span className="flex items-center gap-2">
            <span className="text-accent text-lg">✓</span> No questions asked
          </span>
          <span className="flex items-center gap-2">
            <span className="text-accent text-lg">✓</span> Full refund within 7 days
          </span>
          <span className="flex items-center gap-2">
            <span className="text-accent text-lg">✓</span> Keep the playbook either way
          </span>
        </div>
      </div>
    </section>
  );
}
