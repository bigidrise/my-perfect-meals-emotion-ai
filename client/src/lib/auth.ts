// client/src/lib/auth.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  entitlements?: string[];
  planLookupKey?: string | null;
}

// Simple localStorage-based auth (for demo purposes)
export function signUp(email: string, password: string): User {
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  
  const users = JSON.parse(localStorage.getItem("mpm_users") || "[]");
  
  // Check if user already exists
  if (users.find((u: User) => u.email === email)) {
    throw new Error("User already exists");
  }
  
  const user: User = {
    id: Date.now().toString(),
    email,
    name: email.split("@")[0] // Use email prefix as default name
  };
  
  users.push(user);
  localStorage.setItem("mpm_users", JSON.stringify(users));
  localStorage.setItem("mpm_current_user", JSON.stringify(user));
  localStorage.setItem("userId", user.id); // Set userId for API authentication
  
  return user;
}

export function login(email: string, password: string): User {
  const users = JSON.parse(localStorage.getItem("mpm_users") || "[]");
  const user = users.find((u: User) => u.email === email);
  
  if (!user) {
    throw new Error("User not found");
  }
  
  // For demo purposes, we'll accept any password for existing users
  localStorage.setItem("mpm_current_user", JSON.stringify(user));
  localStorage.setItem("userId", user.id); // Set userId for API authentication
  return user;
}

export function logout(): void {
  localStorage.removeItem("mpm_current_user");
  localStorage.removeItem("userId");
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem("mpm_current_user");
  return userStr ? JSON.parse(userStr) : null;
}