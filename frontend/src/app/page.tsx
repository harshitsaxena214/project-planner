import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Sidebar></Sidebar>
   </div>
  );
}
