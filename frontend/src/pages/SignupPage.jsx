import { useState } from 'react'
import { useAuthStore } from '../store/Auth.Store'
import AuthImagePattern from '../components/AuthImagePattern.jsx'
import { Mail, MessageSquare, User, EyeOff, Eye, Lock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast';

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const { isSigningUp, signup } = useAuthStore()

  const validateForm = () => {
    if (!formData.firstName) return toast.error("First name is required");
    if (!formData.email) return toast.error("Email is required or invalid");
    if (formData.password.length < 4) return toast.error("Password is required and must be at least 4 characters long");
    return true;
    console.log("Validation successful");
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const sucess = validateForm();
    if (sucess === true) {
      signup(formData);
    }

  }
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className="text-center mb-8 bg-[hsl(225,25%,16%)] w-sm p-6 rounded-xl shadow-md">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-12 rounded-xl bg-[hsl(225,27%,20%)] flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors ]"
            >
              <MessageSquare className="size-8 text-[hsl(239,42%,59%)] hover:cursor-pointer " />
            </div>
            <h1 className="text-2xl font-bold mt-2 text-[hsl(214,9%,69%)]">Create Account</h1>
            <p className="text-base-content/60 text-[hsl(214,9%,69%)]">Get started with your free account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* first name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[hsl(214,9%,69%)]">First Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40 text-[hsl(214,9%,69%)]" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10 border-2 rounded border-[hsl(214,9%,69%)] text-[hsl(214,9%,69%)]`}
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
            </div>

            {/* last name */}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium mt-6 text-[hsl(214,9%,69%)]" >Last Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                  <User className="size-5 text-base-content/40 text-[hsl(214,9%,69%)]" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10 border-2 rounded border-[hsl(214,9%,69%)] text-[hsl(214,9%,69%)]`}
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            {/* email */}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[hsl(214,9%,69%)]">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                  <Mail className="size-5 text-base-content/40 text-[hsl(214,9%,69%)]" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10 border-2 rounded border-[hsl(214,9%,69%)] text-[hsl(214,9%,69%)]`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* password */}

            <div className="form-control">
              
              <label className="label">
                <span className="label-text font-medium text-[#a9afb7]">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[hsl(214,9%,69%)]">
                  <Lock className="size-5 text-base-content/40 text-[hsl(214,9%,69%)]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10 border-2 rounded border-[hsl(214,9%,69%)] text-[hsl(214,9%,69%)]`}
                  placeholder="••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })

                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[hsl(214,9%,69%)]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>


            <button type="submit" className="btn btn-primary font-medium rounded bg-[hsl(239,42%,59%)] text-[hsl(214,9%,69%)]  hover:bg-[hsl(239,42%,69%)] hover:text-black cursor-pointer w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin " />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>

          </form>
          <div className="text-center mt-6">
            <p className="text-base-content/60 text-[hsl(214,9%,69%)]">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary hover:underline text-[hsl(239,42%,59%)] ">
                Sign in
              </Link>
            </p>
          </div>
        </div >
      </div >

      {/* right side */}
      <div className="hidden lg:flex flex-col justify-center items-center gap-10 bg-gray-800">
        <AuthImagePattern
          boxWidth="100px"
          boxHeight="100px"
          gap="10px"
          gridCols={3}
          borderRadius="rounded-lg"
        />
        <h2 className="text-2xl font-bold text-[hsl(214,9%,69%)]">Join our community</h2>
        <p className="text-base-content/60 text-[hsl(214,9%,69%)]">Connect with friends, share moments, and stay in touch with your loved ones.</p>
      </div>
    </div>
  )
}

export default SignupPage