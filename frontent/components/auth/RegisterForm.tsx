"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Home, Phone } from "lucide-react";
import { Button } from "../ui/button";

import toast from "react-hot-toast";
import { registerUser } from "@/lib/axios";
import { registerSchema } from "@/lib/registerUserSchema";


interface FormValues {
  name: string;
  address: string;
  mobileNumber: string;
  email: string;
  password: string;
}

const initialValues: FormValues = {
  name: "",
  address: "",
  mobileNumber: "",
  email: "",
  password: "",
};

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const response = await registerUser(values);
      toast.success(response.message || "Registration successful");
      console.log("Registration success:", response);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
    setIsLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="border border-black rounded-xl p-8 bg-white shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Create Account
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit} // Must be exactly like this
        >
          {({}) => (
            <Form className="space-y-5 border border-black rounded-lg p-6 bg-white">
              {/* Name */}
              <div className="space-y-1">
                <label htmlFor="name" className="font-medium text-gray-800">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Field
                    name="name"
                    type="text"
                    className="pl-10 border border-black rounded w-full py-2"
                    placeholder="Enter your name"
                  />
                </div>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label htmlFor="address" className="font-medium text-gray-800">
                  Address
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Field
                    name="address"
                    type="text"
                    className="pl-10 border border-black rounded w-full py-2"
                    placeholder="Enter your address"
                  />
                </div>
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label
                  htmlFor="mobileNumber"
                  className="font-medium text-gray-800"
                >
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Field
                    name="mobileNumber"
                    type="tel"
                    className="pl-10 border border-black rounded w-full py-2"
                    placeholder="Enter your mobile number"
                  />
                </div>
                <ErrorMessage
                  name="mobileNumber"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="font-medium text-gray-800">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Field
                    name="email"
                    type="email"
                    className="pl-10 border border-black rounded w-full py-2"
                    placeholder="Enter your email"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="font-medium text-gray-800">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 border border-black rounded w-full py-2"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-black text-white rounded-md py-2 hover:bg-gray-800"
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="relative my-6 text-center">
          <span className="bg-white px-2 text-xs text-gray-400 font-semibold">
            OR
          </span>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border border-black text-black hover:bg-gray-100"
          >
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full border border-black text-black hover:bg-gray-100"
          >
            Continue with Facebook
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-black hover:underline font-bold">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
