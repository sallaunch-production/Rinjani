"use client";
import ArsemaLogo from "@/app/logo";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
// or via CommonJS
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function SideBar() {
  const tokens = Cookies.get("token")?.toString();
  const router = useRouter();
  const Logout = async () => {
    // remove stored token
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to signout from this apps!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("token");
        if (typeof window !== "undefined") {
          sessionStorage.clear();
        }
        router.push("/login");
      }
    });
  };
  useEffect(() => {
    if (tokens == undefined) {
      console.log("kokisi");
    }
  }, []);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const [sendurl, setsendUrl] = useState("");
  const [amendUrl, setamendUrl] = useState("");
  const [amendPosUrl, setamendPosUrl] = useState("");
  const [reversalUrl, setreversalUrl] = useState("");
  const [reversalposUrl, setreversalposUrl] = useState("");
  const [receiveUrl, setreceiveUrl] = useState("");
  useEffect(() => {
    const plaintext = jwtDecode(tokens ? tokens : "") as any;
    setName(plaintext.name);
    if (
      plaintext.roles.some(function (el: any) {
        return el.name === "checker";
      })
    ) {
      setRole("checker");
      setsendUrl("/dashboard/send/check");
      setamendUrl("/dashboard/amend/check");
      setamendPosUrl("/dashboard/amend-pos/check");
      setreversalUrl("/dashboard/reversal/check");
      setreversalposUrl("/dashboard/reversal-pos/check");
      setreceiveUrl("/dashboard/receive/check");
    } else if (
      plaintext.roles.some(function (el: any) {
        return el.name === "approver";
      })
    ) {
      setRole("approver");
      setsendUrl("/dashboard/send/approve");
      setamendUrl("/dashboard/amend/approve");
      setamendPosUrl("/dashboard/amend-pos/approve");
      setreversalUrl("/dashboard/reversal/approve");
      setreversalposUrl("/dashboard/reversal-pos/approve");
      setreceiveUrl("/dashboard/receive/approve");
    } else if (
      plaintext.roles.some(function (el: any) {
        return el.name === "maker";
      })
    ) {
      setRole("maker");
      setsendUrl("/dashboard/send");
      setamendUrl("/dashboard/amend");
      setamendPosUrl("/dashboard/amend-pos");
      setreversalUrl("/dashboard/reversal");
      setreversalposUrl("/dashboard/reversal-pos");
      setreceiveUrl("/dashboard/receive");
    }
  }, []);

  return (
    <>
      <div
        id="view"
        className="h-full flex flex-row"
        x-data="{ sidenav: true }"
      >
        <button className="p-2 border-2 bg-white rounded-md border-gray-200 shadow-lg text-gray-500 focus:bg-teal-500 focus:outline-none focus:text-white absolute top-0 left-0 sm:hidden">
          <svg
            className="w-5 h-5 fill-current"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        <div
          id="sidebar"
          className="bg-white h-screen md:block shadow-xl px-3 w-30 md:w-60 lg:w-60 overflow-x-hidden transition-transform duration-300 ease-in-out"
          x-show="sidenav"
        >
          <br />
          <ArsemaLogo></ArsemaLogo>
          <div className="space-y-6">
            <h1 className="font-bold text-4xl text-center md:hidden">
              A<span className="text-teal-600">.</span>
            </h1>

            <div id="profile" className="mt-3">
              <div className="text-center">
                <label className="text-xl">{name}</label>
                <br />
                <label className="text-slate-400">{role}</label>
                <p className="text-xs text-gray-500 text-sm text-center mt-3">
                  <button
                    onClick={() => {
                      Logout();
                    }}
                    className="mt-4 border border-solid border-black py-2 px-4 rounded cursor-pointer"
                  >
                    Logout
                  </button>
                </p>
              </div>
            </div>
            <div className="flex border-2 rounded-md focus-within:ring-2 ring-teal-600"></div>
            <div id="menu" className="flex flex-col space-y-2">
              <a
                href="/dashboard"
                className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out"
              >
                <svg
                  className="w-6 h-6 fill-current inline-block"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
                <span className="">Dashboard</span>
              </a>

              <a
                href={sendurl}
                className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
              >
                <svg
                  className="w-6 h-6 fill-current inline-block"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
                </svg>
                <span className="">Send</span>
              </a>
              <a
                href={receiveUrl}
                className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
              >
                <svg
                  className="w-6 h-6 fill-current inline-block"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="">Receive</span>
              </a>

              <a
                href={"/dashboard/change-password"}
                className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
              >
                <svg
                  fill="#000000"
                  viewBox="0 0 24 24"
                  id="secure"
                  data-name="Flat Color"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 fill-current inline-block"
                  width={20}
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      id="primary"
                      d="M19.42,3.83,12.24,2a1,1,0,0,0-.48,0L4.58,3.83A2,2,0,0,0,3.07,5.92l.42,5.51a12,12,0,0,0,7.24,10.11l.88.38a1,1,0,0,0,.78,0l.88-.38a12,12,0,0,0,7.24-10.11l.42-5.51A2,2,0,0,0,19.42,3.83Z"
                    ></path>
                    <path
                      id="secondary"
                      d="M11,14a1,1,0,0,1-.71-.29l-2-2a1,1,0,0,1,1.42-1.42L11,11.59l3.29-3.3a1,1,0,0,1,1.42,1.42l-4,4A1,1,0,0,1,11,14Z"
                      fill="#fff"
                    ></path>
                  </g>
                </svg>
                <span className="">Change Password</span>
              </a>
              {role === "approver" ? (
                <a
                  href={"/dashboard/reporting"}
                  className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
                >
                  <svg
                    className="w-5 h-5 fill-current inline-block"
                    width={10}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M19.728 10.686c-2.38 2.256-6.153 3.381-9.875 3.381-3.722 0-7.4-1.126-9.571-3.371L0 10.437V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7.6l-.272.286Z" />
                    <path d="m.135 7.847 1.542 1.417c3.6 3.712 12.747 3.7 16.635.01L19.605 7.9A.98.98 0 0 1 20 7.652V6a2 2 0 0 0-2-2h-3V3a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H2a2 2 0 0 0-2 2v1.765c.047.024.092.051.135.082ZM10 10.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM7 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H7V3Z" />
                  </svg>
                  <span className="ml-1">Reporting</span>
                </a>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
