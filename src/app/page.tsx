import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BarChart3, Target, Shield } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <header className="px-6 lg:px-10 h-16 flex items-center shadow-lg bg-white sticky top-0 z-50">
        <Link className="flex items-center gap-2" href="/">
          <Sparkles className="h-6 w-6 text-pink-500" />
          <span className="text-2xl font-extrabold text-gray-800 tracking-wide">Narravibe</span>
        </Link>
        <nav className="ml-auto flex gap-6">
          {["Features", "Pricing", "Sign In"].map((link) => (
            <Link
              key={link}
              className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors"
              href={`#${link.toLowerCase()}`}
            >
              {link}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-tr from-white via-blue-100 to-pink-100 text-gray-800">
          <div className="container mx-auto px-6 text-center">
            <Badge className="rounded-full px-4 py-2 bg-pink-500 text-white font-semibold text-sm tracking-wider">
              ✨ Your All-in-One Creator Platform
            </Badge>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-gray-800">
              Transform Your Content Creation
            </h1>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg">
              Schedule posts, analyze performance, and grow your audience with powerful AI-driven tools.
            </p>
            <div className="mt-8 flex justify-center gap-6">
              <Link href="/dashboard">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg text-lg shadow-md transition-transform transform hover:scale-105">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-pink-500 text-pink-500 hover:bg-pink-50 px-8 py-3 rounded-lg text-lg shadow-md transition-transform transform hover:scale-105"
              >
                View Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white text-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-gray-800">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to create, manage, and grow your content.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: BarChart3,
                  title: "Smart Analytics",
                  description:
                    "Track your growth and engagement with detailed insights across platforms.",
                },
                {
                  icon: Target,
                  title: "AI-Powered Tools",
                  description:
                    "Generate captions, hashtags, and content ideas with advanced AI.",
                },
                {
                  icon: Shield,
                  title: "Brand Collaborations",
                  description:
                    "Manage partnerships and track campaign performance effortlessly.",
                },
              ].map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gradient-to-bl from-purple-50 to-blue-100 text-gray-800">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
              Choose the plan that best fits your needs.
            </p>
            {/* Add Pricing Cards */}
          </div>
        </section>
      </main>

      <footer className="py-6 bg-white border-t">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <p>© 2024 Creator Connect. All rights reserved.</p>
          <nav className="flex gap-4 mt-4 sm:mt-0">
            <Link href="#">Terms of Service</Link>
            <Link href="#">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-pink-100 text-pink-500">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mt-4 font-bold text-lg">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}
