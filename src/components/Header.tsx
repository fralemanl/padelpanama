import Link from "next/link";
import { Menu, ShoppingCart, User, Mail, Phone } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-white shadow">
      {/* Top Panel */}
      <div className="bg-gray-900 text-white py-3 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <Phone size={16} /> +(507) 6674-1441
            </span>
            <span className="flex items-center gap-2">
              <Mail size={16} /> info@padelpanama.org
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-[#003D99]">
              Login
            </Link>
            <Link href="/register" className="hover:text-[#003D99]">
              Register
            </Link>
            <Link href="/cart" className="flex items-center gap-1">
              <ShoppingCart size={16} /> Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-[#003D99]">
            🎾 Tennis Club
          </div>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="hover:text-[#003D99] font-semibold">
            Home
          </Link>
          <Link href="/torneos" className="hover:text-[#003D99]">
            About Us
          </Link>
          <Link href="/ranking" className="hover:text-[#003D99]">
            Events
          </Link>
          <Link href="/nosotros" className="hover:text-[#003D99]">
            Shop
          </Link>
          <Link href="/noticias" className="hover:text-[#003D99]">
            Lessons
          </Link>
          <Link
            href="/contacto"
            className="bg-[#003D99] text-white px-4 py-2 rounded hover:bg-[#002a80]"
          >
            Reserve Court
          </Link>
        </div>

        <button className="md:hidden">
          <Menu size={24} />
        </button>
      </nav>
    </header>
  );
}
