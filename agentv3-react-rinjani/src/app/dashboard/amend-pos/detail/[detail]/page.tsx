"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import moment from "moment";
import { useRouter, usePathname } from "next/navigation";
import { Buffer } from "buffer";
import { encode, decode } from "js-base64";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

import { redirect } from "next/navigation";

export default function Page({ params }: { params: { detail: string } }) {
  const router = useRouter();
  const [dataAmend, setDataAmend] = useState<any[]>([]);
  const rejectProcess = async (event: any) => {
    event.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        var param_check = {
          id: decode(params.detail),
        };
        //send data to server
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/amend-reject`,
            param_check,
            {
              headers: {
                Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
              },
            }
          )
          .then((response) => {
            const array_empty2 = [];

            if (response.data.status === "error") {
              alert(response.data.message);
            } else if (response.data.status === "success") {
              Swal.fire("Transaction has been approved!");
              router.push("/dashboard/amend/check");
            } else {
              alert(response.data.message);
            }
          })
          .catch((error) => {
            //assign error to state "validation"
          });
        Swal.fire({
          title: "Rejected!",
          text: "Your transaction has been rejected.",
          icon: "success",
        });
      }
    });
  };
  const checkProcess = async (event: any) => {
    event.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        var param_check = {
          id: decode(params.detail),
        };
        //send data to server
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/amend-check`,
            param_check,
            {
              headers: {
                Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
              },
            }
          )
          .then((response) => {
            const array_empty2 = [];

            if (response.data.status === "error") {
              Swal.fire(response.data.message);
            } else if (response.data.status === "success") {
              Swal.fire("Transaction has been checked!");
              router.push("/dashboard/amend/check");
            } else {
              alert(response.data.message);
            }
          })
          .catch((error) => {
            //assign error to state "validation"
          });
      }
    });
  };

  const [dataq, setData] = useState<any[]>([]);
  const [statuscta, setStatus] = useState();

  const [buttonapprove, setButtonApprove] = useState(false);
  const token = Cookies.get("token");
  const plaintext = jwtDecode(token as string) as any;
  const [buttonreject, setButtonReject] = useState(false);
  useEffect(() => {
    var parameter = {
      id: decode(params.detail),
    };

    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/detail-transaction-send-pos`,
        parameter,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        const array_empty: any[] = [];
        array_empty.push(response.data.transaction);
        setData(array_empty);
      })
      .catch((error) => {});
  }, []);
  useEffect(() => {
    var parameter = {
      id: decode(params.detail),
    };
    const data_amend = axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/amend-detail`, parameter, {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
        },
      })
      .then((response) => {
        const array_empty: any[] = [];
        array_empty.push(response.data.amend);
        setDataAmend(array_empty);

        if (response.data.amend.status == 0) {
          setButtonApprove(true);
          setButtonReject(false);
        }
      })
      .catch((error) => {});
  }, []);
  const [mg, setMg] = useState<any[]>([]);
  useEffect(() => {
    if (
      plaintext.roles.some(function (el: any) {
        return el.name !== "maker" && el.name !== "approver";
      })
    ) {
      redirect("/dashboard");
    }

    var parameter = {
      mgiTransactionSessionID: decode(params.detail),
    };

    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/detail-lookup-pos`,
        parameter,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        const array_empty: any[] = [];
        array_empty.push(response.data.message);

        setMg(array_empty);
      })
      .catch((error) => {});
  }, []);
  function buttonSubmit() {
    if (buttonapprove == true) {
      return (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          type="submit"
        >
          Approve
        </button>
      );
    }
  }
  function buttonReject() {
    if (buttonreject == true) {
      return (
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full"
          type="submit"
        >
          Reject
        </button>
      );
    }
  }
  return (
    <div className="px-5 py-5 content-center">
      <div>
        <h2 className="text-3xl">Detail transactions</h2>
      </div>

      <div className="mt-3 relative overflow-x-auto">
        {dataq.map((student, index) => (
          <>
            <div className="row">
              <div className="col-md-4 max-w-sm">
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <svg
                    width={48}
                    viewBox="0 0 1024 1024"
                    className="icon"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M965.282 186.746H62.449c-25.477 0-46.129 21.177-46.129 47.298v7.139c0 26.121 20.652 47.296 46.129 47.296h902.833c25.48 0 46.131-21.175 46.131-47.296v-7.139c0-26.121-20.65-47.298-46.131-47.298z"
                        fill="#4A5699"
                      ></path>
                      <path
                        d="M965.282 821.697H62.449c-25.477 0-46.129 21.173-46.129 47.296v7.141c0 26.119 20.652 47.297 46.129 47.297h902.833c25.48 0 46.131-21.178 46.131-47.297v-7.141c0-26.123-20.65-47.296-46.131-47.296z"
                        fill="#C45FA0"
                      ></path>
                      <path
                        d="M69.412 186.746H62.33c-26.121 0-47.294 21.177-47.294 47.298v642.09c0 26.119 21.173 47.297 47.294 47.297h7.082c26.121 0 47.294-21.178 47.294-47.297v-642.09c0.001-26.121-21.173-47.298-47.294-47.298zM964.117 186.746h-7.082c-26.119 0-47.296 21.177-47.296 47.298v642.09c0 26.119 21.177 47.297 47.296 47.297h7.082c26.122 0 47.296-21.178 47.296-47.297v-642.09c0-26.121-21.174-47.298-47.296-47.298z"
                        fill="#F39A2B"
                      ></path>
                      <path
                        d="M426.617 435.818h-7.082c-26.121 0-47.296 21.171-47.296 47.294v38.715c0 26.119 21.175 47.296 47.296 47.296h7.082c26.121 0 47.298-21.177 47.298-47.296v-38.715c0-26.122-21.177-47.294-47.298-47.294zM601.912 435.818h-7.082c-26.118 0-47.292 21.171-47.292 47.294v38.715c0 26.119 21.174 47.296 47.292 47.296h7.082c26.119 0 47.3-21.177 47.3-47.296v-38.715c0-26.122-21.181-47.294-47.3-47.294zM777.211 435.818h-7.082c-26.122 0-47.296 21.171-47.296 47.294v38.715c0 26.119 21.174 47.296 47.296 47.296h7.082c26.119 0 47.292-21.177 47.292-47.296v-38.715c0-26.122-21.173-47.294-47.292-47.294zM777.211 611.22h-7.082c-26.122 0-47.296 21.17-47.296 47.293v38.716c0 26.115 21.174 47.293 47.296 47.293h7.082c26.119 0 47.292-21.178 47.292-47.293v-38.716c0-26.123-21.173-47.293-47.292-47.293zM601.912 611.22h-7.082c-26.118 0-47.292 21.17-47.292 47.293v38.716c0 26.115 21.174 47.293 47.292 47.293h7.082c26.119 0 47.3-21.178 47.3-47.293v-38.716c0-26.123-21.181-47.293-47.3-47.293zM426.617 611.22h-7.082c-26.121 0-47.296 21.17-47.296 47.293v38.716c0 26.115 21.175 47.293 47.296 47.293h7.082c26.121 0 47.298-21.178 47.298-47.293v-38.716c0-26.123-21.177-47.293-47.298-47.293zM251.32 611.22h-7.08c-26.123 0-47.294 21.17-47.294 47.293v38.716c0 26.115 21.171 47.293 47.294 47.293h7.08c26.123 0 47.294-21.178 47.294-47.293v-38.716c0-26.123-21.171-47.293-47.294-47.293z"
                        fill="#E5594F"
                      ></path>
                      <path
                        d="M299.245 91.914h-7.435c-26.125 0-47.296 19.988-47.296 44.649V312.24c0 24.657 21.171 44.649 47.296 44.649h7.435c26.125 0 47.296-19.992 47.296-44.649V136.563c0-24.661-21.172-44.649-47.296-44.649zM719.956 91.914h-7.438c-26.118 0-47.292 19.988-47.292 44.649V312.24c0 24.657 21.174 44.649 47.292 44.649h7.438c26.123 0 47.296-19.992 47.296-44.649V136.563c0-24.661-21.173-44.649-47.296-44.649z"
                        fill="#6277BA"
                      ></path>
                    </g>
                  </svg>
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mt-3">
                      Sender
                    </h5>
                  </a>
                  <div className="form-group mt-3 mb-3">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Full name
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      {student.nama_pengirim}
                    </p>
                  </div>
                  <div className="form-group mb-3 ">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Phone number
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      {student.telpon_pengirim}
                    </p>
                  </div>
                  <div className="form-group mb-3 ">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Identity
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      {student.identitas} {student.nomor_identitas}
                    </p>
                  </div>
                  <div className="form-group mb-3 ">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Address
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      {student.alamat_pengirim} {student.kota_pengirim}{" "}
                      {student.provinsi_pengirim ?? ""}{" "}
                      {student.kode_pos_pengirim ?? ""}{" "}
                      {student.negara_pengirim ?? ""}
                    </p>
                  </div>
                  <div className="form-group mb-3 ">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Gender
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      {student.jenis_kelamin}
                    </p>
                  </div>
                  <div className="form-group mb-3 ">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Occupation
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      {student.pekerjaan.replaceAll("_", " ")}
                    </p>
                  </div>
                  <div className="form-group mb-3 ">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Relationship to receiver
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      {student.hubungan_pengirim.replaceAll("_", " ")}
                    </p>
                  </div>
                  <div className="form-group mb-3 ">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Tujuan pengiriman
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      {student.tujuan_penggunaan_dana.replaceAll("_", " ")}
                    </p>
                  </div>
                  {statuscta}
                </div>
              </div>
              <div className="col-md-4 max-w-sm">
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <svg
                    width={48}
                    viewBox="0 0 1024 1024"
                    className="icon"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M899.984 19.873h-3.452c-26.123 0-47.296 21.172-47.296 47.296v888.508c0 26.127 21.173 47.298 47.296 47.298h3.452c26.119 0 47.297-21.171 47.297-47.298V67.169c0-26.124-21.177-47.296-47.297-47.296z"
                        fill="#4A5699"
                      ></path>
                      <path
                        d="M132.643 19.873h-3.449c-26.12 0-47.296 21.172-47.296 47.296v888.508c0 26.127 21.177 47.298 47.296 47.298h3.449c26.123 0 47.299-21.171 47.299-47.298V67.169c0-26.124-21.176-47.296-47.299-47.296z"
                        fill="#C45FA0"
                      ></path>
                      <path
                        d="M899.463 19.873H129.194c-26.12 0-47.296 21.172-47.296 47.296v3.377c0 26.12 21.177 47.299 47.296 47.299h770.269c26.123 0 47.296-21.179 47.296-47.299v-3.377c0-26.124-21.173-47.296-47.296-47.296z"
                        fill="#6277BA"
                      ></path>
                      <path
                        d="M899.463 905.006H129.194c-26.12 0-47.296 21.17-47.296 47.29v3.381c0 26.127 21.177 47.298 47.296 47.298h770.269c26.123 0 47.296-21.171 47.296-47.298v-3.381c0-26.12-21.173-47.29-47.296-47.29z"
                        fill="#C45FA0"
                      ></path>
                      <path
                        d="M717.962 543.153H542.047c-26.121 0-47.298 21.175-47.298 47.297v3.724c0 26.123 21.177 47.293 47.298 47.293h175.915c26.121 0 47.297-21.17 47.297-47.293v-3.724c0-26.122-21.176-47.297-47.297-47.297z"
                        fill="#E5594F"
                      ></path>
                      <path
                        d="M689.268 198.849H513.355c-26.122 0-47.298 21.175-47.298 47.297v3.722c0 26.12 21.176 47.297 47.298 47.297h175.912c26.122 0 47.298-21.177 47.298-47.297v-3.722c0-26.122-21.175-47.297-47.297-47.297z"
                        fill="#F0D043"
                      ></path>
                      <path
                        d="M757.789 353.081H261.17c-26.121 0-47.297 21.172-47.297 47.296v3.377c0 26.121 21.177 47.299 47.297 47.299h496.619c26.121 0 47.296-21.178 47.296-47.299v-3.377c0-26.125-21.175-47.296-47.296-47.296z"
                        fill="#E5594F"
                      ></path>
                      <path
                        d="M762.638 726.225h-496.62c-26.12 0-47.294 21.18-47.294 47.301v3.377c0 26.12 21.174 47.3 47.294 47.3h496.62c26.122 0 47.296-21.18 47.296-47.3v-3.377c0-26.122-21.174-47.301-47.296-47.301z"
                        fill="#6277BA"
                      ></path>
                      <path
                        d="M355.734 543.328H281.41c-26.122 0-47.297 21.17-47.297 47.293v3.378c0 26.118 21.175 47.297 47.297 47.297h74.324c26.123 0 47.296-21.179 47.296-47.297v-3.378c0-26.123-21.174-47.293-47.296-47.293z"
                        fill="#F39A2B"
                      ></path>
                      <path
                        d="M334.85 248.006m-48.986 0a48.986 48.986 0 1 0 97.972 0 48.986 48.986 0 1 0-97.972 0Z"
                        fill="#F39A2B"
                      ></path>
                    </g>
                  </svg>

                  <a href="#">
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mt-3">
                      Amended Receiver
                    </h5>
                  </a>
                  {dataAmend.map((amend_data, index) => (
                    <>
                      <div key={amend_data.id} className="mt-3 mb-3 form-group">
                        <p className="font-normal text-gray-500 dark:text-gray-400">
                          First name
                        </p>
                        <p className="bold text-slate-600 mt-1">
                          {amend_data.first_name}{" "}
                        </p>
                      </div>
                      <div key={amend_data.id} className="mt-3 mb-3 form-group">
                        <p className="font-normal text-gray-500 dark:text-gray-400">
                          Middle name
                        </p>
                        <p className="bold text-slate-600 mt-1">
                          {amend_data.middle_name}{" "}
                        </p>
                      </div>
                      <div key={amend_data.id} className="mt-3 mb-3 form-group">
                        <p className="font-normal text-gray-500 dark:text-gray-400">
                          Last name
                        </p>
                        <p className="bold text-slate-600 mt-1">
                          {" "}
                          {amend_data.last_name}{" "}
                        </p>
                      </div>
                      <div key={amend_data.id} className="mt-3 mb-3 form-group">
                        <p className="font-normal text-gray-500 dark:text-gray-400">
                          Last name 2
                        </p>
                        <p className="bold text-slate-600 mt-1">
                          {" "}
                          {amend_data.last_name2}{" "}
                        </p>
                      </div>
                    </>
                  ))}
                </div>
              </div>
              <div className="col-md-4 max-w-sm">
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <svg
                    width={48}
                    viewBox="0 0 1024 1024"
                    className="icon"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M91.89 238.457c-29.899 0-54.133 24.239-54.133 54.134 0 29.899 24.234 54.137 54.133 54.137s54.138-24.238 54.138-54.137c0-29.896-24.239-54.134-54.138-54.134z"
                        fill="#E5594F"
                      ></path>
                      <path
                        d="M91.89 462.463c-29.899 0-54.133 24.239-54.133 54.139 0 29.895 24.234 54.133 54.133 54.133s54.138-24.238 54.138-54.133c0-29.9-24.239-54.139-54.138-54.139z"
                        fill="#C45FA0"
                      ></path>
                      <path
                        d="M91.89 686.475c-29.899 0-54.133 24.237-54.133 54.133 0 29.899 24.234 54.138 54.133 54.138s54.138-24.238 54.138-54.138c0-29.896-24.239-54.133-54.138-54.133z"
                        fill="#F39A2B"
                      ></path>
                      <path
                        d="M941.26 234.723H328.964c-28.867 0-52.263 23.4-52.263 52.268v3.734c0 28.868 23.396 52.269 52.263 52.269H941.26c28.869 0 52.269-23.401 52.269-52.269v-3.734c-0.001-28.868-23.4-52.268-52.269-52.268z"
                        fill="#F0D043"
                      ></path>
                      <path
                        d="M941.26 682.74H328.964c-28.867 0-52.263 23.399-52.263 52.268v3.734c0 28.863 23.396 52.269 52.263 52.269H941.26c28.869 0 52.269-23.405 52.269-52.269v-3.734c-0.001-28.868-23.4-52.268-52.269-52.268z"
                        fill="#4A5699"
                      ></path>
                      <path
                        d="M709.781 458.729H328.964c-28.867 0-52.263 23.4-52.263 52.269v3.734c0 28.873 23.396 52.269 52.263 52.269h380.817c28.866 0 52.271-23.396 52.271-52.269v-3.734c0.001-28.869-23.405-52.269-52.271-52.269z"
                        fill="#E5594F"
                      ></path>
                    </g>
                  </svg>
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mt-3">
                      Transaction
                    </h5>
                  </a>
                  <div className="mt-3 mb-3 form-group">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Destination country
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      {student.negara_penerima}
                    </p>
                  </div>
                  <div className="mt-3 mb-3 form-group">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Send Amount
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      IDR{" "}
                      {Number(student.amount).toLocaleString("id-ID", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="mt-3 mb-3 form-group">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Receive Amount
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      {mg.map(
                        (mgs, index) => mgs.receiveAmounts[0].receiveCurrency
                      )}{" "}
                      {mg.map(
                        (mgs, index) => mgs.receiveAmounts[0].receiveAmount
                      )}
                    </p>
                  </div>
                  <div className="mt-3 mb-3 form-group">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Fee
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      IDR{" "}
                      {mg.map((mgs, index) => mgs.sendAmounts[0].totalSendFees)}
                    </p>
                  </div>

                  <div className="mt-3 mb-3 form-group">
                    <p className="font-normal text-gray-500 dark:text-gray-400">
                      Timestamp
                    </p>
                    <p className="bold text-slate-600 mt-1">
                      {dataAmend.map((amend_data, index) =>
                        moment(new Date(amend_data.created_at)).format(
                          "ddd, MMMM Do YYYY, HH:mm:ss A"
                        )
                      )}
                    </p>
                  </div>
                  {statuscta}
                  <div className="row">
                    <div className="col-6">
                      <form onSubmit={checkProcess}>{buttonSubmit()}</form>
                    </div>
                    <div className="col-6">
                      <form onSubmit={rejectProcess}>{buttonReject()}</form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
