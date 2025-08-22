import React, { useState } from "react";

export default function SearchBox({ onSearch }) {
  const [q, setQ] = useState("");
  return (
    <div className="relative w-full md:w-80">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); onSearch(e.target.value); }}
        placeholder="Cerca nella documentazione…"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all font-inter"
      />
    </div>
  );
}
