import React, { useState, useEffect } from "react";
import Favicon from "../assets/images/favicon.ico";
import { Mail, Lock, Eye, EyeOff, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/service";
import { toast } from "react-hot-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState([]);
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const navigateSinghup = () => {
    navigate("/register");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await login(signInData);
      if (response.success) {
        toast.success(`User signed in: ${response.data}`);
        setSignInData({ email: "", password: "" });
        navigate("/dashboard");
      } else {
        toast.error(`Sign In Failed: ${response.message || "Unknown error"}`);
      }
    } catch (error) {
      toast.error(`Sign In Error: ${error.message || error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      <div className="flex h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
        {/* Sidebar */}
        <div className="w-24 bg-white border-r flex flex-col">
          <div className="p-4 flex justify-center">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-blue-600">
              <img
                src={Favicon}
                alt="User Icon"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Sign In Tab Only */}
          <div className="flex-1 flex flex-col">
            <button className="py-8 flex flex-col items-center relative text-blue-600">
              <div className="absolute left-0 h-full w-1 bg-blue-600"></div>
              <CheckSquare className="mb-2" size={24} />
              <span onClick={navigateSinghup} className="text-sm">
                Sign In
              </span>
            </button>
          </div>
        </div>

        {/* Illustration Section */}
        <div className="bg-blue-600 p-8 flex flex-col relative overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 40 + 10}px`,
                height: `${Math.random() * 40 + 10}px`,
                opacity: Math.random() * 0.2 + 0.1,
                animation: `float ${
                  Math.random() * 10 + 8
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                bottom: "-10%",
              }}
            />
          ))}

          <div className="mb-6 z-10">
            <h1 className="text-3xl font-bold text-white">Welcome Back.</h1>
            <p className="text-blue-100 mt-2">
              Sign in to continue your journey.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center z-10">
            <div className="w-64 h-64 relative">
              <div className="absolute w-48 h-32 bg-white rounded-lg transform rotate-12 left-8 top-16"></div>
              <div className="absolute w-16 h-16 bg-blue-800 rounded-full left-16 top-8"></div>
              <div className="absolute w-24 h-6 bg-blue-300 rounded-full left-24 top-32"></div>
              <div className="absolute w-12 h-12 bg-blue-400 rounded-full left-40 top-40"></div>
              <div className="absolute w-12 h-12 bg-red-400 rounded-full left-12 top-20"></div>
            </div>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="w-96 p-8">
          <h2 className="text-2xl font-semibold mb-2">Sign In</h2>
          <p className="text-sm text-gray-500 mb-6">
            Please enter your credentials to continue.
          </p>

          <form onSubmit={handleSignIn}>
            <div className="mb-6">
              <label className="block text-gray-600 mb-2">Email</label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={signInData.email}
                  onChange={handleSignInChange}
                  className="w-full p-3 border rounded-lg pl-10"
                  placeholder="youremail@gmail.com"
                />
                <Mail
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={signInData.password}
                  onChange={handleSignInChange}
                  className="w-full p-3 border rounded-lg pl-10 pr-10" // Adjust padding for icon
                  placeholder="••••••••"
                />
                <Lock
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3.5 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-14 py-3 bg-indigo-600 text-white font-medium rounded-lg uppercase tracking-wide"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
