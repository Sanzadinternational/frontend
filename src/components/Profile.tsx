
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

interface User {
  userId: string;
  Company_name: string;
  Email: string;
  Office_number: string;
  Mobile_number: string;
  Gst_Vat_Tax_number: string;
  Country: string;
  City: string;
  Address: string;
  Zip_code: string;
  // profileImage?: string;
  Role: string;
}

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Authentication token is missing.");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  return response.json();
};

const Profile = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  // const [image, setImage] = useState<File | null>(null);
  // const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        setUser(data);
        setUpdatedUser(data);
        console.log("userData",data);
      } catch (err: any) {
        setError(err.message);
        if (err.message.includes("401")) removeToken();
      }
    };
    fetchUserData();
  }, []);
console.log("userData",user);
  const removeToken = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!updatedUser) return alert("No data to update!");

      const formData = new FormData();
      Object.keys(updatedUser).forEach((key) => {
        formData.append(key, (updatedUser as any)[key]);
      });

      // if (image) {
      //   formData.append("profileImage", image);
      // }

      const response = await fetch(`${API_BASE_URL}/view/UpdateProfile/${user?.userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to update profile: ${response.status}`);

      const data = await response.json();
      // setUser((prev) => ({ ...prev, ...updatedUser, profileImage: data.profileImage })); 
      setUser((prev) => ({ ...prev, ...updatedUser })); 
      setEditing(false);
      // setPreview(null);
      window.location.reload();
    } catch (err: any) {
      console.error("Error updating profile:", err.message);
      setError(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser((prev) => prev ? { ...prev, [e.target.name]: e.target.value } : null);
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setImage(file);
  //     setPreview(URL.createObjectURL(file));
  //   }
  // };

  if (!user) return <Skeleton className="h-32 w-full" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Profile</CardTitle>
            {editing ? <Button onClick={handleSave}>Save</Button> : <Button onClick={handleEdit}>Edit</Button>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Image
              // src={preview || user?.profileImage || "/male-profile-pic.webp"}
              src={"/male-profile-pic.webp"}
              width={100}
              height={100}
              alt="user"
              className="rounded-full"
            />
            {/* <Image
  src={preview || (user?.profileImage?.startsWith("http") ? user.profileImage : `/uploads/${user?.profileImage}`) || "/male-profile-pic.webp"}
  width={100}
  height={100}
  alt="user"
  className="rounded-full"
/> */}
            {/* {editing && (
              <>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </>
            )} */}
            <dl>
              <h1 className="text-xl font-extrabold">{user?.Company_name || "N/A"}</h1>
              <p>{user?.Email || "N/A"}</p>
            </dl>
          </div>
        </CardContent>
      </Card>
        {/* Basic Information Card */}
        <Card>
         <CardHeader>
           <div className="flex justify-between items-center">
             <CardTitle>Basic Information</CardTitle>
             {editing ? (
              <Button onClick={handleSave}>Save</Button>
            ) : (
              <Button onClick={handleEdit}>Edit</Button>
            )}
           </div>
         </CardHeader>
         <CardContent>
           <dl className="grid grid-cols-2 gap-5">
             <div className="flex flex-col">
               <dt className="text-muted-foreground">Name</dt>
               <dd>{user?.Company_name || "N/A"}</dd>
            </div>
             <div className="flex flex-col">
               <dt className="text-muted-foreground">Email</dt>
               <dd>{user?.Email || "N/A"}</dd>
             </div>
             <div className="flex flex-col">
               <dt className="text-muted-foreground">Office No.</dt>
               {editing ? (
                <Input name="Office_number" value={updatedUser?.Office_number} onChange={handleChange} />
              ) : (
                <dd>{user.Office_number}</dd>
              )}
             </div>
             <div className="flex flex-col">
               <dt className="text-muted-foreground">Mobile No.</dt>
               {editing ? (
                <Input name="Mobile_number" value={updatedUser?.Mobile_number} onChange={handleChange} />
              ) : (
                <dd>{user.Mobile_number}</dd>
              )}
             </div>
           </dl>
         </CardContent>
       </Card>
            {/* Contact Information Card */}
       <Card>
         <CardHeader>
           <div className="flex justify-between items-center">
             <CardTitle>Contact Information</CardTitle>
             {editing ? (
              <Button onClick={handleSave}>Save</Button>
            ) : (
              <Button onClick={handleEdit}>Edit</Button>
            )}
           </div>
         </CardHeader>
         <CardContent>
           <dl className="grid grid-cols-2 gap-5">
             <div className="flex flex-col">
               <dt className="text-muted-foreground">Contact Person</dt>
               {editing ? (
                <Input name="Company_name" value={updatedUser?.Company_name} onChange={handleChange} />
              ) : (
                <dd>{user.Company_name}</dd>
              )}
             </div>
             <div className="flex flex-col">
               <dt className="text-muted-foreground">Tax ID</dt>
               <dd>{user?.Gst_Vat_Tax_number || "N/A"}</dd>
             </div>
             <div className="flex flex-col">
               <dt className="text-muted-foreground">Country</dt>
               <dd>{user?.Country || "N/A"}</dd>
             </div>
             <div className="flex flex-col">
               <dt className="text-muted-foreground">City</dt>
               <dd>{user?.City || "N/A"}</dd>
             </div>
             <div className="flex flex-col">
               <dt className="text-muted-foreground">Address</dt>
               {editing ? (
                <Input name="Address" value={updatedUser?.Address} onChange={handleChange} />
              ) : (
                <dd>{user.Address}</dd>
              )}
             </div>
             <div className="flex flex-col">
               <dt className="text-muted-foreground">Postal Code</dt>
               {editing ? (
                <Input name="Zip_code" value={updatedUser?.Zip_code} onChange={handleChange} />
              ) : (
                <dd>{user.Zip_code}</dd>
              )}
             </div>
           </dl>
         </CardContent>
       </Card>
    </div>
  );
};

export default Profile;
