"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CarouselSection from "@/components/carousel-section";

export default function SignupPage() {
  const [accountType, setAccountType] = useState<string>("");
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};

    if (!/^[A-Za-z]+$/.test(form.firstName)) {
      newErrors.firstName = "Only letters allowed";
    }

    if (!/^[A-Za-z]+$/.test(form.lastName)) {
      newErrors.lastName = "Only letters allowed";
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit number";
    }

    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log("Form is valid:", form);
      if (accountType === "doctor") {
        router.push("/doctor-registration");
      } else if (accountType === "lab") {
        router.push("/lab-registration");
      } else {
        router.push("/dashboard");
      }
    }
  };

  useEffect(() => {
    const type = localStorage.getItem("accountType");
    if (type) {
      setAccountType(type);
    }
  }, []);

  return (
    <>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
          body {
            font-family: "Inter", sans-serif;
          }
        `}</style>
        {/* Left side - Signup form */}
        <div className="bg-white flex items-center justify-center p-10 ">
          <div className="max-w-md w-full flex flex-col justify-center">
            <div className="mb-6 text-center">
              <Image
                className="mx-auto mb-4"
                src="/labsphere-icon.svg"
                alt="Labsphere Logo"
                width={307}
                height={111}
              />
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                Create an account
              </h2>
              <p className="text-gray-600 mt-2">
                Start your 30 days free trial
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your e-mail"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              <div>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Enter your mobile number"
                  value={form.mobile}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
                {errors.mobile && (
                  <p className="text-xs text-red-500">{errors.mobile}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-teal-600 text-white rounded-md py-2 font-semibold cursor-pointer"
              >
                Next
              </button>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="mx-2 text-gray-400 text-sm">OR</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                className="flex items-center gap-2 px-5 py-2 border border-black rounded-full shadow-sm hover:bg-gray-100 transition duration-200"
                onClick={() => {
                  const accountType = localStorage.getItem("accountType");
                  let callbackUrl = "/dashboard";

                  if (accountType === "doctor") {
                    callbackUrl = "/doctor-registration";
                  } else if (accountType === "lab") {
                    callbackUrl = "/lab-registration";
                  }

                  signIn("google", { callbackUrl });
                }}
              >
                <Image src="/google.svg" alt="Google" width={20} height={20} />{" "}
                <span className="text-sm font-medium">Sign in with Google</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <a href="/auth/login" className="text-teal-600">
                Log in
              </a>
            </p>
          </div>
        </div>

        {/* Right side - Illustration and carousel */}
            <CarouselSection prop={"/doctor-desk.webp"}/>
      </div>
    </>
  );
}
