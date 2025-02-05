// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Correct Next.js router import
// import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
// import { Button } from "./ui/button";
// import Image from "next/image";

// interface User {
//   Company_name: string;
//   Email: string;
//   Office_number: string;
//   Mobile_number: string;
//   Gst_Vat_Tax_number: string;
//   Country: string;
//   City: string;
//   Address: string;
//   Zip_code: string;
//   profileImage?: string; // Optional field for profile image
// }

// // Utility function for authenticated requests
// const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
//   const token = localStorage.getItem("authToken");
//   if (!token) {
//     throw new Error("Authentication token is missing.");
//   }

//   const headers = {
//     ...options.headers,
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };

//   const response = await fetch(url, {
//     ...options,
//     headers,
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
//   }

//   return response.json();
// };

// const Profile = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [error, setError] = useState<string>("");
//   const router = useRouter();

//   // Function to remove token and redirect to login
//   const removeToken = () => {
//     localStorage.removeItem("authToken");
//     router.push("/login");
//   };

//   // Fetch user data on mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         console.warn("No auth token found. Redirecting to login...");
//         removeToken();
//         return;
//       }

//       try {
//         console.log("Fetching user data...");
//         const data = await fetchWithAuth("http://localhost:8000/api/V1/dashboard");
//         console.log("Fetched user data:", data);
//         setUser(data);
//       } catch (err: any) {
//         console.error("Error fetching user data:", err.message);
//         setError(err.message || "An error occurred while fetching user data.");
//         if (err.message.includes("401")) {
//           console.warn("Unauthorized. Removing token and redirecting...");
//           removeToken();
//         }
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Display loading state
//   if (!user && !error) return <div>Loading...</div>;

//   // Display error state
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="flex flex-col gap-5">
//       {/* Profile Card */}
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>My Profile</CardTitle>
//             <Button variant="secondary">Edit</Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center gap-2">
//             <Image
//               src={user?.profileImage || "/male-profile-pic.webp"}
//               width={100}
//               height={100}
//               alt="user"
//               className="rounded-full"
//             />
//             <dl>
//               <div className="flex flex-col">
//                 <h1 className="text-xl font-extrabold leading-[100%]">
//                   {user?.Company_name || "N/A"}
//                 </h1>
//                 <p className="font-medium">{user?.Email || "N/A"}</p>
//               </div>
//             </dl>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Basic Information Card */}
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>Basic Information</CardTitle>
//             <Button variant="secondary">Edit</Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <dl className="grid grid-cols-2 gap-5">
//             <div className="flex flex-col">
//               <dt className="text-muted-foreground">Name</dt>
//               <dd>{user?.Company_name || "N/A"}</dd>
//             </div>
//             <div className="flex flex-col">
//               <dt className="text-muted-foreground">Email</dt>
//               <dd>{user?.Email || "N/A"}</dd>
//             </div>
//             <div className="flex flex-col">
//               <dt className="text-muted-foreground">Office No.</dt>
//               <dd>{user?.Office_number || "N/A"}</dd>
//             </div>
//             <div className="flex flex-col">
//               <dt className="text-muted-foreground">Mobile No.</dt>
//               <dd>{user?.Mobile_number || "N/A"}</dd>
//             </div>
//           </dl>
//         </CardContent>
//       </Card>

//       {/* Contact Information Card */}
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>Contact Information</CardTitle>
//             <Button variant="secondary">Edit</Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <dl className="grid grid-cols-2 gap-5">
//             <div className="flex flex-col">
//               <dt className="text-muted-foreground">Contact Person</dt>
//               <dd>{user?.Company_name || "N/A"}</dd>
//             </div>
//             <div className="flex flex-col">
//               <dt className="text-muted-foreground">Tax ID</dt>
//               <dd>{user?.Gst_Vat_Tax_number || "N/A"}</dd>
//             </div>
//             <div className="flex flex-col">
//               <dt className="text-muted-foreground">Country</dt>
//               <dd>{user?.Country || "N/A"}</dd>
//             </div>
//             <div className="flex flex-col">
//               <dt className="text-muted-foreground">City</dt>
//               <dd>{user?.City || "N/A"}</dd>
//             </div>
//             <div className="flex flex-col">
//               <dt className="text-muted-foreground">Address</dt>
//               <dd>{user?.Address || "N/A"}</dd>
//             </div>
//             <div className="flex flex-col">
//               <dt className="text-muted-foreground">Postal Code</dt>
//               <dd>{user?.Zip_code || "N/A"}</dd>
//             </div>
//           </dl>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Profile;




"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { Input } from "./ui/input";

interface User {
  Company_name: string;
  Email: string;
  Office_number: string;
  Mobile_number: string;
  Gst_Vat_Tax_number: string;
  Country: string;
  City: string;
  Address: string;
  Zip_code: string;
  profileImage?: string;
}

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Authentication token is missing.");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);

  return response.json();
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth("http://localhost:8000/api/V1/dashboard");
        setUser(data);
        setUpdatedUser(data);
      } catch (err: any) {
        setError(err.message);
        if (err.message.includes("401")) removeToken();
      }
    };
    fetchUserData();
  }, []);

  const removeToken = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const handleEdit = () => {
    setEditing(true);
  };

  // const handleSave = async () => {
  //   try {
  //     if (!updatedUser) return;
  //     await fetchWithAuth(`http://localhost:8000/api/V1/view/UpdateProfile/${user?.Email}`, {
  //       method: "PUT",
  //       body: JSON.stringify(updatedUser),
  //     });
  //     setUser(updatedUser);
  //     setEditing(false);
  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  // };

const handleSave = async () => {
    try {
      if (!updatedUser) return;
      const response = await fetch("http://localhost:8000/api/V1/update-profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const data = await response.json();
      setUser(data);
      setEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser((prev) => (prev ? { ...prev, [e.target.name]: e.target.value } : null));
  };

  if (!user) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-5">

 {/* Profile Card */}
       <Card>
       <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Profile</CardTitle>
            {editing ? (
              <Button onClick={handleSave}>Save</Button>
            ) : (
              <Button onClick={handleEdit}>Edit</Button>
            )}
          </div>
        </CardHeader>
         <CardContent>
           <div className="flex items-center gap-2">
            <Image
              src={user?.profileImage || "/male-profile-pic.webp"}
              width={100}
              height={100}
              alt="user"
              className="rounded-full"
            />
            <dl>
              <div className="flex flex-col">
                <h1 className="text-xl font-extrabold leading-[100%]">
                  {user?.Company_name || "N/A"}
                </h1>
                <p className="font-medium">{user?.Email || "N/A"}</p>
              </div>
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
