export const isAuthenticated = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
};

export const logout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
}
