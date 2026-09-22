import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Invaders",
  description:
    "A browser recreation of the classic arcade game Space Invaders, themed with Claude-branded aliens.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
