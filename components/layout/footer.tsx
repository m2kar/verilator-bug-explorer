export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Verilator Bug Explorer. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/verilator/verilator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 hover:text-[#00ADD8] dark:text-gray-300 dark:hover:text-[#00ADD8]"
            >
              Verilator Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
