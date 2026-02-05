"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import { authService } from '@/shared/services'; // TODO: Enable when ready
import type { UserType } from "@/shared/types/auth";

interface RegistrationFormProps {
  userType: UserType;
}

export function RegistrationForm({ userType }: RegistrationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get localized title based on user type
  const title =
    userType === "buyer" ? "バイヤーアカウント作成" : "ベンダーアカウント作成";
  const loginPath = userType === "buyer" ? "/buyer/login" : "/vendor/login";
  const confirmPath =
    userType === "buyer"
      ? "/buyer/register-confirm"
      : "/vendor/register-confirm";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.email) return "メールアドレスを入力してください";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      return "有効なメールアドレスを入力してください";
    if (!formData.password) return "パスワードを入力してください";
    if (formData.password.length < 8)
      return "パスワードは8文字以上である必要があります";
    if (!formData.passwordConfirm)
      return "パスワード（確認）を入力してください";
    if (formData.password !== formData.passwordConfirm)
      return "パスワードが一致しません";
    if (!formData.acceptTerms)
      return "利用規約・プライバシーポリシーに同意してください";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Integrate with Supabase Auth later
      // await authService.signUp(formData, userType);

      // Mock: Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to confirmation page
      router.push(confirmPath);
    } catch (err) {
      const error = err as { message: string };
      setError(error.message || "登録に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-white relative w-full h-screen"
      style={{ fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif" }}
    >
      {/* Registration Card - Centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f5f8fa] flex flex-col gap-[15px] items-center p-[25px] rounded-lg shadow-[5px_5px_15px_0px_rgba(0,0,0,0.15)]">
        {/* Logo and Title Section */}
        <div className="flex flex-col gap-[5px] items-center justify-center">
          {/* PEP Logo */}
          <div className="flex flex-col h-[51px] items-end justify-center overflow-hidden w-[140px]">
            <div className="h-[48px] w-[150px]">
              <Image
                src="/assets/icons/logo-pep-login.svg"
                alt="PEP Logo"
                width={150}
                height={48}
              />
            </div>
          </div>

          {/* Title */}
          <div className="flex items-center">
            <p className="font-bold text-[#333] text-[20px]">{title}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-[20px] items-center">
          {/* Error Alert */}
          {error && (
            <div className="w-[400px] p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
            {/* Form Fields */}
            <div className="flex flex-col gap-[10px] items-start">
              {/* Email Field */}
              <div className="flex flex-col gap-[5px] items-start justify-center">
                <div className="flex items-center w-[200px]">
                  <p className="font-normal text-[#333] text-[16px]">
                    メールアドレス
                  </p>
                </div>
                <div className="bg-white flex items-center p-[10px] rounded w-[400px]">
                  <input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    className="w-full font-normal text-[#333] text-[16px] bg-transparent border-none outline-none placeholder:text-[#b9b9b9]"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-[5px] items-start justify-center">
                <div className="flex items-center w-[200px]">
                  <p className="font-normal text-[#333] text-[16px]">
                    パスワード
                  </p>
                </div>
                <div className="bg-white flex items-center justify-between p-[10px] rounded w-[400px]">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="パスワード"
                    className="flex-1 font-normal text-[#333] text-[16px] bg-transparent border-none outline-none placeholder:text-[#b9b9b9]"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="flex items-center justify-center bg-transparent border-none p-0 cursor-pointer shrink-0 hover:opacity-70"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    <Image
                      src={
                        showPassword
                          ? "/assets/icons/eye-off.svg"
                          : "/assets/icons/eye.svg"
                      }
                      alt="Eye Icon"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>

              {/* Password Confirm Field */}
              <div className="flex flex-col gap-[5px] items-start justify-center">
                <div className="flex items-center w-[200px]">
                  <p className="font-normal text-[#333] text-[16px]">
                    パスワード（確認）
                  </p>
                </div>
                <div className="bg-white flex items-center justify-between p-[10px] rounded w-[400px]">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    name="passwordConfirm"
                    placeholder="パスワード（確認）"
                    className="flex-1 font-normal text-[#333] text-[16px] bg-transparent border-none outline-none placeholder:text-[#b9b9b9]"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="flex items-center justify-center bg-transparent border-none p-0 cursor-pointer shrink-0 hover:opacity-70"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    tabIndex={-1}
                  >
                    <Image
                      src={
                        showPasswordConfirm
                          ? "/assets/icons/eye-off.svg"
                          : "/assets/icons/eye.svg"
                      }
                      alt="Eye Icon"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Checkbox and Submit Button */}
            <div className="flex flex-col gap-[10px] items-center">
              {/* Terms Checkbox */}
              <div className="flex gap-[10px] items-center">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <p className="font-normal text-[16px] text-black">
                  <span className="text-[#066a9e] underline decoration-solid">
                    利用規約・プライバシーポリシー
                  </span>
                  <span style={{ lineHeight: "normal" }}>に同意する</span>
                </p>
              </div>

              {/* Submit Button */}
              <button
                className="!bg-[#066a9e] flex items-center px-[15px] py-[10px] rounded-xl modal-btn-primary"
                disabled={isLoading}
              >
                <p className="font-normal text-[14px] text-white">
                  {isLoading ? "送信中..." : "サインアップ"}
                </p>
              </button>

              {/* Info Text */}
              <p className="font-normal text-[#333] text-[14px] text-center whitespace-nowrap">
                入力されたメールアドレス宛にアカウント設定用URLを送信します
              </p>
            </div>

            {/* Login Link */}
            <div className="border-t flex items-center justify-center pt-[15px] w-full">
              <p className="font-normal text-[#333] text-[16px]">
                <span style={{ lineHeight: "normal" }}>
                  既にアカウントをお持ちの方は
                </span>
                <a href={loginPath} className="font-bold text-[#066a9e]">
                  こちら
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
