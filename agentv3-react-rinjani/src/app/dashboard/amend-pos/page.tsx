"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import moment from "moment";

import { Buffer } from "buffer";
import { encode, decode } from "js-base64";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
export default function Amend() {
  const [refNumber, setRefNumber] = useState("");
  const [mg, setMg] = useState<any[]>([]);
  const [buttonreject, setButtonReject] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [mgiSession, setMgiSession] = useState("");
  const [idpos, setIdPos] = useState("");
  const [transStatus, settranssStatus] = useState("");
  function buttonReject() {
    if (buttonreject == true) {
      return (
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full"
          type="submit"
        >
          Amend
        </button>
      );
    }
  }
  const checkProcess = async (event: any) => {
    const token = Cookies.get("token") as string;
    const plaintext = jwtDecode(token as string) as any;
    event.preventDefault();

    var parameter = {
      referenceNumber: refNumber,
      includeUseData: false,

      operatorName: plaintext.name,
    };
    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/detail-lookup-refnumber-pos`,
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

        if (response.data.status === "error") {
          Swal.fire({
            title: "Error!",
            text:
              response.data.message.errorCode +
              " " +
              response.data.message.errorString,
            icon: "error",
          });
        } else {
          if (
            response.data.message.transactionStatus == "AVAIL" ||
            response.data.message.transactionStatus == "AFR" ||
            response.data.message.transactionStatus == "PRCSS"
          ) {
            setFirstName(response.data.message.receiverFirstName.toString());
            setMiddleName(
              response.data.message.receiverMiddleName
                ? response.data.message.receiverMiddleName.toString()
                : ""
            );
            setLastName(response.data.message.receiverLastName.toString());
            setLastName2(
              response.data.message.receiverLastName2
                ? response.data.message.receiverLastName2.toString()
                : ""
            );
            setButtonReject(true);
            if (response.data.message.transactionStatus[0] === "AFR") {
              settranssStatus("Available for refund");
            } else if (response.data.message.transactionStatus[0] === "AVAIL") {
              settranssStatus("Available");
            } else if (response.data.message.transactionStatus[0] === "PRCSS") {
              settranssStatus("On Process");
            } else if (response.data.message.transactionStatus[0] === "RECVD") {
              settranssStatus("Received");
            }
          } else if (response.data.message.transactionStatus[0] == "RECVD") {
            settranssStatus("Received");
          } else {
            settranssStatus(response.data.message.transactionStatus[0]);
          }
          setMg(array_empty);
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error.response.data.errors,
          icon: "error",
        });
      });

    var parameter_refnumber = {
      referenceNumber: refNumber,
    };
    const data_ref = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/detail-send-pos-refnumber`,
        parameter_refnumber,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )
      .then((response) => {
        console.log(response.data.transaction.mgisession);
        const array_empty: any[] = [];

        setMgiSession(response.data.transaction.mgisession);

        setIdPos(response.data.transaction.id_pos.toString());
      })
      .catch((error) => {});
  };
  const amendProcess = async (event: any) => {
    const token = Cookies.get("token") as string;
    const plaintext = jwtDecode(token as string) as any;
    event.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, create it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        var parameter = {
          no_referensi: refNumber,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          last_name2: lastName2,
          mgisession: mgiSession,
          operator: plaintext.name,
          id_pos: idpos,
          status: 0,
        };
        const data_country = axios
          .post(`${process.env.NEXT_PUBLIC_API_URL}/api/amend-add`, parameter, {
            headers: {
              Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
            },
          })

          .then((response) => {
            const array_empty: any[] = [];
            array_empty.push(response.data.message);
            if (response.data.status === "error") {
              Swal.fire({
                title: "Error!",
                text: "Amend failed",
                icon: "error",
              });
            } else if (response.data.status === "success") {
              Swal.fire({
                title: "Success!",
                text: "Amend request success",
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Fail!",
                text: "Fail",
                icon: "error",
              });
            }
          })
          .catch((error) => {});
      }
    });
  };
  return (
    <>
      <div className="px-5 col-12 py-5 card h-100 w-full">
        <div>
          <h2 className="text-3xl">Amend transactions</h2>
        </div>
        <form onSubmit={checkProcess}>
          <div className="mt-3 card-body relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="col-md-4 flex items-center border-b border-teal-500 py-2">
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="Reference number"
                aria-label="Reference number"
                onChange={(event) => setRefNumber(event.target.value)}
              />
              <button
                className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
        <br />
        <div className="pt-3 card">
          {mg.map((mgs, index) => (
            <div key={mgs.id} className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <label className="text-2xl">Receiver</label>
                  <div className="mb-1 mt-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      First Name
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      required
                      onChange={(event) => setFirstName(event.target.value)}
                      defaultValue={mgs.receiverFirstName}
                    />
                  </div>
                  <div className="mt-3 mb-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Middle Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      defaultValue={mgs.receiverMiddleName}
                      onChange={(event) => setMiddleName(event.target.value)}
                    />
                  </div>
                  <div className="mt-3 mb-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Last Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      required
                      defaultValue={mgs.receiverLastName}
                      onChange={(event) => setLastName(event.target.value)}
                    />
                  </div>
                  <div className="mt-3 mb-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Last Name 2
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      defaultValue={mgs.receiverLastName2}
                      onChange={(event) => setLastName2(event.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4 px-5">
                  <label className="text-2xl mb-3">Transaction</label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Reference Number : {mgs.referenceNumber}
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status : {transStatus}
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Receive Country : {mgs.receiveCountry}
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Send Amount : IDR{" "}
                    {Number(mgs.sendAmounts[0].sendAmount).toLocaleString(
                      "id-ID",
                      { maximumFractionDigits: 2, minimumFractionDigits: 2 }
                    )}
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Receive Amount : {mgs.receiveAmounts[0].receiveCurrency[0]}{" "}
                    {mgs.receiveAmounts[0].receiveAmount[0].toLocaleString(
                      "id-ID",
                      { maximumFractionDigits: 2, minimumFractionDigits: 2 }
                    )}
                  </label>
                  <label className="text-2xl mt-3">Sender</label>
                  <div className="mb-1 mt-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      First Name : {mgs.senderFirstName}
                    </label>
                  </div>
                  <div className="mb-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Middle Name : {mgs.senderMiddleName}
                    </label>
                  </div>
                  <div className="mb-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Last Name : {mgs.senderLastName}
                    </label>
                  </div>
                  <div className="mb-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Last Name 2 : {mgs.senderLastName2}
                    </label>
                  </div>
                </div>
              </div>
              <form onSubmit={amendProcess}>
                <div className="form-group">
                  <br />
                  {buttonReject()}
                </div>
              </form>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
