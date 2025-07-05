import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Shield,
  Heart,
  Award,
  Target,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "We prioritize the safety and security of our users through rigorous background checks and verification processes.",
    },
    {
      icon: Heart,
      title: "Community First",
      description:
        "Building a supportive community where service providers and customers can connect meaningfully and grow together.",
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description:
        "We maintain high standards of service quality through continuous monitoring, feedback, and improvement processes.",
    },
    {
      icon: Target,
      title: "Innovation",
      description:
        "Constantly evolving our platform with cutting-edge technology to provide the best user experience possible.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      description:
        "10+ years in marketplace technology and business development.",
      image: "👩‍💼",
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      description: "Expert in scalable platforms and security architecture.",
      image: "👨‍💻",
    },
    {
      name: "Lisa Rodriguez",
      role: "Head of Operations",
      description: "Specialist in service quality and customer experience.",
      image: "👩‍💼",
    },
    {
      name: "David Kim",
      role: "Head of Product",
      description: "Product strategist focused on user-centric design.",
      image: "👨‍💼",
    },
  ];

  const milestones = [
    {
      year: "2020",
      event: "ServiceHub founded with a vision to connect communities",
    },
    { year: "2021", event: "Reached 1,000 active service providers" },
    { year: "2022", event: "Expanded to 50+ service categories" },
    { year: "2023", event: "Served over 10,000 satisfied customers" },
    {
      year: "2024",
      event: "Launched mobile app and advanced matching algorithm",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About ServiceHub
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We're on a mission to make finding trusted services simple, safe,
            and accessible for everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                ServiceHub was born from a simple observation: finding reliable
                service providers shouldn't be a stressful experience. We
                believe everyone deserves access to quality services and skilled
                professionals deserve a platform to showcase their expertise.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform bridges the gap between service seekers and
                providers, creating a thriving ecosystem built on trust,
                quality, and mutual respect.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">
                    Verified service providers
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Transparent pricing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">24/7 customer support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">
                    Secure payment processing
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Building Connections
                </h3>
                <p className="text-muted-foreground">
                  Connecting communities through trusted service relationships
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground">
              The passionate people behind ServiceHub
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              Key milestones in our growth story
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">
                      {milestone.year.slice(-2)}
                    </span>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">
                        {milestone.year}
                      </span>
                    </div>
                    <p className="text-foreground mt-1">{milestone.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Whether you're looking for services or want to offer your skills,
            we're here to help you succeed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">
                <Users className="w-5 h-5 mr-2" />
                Get Started Today
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/how-it-works">
                <ArrowRight className="w-5 h-5 mr-2" />
                Learn How It Works
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}