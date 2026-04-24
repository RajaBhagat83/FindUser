import { useNavigate } from "react-router-dom";
import Button from "../../Components/Button.js";
import Input from "../input/index.js";
import React, { useState } from "react";
import loginImage from "../../assets/login.png";
import { BACKEND_URL } from "../../Components/config.js";

function Form({ isSignin = false, setToken, setUser }) {
  const [data, setData] = useState({
    ...(!isSignin && {
      fullName: "",
    }),
    email: "",
    password: "",
    interest: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/${isSignin ? "login" : "register"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      const resData = await res.json();
      localStorage.setItem("user:token", resData.token);
      localStorage.setItem("user:details", JSON.stringify(resData.user));
      setToken(resData.token);
      setUser(resData.user);
      await navigate("/DashBoard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl flex overflow-hidden">
        {/* Left Side Image Section */}
        <div className="w-1/2 bg-blue-50 flex flex-col items-center justify-center p-8">
          <img src={loginImage} alt="Login Visual" className="w-4/5 h-auto" />
          <h1 className="text-3xl font-bold text-blue-700 mt-6">WELCOME</h1>
        </div>

        {/* Right Side Form Section */}
        <div className="w-1/2 p-10 flex flex-col justify-center bg-[#c6eaf8]">
          <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
            {isSignin ? "User Login" : "Create Account"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignin && (
              <Input
                label="Full Name"
                name="name"
                placeholder="Enter your Full Name"
                type="text"
                value={data.fullName}
                className="w-[84%]"
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
              />
            )}
            <Input
              label="Email Address"
              name="Email"
              placeholder="Enter your Email"
              type="text"
              className="w-[84%]"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            {!isSignin && (
              <Input
                label="Profile"
                name="Interest"
                placeholder="Enter your Interest"
                type="text"
                className="w-[84%]"
                value={data.interest}
                onChange={(e) => setData({ ...data, interest: e.target.value })}
              />
            )}
            <Input
              label="Password"
              name="password"
              placeholder="Enter your Password"
              type="password"
              className="w-[84%]"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />

            <Button
              label="Submit"
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white py-2 rounded-full font-semibold transition"
            />
          </form>

          <div className="text-md text-center mt-4 mr-12 text-gray-600">
            {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="cursor-pointer text-teal-600 font-medium hover:underline"
              onClick={() =>
                navigate(`/users/${isSignin ? "sign_up" : "sign_in"}`)
              }
            >
              {isSignin ? "Signup" : "Signin"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
