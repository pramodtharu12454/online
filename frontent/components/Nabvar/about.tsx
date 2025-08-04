// components/TeamAndFooterCard.tsx
"use client";

import { Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";

export default function TeamAndFooterCard() {
  const teamMembers = [
    {
      name: "Karan Shrestha",
      role: "UI/UX Designer",
      desc: "Creative UI/UX Designer focused on building intuitive, user-centered interfaces.",
      image: "/karan.png",
    },
    {
      name: "Pramod Tharu",
      role: "Full Stack Developer",
      desc: "Full-stack developer specializing in scalable web apps and system design.",
      image: "/parmod.jpg",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Team Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Meet Our Team</h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          The dedicated team behind Online Bazar – blending creativity,
          commerce, and technology to transform local shopping into a seamless
          digital experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 items-center">
        {teamMembers.map((member, i) => (
          <Card key={i} className="text-center py-6">
            <CardContent>
              <div className="flex justify-center mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              </div>
              <Typography variant="h6">{member.name}</Typography>
              <Typography variant="subtitle2" color="primary">
                {member.role}
              </Typography>
              <Typography variant="body2" className="mt-2 text-gray-500">
                {member.desc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Section */}
      <Card>
        <CardContent className="w-full bg-gray-200 flex flex-col md:flex-row justify-between ">
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">Online Bazar</span>
            </div>
            <Typography variant="body2" className="text-gray-500">
              Online Bazar is your all-in-one destination for smart shopping.
              Discover top deals, shop quality products, and enjoy seamless
              delivery — all in one place.
            </Typography>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <Typography variant="subtitle1" className="font-semibold mb-2">
                Quick Links
              </Typography>
              <ul className="space-y-1 text-sm text-blue-600">
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Career</a>
                </li>
              </ul>
            </div>

            <div>
              <Typography variant="subtitle1" className="font-semibold mb-2">
                Our Location
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Kathmandu, Nepal
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
