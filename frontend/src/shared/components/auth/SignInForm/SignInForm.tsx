"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SignInFormProps } from "@/shared/types";
import { Loading } from "@/shared/components";


export const SignInForm: React.FC<SignInFormProps> = ({
    title = "バイヤーサインイン",
    onSubmit,
    onForgotPassword,
    isLoading = false,
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>(
        {}
    );

    /**
     * Validate email format
     */
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /**
     * Validate form fields
     */
    const validateForm = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = "メールアドレスを入力してください";
        } else if (!validateEmail(email)) {
            newErrors.email = "有効なメールアドレスを入力してください";
        }

        if (!password) {
            newErrors.password = "パスワードを入力してください";
        } else if (password.length < 6) {
            newErrors.password = "パスワードは6文字以上で入力してください";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(email, password);
        } catch (error) {
            console.error("Sign in error:", error);
        }
    };

    /**
     * Handle forgot password click
     */
    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onForgotPassword) {
            onForgotPassword();
        }
    };

    return (
        <div className="relative w-[450px] bg-[#F5F8FA] border-b border-[#E1E1E1] shadow-[5px_5px_15px_rgba(0,0,0,0.15)] rounded-[8px] p-[25px] flex flex-col items-center gap-[15px] max-w-full mx-5">
            {/* Logo Section */}
            <div className="flex flex-col justify-center items-center p-0 gap-[5px] w-[180px]">
                <div className="w-[140px] h-[51px] flex justify-center items-end ">
                    <Image
                        src="/assets/icons/logo-sign-in.svg"
                        alt="PEP Logo"
                        width={140}
                        height={51}
                        priority
                    />
                </div>
                <h1 className="w-[180px] h-[27px] font-noto font-bold text-[20px] leading-[27px] text-[#333333] text-center">
                    {title}
                </h1>
            </div>

            {/* Form Section */}
            <form
                className="flex flex-col items-center p-0 gap-[20px] w-full max-w-[400px]"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col items-start p-0 gap-[10px] w-full">
                    {/* Email Field */}
                    <div className="flex flex-col justify-center items-start p-0 gap-[5px] w-full">
                        <label
                            htmlFor="email"
                            className="font-noto font-normal text-base leading-[22px] text-[#333333]"
                        >
                            メールアドレス
                        </label>
                        <div
                            className={`flex flex-row items-center p-[10px] gap-[10px] w-full bg-white rounded-[4px] transition-all ${errors.email ? "border border-red-500" : "border border-transparent focus-within:border-[#066A9E]"
                                }`}
                        >
                            <input
                                id="email"
                                type="email"
                                className="flex-1 border-none outline-none font-noto font-normal text-base leading-[22px] text-[#333333] bg-transparent placeholder:text-[#B9B9B9]"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) {
                                        setErrors({ ...errors, email: undefined });
                                    }
                                }}
                                disabled={isLoading}
                                autoComplete="email"
                            />
                        </div>
                        {errors.email && (
                            <span className="font-noto text-sm leading-[19px] text-red-500 mt-[5px]">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col justify-center items-start p-0 gap-[5px] w-full">
                        <label
                            htmlFor="password"
                            className="font-noto font-normal text-base leading-[22px] text-[#333333]"
                        >
                            パスワード
                        </label>
                        <div
                            className={`flex flex-row items-center p-[10px] gap-[10px] w-full bg-white rounded-[4px] transition-all ${errors.password ? "border border-red-500" : "border border-transparent focus-within:border-[#066A9E]"
                                }`}
                        >
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="flex-1 border-none outline-none font-noto font-normal text-base leading-[22px] text-[#333333] bg-transparent placeholder:text-[#B9B9B9]"
                                placeholder="パスワード"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) {
                                        setErrors({ ...errors, password: undefined });
                                    }
                                }}
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="w-6 h-6 cursor-pointer text-[#808080] flex-shrink-0 transition-colors hover:text-[#066A9E] disabled:cursor-not-allowed"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5ZM12 9.5C10.34 9.5 9 10.84 9 12.5C9 14.16 10.34 15.5 12 15.5C13.66 15.5 15 14.16 15 12.5C15 10.84 13.66 9.5 12 9.5Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 23 12C21.27 7.61 17 4.5 12 4.5C10.6 4.5 9.26 4.75 8.03 5.2L10.17 7.34C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="font-noto text-sm leading-[19px] text-red-500 mt-[5px]">
                                {errors.password}
                            </span>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col items-center p-0 gap-[10px] w-[140px]">
                    <button
                        type="submit"
                        className="flex flex-row items-center justify-center px-[30px] py-[15px] gap-[10px] w-[140px] h-[52px] bg-[#066A9E] rounded-[8px] border-none cursor-pointer transition-colors font-noto font-normal text-base leading-[22px] text-white hover:bg-[#055580] disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loading type="spinner" size="sm" /> : "サインイン"}
                    </button>
                </div>

                {/* Footer */}
                <div className="box-border flex flex-row justify-center items-center pt-[15px] gap-[10px] w-full border-t border-[#B9B9B9]">
                    <div className="font-noto font-normal text-base leading-[22px] text-[#333333]">
                        パスワードを忘れた方は<span
                            className="text-[#066A9E] font-bold cursor-pointer"
                            onClick={handleForgotPassword}
                        >こちら</span>
                    </div>
                </div>
            </form>
        </div>
    );
};
