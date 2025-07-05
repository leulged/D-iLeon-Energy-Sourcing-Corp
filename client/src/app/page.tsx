"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WhyChooseSection from "./components/WhyChooseSection";
import AccountTypeModal from "./components/AccountTypeModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleSelectRole = (role: "buyer" | "seller" | "both") => {
    setModalOpen(false);
    // Redirect to register page with role param, or handle as needed
    window.location.href = `/register?role=${role}`;
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar onRegisterClick={handleOpenModal} />
      <HeroSection />
      <WhyChooseSection />
      <div className="flex gap-4 justify-center mt-8">
        <a
          href="/buyer"
          className="px-8 py-3 rounded-lg bg-black text-white font-bold text-lg border-2 border-white hover:bg-neutral-900 hover:text-orange-400 transition shadow-lg"
        >
          Buyer Portal
        </a>
        <a
          href="/seller"
          className="px-8 py-3 rounded-lg bg-yellow-400 text-black font-bold text-lg border-2 border-yellow-400 hover:bg-yellow-500 hover:text-black transition shadow-lg"
        >
          Seller Portal
        </a>
      </div>
      <AccountTypeModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSelect={handleSelectRole}
      />
    </main>
  );
}
