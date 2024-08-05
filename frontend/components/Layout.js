import Navbar from "@/components/Navbar";
import { createContext } from "react";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import Demo from "@/components/Demo";

export const LoginContext = createContext();

export default function Layout({ children }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      {children}
      <Demo />
    </>
  );
}
