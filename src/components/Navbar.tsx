import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border">
      <Link href="/" className="text-2xl font-bold">
        CodeNest
      </Link>

      <div className="flex items-center gap-10">
        <ul className="flex items-center gap-6">
          <li>
            <a href="#WhyChooseCodeNest">Why Choose CodeNest</a>
          </li>
          <li>
            <a
              href="https://github.com/your-username/codenest"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>

        <ul className="flex items-center gap-4">
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
