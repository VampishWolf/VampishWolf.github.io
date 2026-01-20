export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">QR Code Generator</p>
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} VampishWolf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
