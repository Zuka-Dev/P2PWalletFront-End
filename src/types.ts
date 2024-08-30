export interface LoginDTO {
  email: string;
  password: string;
}
export interface BaseResponseDTO {
  status: boolean;
  statusMessage: string;
  data: object;
}

export interface SignUpDTO {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  password: string;
  address: string;
}
export interface CreateForeignWalletDTO {
  currency: string;
}
export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
  imageBase64: string;
  hasPin: boolean;
  accounts: Account[];
  securityQuestion: {
    securityAnswerId: number;
  };
}
export interface Account {
  accountNumber: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  beneficiaryId: string;
  amount: number;
  transactionTime: any;
}

export interface VerifyEmailDto {
  email: string;
  token: string;
}
export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}
export interface ChangePinDTO {
  oldPin: string;
  newPin: string;
}
export interface SecurityAnswer {
  securityQuestionId: number;
  securityA: string;
}
export interface UpdateProfileDTO {
  lastName: string;
  imageBase64: string;
  phone: string;
  address: string;
}
export interface SecurityQuestion {
  id: number;
  securityQuestion: string;
}
export interface CreatePinDTO {
  pin: string;
}
export interface StatementRequestDTO {
  startDate: Date;
  endDate: Date;
  format: string;
}
