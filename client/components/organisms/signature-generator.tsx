"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download } from "lucide-react"
import { toast } from "sonner"

interface SignatureData {
    name: string
    jobTitle: string
    branch: string
    phone: string
    email: string
    certifications?: string
    avatarUrl?: string
    signatureBackgroundUrl?: string
    customImage?: string // Legacy prop fallback
}

export function SignatureGenerator({ data }: { data: SignatureData }) {
    const signatureRef = useRef<HTMLDivElement>(null)
    const [copied, setCopied] = useState(false)

    // Using defaults or user provided images
    // Ensure these assets exist in your public folder or change to remote URLs for production
    const bgImage = data.signatureBackgroundUrl || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop" // High quality mountain from Unsplash
    const famiLogo = "http://localhost:3000/signature-assets/final-logo.png"
    const gptwLogo = "http://localhost:3000/signature-assets/final-gptw.png"
    // Placeholder for XP logo
    const xpLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/XP_Investimentos_logo.svg/2560px-XP_Investimentos_logo.svg.png"

    const handleCopy = async () => {
        if (!signatureRef.current) return
        try {
            const content = signatureRef.current.innerHTML
            const blob = new Blob([content], { type: "text/html" })
            const textBlob = new Blob([signatureRef.current.innerText], { type: "text/plain" })
            const clipboardItem = new ClipboardItem({ "text/html": blob, "text/plain": textBlob })
            await navigator.clipboard.write([clipboardItem])
            setCopied(true)
            toast.success("Assinatura copiada!")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Erro ao copiar.")
        }
    }

    const handleDownload = () => {
        if (!signatureRef.current) return
        const content = signatureRef.current.innerHTML
        const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;">${content}</body></html>`
        const blob = new Blob([fullHtml], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "assinatura_email.html"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Download iniciado!")
    }

    // Process branches to format like SP | RJ | MG ...
    const branches = data.branch
        ? data.branch.split(',').map(b => b.trim().toUpperCase()).join(' | ')
        : "SP | RJ | MG | DF | RS | MT | PR | GO | MIAMI"

    return (
        <div className="flex flex-col gap-6 w-full items-center">

            <div className="bg-white p-8 rounded-xl shadow-sm border overflow-auto w-full flex justify-center bg-gray-50/30">
                {/* 
                    MASTER CONTAINER FOR EMAIL SIGNATURE 
                    Width: 600px standard for email templates.
                    Font: Arial/Helvetica fallback.
                */}
                <div ref={signatureRef} style={{ width: "600px", margin: "0 auto", backgroundColor: "#ffffff" }}>
                    <table width="600" border={0} cellPadding="0" cellSpacing="0" style={{ borderCollapse: "collapse", minWidth: "600px", backgroundColor: "#ffffff", fontFamily: "Arial, Helvetica, sans-serif" }}>
                        <tbody>
                            {/* --- TOP SECTION: NAME/INFO & LOGO --- */}
                            <tr>
                                <td style={{ padding: "20px 20px 15px 20px", verticalAlign: "bottom" }}>
                                    <p style={{ margin: "0", fontSize: "22px", fontWeight: "bold", color: "#1e293b", textTransform: "uppercase", letterSpacing: "-0.5px" }}>
                                        {data.name || "NOME SOBRENOME"}
                                    </p>
                                    <p style={{ margin: "4px 0 0 0", fontSize: "15px", color: "#64748b", fontWeight: "normal" }}>
                                        {data.jobTitle || "Cargo / Função"}
                                    </p>
                                    {data.phone && (
                                        <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#64748b" }}>
                                            {data.phone}
                                        </p>
                                    )}
                                </td>
                                <td style={{ padding: "20px 20px 15px 0", verticalAlign: "bottom", textAlign: "right" }}>
                                    <img
                                        src={famiLogo}
                                        alt="Fami Capital"
                                        width="140"
                                        style={{ display: "block", border: 0, marginLeft: "auto" }}
                                    />
                                </td>
                            </tr>

                            {/* --- SEPARATOR --- */}
                            <tr>
                                <td colSpan={2} style={{ padding: "0 20px" }}>
                                    <table width="100%" border={0} cellPadding="0" cellSpacing="0">
                                        <tbody>
                                            <tr>
                                                <td style={{ borderBottom: "2px solid #e2e8f0", height: "1px", lineHeight: "1px" }}>&nbsp;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                            {/* --- MIDDLE SECTION: BRANCHES + XP LOGO + SITE --- */}
                            <tr>
                                {/* Left: Branches */}
                                <td style={{ padding: "15px 20px 20px 20px", verticalAlign: "top", width: "70%" }}>
                                    <p style={{ margin: "0", fontSize: "12px", color: "#94a3b8", fontWeight: "600", lineHeight: "1.6", fontFamily: "Arial, sans-serif" }}>
                                        {branches}
                                    </p>
                                </td>
                                {/* Right: XP Logo & Website */}
                                <td style={{ padding: "15px 20px 20px 0", verticalAlign: "top", textAlign: "right", width: "30%" }}>
                                    <table width="100%" border={0} cellPadding="0" cellSpacing="0">
                                        <tbody>
                                            <tr>
                                                <td align="right" style={{ paddingBottom: "8px" }}>
                                                    {/* Using a placeholder for XP logo or similar partnership logo */}
                                                    <img
                                                        src={xpLogo}
                                                        alt="XP Investimentos"
                                                        width="70"
                                                        height="35"
                                                        style={{ display: "block", border: 0, objectFit: "contain" }}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="right">
                                                    <a href="https://www.fami.capital" style={{ color: "#1e293b", textDecoration: "none", fontSize: "13px", fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>
                                                        www.fami.capital
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                            {/* --- FOOTER SECTION: BLUE BG + TEXT + GPTW --- */}
                            <tr>
                                <td colSpan={2} style={{ padding: "0" }}>
                                    <table width="100%" border={0} cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                                        <tbody>
                                            <tr>
                                                {/* Background Image Wrapper */}
                                                <td background={data.customImage || bgImage} style={{ backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", width: "100%", height: "100px" }}>
                                                    {/* VML for Outlook Backgrounds would go here in a production generator */}
                                                    <table width="100%" height="100" border={0} cellPadding="0" cellSpacing="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ padding: "0 25px", verticalAlign: "middle", color: "#ffffff", fontSize: "13px", lineHeight: "1.4", fontFamily: "Arial, sans-serif" }}>
                                                                    <span style={{ fontWeight: "bold", display: "block", marginBottom: "3px" }}>GREAT PLACE TO WORK</span>
                                                                    Orgulho em sermos eleitos uma das<br />melhores empresas para trabalhar.
                                                                </td>
                                                                <td style={{ padding: "0 25px", verticalAlign: "middle", textAlign: "right" }}>
                                                                    <img
                                                                        src={gptwLogo}
                                                                        alt="GPTW Certified"
                                                                        width="60"
                                                                        height="60"
                                                                        style={{ display: "inline-block", border: 0, verticalAlign: "middle" }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex w-full gap-4 max-w-md">
                <Button onClick={handleCopy} className="flex-1" variant={copied ? "default" : "secondary"}>
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copiado" : "Copiar"}
                </Button>
                <Button onClick={handleDownload} className="flex-1" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar HTML
                </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center max-w-lg">
                <strong>Dica de Compatibilidade:</strong> Esta assinatura utiliza tabelas HTML padrão para garantir a melhor visualização no Outlook, Gmail e Apple Mail.
                Para o Outlook Desktop, recomenda-se usar o botão "Baixar HTML" e importar o arquivo nas configurações de assinatura.
            </p>
        </div>
    )
}
