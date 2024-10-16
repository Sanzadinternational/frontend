import Link from "next/link"
import { Phone,Mail } from "lucide-react"
import { SocialIcon } from "react-social-icons"

const Footer = () => {
  return (
    <div className="text-white bg-slate-800 py-2 px-5 mx-10 my-4 rounded-sm flex flex-col gap-5">
        <div className="grid grid-cols-3 justify-items-center">
            <div>
                <h3 className="text-xl font-medium">Address</h3>
                <p>Sanzad International, H-53 First Floor Sector-63, Noida, UP</p>
            </div>
            <div>
                <h3 className="text-xl font-medium">Quick Links</h3>
                <div className="flex flex-col items-center gap-1">
                    <Link href="/">Home</Link>
                    <Link href="/agent">Agent</Link>
                    <Link href="/supplier">Supplier</Link>
                    <Link href="/login">Login</Link>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-medium">Contact</h3>
                <div className="flex gap-1">
                    <Phone className="bg-slate-700 rounded-full p-1 hover:bg-slate-600" width={30} height={30}/>
                    <Mail className="bg-slate-700 rounded-full p-1 hover:bg-slate-600" width={30} height={30}/>
                </div>
            </div>
        </div>
        <div className="flex justify-between items-center">
            <div>
                <p>© 2024 Sanzad International.</p>
            </div>
            <div className="flex gap-1">
                <SocialIcon style={{width:30,height:30}} network="facebook"/>
                <SocialIcon style={{width:30,height:30}} network="instagram"/>
                <SocialIcon style={{width:30,height:30}} network="facebook"/>
                <SocialIcon style={{width:30,height:30}} network="linkedin"/>
            </div>
        </div>
        <div className="flex justify-center divide-x divide-white">
            <Link className="px-1" href="/privacy-policy">Privacy-Policy</Link>
            <Link className="px-1" href="/terms">Terms & Conditions</Link>
        </div>
        
    </div>
  )
}

export default Footer