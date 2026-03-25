import { ref } from "vue";
import { clearTokens, hasToken } from "../api";

const isAuthenticated = ref(hasToken());

const setAuthenticated = (value) => {
  isAuthenticated.value = Boolean(value);
};

const loginSuccess = () => {
  setAuthenticated(true);
};

const logout = () => {
  clearTokens();
  setAuthenticated(false);
};

const syncFromToken = () => {
  setAuthenticated(hasToken());
};

export const useAuthStore = () => ({
  isAuthenticated,
  setAuthenticated,
  loginSuccess,
  logout,
  syncFromToken,
});
