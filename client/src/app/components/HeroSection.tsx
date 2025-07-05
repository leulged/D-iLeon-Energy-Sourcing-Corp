export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-b from-black to-neutral-900 min-h-[60vh]">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
        We Don&apos;t Sell Oil.
        <br />
        We Deliver <span className="text-orange-500">Access</span>.
      </h1>
      <p className="text-lg md:text-2xl text-neutral-300 max-w-2xl mb-8">
        Connect directly with verified oil suppliers and buyers worldwide.
        Streamlined transactions, transparent pricing, secure platform.
      </p>
      <div className="flex gap-4 justify-center mb-12">
        <a
          href="/buyer"
          className="px-8 py-3 rounded bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition shadow-lg"
        >
          Buyer Portal
        </a>
        <a
          href="/seller"
          className="px-8 py-3 rounded border border-orange-500 text-orange-500 font-semibold text-lg bg-black hover:bg-orange-500 hover:text-white transition shadow-lg"
        >
          Seller Portal
        </a>
      </div>
    </section>
  );
}
