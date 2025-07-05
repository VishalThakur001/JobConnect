import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  MessageSquare,
  CreditCard,
  Star,
  Shield,
  Clock,
  CheckCircle,
  Users,
  ArrowRight,
  Play,
  User,
  Briefcase,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState("customer");

  const customerSteps = [
    {
      step: 1,
      icon: Search,
      title: "Search & Browse",
      description:
        "Browse our extensive catalog of service categories or search for specific services you need.",
      details: [
        "Filter by location, price range, and ratings",
        "View detailed service provider profiles",
        "Check availability and pricing upfront",
        "Read reviews from verified customers",
      ],
    },
    {
      step: 2,
      icon: MessageSquare,
      title: "Connect & Discuss",
      description:
        "Contact service providers to discuss your needs and get personalized quotes.",
      details: [
        "Send messages through our secure platform",
        "Share photos and detailed requirements",
        "Ask questions about the service",
        "Negotiate pricing and timeline",
      ],
    },
    {
      step: 3,
      icon: Calendar,
      title: "Book & Schedule",
      description:
        "Choose your preferred provider and book the service at a time that works for you.",
      details: [
        "Select from available time slots",
        "Provide service location details",
        "Confirm pricing and scope of work",
        "Receive booking confirmation",
      ],
    },
    {
      step: 4,
      icon: CreditCard,
      title: "Secure Payment",
      description:
        "Pay securely through our platform with multiple payment options.",
      details: [
        "Multiple payment methods accepted",
        "Secure encrypted transactions",
        "Payment protection guarantee",
        "Transparent pricing with no hidden fees",
      ],
    },
    {
      step: 5,
      icon: Star,
      title: "Service & Review",
      description:
        "Enjoy the service and share your experience to help other customers.",
      details: [
        "Track service progress in real-time",
        "Rate your experience after completion",
        "Leave detailed reviews for others",
        "Build long-term relationships with providers",
      ],
    },
  ];

  const providerSteps = [
    {
      step: 1,
      icon: User,
      title: "Create Your Profile",
      description:
        "Set up a comprehensive profile showcasing your skills, experience, and services.",
      details: [
        "Upload professional photos and portfolio",
        "List your services and specializations",
        "Set your availability and pricing",
        "Complete identity verification",
      ],
    },
    {
      step: 2,
      icon: Search,
      title: "Find Opportunities",
      description:
        "Browse available jobs in your area and apply for ones that match your skills.",
      details: [
        "Get notified of relevant job postings",
        "Filter jobs by distance and category",
        "View detailed job requirements",
        "Apply with personalized proposals",
      ],
    },
    {
      step: 3,
      icon: MessageSquare,
      title: "Connect with Customers",
      description:
        "Communicate directly with potential customers to understand their needs.",
      details: [
        "Respond to customer inquiries quickly",
        "Provide detailed quotes and timelines",
        "Share examples of your previous work",
        "Build trust through professional communication",
      ],
    },
    {
      step: 4,
      icon: Briefcase,
      title: "Complete the Work",
      description:
        "Deliver high-quality service and maintain professional standards.",
      details: [
        "Arrive on time and prepared",
        "Maintain clear communication throughout",
        "Ensure quality meets customer expectations",
        "Handle any issues professionally",
      ],
    },
    {
      step: 5,
      icon: CreditCard,
      title: "Get Paid",
      description:
        "Receive secure payments through our platform after job completion.",
      details: [
        "Automatic payment processing",
        "Fast and secure fund transfers",
        "Track your earnings and performance",
        "Build your reputation for future jobs",
      ],
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Safety First",
      description: "All service providers are background checked and verified",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Quick booking process with instant confirmations",
    },
    {
      icon: Star,
      title: "Quality Assured",
      description: "Read reviews and ratings from real customers",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Protected transactions with multiple payment options",
    },
  ];

  const faqs = [
    {
      question: "How do I know if a service provider is trustworthy?",
      answer:
        "All service providers on ServiceHub undergo background checks and identity verification. You can also read reviews and ratings from previous customers to make informed decisions.",
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer:
        "We have a satisfaction guarantee policy. If you're not happy with the service, contact our support team within 24 hours, and we'll work to resolve the issue or provide a refund.",
    },
    {
      question: "How are payments processed?",
      answer:
        "Payments are processed securely through our platform. We support credit cards, debit cards, and digital wallets. Payment is typically charged after service completion.",
    },
    {
      question: "Can I cancel a booking?",
      answer:
        "Yes, you can cancel bookings according to our cancellation policy. Free cancellations are usually allowed up to 24 hours before the scheduled service time.",
    },
    {
      question: "How do I become a service provider?",
      answer:
        "Simply sign up as a service provider, complete your profile with your skills and experience, pass our verification process, and start accepting jobs in your area.",
    },
  ];

  const currentSteps = activeTab === "customer" ? customerSteps : providerSteps;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How ServiceHub Works
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Getting the help you need or finding work is simple and
            straightforward. Here's how our platform connects customers with
            trusted service providers.
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-card border border-border rounded-lg p-1">
              <button
                onClick={() => setActiveTab("customer")}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === "customer"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="w-4 h-4 mr-2 inline" />
                For Customers
              </button>
              <button
                onClick={() => setActiveTab("provider")}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === "provider"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Briefcase className="w-4 h-4 mr-2 inline" />
                For Providers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {activeTab === "customer"
                ? "How to Get Services"
                : "How to Provide Services"}
            </h2>
            <p className="text-xl text-muted-foreground">
              {activeTab === "customer"
                ? "Follow these simple steps to book the services you need"
                : "Start earning by offering your skills and expertise"}
            </p>
          </div>

          <div className="space-y-12">
            {currentSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row gap-8 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                        <span className="text-primary-foreground font-bold text-lg">
                          {step.step}
                        </span>
                      </div>
                      <Icon className="w-8 h-8 text-primary mr-4" />
                      <h3 className="text-2xl font-bold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                      <CardContent className="p-8 text-center">
                        <Icon className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-foreground mb-2">
                          Step {step.step}
                        </h4>
                        <p className="text-muted-foreground">{step.title}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose ServiceHub?
            </h2>
            <p className="text-xl text-muted-foreground">
              We provide a safe, efficient, and reliable platform for all your
              service needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Get answers to common questions about using ServiceHub
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
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
            Join thousands of satisfied users who trust ServiceHub for their
            service needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              <Link to="/about">
                <ArrowRight className="w-5 h-5 mr-2" />
                Learn About Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}