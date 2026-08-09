export default function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        <h3 className="text-2xl font-bold">CodeNest</h3>

        <p className="mt-3 max-w-md text-muted-foreground">
          Built for developers. Open source and built in public.
        </p>

        <a
          href="#"
          className="mt-6 text-sm font-medium transition-colors hover:text-primary"
        >
          GitHub
        </a>

        <p className="mt-8 text-sm text-muted-foreground">
          © 2026 CodeNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
