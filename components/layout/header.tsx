'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bug, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white dark:bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Bug className="h-6 w-6 text-[#00ADD8]" />
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
              Verilator Bug Explorer
            </span>
          </Link>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-[#00ADD8] dark:text-gray-300 dark:hover:text-[#00ADD8]">
            仪表板
          </Link>
          <Link href="/issues" className="text-sm font-medium text-gray-700 hover:text-[#00ADD8] dark:text-gray-300 dark:hover:text-[#00ADD8]">
            Bug 列表
          </Link>
          <Link href="/matrix" className="text-sm font-medium text-gray-700 hover:text-[#00ADD8] dark:text-gray-300 dark:hover:text-[#00ADD8]">
            版本矩阵
          </Link>
        </nav>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          )}
        </Button>
      </div>
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t bg-white dark:bg-black">
          <div className="container mx-auto py-4 space-y-3 px-4">
            <Link
              href="/"
              className="block text-sm font-medium text-gray-700 hover:text-[#00ADD8] dark:text-gray-300 dark:hover:text-[#00ADD8]"
              onClick={() => setMobileMenuOpen(false)}
            >
              仪表板
            </Link>
            <Link
              href="/issues"
              className="block text-sm font-medium text-gray-700 hover:text-[#00ADD8] dark:text-gray-300 dark:hover:text-[#00ADD8]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bug 列表
            </Link>
            <Link
              href="/matrix"
              className="block text-sm font-medium text-gray-700 hover:text-[#00ADD8] dark:text-gray-300 dark:hover:text-[#00ADD8]"
              onClick={() => setMobileMenuOpen(false)}
            >
              版本矩阵
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
