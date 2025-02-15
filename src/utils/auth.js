export const getToken = () => localStorage.getItem("chat_token");
export const removeToken = () => localStorage.removeItem("chat_token");
export const setToken = (token) => {
  localStorage.setItem("chat_token", token);
};
