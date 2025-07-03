import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search,
  Star,
  Shield,
  Clock,
  Users,
  Briefcase,
  CheckCircle,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function LandingPage() {
  const { isAuthenticated, role } = useSelector((state) => state.user);

  const features = [
    {
      icon: Search,
      title: "Find Trusted Services",
      description:
        "Browse verified professionals in your area for all your service needs.",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description:
        "All service providers are background checked and insured for your peace of mind.",
    },
    {
      icon: Clock,
      title: "Quick Booking",
      description:
        "Book services instantly with our easy-to-use platform and get confirmed in minutes.",
    },
    {
      icon: Star,
      title: "Quality Guaranteed",
      description:
        "Read reviews and ratings from real customers to make informed decisions.",
    },
  ];

  const services = [
    { name: "Home Cleaning", icon: "🏠", providers: 120 },
    { name: "Plumbing", icon: "🔧", providers: 85 },
    { name: "Electrical Work", icon: "⚡", providers: 95 },
    { name: "Gardening", icon: "🌱", providers: 67 },
    { name: "Moving Services", icon: "📦", providers: 45 },
    { name: "Pet Care", icon: "🐕", providers: 78 },
    { name: "Tutoring", icon: "📚", providers: 134 },
    { name: "Photography", icon: "📸", providers: 56 },
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "500+", label: "Service Providers" },
    { number: "50+", label: "Service Categories" },
    { number: "4.8/5", label: "Average Rating" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content:
        "Found an amazing cleaner through ServiceHub. The booking process was seamless and the service was exceptional!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Business Owner",
      content:
        "As a plumber, ServiceHub has helped me connect with more customers and grow my business significantly.",
      rating: 5,
    },
    {
      name: "Lisa Rodriguez",
      role: "Busy Parent",
      content:
        "ServiceHub is a lifesaver! From tutoring to pet sitting, I can find reliable help for everything I need.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Your Trusted Service
              <span className="text-primary block">Marketplace</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect with verified professionals for all your service needs.
              From home repairs to personal care, find the right person for the
              job.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!isAuthenticated ? (
                <>
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <Link to="/register">
                      <Users className="w-5 h-5 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <Link to="/how-it-works">
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Learn More
                    </Link>
                  </Button>
                </>
              ) : (
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link
                    to={
                      role === "worker"
                        ? "/worker/home"
                        : "/customer/home"
                    }
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Lets Start
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose ServiceHub?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make it easy to find, book, and manage services with complete
              confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover the most requested services on our platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {service.providers} providers
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/register">
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Getting the help you need is simple and straightforward
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-foreground font-bold text-xl">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Search & Browse
              </h3>
              <p className="text-muted-foreground">
                Find the perfect service provider by browsing categories or
                searching for specific services.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-foreground font-bold text-xl">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Book & Schedule
              </h3>
              <p className="text-muted-foreground">
                Select your preferred provider, choose a time that works for
                you, and book the service instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-foreground font-bold text-xl">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Relax & Review
              </h3>
              <p className="text-muted-foreground">
                Enjoy the service and leave a review to help other customers
                make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Real feedback from our satisfied customers and service providers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of satisfied customers and service providers on
            ServiceHub today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/register">
                    <Users className="w-5 h-5 mr-2" />
                    Sign Up Now
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <Link to="/how-it-works">Learn More</Link>
                </Button>
              </>
            ) : (
              <Button size="lg" variant="secondary" asChild>
                <Link
                  to={
                    role === "worker"
                      ? "/worker/home"
                      : "/customer/home"
                  }
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Go to Home
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    SH
                  </span>
                </div>
                <span className="font-bold text-xl text-foreground">
                  ServiceHub
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                Connecting customers with trusted service providers across all
                categories.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                For Customers
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/register"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-it-works"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/safety"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Safety
                  </Link>
                </li>
              </ul>
            </div>

            {/* Provider Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                For Providers
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/register"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Become a Provider
                  </Link>
                </li>
                <li>
                  <Link
                    to="/provider-resources"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Resources
                  </Link>
                </li>
                <li>
                  <Link
                    to="/provider-help"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Provider Help
                  </Link>
                </li>
                <li>
                  <Link
                    to="/success-stories"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/press"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Press
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 ServiceHub. All rights reserved. |
              <Link
                to="/privacy"
                className="hover:text-foreground transition-colors ml-1"
              >
                Privacy Policy
              </Link>{" "}
              |
              <Link
                to="/terms"
                className="hover:text-foreground transition-colors ml-1"
              >
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}