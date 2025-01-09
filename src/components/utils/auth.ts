export const getToken = () => localStorage.getItem("authToken");

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isLoggedIn = () => !!getToken();