// src/api/userService.ts
import axios, {type AxiosResponse } from "axios";

export interface CreateUserPayload {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    password: string;
}
export interface LoginUserPayload {
    email: string;
    password: string;
}
export interface LoginResponse {
    token: string;
}

const API_URL = "https://localhost:7091/api/User";

export function registerUser(
    userData: CreateUserPayload
): Promise<AxiosResponse<CreateUserPayload>> {
    return axios.post<CreateUserPayload>(API_URL, userData);
}

export function loginUser(
    userData: LoginUserPayload
):Promise<AxiosResponse<LoginResponse>> {
    return axios.post<LoginResponse>(API_URL+"/login", userData);
}
