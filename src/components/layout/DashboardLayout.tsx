import React, { useState, ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { X } from 'lucide-react';

export interface DashboardLayoutProps {
  children: ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function DashboardLayout({ children, currentPath, onNavigate }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={onNavigate}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-[#0B0F19] h-full shadow-2xl flex flex-col z-10 border-r border-slate-800">
              <div className="p-4 flex items-center justify-between border-b border-slate-800">
                <span className="font-bold text-white text-sm">Navigation Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  currentPath={currentPath}
                  onNavigate={onNavigate}
                  onCloseMobileMenu={() => setMobileMenuOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090D16]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
