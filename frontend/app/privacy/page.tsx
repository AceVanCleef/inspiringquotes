export default function Privacy() {
    const email = "sw@stefanwohlgensinger.ch";

    return(
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    General Information
                </h2>
                <p>
                    In accordance with the data protection regulations of the Federal Republic of Germany (Federal Data Protection Act, BDSG) and the European Union (General Data Protection Regulation, GDPR), every person has the right to privacy and protection against the misuse of their personal data. We, Daniel Seglias GmbH, and Daniel Seglias as its shareholder and managing director, treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy.
                </p>
                <p>
                    In cooperation with our hosting provider, we strive to protect the databases as effectively as possible against unauthorized access, loss, misuse, or falsification. Please note that data transmission over the Internet (e.g., communication by email) can have security vulnerabilities. Complete protection of data against access by third parties is not possible.
                </p>
                <p>
                    By using our website, you consent to the collection, processing, and use of data in accordance with the following provisions.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Data Protection Officer
                </h2>
                <p>
                    If you have any concerns regarding data protection, and in particular those arising from or in connection with this privacy policy, you can contact the following person in writing:
                </p>
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Stefan Wohlgensinger</p>
                    <p>Hermetschloostr. 25</p>
                    <p>8048 Zürich</p>
                    <a href={`mailto:${email}`}
                    className="text-green-500 hover:text-rose-600 transition-colors cursor-pointer underline-offset-4 hover:underline"
                    >{email}</a>
                    <a 
                    className="text-green-500 hover:text-rose-600 transition-colors cursor-pointer underline-offset-4 hover:underline"
                    href="https://www.instagram.com/stefan_wohlgensinger"
                    target="_blank">@stefan.wohlgensinger</a>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Legal Basis for Processing Personal Data
                </h2>
                <p>
                    The Swiss Federal Act on Data Protection (FADP) and Article 6(1)(a)-(f) of the GDPR form the legal basis for data processing and this privacy policy.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Scope of Personal Data Processing
                </h2>
                <p>
                    We generally only collect and process personal data that we receive from customers and other business partners, as well as from other individuals involved in our business relationships, or that we collect from users when operating our website and other applications. The data described in sections 4.1–4.6 will be collected and processed.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Data Collection When You Visit Our Website
                </h2>
                <p>
                    When you visit our website, the following information may be recorded in a log file on our provider's server:
                </p>
                <ul>
                    <li>IP ​​address</li>
                    <li>Date and time of access</li>
                    <li>Name of the file accessed</li>
                    <li>Access status (OK, partial content, document not found, etc.)</li>
                    <li>Page from which the access originated</li>
                    <li>Web browser used</li>
                    <li>Operating system used</li>
                </ul>
                <p>
                    The collection of this data is technically necessary to ensure the stability, security, and user-friendliness of our website. The collected data is not personally identifiable but is evaluated exclusively for internal statistical purposes to further improve the user-friendliness of our website.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Cookies
                </h2>
                <p>
                    Our website uses cookies. Cookies are text files that contain data from visited websites or domains and are stored by a browser on the user's computer. Cookies enable us, in particular, to track the number of users and the frequency of use of the various pages on our website, as well as to analyze visitor behavior, without directly identifying the user.
                </p>
                <p>
                    If you do not wish to use cookies, you can change the settings in your web browser to block cookies from our website. Cookies that have already been saved can be deleted at any time. If cookies are deactivated for our website, you may not be able to use all of its functions to their full extent.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Contact Form
                </h2>
                <p>
                    If you send us inquiries via the contact form, your information from the inquiry form, including the contact details you provide, will be stored by us for the purpose of processing your inquiry and in case of follow-up questions. We will not share this data without your consent.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    SSL/TLS Encryption
                </h2>
                <p>
                    For security reasons and to protect the transmission of confidential information, our website uses SSL/TLS encryption. You can recognize an encrypted connection by the address bar in your browser, which begins with “https://” and contains a padlock icon.
                </p>
                <p>
                    When SSL/TLS encryption is enabled, the data you transmit to us, including inquiries submitted via the contact form, cannot be intercepted by third parties.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Data for Newsletters
                </h2>
                <p>
                    If you wish to subscribe to the newsletter offered on this website, we require your email address and information that allows us to verify that you are the owner of the provided email address and that you wish to receive the newsletter. No further data is collected. We use this data exclusively for sending the newsletter and will not share it with third parties.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Data for Contractual Services
                </h2>
                <p>
                    In the context of our business relationships, we collect and process data from our contractual and business partners, such as customers, prospective customers, suppliers, and third parties and third-party providers (collectively referred to as "Contractual Partners").
                </p>
                <p>
                    We process this data for the purpose of concluding and fulfilling contracts, safeguarding our rights, and for the administrative tasks and business organization associated with this information. We only disclose Contractual Partner data to third parties (e.g., tax authorities, commercial registers, land registries, and other authorities, as well as third parties such as legal advisors or third-party providers like banks, insurance companies, etc.) to the extent and in accordance with applicable law, insofar as this is necessary for the aforementioned purposes, for compliance with legal obligations, or with the consent of the data subjects.
                </p>
                <p>
                    If we use third-party providers or platforms to provide our services, the terms and conditions and privacy policies of the respective third-party providers or platforms apply to the relationship between you and those providers.
                </p>
            </div>            

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Retention Period for Personal Data
                </h2>
                <p>
                    Subject to longer retention periods due to legal or other obligations, personal data is generally stored only as long as necessary for the respective purpose.
                </p>
            </div>            

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Your Rights as a Data Subject
                </h2>
                <p>
                    With regard to the data we process concerning you, you have the following rights:
                </p>
                <ul>
                    <li>Access to the data collected</li>
                    <li>Correction of inaccurate data</li>
                    <li>Erasure of the data stored by us</li>
                    <li>Restriction of processing</li>
                    <li>Objection to processing</li>
                </ul>
                <p>
                    All requests relating to this section must be submitted in writing to the data controller as specified in Section 1 of this Privacy Policy.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Privacy Policy for Objection to Promotional Emails
                </h2>
                <p>
                    We hereby object to the use of contact details published within the scope of the legal notice requirements for sending unsolicited advertising and informational materials. In the event of unsolicited advertising, such as spam emails, we expressly reserve the right to take legal action.
                </p>
            </div>  

            <div className="flex flex-col gap-4">
                <h2 
                className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Changes
                </h2>
                <p>
                    This Privacy Policy may be amended at any time without prior notice. The current version published on our website applies. If the Privacy Policy is part of an agreement with you, we will inform you of any updates by email or other suitable means.
                </p>
                <p>Stefan Wohlgensinger, February 2026</p>
            </div>  
        </div>
    )
}