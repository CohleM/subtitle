"use client"
import { Navbar } from "@/components/DashboardNavbar"
const page = () => {
    return (
        <div>
            <Navbar showLogo={true} />
            <div className="max-w-2xl mx-auto p-4">

                <h1 className="text-3xl font-bold mb-4 text-slate-700">Have some query or feedback?</h1>
                <p></p>
                If you think there's an unsual behavior in our application, please send us an email at<a href="mailto:contact.primeclip@gmail.com" className='text-indigo-600'> contact.primeclip@gmail.com</a>
            </div>
        </div>
    )
}

export default page