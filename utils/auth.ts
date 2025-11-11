export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};


export interface JwtPayload {
  sub: string;
  email: string;
  unique_name: string;
  UserId: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
  iss: string;
  aud: string;
}

export function getUserRole(payload: JwtPayload): string {
  return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
}