"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import ArsemaLogo from "../logo";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
//import Head
import Head from "next/head";

//import router

import { useRouter } from "next/navigation";
//import axios
import axios from "axios";

//import js cookie
import Cookies from "js-cookie";
export default Auth;
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { jwtVerify } from "jose";
import { jwtDecode } from "jwt-decode";

function Auth() {
  const [dataq, setData] = useState(false);
  const [dataqr, setQR] = useState("");
  // get functions to build form with useForm() hook
  const [email, setEmail] = useState("");
  const [codes, setCode] = useState("");
  const router = useRouter();
  //define state validation
  const [validation, setValidation] = useState("");
  const MySwal = withReactContent(Swal);

  function imageQR() {
    if (dataq == true) {
      return <embed src={dataqr}></embed>;
    }
  }
  //function "loginHanlder"
  useEffect(() => {
    const token = Cookies.get("auth");
    const plaintext = jwtDecode(token as string) as any;
    var parameter = { email: plaintext.email };
    const data_country = axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/setup2fa`, parameter, {
        headers: {
          Authorization: "Bearer " + token, //the token is a variable which holds the token
        },
      })

      .then((response) => {
        if (response.data.status == "success") {
          setData(true);
          setQR(response.data.imageUrl);
        } else {
          setData(false);
        }
      })
      .catch((error) => {});
  }, []);
  const loginHandler = async (e: any) => {
    e.preventDefault();
    //initialize formData
    const formData = new FormData();
    const token = Cookies.get("auth");
    const plaintext = jwtDecode(token as string) as any;
    //append data to formData
    var params = { email: plaintext.email, token: codes, name: plaintext.name };

    //send data to server
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/verify2fa`, params, {
        headers: {
          Authorization: "Bearer " + token, //the token is a variable which holds the token
        },
      })
      .then(async (response) => {
        //set token on cookies
        if (response.data.message == "success") {
          Cookies.set("token", response.data.accessToken, { secure: true });
          //redirect to dashboard
          Swal.fire("Welcome!");
          router.push("/dashboard");
        } else {
          Swal.fire("Login failed!. " + response.data.message);
        }
      })
      .catch((error) => {
        Swal.fire("Login failed!. " + error);

        //assign error to state "validation"
      });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full p-8 bg-white rounded-md shadow-lg lg:max-w-sm">
        <div className="object-center items-center text-center text-gray-700">
          <ArsemaLogo></ArsemaLogo>
        </div>
        {imageQR()}
        <form className="mt-6" onSubmit={loginHandler}>
          {(validation as any).errors ? (
            <div className="alert alert-danger">
              {(validation as any).errors}
            </div>
          ) : (
            ""
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Please input your code
            </label>
            <input
              onChange={(e) => setCode(e.target.value)}
              type="number"
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
