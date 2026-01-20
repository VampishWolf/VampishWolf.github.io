export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-500">QR Code Generator</p>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} VampishWolf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
