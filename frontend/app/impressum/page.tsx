export default function Impressum() {
    const email = "sw@stefanwohlgensinger.ch";
    return (
        <div className="flex flex-col gap-8">
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

            <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Copyright</h2>
                <p>The copyright and all other rights to content, images, photos, or other files on this website belong exclusively to the operator of this website or the specifically named rights holders. Prior written consent from the copyright holder is required for the reproduction and/or other use of content from this website.</p>
                <p>Unauthorized reproduction, duplication, and/or other use of content from this website may result in criminal and civil penalties.</p>
            </div>
            
            <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Disclaimer for Website Content</h2>
                <p>We strive to provide current, accurate, and complete information on this website. However, errors cannot be entirely ruled out, and therefore we do not guarantee the completeness, accuracy, or timeliness of any information, including editorial content. Liability claims for damages of a material or immaterial nature caused by the use of the information provided are excluded.</p>
                <p>We reserve the right to change or delete content on this website at any time without prior notice. We are obligated to update the content of this website. Use of or access to this website is at the visitor's own risk. Liability for any kind of damage that may arise from the use of this website is excluded to the extent permitted by law.</p>
            </div>
        </div>
    )
}