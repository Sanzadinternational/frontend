import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
const Profile = () => {
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Profile</CardTitle>
            <Button variant="secondary">Edit</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Image
              src="/female-profile-pic.webp"
              width={100}
              height={100}
              alt="user"
              className="rounded-full"
            />
            <dl>
              <div className="flex flex-col">
                <h1 className="text-xl font-extrabold leading-[100%]">
                  Ashish Kumar
                </h1>
                <p className="font-medium">ashish@gmail.com</p>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Basic Information</CardTitle>
            <Button variant="secondary">Edit</Button>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2">
            <div className="flex flex-col justify-start gap-5">
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Name</dt>
                <dd>Ashish Kumar</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Email</dt>
                <dd>ashish@email.com</dd>
              </div>
            </div>
            <div className="flex flex-col justify-start gap-5">
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Office No.</dt>
                <dd>+919876543210</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Mobile No.</dt>
                <dd>+918765493521</dd>
              </div>
            </div>
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Contact Information</CardTitle>
            <Button variant="secondary">Edit</Button>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-5">
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Contact Person</dt>
                <dd>G Caffe</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Tax ID</dt>
                <dd>DGH767K</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Country</dt>
                <dd>India</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-muted-foreground">City</dt>
                <dd>Patna</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Address</dt>
                <dd>Sector-63, Noida<br/>Uttar Pradesh</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Postal Code</dt>
                <dd>201301</dd>
              </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
