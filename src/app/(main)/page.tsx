"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Location from "@/components/Location";
import Link from "next/link";
import { features } from "@/components/constants/features";
import { useState,useEffect } from "react";
export default function Home() {
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
    {/* Launching Soon Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Launching Soon!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg">We&apos;re excited to announce that Sanzad International will be launching soon!</p>
            <p className="mt-2">Stay tuned for our official launch date.</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>Got It</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 py-2 px-5 mx-10 my-4 z-[-1] rounded-md bg-slate-100 dark:bg-primary dark:text-black">
        <div className="py-4 px-5">
          <h1 className="">Sanzad International</h1>
          <p className="text-3xl md:text-6xl font-bold">
            Transfer Rides In All Countries
          </p>
          <Button className="my-2 bg-blue-500 dark:bg-card-foreground">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
        <div className="flex justify-center">
          <Image
            src="/Transfer-Rides_Sanzad-International.webp"
            alt="Hero Image"
            width={250}
            height={250}
          />
        </div>
      </div>
      <div className="flex justify-center mt-[-80px]">
        <Location />
      </div>
      <div
        id="about"
        className="flex flex-col items-center gap-5 mt-20 px-10"
      >
        <div className="w-full flex flex-col items-center gap-1">
          <h2 className="text-muted-foreground text-xl">About Us</h2>
          <h3 className="text-2xl md:text-4xl font-semibold text-center">We&apos;re Wholesale Destination <br/>Management Tour Operators</h3>
          <p className="md:w-1/2 text-muted-foreground text-center">We provide packages for Groups, FITs, Van Tours, MICE & Leisure Tours to Travel Agents for Europe, UK, USA, South America, Central America & Canada.</p>
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between bg-slate-100 dark:bg-primary dark:text-black md:h-[500px] rounded-md bg-[url(/about-background.svg)] bg-cover relative overflow-hidden">
          <div className="flex flex-col justify-center px-4 md:pl-10 py-10 gap-5 md:w-2/3">
            <h3 className="text-2xl font-semibold">Founders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Card className="">
              <CardHeader>
                <CardTitle>Kaizad Gazdar</CardTitle>
                <CardDescription>Global CEO</CardDescription>
              </CardHeader>
              <CardContent>
                <p>With more than 24 years of experience in operations, customer service, and retention, he possesses a deep understanding of overseeing outbound processes within the European vacation rental sector and creating systems focused on customer needs.</p>
              </CardContent>
            </Card>
            <Card className="">
              <CardHeader>
                <CardTitle>Riya Gazdar</CardTitle>
                <CardDescription>Managing Director</CardDescription>
              </CardHeader>
              <CardContent>
                <p>With more than 22 years of experience in the travel sector, she focuses on worldwide lodging acquisition and oversees travel operations and sales for both leisure and corporate markets, utilizing an extensive network of global suppliers and tourism entities.</p>
              </CardContent>
            </Card>
            </div>
          </div>
          <div className="w-1/3 relative">
            <Image src='/Sanzad International-Logo.svg' alt="Sanzad International Logo" width={200} height={200} className="absolute md:scale-[1.5] md:bottom-[60px] md:right-[50px]"/>
          </div>
        <Image src='/point-to-point-transfer.svg'alt="point-to-point-transfer" width={80} height={80} className="absolute bottom-1 left-1 opacity-50 hidden md:block"/>
        <Image src='/traveling-cap.svg'alt="traveling-cap" width={80} height={80} className="absolute top-1 right-1 md:left-1"/>
        <Image src='/navigation.svg'alt="navigation" width={150} height={150} className="hidden md:block absolute bottom-60 left-5 md:top-1 md:left-[700px] opacity-50"/>
        </div>
        
      </div>
      <div id="features" className="flex flex-col md:flex-row gap-5 mt-10 mb-20 px-10">
      {features.map((feature, id) => (
            <Card key={id}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );
}
