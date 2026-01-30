import Link from 'next/link';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/', label: '仪表板' },
  { href: '/issues', label: 'Bug 列表' },
  { href: '/matrix', label: '版本矩阵' },
];

export function Navigation({ className }: { className?: string }) {
  return (
    <nav className={className}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-gray-700 hover:text-[#00ADD8] dark:text-gray-300 dark:hover:text-[#00ADD8]"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
