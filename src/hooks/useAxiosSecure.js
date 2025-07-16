import { useContext, useEffect } from "react";
import { AuthContext } from "../provider/AuthProvider";
import axiosSecure from "./axiosSecureInstance";

const useAxiosSecure = () => {
  const { firebaseUser } = useContext(AuthContext);

  useEffect(() => {
    console.log("firebaseUser inside useAxiosSecure:", firebaseUser);
    const interceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosSecure.interceptors.request.eject(interceptor);
    };
  }, [firebaseUser]);

  return axiosSecure;
};

export default useAxiosSecure;
