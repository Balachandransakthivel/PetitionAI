import { Link } from "react-router-dom";
import { Shield, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-navy-600" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted-foreground mb-6">This page does not exist.</p>
        <Link to="/" className="btn-primary flex items-center gap-2 w-fit mx-auto">
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
