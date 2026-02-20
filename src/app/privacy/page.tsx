"use client"
import { Navbar } from "@/components/DashboardNavbar"
const PrivacyPolicy = () => {
    return (

        <div>

            <Navbar showLogo={true} />

            <div className="max-w-2xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

                <p className="text-sm text-black/70">Your privacy is critically important to us.</p>

                <p className="text-sm text-black/70">
                    It is primeclip's policy to respect your privacy regarding any information we may collect while operating our website.
                    This Privacy Policy applies to <a href="https://primeclip.pro" className="text-blue-500">https://primeclip.pro</a>  (hereinafter, "us", "we", or "https://primeclip.pro").
                    We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website.
                    We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties.
                    This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other sources.
                    This Privacy Policy, together with the Terms and conditions posted on our Website, set forth the general rules and policies governing your use of our Website.
                    Depending on your activities when visiting our Website, you may be required to agree to additional terms and conditions.
                </p>

                <h2 className="text-2xl font-bold mt-4 mb-2">Website Visitors</h2>

                <p className="text-sm text-black/70" >
                    Like most website operators, primeclip collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request.
                    primeclip's purpose in collecting non-personally identifying information is to better understand how primeclip's visitors use its website.
                    From time to time, primeclip may release non-personally-identifying information in the aggregate, e.g., by publishing a report on trends in the usage of its website.
                    primeclip also collects potentially personally-identifying information like Internet Protocol (IP) addresses for logged-in users and for users leaving comments on <a href="https://primeclip.pro" className="text-blue-500">https://primeclip.pro</a> blog posts.
                    primeclip only discloses logged-in user and commenter IP addresses under the same circumstances that it uses and discloses personally-identifying information as described below.
                </p>

                <h2 className="text-2xl font-bold mt-4 mb-2">Gathering of Personally-Identifying Information</h2>

                <p className="text-sm text-black/70">
                    Certain visitors to primeclip's websites choose to interact with primeclip in ways that require primeclip to gather personally-identifying information.
                    The amount and type of information that primeclip gathers depends on the nature of the interaction.
                    For example, we ask visitors who sign up for a blog at <a href="https://primeclip.pro" className="text-blue-500">https://primeclip.pro</a> to provide a username and email address.
                </p>

                <h2 className="text-2xl font-bold mt-4 mb-2">Security</h2>

                <p className="text-sm text-black/70">
                    The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.
                    While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
                </p>

                <h2 className="text-2xl font-bold mt-4 mb-2">Protection of Certain Personally-Identifying Information</h2>

                <p className="text-sm text-black/70">primeclip discloses potentially personally-identifying and personally-identifying information only to those of its employees, contractors and affiliated organizations that (i) need to know that information in order to process it on primeclip's behalf or to provide services available at primeclip's website, and (ii) that have agreed not to disclose it to others. Some of those employees, contractors and affiliated organizations may be located outside of your home country; by using primeclip's website, you consent to the transfer of such information to them. primeclip will not rent or sell potentially personally-identifying and personally-identifying information to anyone. Other than to its employees, contractors and affiliated organizations, as described above, primeclip discloses potentially personally-identifying and personally-identifying information only in response to a subpoena, court order or other governmental request, or when primeclip believes in good faith that disclosure is reasonably necessary to protect the property or rights of primeclip, third parties or the public at large. If you are a registered user of https://primeclip.pro and have supplied your email address, primeclip may occasionally send you an email to tell you about new features, solicit your feedback, or just keep you up to date with what's going on with primeclip and our products. We primarily use our blog to communicate this type of information, so we expect to keep this type of email to a minimum. If you send us a request (for example via a support email or via one of our feedback mechanisms), we reserve the right to publish it in order to help us clarify or respond to your request or to help us support other users. primeclip takes all measures reasonably necessary to protect against the unauthorized access, use, alteration or destruction of potentially personally-identifying and personally-identifying information.</p>
                <h2 className="text-2xl font-bold mt-8 mb-2">Aggregated Statistics</h2>
                <p className="text-sm text-black/70">
                    primeclip may collect statistics about the behavior of visitors to its website. primeclip may display this information publicly or provide it to others. However, primeclip does not disclose your personally-identifying information.
                </p>

                {/* Affiliate Disclosure */}
                <h2 className="text-2xl font-bold mt-8 mb-2">Affiliate Disclosure</h2>
                <p className="text-sm text-black/70">
                    This site uses affiliate links and does earn a commission from certain links. This does not affect your purchases or the price you may pay.
                </p>

                {/* Cookies */}
                <h2 className="text-2xl font-bold mt-8 mb-2">Cookies</h2>
                <p className="text-sm text-black/70">
                    To enrich and perfect your online experience, primeclip uses "Cookies", similar technologies, and services provided by others to display personalized content, appropriate advertising, and store your preferences on your computer.
                    A cookie is a string of information that a website stores on a visitor's computer, and that the visitor's browser provides to the website each time the visitor returns. primeclip uses cookies to help primeclip identify and track visitors, their usage of https://primeclip.pro, and their website access preferences.
                    primeclip visitors who do not wish to have cookies placed on their computers should set their browsers to refuse cookies before using primeclip's websites, with the drawback that certain features of primeclip's websites may not function properly without the aid of cookies. By continuing to navigate our website without changing your cookie settings, you hereby acknowledge and agree to primeclip's use of cookies.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-2">Privacy Policy Changes</h2>
                <p className="text-sm text-black/70">Although most changes are likely to be minor, primeclip may change its Privacy Policy from time to time, and in primeclip's sole discretion. primeclip encourages visitors to frequently check this page for any changes to its Privacy Policy. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;