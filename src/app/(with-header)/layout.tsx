"use client";
import Navbar from "@/components/layout/Navbar";

export default function RootLayoutWithHeader({
    children,
    modal

}: {
    children: React.ReactNode
    modal: React.ReactNode;

}) {
    return (
        <>
            <Navbar />
            <main className="pt-25">
                {children}
                {modal}
            </main>
        </>
    )
}