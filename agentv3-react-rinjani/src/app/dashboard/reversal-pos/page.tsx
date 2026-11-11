"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import moment from "moment";

import { Buffer } from "buffer";
import { encode, decode } from "js-base64";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
export default function Reversal() {
  const [refNumber, setRefNumber] = useState("");
  const [mg, setMg] = useState<any[]>([]);
  const [buttonreject, setButtonReject] = useState(false);
  const [pengirim, setNamaPengirim] = useState("");
  const [penerima, setNamaPenerima] = useState("");
  const [idpos, setIdPos] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [senderfirstName, setsenderFirstName] = useState("");
  const [sendermiddleName, setsenderMiddleName] = useState("");
  const [senderlastName, setsenderLastName] = useState("");
  const [senderlastName2, setsenderLastName2] = useState("");
  const [negaraPenerima, setNegaraPenerima] = useState("");
  const [mgiSession, setMgiSession] = useState("");
  const [cancel_reason, setCancelReason] = useState("");
  const [button_print, setButtonPrint] = useState(false);
  const [hiddenReason, setHiddenReason] = useState("");
  const [transsStatus, settranssStatus] = useState("");
  const checkProcess = async (event: any) => {
    const token = Cookies.get("token");
    const plaintext = jwtDecode(token as string) as any;
    event.preventDefault();
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
        setMgiSession(response.data.transaction.mgisession);
        setNamaPengirim(response.data.transaction.nama_pengirim);
        setNamaPenerima(response.data.transaction.nama_penerima);
        setNegaraPenerima(response.data.transaction.negara_penerima);
        setIdPos(response.data.transaction.id_pos);
      })
      .catch((error) => {});
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
          setMg(array_empty);

          if (
            response.data.message.transactionStatus[0] === "AVAIL" ||
            response.data.message.transactionStatus[0] === "AFR" ||
            response.data.message.transactionStatus[0] === "PRCSS"
          ) {
            if (response.data.message.transactionStatus[0] === "AFR") {
              settranssStatus("Available for refund");
            } else if (response.data.message.transactionStatus[0] === "AVAIL") {
              settranssStatus("Available");
            } else if (response.data.message.transactionStatus[0] === "PRCSS") {
              settranssStatus("On Process");
            } else {
              settranssStatus(response.data.message.transactionStatus[0]);
            }
            setFirstName(response.data.message.receiverFirstName[0]);

            setMiddleName(
              response.data.message.receiverMiddleName
                ? response.data.message.receiverMiddleName.toString()
                : ""
            );

            setLastName(response.data.message.receiverLastName[0]);

            setLastName2(
              response.data.message.receiverLastName2
                ? response.data.message.receiverLastName2[0]
                : ""
            );
            setsenderFirstName(response.data.message.senderFirstName[0]);
            setsenderMiddleName(
              response.data.message.senderMiddleName
                ? response.data.message.senderMiddleName[0]
                : ""
            );
            setsenderLastName(response.data.message.senderLastName[0]);

            setsenderLastName2(
              response.data.message.senderLastName2
                ? response.data.message.senderLastName2[0]
                : ""
            );

            setButtonReject(true);
            setButtonPrint(false);
          } else if (response.data.message.transactionStatus === "CANCL") {
            setButtonPrint(true);
            setHiddenReason("d-none");
          }
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error.response.data.errors,
          icon: "error",
        });
      });
  };
  const reversalProcess = async (event: any) => {
    event.preventDefault();
    const token = Cookies.get("token");
    const plaintext = jwtDecode(token as string) as any;
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
          cancel_reason: cancel_reason,
          mgisession: mgiSession,
          nama_pengirim: pengirim,
          nama_penerima: penerima,
          operator: plaintext.name,
          id_pos: idpos,
          negara_penerima: negaraPenerima,
          status: 0,
        };
        const data_country = axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/reversal-add`,
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
                text: "Reversal failed",
                icon: "error",
              });
            } else if (response.data.status === "success") {
              Swal.fire({
                title: "Success!",
                text: "Reversal request success",
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
  function buttonReject() {
    console.log(buttonreject);
    if (buttonreject == true) {
      return (
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full"
          type="submit"
        >
          Reversal request
        </button>
      );
    }
  }
  return (
    <>
      <div className="px-5 col-12 py-5 card h-100 w-full">
        <div>
          <h2 className="text-3xl">Reversal transactions</h2>
        </div>
        <form onSubmit={checkProcess}>
          <div className="mt-3 card-body relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="col-md-4 flex items-center border-b border-teal-500 py-2">
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="Reference number"
                aria-label="Reference number"
                onChange={(event: any) => setRefNumber(event.target.value)}
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
            <div className="card-body">
              <div className="row mt-3">
                <div className="col-md-4">
                  <label className="text-2xl">Sender</label>
                  <div className="mb-1 mt-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      <span className="text-slate-400">First Name</span> :{" "}
                      {mgs.senderFirstName}
                    </label>
                  </div>
                  <div className="mb-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      <span className="text-slate-400">Middle Name</span> :{" "}
                      {mgs.senderMiddleName}
                    </label>
                  </div>
                  <div className="mb-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      <span className="text-slate-400">Last Name</span> :{" "}
                      {mgs.senderLastName}
                    </label>
                  </div>
                  <div className="mb-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      <span className="text-slate-400">Last Name 2</span> :{" "}
                      {mgs.senderLastName2}
                    </label>
                  </div>
                </div>
                <div className="col-md-4 px-5">
                  <label className="text-2xl">Receiver</label>
                  <div className="mb-1 mt-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      First Name : {mgs.receiverFirstName}
                    </label>
                  </div>
                  <div className="mt-3 mb-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Middle Name : {mgs.receiverMiddleName}
                    </label>
                  </div>
                  <div className="mt-3 mb-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Last Name : {mgs.receiverLastName}
                    </label>
                  </div>
                  <div className="mt-3 mb-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Last Name 2 : {mgs.receiverLastName2}
                    </label>
                  </div>
                </div>
                <div className="col-md-4 px-5">
                  <label className="text-2xl mb-3">Transaction</label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Reference Number : {mgs.referenceNumber}
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status : {transsStatus}
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
                </div>
              </div>
              <hr />
              <div className={"form-group col-md-3 mt-3 " + hiddenReason}>
                <label className="text-2xl mt-3">Reason</label>
                <select
                  name="reason"
                  className="form-control mt-3"
                  required
                  onChange={(event: any) => setCancelReason(event.target.value)}
                >
                  <option value="">Choose Send Reversal reason</option>
                  <option value="NO_RCV_LOC">No receive location</option>
                  <option value="WRONG_SERVICE">Wrong delivery option</option>
                  <option value="NO_TQ">
                    missing test question and answer
                  </option>
                  <option value="INCORRECT_AMT">
                    Incorrect send / receive amount
                  </option>
                  <option value="MS_NOT_USED">
                    MoneyGram Plus or a card number not used{" "}
                  </option>
                </select>
              </div>
              <form onSubmit={reversalProcess}>
                <div className="form-group mt-3">{buttonReject()}</div>
              </form>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
