"use client";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = { identifier: "", password: "" };
    let valid = true;

    if (!form.identifier) {
      newErrors.identifier = "Email or phone is required";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    console.log("Logging in with", form);
    router.push("/optionss");

    // Uncomment if using credentials auth
    // const res = await signIn("credentials", {
    //   redirect: false,
    //   email: form.identifier,
    //   password: form.password,
    // });
    // if (res?.ok) router.push("/optionss");
    // else alert("Login failed");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="bg-white flex items-center justify-center p-10">
        <div className="max-w-md w-full">
          <div className="mb-6 text-center">
            <Image
              className="mx-auto mb-4"
              src="/labsphere-icon.svg"
              alt="Labsphere Logo"
              width={300}
              height={111}
            />
            <h2 className="text-4xl font-semibold text-gray-800 mb-2">Login</h2>
            <p className="text-gray-600 text-xl">Welcome back! Please login.</p>
          </div>

          <form className="space-y-4">
            <div>
              <input
                type="text"
                name="identifier"
                placeholder="Email or Phone"
                value={form.identifier}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              {errors.identifier && (
                <p className="text-xs text-red-500">{errors.identifier}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-teal-600 text-white rounded-md py-2 font-semibold hover:bg-teal-700"
            >
              Login
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
              onClick={() => signIn("google", { callbackUrl: "/optionss" })}
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              <span className="text-sm font-medium">Login with Google</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <a href="/auth/sign_in" className="text-teal-600">
              Sign up
            </a>
          </p>
        </div>
      </div>

      <div
        className="hidden md:flex items-center justify-center p-10"
        style={{
          background:
            "linear-gradient(26.61deg, #05303B 0.93%, #2B7C7E 101.37%)",
        }}
      >
        <Image
          src="/doctor-desk.svg"
          alt="Doctor at desk"
          width={500}
          height={600}
          className="mx-auto"
        />
      </div>
    </div>
  );
}
