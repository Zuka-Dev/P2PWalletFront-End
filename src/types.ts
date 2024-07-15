export interface LoginDTO {
  email: string;
  password: string;
}
export interface BaseResponseDTO {
  status: boolean;  
  statusMessage: string;
  data: object;
}
