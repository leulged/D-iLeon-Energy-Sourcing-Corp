import Link from "next/link";

interface NavbarProps {
  onRegisterClick?: () => void;
}

export default function Navbar({ onRegisterClick }: NavbarProps) {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-orange-500 tracking-tight">
          OilAccess
        </span>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <Link href="#about" className="hover:text-orange-400 transition">
          About
        </Link>
        <Link href="#how-it-works" className="hover:text-orange-400 transition">
          How it Works
        </Link>
        <Link href="#contact" className="hover:text-orange-400 transition">
          Contact
        </Link>
      </div>
      <div className="flex gap-2">
        <Link href="/login">
          <button className="px-4 py-2 rounded border border-neutral-700 bg-black text-white hover:bg-neutral-900 transition">
            Login
          </button>
        </Link>
        <button
          className="px-4 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
          onClick={onRegisterClick}
        >
          Register
        </button>
      </div>
    </nav>
  );
}
 