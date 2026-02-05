"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ForgotPasswordFormProps } from "@/shared/types";
import { Loading } from "@/shared/components";


export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    title = "パスワードを忘れた方",
    onSubmit,
    onBack,
    isLoading = false,
}) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError("メールアドレスを入力してください");
            return;
        }

        if (!validateEmail(email)) {
            setError("有効なメールアドレスを入力してください");
            return;
        }

        try {
            await onSubmit(email);
            setIsSuccess(true);
        } catch (error) {
            console.error("Forgot password error:", error);
        }
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onBack) {
            onBack();
        }
    };

    const handleRetry = () => {
        setIsSuccess(false);
        setEmail("");
    };

    if (isSuccess) {
        return (
            <div className="relative w-[464px] h-[314px] bg-[#F5F8FA] border-b border-[#E1E1E1] shadow-[5px_5px_15px_rgba(0,0,0,0.15)] rounded-[8px] p-[25px] flex flex-col items-center gap-[25px] max-w-full mx-5">
                {/* Logo Section */}
                <div className="flex flex-col justify-center items-center p-0 gap-[5px] w-[200px]">
                    <div className="w-[140px] h-[51px] flex justify-center items-end">
                        <Image
                            src="/assets/icons/logo-sign-in.svg"
                            alt="PEP Logo"
                            width={140}
                            height={51}
                            priority
                        />
                    </div>
                    <h1 className="w-[300px] h-[27px] font-noto font-bold text-[20px] leading-[27px] text-[#333333] text-center">
                        メールを送信しました
                    </h1>
                </div>

                {/* Content Section */}
                <div className="flex flex-col items-center p-0 gap-[20px] w-full">
                    <div className="flex flex-col items-center gap-[5px]">
                        <p className="font-noto font-normal text-[14px] leading-[19px] text-[#333333] text-center">
                            メールに記載のURLからパスワードを再設定してください
                        </p>
                        <div className="flex flex-col items-center gap-[2px]">
                            <p className="font-noto font-normal text-[12px] leading-[17px] text-[#066A9E] text-center">
                                ※届かない場合は迷惑メールフォルダをご確認ください
                            </p>
                            <p className="font-noto font-normal text-[12px] leading-[17px] text-[#066A9E] text-center">
                                ※メールアドレスを間違えた場合は再度入力し直してください
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRetry}
                        className="flex flex-row items-center justify-center px-[30px] py-[15px] gap-[10px] w-[252px] h-[52px] bg-[#066A9E] rounded-[8px] border-none cursor-pointer transition-colors font-noto font-normal text-base leading-[22px] text-white hover:bg-[#055580]"
                    >
                        メールアドレスを再度入力
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-[450px] bg-[#F5F8FA] border-b border-[#E1E1E1] shadow-[5px_5px_15px_rgba(0,0,0,0.15)] rounded-[8px] p-[25px] flex flex-col items-center gap-[15px] max-w-full mx-5">
            {/* Logo Section */}
            <div className="flex flex-col justify-center items-center p-0 gap-[5px] w-[200px]">
                <div className="w-[140px] h-[51px] flex justify-center items-end">
                    <Image
                        src="/assets/icons/logo-sign-in.svg"
                        alt="PEP Logo"
                        width={140}
                        height={51}
                        priority
                    />
                </div>
                <h1 className="w-[200px] h-[27px] font-noto font-bold text-[20px] leading-[27px] text-[#333333] text-center">
                    {title}
                </h1>
            </div>

            {/* Form Section */}
            <form
                className="flex flex-col items-center p-0 gap-[25px] w-full max-w-[400px]"
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
                            className={`flex flex-row items-center p-[10px] gap-[10px] w-full bg-white rounded-[4px] transition-all ${error ? "border border-red-500" : "border border-transparent focus-within:border-[#066A9E]"
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
                                    if (error) {
                                        setError("");
                                    }
                                }}
                                disabled={isLoading}
                                autoComplete="email"
                            />
                        </div>
                        {error && (
                            <span className="font-noto text-sm leading-[19px] text-red-500 mt-[5px]">
                                {error}
                            </span>
                        )}
                    </div>
                </div>

                {/* Instruction Text and Submit Button */}
                <div className="flex flex-col items-center p-0 gap-[10px] w-[375px]">
                    <p className="w-[375px] h-[19px] font-noto font-normal text-[14px] leading-[19px] text-center text-[#333333]">
                        入力されたメールアドレス宛に再設定用URLを送信します。
                    </p>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="flex flex-row items-center justify-center px-[30px] py-[15px] gap-[10px] w-[156px] h-[52px] bg-[#066A9E] rounded-[8px] border-none cursor-pointer transition-colors font-noto font-normal text-base leading-[22px] text-white hover:bg-[#055580] disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loading type="spinner" size="sm" /> : "メールを送信"}
                    </button>
                </div>

                {/* Back Link */}
                <div className="flex flex-row justify-center items-center w-full">
                    <span
                        className="font-noto font-bold text-base leading-[22px] text-[#066A9E] cursor-pointer"
                        onClick={handleBack}
                    >
                        戻る
                    </span>
                </div>
            </form>
        </div>
    );
};
