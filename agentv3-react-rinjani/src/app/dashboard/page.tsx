"use client";
import CardDataStats from "../../components/CardDataStats";
import moment from "moment-timezone";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";
export default function Dashboard() {
  const [created, setCreated] = useState<any>({});
  const [needtocheck, setNeedToCheck] = useState<any>({});
  const [needtoapprove, setNeedToApprove] = useState<any>({});
  const [complete, setComplete] = useState<any>({});
  const [amend, setAmend] = useState<any>({});
  const [reversal, setReversal] = useState<any>({});
  const [amendpos, setAmendpos] = useState<any>({});
  const [reversalpos, setReversalpos] = useState<any>({});
  const [rejected, setRejected] = useState<any>({});
  const [rcvcreated, setrcvCreated] = useState<any>({});
  const [rcvneedtocheck, setrcvNeedToCheck] = useState<any>({});
  const [rcvneedtoapprove, setrcvNeedToApprove] = useState<any>({});
  const [rcvcomplete, setrcvComplete] = useState<any>({});
  const [amendcomplete, setamendComplete] = useState<any>({});
  const [reversalcomplete, setreversalComplete] = useState<any>({});
  const [amendcompletepos, setamendCompletepos] = useState<any>({});
  const [reversalcompletepos, setreversalCompletepos] = useState<any>({});
  const [rcvrejected, setrcvRejected] = useState<any>({});
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dataSend, setDataSend] = useState("");
  const [dataExpired, setDataExpired] = useState("");
  const [dateNow, setDateNow] = useState("");

  const router = useRouter();
  useEffect(() => {
    const tokens = Cookies.get("token")?.toString();
    const plaintext = jwtDecode(tokens ? tokens : "") as any;

    var params = {
      email: plaintext.email,
    };
    const data_country = axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/check-expired`, params, {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
        },
      })

      .then((response) => {
        const array_empty = [];

        if (response.data.status === "error") {
          router.push("/dashboard/change-password");
        }
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    setDateNow(
      moment.tz(new Date(), "Asia/Jakarta").format("DD MMM YYYY HH:mm:ss")
    );
    const tokens = Cookies.get("token")?.toString();
    const plaintext = jwtDecode(tokens ? tokens : "") as any;
    if (
      plaintext.roles.some(function (el: any) {
        return el.name === "maker";
      })
    ) {
      setRole("Maker");

      var params = {
        status: "",
        tanggal: moment().format("YYYYMMDD"),
      };
      const data_country = axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/count-transaction`,
          params,
          {
            headers: {
              Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
            },
          }
        )

        .then((response) => {
          const array_empty = [];

          setCreated(response.data);
        })
        .catch((error) => {});
    } else if (
      plaintext.roles.some(function (el: any) {
        return el.name === "approver";
      })
    ) {
      setRole("Approver");

      var params = {
        status: "",
        tanggal: moment().format("YYYYMMDD"),
      };
      const data_country = axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/count-transaction`,
          params,
          {
            headers: {
              Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
            },
          }
        )

        .then((response) => {
          const array_empty = [];

          setCreated(response.data);
        })
        .catch((error) => {});
    }
  }, []);

  useEffect(() => {
    var params = {
      status: "2",
      tanggal: moment().format("YYYY-MM-DD"),
    };
    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/count-transaction`,
        params,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        const array_empty = [];

        setComplete(response.data);
      })
      .catch((error) => {});
  }, []);
  useEffect(() => {
    var params = {
      status: "4",
      tanggal: moment().format("YYYYMMDD"),
    };
    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/count-transaction`,
        params,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        const array_empty = [];

        setRejected(response.data);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    const tokens = Cookies.get("token")?.toString();
    const plaintext = jwtDecode(tokens ? tokens : "") as any;
    if (
      plaintext.roles.some(function (el: any) {
        return el.name === "maker";
      })
    ) {
      var params = {
        status: "",
        tanggal: moment().format("YYYYMMDD"),
      };
      const data_country = axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/count-transaction-receive`,
          params,
          {
            headers: {
              Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
            },
          }
        )

        .then((response) => {
          const array_empty = [];

          setrcvCreated(response.data);
        })
        .catch((error) => {});
    }
    if (
      plaintext.roles.some(function (el: any) {
        return el.name === "approver";
      })
    ) {
      var params = {
        status: "2",
        tanggal: moment().format("YYYYMMDD"),
      };
      const data_country = axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/count-transaction-receive`,
          params,
          {
            headers: {
              Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
            },
          }
        )

        .then((response) => {
          const array_empty = [];

          setrcvCreated(response.data);
        })
        .catch((error) => {});
    }
  }, []);

  useEffect(() => {
    var params = {
      status: "2",
      tanggal: moment().format("YYYY-MM-DD"),
    };
    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/count-transaction-receive`,
        params,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        const array_empty = [];

        setrcvComplete(response.data);
      })
      .catch((error) => {});
  }, []);

  return (
    <>
      <div className="card px-3 py-3">
        <h2 suppressHydrationWarning>Last update {dateNow}</h2>
      </div>
      <h1 className="text-center text-3xl pt-3">Today's Transaction</h1>
      <div className="lg:ml-64 lg:pl-4 lg:flex lg:flex-col lg:w-75% mt-5 mx-2">
        <div className="lg:flex gap-4 items-stretch">
          <div className="bg-white md:p-2 p-6 rounded-lg border border-gray-200 mb-4 lg:mb-0 shadow-md lg:w-[35%]">
            <a href="/dashboard/send/today">
              <div className="flex justify-center items-center space-x-24 h-full">
                <div>
                  <p>Send</p>
                  <h2 className="text-4xl font-bold text-gray-600">
                    {created.total}
                  </h2>
                  <p>Created</p>
                </div>
                <svg
                  width="64px"
                  height="64px"
                  viewBox="-4.8 -4.8 33.60 33.60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g
                    id="SVGRepo_bgCarrier"
                    strokeWidth="0"
                    transform="translate(0,0), scale(1)"
                  >
                    <rect
                      x="-4.8"
                      y="-4.8"
                      width="33.60"
                      height="33.60"
                      rx="16.8"
                      fill="#b10b2d"
                      strokeWidth="0"
                    ></rect>
                  </g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#CCCCCC"
                    strokeWidth="0.8640000000000001"
                  >
                    {" "}
                    <path
                      d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                      stroke="#fdfcfc"
                      strokeWidth="0.192"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                  </g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                      stroke="#fdfcfc"
                      strokeWidth="1.3679999999999999"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
            </a>
          </div>

          <div className="bg-white md:p-2 p-6 rounded-lg border border-gray-200 mb-4 lg:mb-0 shadow-md lg:w-[35%]">
            <a
              href={role === "approver" ? "/dashboard/send/need-approval" : "#"}
            >
              <div className="flex justify-center items-center space-x-16 h-full">
                <div>
                  <p>Send</p>
                  <h2 className="text-4xl font-bold text-gray-600">
                    {complete.total}
                  </h2>
                  <p>Need Approval</p>
                </div>
                <svg
                  width="64px"
                  height="64px"
                  viewBox="-4.8 -4.8 33.60 33.60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g
                    id="SVGRepo_bgCarrier"
                    strokeWidth="0"
                    transform="translate(0,0), scale(1)"
                  >
                    <rect
                      x="-4.8"
                      y="-4.8"
                      width="33.60"
                      height="33.60"
                      rx="16.8"
                      fill="#b10b2d"
                      strokeWidth="0"
                    ></rect>
                  </g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#CCCCCC"
                    strokeWidth="0.8640000000000001"
                  >
                    {" "}
                    <path
                      d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                      stroke="#fdfcfc"
                      strokeWidth="0.192"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                  </g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                      stroke="#fdfcfc"
                      strokeWidth="1.3679999999999999"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
            </a>
          </div>

          <div className="bg-white md:p-2 p-6 rounded-lg border border-gray-200 mb-4 lg:mb-0 shadow-md lg:w-[35%]">
            <div className="flex justify-center items-center space-x-24 h-full">
              <div>
                <p>Receive</p>
                <h2 className="text-4xl font-bold text-gray-600">
                  {rcvcreated.total}
                </h2>
                <p>Created</p>
              </div>
              <svg
                width={84}
                viewBox="-2.4 -2.4 28.80 28.80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM8.64 7.15C8.93 6.86 9.41 6.86 9.7 7.15L14.08 11.53V9.1C14.08 8.69 14.42 8.35 14.83 8.35C15.24 8.35 15.58 8.69 15.58 9.1V13.34C15.58 13.44 15.56 13.53 15.52 13.63C15.44 13.81 15.3 13.96 15.11 14.04C15.02 14.08 14.92 14.1 14.82 14.1H10.58C10.17 14.1 9.83 13.76 9.83 13.35C9.83 12.94 10.17 12.6 10.58 12.6H13.01L8.64 8.21C8.35 7.92 8.35 7.45 8.64 7.15ZM18.24 17.22C16.23 17.89 14.12 18.23 12 18.23C9.88 18.23 7.77 17.89 5.76 17.22C5.37 17.09 5.16 16.66 5.29 16.27C5.42 15.88 5.84 15.66 6.24 15.8C9.96 17.04 14.05 17.04 17.77 15.8C18.16 15.67 18.59 15.88 18.72 16.27C18.84 16.67 18.63 17.09 18.24 17.22Z"
                    fill="#0b74f4"
                  ></path>{" "}
                </g>
              </svg>
            </div>
          </div>
          <div className="bg-white md:p-2 p-6 rounded-lg border border-gray-200 mb-4 lg:mb-0 shadow-md lg:w-[35%]">
            <a href={role === "approver" ? "/dashboard/receive/complete" : "#"}>
              <div className="flex justify-center items-center space-x-16 h-full">
                <div>
                  <p>Receive</p>
                  <h2 className="text-4xl font-bold text-gray-600">
                    {rcvcomplete.total}
                  </h2>
                  <p>Need Approval</p>
                </div>
                <svg
                  width={84}
                  viewBox="-2.4 -2.4 28.80 28.80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM8.64 7.15C8.93 6.86 9.41 6.86 9.7 7.15L14.08 11.53V9.1C14.08 8.69 14.42 8.35 14.83 8.35C15.24 8.35 15.58 8.69 15.58 9.1V13.34C15.58 13.44 15.56 13.53 15.52 13.63C15.44 13.81 15.3 13.96 15.11 14.04C15.02 14.08 14.92 14.1 14.82 14.1H10.58C10.17 14.1 9.83 13.76 9.83 13.35C9.83 12.94 10.17 12.6 10.58 12.6H13.01L8.64 8.21C8.35 7.92 8.35 7.45 8.64 7.15ZM18.24 17.22C16.23 17.89 14.12 18.23 12 18.23C9.88 18.23 7.77 17.89 5.76 17.22C5.37 17.09 5.16 16.66 5.29 16.27C5.42 15.88 5.84 15.66 6.24 15.8C9.96 17.04 14.05 17.04 17.77 15.8C18.16 15.67 18.59 15.88 18.72 16.27C18.84 16.67 18.63 17.09 18.24 17.22Z"
                      fill="#0b74f4"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
