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
import Location from "@/components/Location";
import Link from "next/link";
import { features } from "@/components/constants/features";
export default function Home() {
  return (
    <>
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
          <h3 className="text-2xl md:text-4xl font-semibold">We provide best<br/>tour in the world</h3>
          <p className="md:w-1/2 text-muted-foreground text-center">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum esse atque ducimus inventore cum rem exercitationem dolore! Culpa possimus quae, in animi sed eligendi consequuntur necessitatibus aliquid est, modi expedita!</p>
        </div>
        <div className="w-full flex items-center justify-center bg-slate-100 md:h-[500px] rounded-md">
          {/* <div className="relative block h-[500px] w-full bg-gray-200"> */}
          <Image src="/Car-Mockup_Sanzad-International.webp" alt="about" width={600} height={600}/>
          {/* </div> */}
          {/* <Card>
            <CardContent className="relative block h-[500px] w-full bg-gray-200">
              <Image src="/Car-Mockup_Sanzad-International.webp" alt="about" fill style={{ objectFit: 'cover' }} />
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <h5 className="text-xl pt-3">User 1</h5>
              <CardDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque molestiae ipsum sequi minima reprehenderit a eum, quas nostrum dolorem magnam impedit.</CardDescription>
            </CardFooter>
          </Card> */}
          {/* <Card>
            <CardContent className="relative block h-[350px] w-full">
              <Image src="/female-profile-pic.webp" alt="about" fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover" />
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <h5 className="text-xl pt-3">User 2</h5>
              <CardDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque molestiae ipsum sequi minima reprehenderit a eum, quas nostrum dolorem magnam impedit.</CardDescription>
            </CardFooter>
          </Card> */}
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
