import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { refreshAccessToken, getAccessToken } from "@/utils/auth";
import Loading from "@/components/Loading";

const AuthWrapper = ({ children }) => {
  const { state, dispatch } = useAuth();
  const { isAuthenticated, isLoading } = state;
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  //   useEffect(() => {
  //     const checkAuthentication = async () => {
  //       console.log("AuthWrapper - Checking authentication status...");

  //       const token = getAccessToken();

  //       if (!token) {
  //         console.log("AuthWrapper - No access token found, attempting to refresh...");
  //         try {
  //           const newAccessToken = await refreshAccessToken();

  //           if (newAccessToken) {
  //             console.log("AuthWrapper - Access token refreshed successfully.");
  //             // You can dispatch a LOGIN action if needed to update the state
  //             setIsCheckingAuth(false);
  //           } else {
  //             console.log("AuthWrapper - Failed to refresh access token, redirecting to login.");
  //             router.push("/login");
  //           }
  //         } catch (error) {
  //           console.error("AuthWrapper - Error refreshing access token:", error);
  //           router.push("/login");
  //         }
  //       } else {
  //         console.log("AuthWrapper - Token found.");
  //         setIsCheckingAuth(false);
  //       }
  //     };

  //     if (!isLoading) {
  //       checkAuthentication();
  //     }
  //   }, [isLoading, isAuthenticated, router, dispatch]);

  //   if (isLoading || isCheckingAuth) {
  //     console.log("AuthWrapper - Loading...");
  //     return <Loading />;
  //   }

  //   console.log("AuthWrapper - User authenticated, rendering children.");
  return <>{children}</>;
};

export default AuthWrapper;
