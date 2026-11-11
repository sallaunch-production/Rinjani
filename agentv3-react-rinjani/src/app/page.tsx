"use client";

import ArsemaLogo from "./logo";

import { useState, useEffect } from "react";
//import Head

//import router
import { useRouter } from "next/navigation";
//import axios
import axios from "axios";

//import js cookie
import Cookies from "js-cookie";
export default Login;
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { jwtVerify } from "jose";

function Login() {
  // get functions to build form with useForm() hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  //define state validation
  const [validation, setValidation] = useState<any>({});
  const MySwal = withReactContent(Swal);
  //function "loginHanlder"

  const loginHandler = async (e: any) => {
    e.preventDefault();
    //initialize formData
    const formData = new FormData();

    //append data to formData
    var params = { email: email, password: password };

    //send data to server
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/signin`, params)
      .then((response) => {
        //set token on cookies
        if (response.data.auth == true) {
          //Cookies.set('auth', response.data.accessToken, { domain: '103.186.0.37', expires: 1/86400, secure: true, sameSite: 'None', path: '/', });
          Cookies.set("auth", response.data.accessToken, {
            secure: true,
            sameSite: "None",
          });
          //redirect to dashboard

          router.push("/auth");
        }
      })
      .catch((error) => {
        const data = error.response?.data;

        if (data?.errors?.name) {
          // specific error from the backend
            MySwal.fire({ icon: "error", title: "Login failed", text: data.errors.name });
          } else if (data) {
            // other backend errors (e.g. { errors: "..." } or { message: "..." })
            setValidation(data);
          } else {
            // no response at all (backend down, network error, CORS, etc.)
            setValidation({ errors: "Unable to connect to the server" });
          }
        });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full p-8 bg-white rounded-md shadow-lg lg:max-w-sm">
        <div className="object-center items-center text-center text-gray-700">
          <ArsemaLogo></ArsemaLogo>
        </div>
        <form className="mt-6" onSubmit={loginHandler}>

          {validation?.errors && (
            <div className="alert alert-danger">
              {/* `errors` can be a string or an object; React can't render objects directly, so convert it to text first */}
              {typeof validation.errors === "string"
                ? validation.errors
                : Object.values(validation.errors).join(", ")}
            </div>
          )}
          
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className="mt-3">
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-400 focus:outline-none focus:bg-red-400">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
