import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axiosInstance from "../AxiosInstance";

const UserContext = createContext({
  user: null,
  isLoading: false,
  refreshUser: async () => {},
  bumpFollowingCounts: () => {}
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/users/getCurrentUser");
      setUser(res.data);
    } catch (error) {
      console.error("Failed to refresh current user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const bumpFollowingCounts = useCallback((deltaFollowers = 0, deltaFollowing = 0) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        followers: typeof prev.followers === "number" ? prev.followers + deltaFollowers : prev.followers,
        following: typeof prev.following === "number" ? prev.following + deltaFollowing : prev.following
      };
    });
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = useMemo(() => ({ user, isLoading, refreshUser, bumpFollowingCounts }), [user, isLoading, refreshUser, bumpFollowingCounts]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);


