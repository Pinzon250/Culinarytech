import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!form.username || !form.fullName || !form.phone || !form.email || !form.password || !form.confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      const response = await fetch('https://culinarytech-backend.onrender.com/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          full_name: form.fullName,
          phone: form.phone,
          email: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Registration successful! Redirecting...' });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error. Try again later.' });
    }
  };

  return (
    <div>

      <h2 className="text-2xl text-[#2D1B0E] font-semibold mb-4 text-center">Sign Up</h2>

      {message && (
        <p className={`text-center text-sm font-semibold ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Username */}
  <div className="flex flex-col">
    <label htmlFor="username" className="text-sm font-semibold text-gray-700 mb-2">Username</label>
    <input
      id="username"
      name="username"
      type="text"
      value={form.username}
      onChange={handleChange}
      className="border rounded-2xl border-gray-300 w-full p-2 bg-white/35 focus:ring-2 focus:ring-[#C19A6B] outline-none"
      required
    />
  </div>

  {/* Full Name */}
  <div className="flex flex-col">
    <label htmlFor="fullName" className="text-sm font-semibold text-gray-700 mb-2">Full Name</label>
    <input
      id="fullName"
      name="fullName"
      type="text"
      value={form.fullName}
      onChange={handleChange}
      className="border rounded-2xl border-gray-300 w-full p-2 bg-white/35 focus:ring-2 focus:ring-[#C19A6B] outline-none"
      required
    />
  </div>

  {/* Phone */}
  <div className="flex flex-col">
    <label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
    <input
      id="phone"
      name="phone"
      type="tel"
      value={form.phone}
      onChange={handleChange}
      className="border rounded-2xl border-gray-300 w-full p-2 bg-white/35 focus:ring-2 focus:ring-[#C19A6B] outline-none"
      required
    />
  </div>

  {/* Email */}
  <div className="flex flex-col">
    <label htmlFor="RegisterEmail" className="text-sm font-semibold text-gray-700 mb-2">Email</label>
    <input
      id="RegisterEmail"
      type="email"
      name="email"
      value={form.email}
      onChange={handleChange}
      className="border rounded-2xl border-gray-300 w-full p-2 bg-white/35 focus:ring-2 focus:ring-[#C19A6B] outline-none"
      required
    />
  </div>

  {/* Password */}
  <div className="flex flex-col">
    <label htmlFor="RegisterPass" className="text-sm font-semibold text-gray-700 mb-2">Password</label>
    <div className="relative">
      <input
        id="RegisterPass"
        type={showPassword ? "text" : "password"}
        name="password"
        value={form.password}
        onChange={handleChange}
        className="border rounded-2xl border-gray-300 w-full p-2 pr-10 bg-white/35 focus:ring-2 focus:ring-[#C19A6B] outline-none"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>

  {/* Confirm Password */}
  <div className="flex flex-col">
    <label htmlFor="ConfirmPass" className="text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name="confirmPassword"
        id="ConfirmPass"
        value={form.confirmPassword}
        onChange={handleChange}
        className="border rounded-2xl border-gray-300 w-full p-2 pr-10 bg-white/35 focus:ring-2 focus:ring-[#C19A6B] outline-none"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>
</div>


        <button
          type="submit"
          className="w-full cursor-pointer bg-[#D4A373] hover:bg-[#C19A6B] text-[#2D1B0E] font-semibold py-2 px-4 rounded-lg transition duration-300">
          Sign Up
        </button>
      </form>

      <aside className="mt-4 text-sm text-gray-600 text-center">
        Already have an account?
        <a href="/login" className="text-[#2D1B0E] cursor-pointer hover:text-[#C19A6B] font-semibold ml-1">Log in</a>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-black/30"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-black/30"></div>
        </div>

        <button className="flex cursor-pointer items-center bg-white justify-center w-full border border-gray-300 p-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
          <FcGoogle size={24} className="mr-2" />
          Sign up with Google
        </button>

        <p className='text-center text-gray-500 pt-4'>
          By signing up, you agree to our <a href="/terms" className="text-[#2D1B0E] hover:text-[#C19A6B] font-semibold">Terms of Service</a> and <a href="/privacy" className="text-[#2D1B0E] hover:text-[#C19A6B] font-semibold">Privacy Policy</a>.
        </p>
      </aside>
    </div>
  );
}
