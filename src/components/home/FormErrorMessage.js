import { AlertCircle } from "lucide-react";

export default function FormErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 mt-4 p-3 rounded-full border border-red-900 bg-red-950/30 text-red-400 text-xs font-mono text-left px-5">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
