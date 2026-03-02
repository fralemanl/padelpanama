"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HeroSlider() {
  return (
    <div className="relative w-full h-96 md:h-screen bg-gradient-to-r from-[#003D99] to-[#001f5c] overflow-hidden">
      {/* Background Image Placeholder */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'url(data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"%3E%3Crect fill="%23fff" width="1200" height="600"/%3E%3C/svg%3E)',
        }}
      />

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center text-white">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Welcome to APP 2026
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-lg">
            Discover excellence in every serve, slice, and rally
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/court-reservation"
              className="bg-white text-[#003D99] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-flex items-center justify-center gap-2"
            >
              Reserve a Court
              <ChevronRight size={20} />
            </Link>
            <Link
              href="/events"
              className="bg-[#002a80] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#001a4d] transition inline-flex items-center justify-center gap-2"
            >
              View Events
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400" />
    </div>
  );
}
