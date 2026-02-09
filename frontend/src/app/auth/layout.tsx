import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PEP Authentication",
    description: "PEP Authentication",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
