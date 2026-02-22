"use client"

import { ReactNode } from "react"
import GenericDialog from "../molecule/Dialog"

interface QuoteDownloadDialogProps {
    trigger: ReactNode;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
} 

export default function QuoteDownloadDialog({trigger, children, className="", description = "Inspire your friends! Send them a ray of light and hope! Share this quote on Whatsapp and Social Media - or send it directly!", footer}: QuoteDownloadDialogProps) {

    return(
        <GenericDialog
        className={className}
        trigger={trigger} 
        title={"Download This Quote - Share it with friends!"}
        description={description}
        footer={footer}
        >
            {children}
        </GenericDialog>
    )
}