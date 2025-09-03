import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { SocialIcon } from "react-social-icons";
const Footer = () => {
  return (
    <div
      className="text-white py-4 px-10 mx-10 my-4 rounded-sm flex flex-col gap-5"
      style={{ backgroundColor: "#2f2483" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center gap-3">
        <div className="flex flex-col justify-center items-center md:justify-normal md:items-start">
          <h3 className="text-xl font-medium">Location</h3>
          <p className="text-center md:text-left">
            H-53 First Floor Sector-63 Noida, Uttar
            Pradesh
          </p>
        </div>
        <div>
          <h3 className="text-xl font-medium">Quick Links</h3>
          <div className="flex flex-col items-center gap-1">
            <Link className="hover:text-blue-200" href="/">
              Home
            </Link>
            <Link className="hover:text-blue-200" href="#about">
              About
            </Link>
            <Link className="hover:text-blue-200" href="#features">
              Features
            </Link>
            <Link className="hover:text-blue-200" href="/login">
              Login
            </Link>
          </div>
        </div>
        <div className=" flex flex-col gap-3 items-center md:items-start">
          <div>
          <h3 className="text-xl font-medium">Follow Us</h3>
          {/* <div className="flex gap-1">
            <Phone
              className="hover:rounded-full p-1 hover:bg-blue-200 hover:text-indigo-700"
              width={30}
              height={30}
            />
            <Mail
              className=" hover:rounded-full p-1 hover:bg-blue-200 hover:text-indigo-700"
              width={30}
              height={30}
            />
          </div> */}
          </div>
          <div className="flex gap-1">
          <SocialIcon style={{ width: 30, height: 30 }} network="facebook" />
          <SocialIcon style={{ width: 30, height: 30 }} network="instagram" />
          <SocialIcon style={{ width: 30, height: 30 }} network="youtube" />
          <SocialIcon style={{ width: 30, height: 30 }} network="linkedin" />
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center gap-3">
        <div className="flex w-full justify-center md:justify-normal">
          <p>© 2025 Sanzad International</p>
        </div>
        <div className="flex items-center divide-x divide-white">
          <Link className="px-1 text-sm hover:text-blue-200" href="/privacy-policy">
            Privacy-Policy
          </Link>
          <Link className="px-1 text-sm hover:text-blue-200" href="/terms-&-conditions">
            Terms & Conditions
          </Link>
        </div>
        
        <div>
          {/* <p>Powered By <Link className="hover:text-blue-200" href="https://gcaffe.org" target="_blank">G Caffe</Link></p> */}
          <p>Powered By Sanzad Group</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
