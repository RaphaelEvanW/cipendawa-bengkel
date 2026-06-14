"use client";

import { useState, useEffect } from "react";
import { Admin } from "../types";
import { isLoggedIn, getAdmin, logout } from "../api/auth";

export function useAuth() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (isLoggedIn()) {
        const adminData = getAdmin();
        setAdmin(adminData);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setAdmin(null);
  };

  return {
    admin,
    loading,
    isLoggedIn: !!admin,
    logout: handleLogout,
  };
}