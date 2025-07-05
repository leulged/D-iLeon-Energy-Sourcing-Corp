import { FaLock, FaGlobe, FaChartBar } from "react-icons/fa";

export default function WhyChooseSection() {
  return (
    <section className="py-16 px-4 bg-neutral-950 text-white flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Why Choose OilAccess?
      </h2>
      <p className="text-neutral-400 mb-10 text-lg text-center max-w-2xl">
        The most trusted platform for oil trading and distribution
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="bg-neutral-900 rounded-xl p-8 flex flex-col items-center shadow-lg border border-neutral-800 transition duration-200 cursor-pointer hover:border-orange-500 hover:shadow-2xl">
          <FaLock className="text-4xl text-orange-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
          <p className="text-neutral-400 text-center">
            End-to-end encryption and verified payment processing ensure your
            transactions are always secure.
          </p>
        </div>
        <div className="bg-neutral-900 rounded-xl p-8 flex flex-col items-center shadow-lg border border-neutral-800 transition duration-200 cursor-pointer hover:border-orange-500 hover:shadow-2xl">
          <FaGlobe className="text-4xl text-orange-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Global Network</h3>
          <p className="text-neutral-400 text-center">
            Access to suppliers and buyers across 50+ countries with 24/7 market
            availability.
          </p>
        </div>
        <div className="bg-neutral-900 rounded-xl p-8 flex flex-col items-center shadow-lg border border-neutral-800 transition duration-200 cursor-pointer hover:border-orange-500 hover:shadow-2xl">
          <FaChartBar className="text-4xl text-orange-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
          <p className="text-neutral-400 text-center">
            Live market data, price tracking, and comprehensive analytics to
            make informed decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
