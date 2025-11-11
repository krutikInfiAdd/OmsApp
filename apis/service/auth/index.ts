import http from "@/apis/api";
import { APISURLS } from "@/apis/url";

export const LoginApi = async (email: string, password: string) => {
  const data = { email, password };
  return http.post<{ accessToken: string; refreshToken: any }>(APISURLS.LOGIN, data);
};
