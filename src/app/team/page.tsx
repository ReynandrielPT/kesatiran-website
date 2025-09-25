"use client";

import React, { useState } from "react";
import { MemberCard } from "@/components/MemberCard";
import { Button } from "@/components/ui/Button";
import { Filter, Users, Award, Briefcase, Calendar } from "lucide-react";

// Import data
import membersData from "@/data/members.json";
import teamStatsData from "@/data/team-stats.json";

export default function TeamPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Get unique departments for filtering
  const departments = Array.from(
    new Set(membersData.map((member: any) => member.department))
  );

  // Filter and sort members
  const filteredMembers = membersData
    .filter(
      (member: any) =>
        selectedFilter === "all" || member.department === selectedFilter
    )
    .sort((a: any, b: any) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "role") return a.role.localeCompare(b.role);
      if (sortBy === "date")
        return (
          new Date(b.member_since).getTime() -
          new Date(a.member_since).getTime()
        );
      return 0;
    });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h1
              className="text-4xl font-bold tracking-tight sm:text-5xl mb-4"
              style={{ color: "var(--text)" }}
            >
              Our Team
            </h1>
            <p
              className="text-xl leading-8 max-w-3xl mx-auto"
              style={{ color: "var(--muted)" }}
            >
              Meet the talented individuals who make Kesatiran a creative
              powerhouse. Our diverse team brings together expertise in
              development, design, and innovation.
            </p>
          </div>

          {/* Team Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div
              className="text-center p-6 rounded-xl"
              style={{
                backgroundColor: "var(--card)",
                boxShadow: "var(--shadow)",
              }}
            >
              <Users
                size={32}
                className="mx-auto mb-3"
                style={{ color: "var(--accent)" }}
              />
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "var(--text)" }}
              >
                {teamStatsData.total_members}
              </div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Team Members
              </div>
            </div>

            <div
              className="text-center p-6 rounded-xl"
              style={{
                backgroundColor: "var(--card)",
                boxShadow: "var(--shadow)",
              }}
            >
              <Calendar
                size={32}
                className="mx-auto mb-3"
                style={{ color: "var(--accent)" }}
              />
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "var(--text)" }}
              >
                {teamStatsData.combined_experience}+
              </div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Years Experience
              </div>
            </div>

            <div
              className="text-center p-6 rounded-xl"
              style={{
                backgroundColor: "var(--card)",
                boxShadow: "var(--shadow)",
              }}
            >
              <Briefcase
                size={32}
                className="mx-auto mb-3"
                style={{ color: "var(--accent)" }}
              />
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "var(--text)" }}
              >
                {teamStatsData.projects_completed}
              </div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Projects Completed
              </div>
            </div>

            <div
              className="text-center p-6 rounded-xl"
              style={{
                backgroundColor: "var(--card)",
                boxShadow: "var(--shadow)",
              }}
            >
              <Award
                size={32}
                className="mx-auto mb-3"
                style={{ color: "var(--accent)" }}
              />
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "var(--text)" }}
              >
                {teamStatsData.clients_served}
              </div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Happy Clients
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Sort Controls */}
      <section className="px-6 pb-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {/* Filter by Department */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFilter === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
              >
                All
              </Button>
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={selectedFilter === dept ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(dept)}
                >
                  {dept}
                </Button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <Filter size={16} style={{ color: "var(--muted)" }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 text-sm rounded-lg border-0 focus:ring-2"
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--text)",
                  boxShadow: "var(--shadow)",
                }}
              >
                <option value="name">Sort by Name</option>
                <option value="role">Sort by Role</option>
                <option value="date">Sort by Join Date</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((member: any, index: number) => (
              <div
                key={member.id}
                className="fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MemberCard member={member} showSkills />
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg" style={{ color: "var(--muted)" }}>
                No team members found for the selected filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Specializations Section */}
      <section
        className="px-6 pb-16 lg:px-8"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="mx-auto max-w-7xl py-16">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
              style={{ color: "var(--text)" }}
            >
              Our Specializations
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "var(--muted)" }}
            >
              The diverse skills and expertise that make our team exceptional.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {teamStatsData.specializations.map((specialization, index) => (
              <span
                key={index}
                className="px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "white",
                }}
              >
                {specialization}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
            style={{ color: "var(--text)" }}
          >
            Want to Work with Us?
          </h2>
          <p
            className="text-lg leading-8 max-w-2xl mx-auto mb-8"
            style={{ color: "var(--muted)" }}
          >
            We're always excited to collaborate on new projects and explore
            creative solutions. Let's build something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <a href="mailto:hello@kesatiran.com">Contact Us</a>
            </Button>
            <Button variant="outline" size="lg">
              <a href="/works">View Our Works</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
