"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import moment from "moment";

import { Buffer } from "buffer";
import { encode, decode } from "js-base64";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";
export default function Receive() {
  const [refNumber, setRefNumber] = useState("");
  const [mg, setMg] = useState<any[]>([]);
  const [buttonreject, setButtonReject] = useState(false);
  const [amount, setAmount] = useState(0);
  const [receiveCurrency, setreceiveCurreny] = useState("");
  const [originatingCountry, setoriginatingCountry] = useState("");
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [alerts, setAlert] = useState("");
  const [mgiSession, setMgiSession] = useState<any[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const checkProcess = async (event: any) => {
    event.preventDefault();
    Swal.fire({
      text: "Please wait...",
      showConfirmButton: false,
      timer: 5000,
      icon: "info",
    });
    const token = Cookies.get("token")?.toString();
    const plaintext = jwtDecode(token as string) as any;
    var parameter = {
      referenceNumber: refNumber,
      includeUseData: false,

      operatorName: plaintext.name,
    };
    const data_country = axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/receive`, parameter, {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
        },
      })
      .then((response) => {
        const array_empty: any[] = [];
        //array_empty.push(response.data.message);

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
          array_empty.push(response.data.message);

          setMg(array_empty);
          if (
            response.data.message.transactionStatus[0] === "AVAIL" &&
            response.data.message.okForAgent[0] === "true" &&
            response.data.message.okForPickup[0] === "true"
          ) {
            setButtonReject(true);
            setAmount(response.data.message.receiveAmount[0]);
            setreceiveCurreny(response.data.message.receiveCurrency[0]);
            setoriginatingCountry(response.data.message.originatingCountry[0]);
            setMgiSession(response.data.message.mgiTransactionSessionID[0]);
            var senderMiddleName = "";
            if (typeof response.data.message.senderMiddleName === "undefined")
              senderMiddleName = "";
            else senderMiddleName = response.data.message.senderMiddleName[0];
            var senderLastName2 = "";
            if (typeof response.data.message.senderLastName2 === "undefined")
              senderLastName2 = "";
            else senderLastName2 = response.data.message.senderLastName2[0];

            var receiverMiddleName = "";
            if (typeof response.data.message.receiverMiddleName === "undefined")
              receiverMiddleName = "";
            else
              receiverMiddleName = response.data.message.receiverMiddleName[0];
            var receiverLastName2 = "";
            if (typeof response.data.message.receiverLastName2 === "undefined")
              receiverLastName2 = "";
            else receiverLastName2 = response.data.message.receiverLastName2[0];

            var senders =
              response.data.message.senderFirstName[0] +
              " " +
              senderMiddleName +
              " " +
              response.data.message.senderLastName[0] +
              " " +
              senderLastName2;

            var receivers =
              response.data.message.receiverFirstName[0] +
              " " +
              receiverMiddleName +
              " " +
              response.data.message.receiverLastName[0] +
              " " +
              receiverLastName2;

            setSender(senders);
            setReceiver(receivers);
          } else {
            setAlert("Agent is not allowed to proceed this transaction");
          }
          /*setAmount(response.data.message.receiveAmount[0]);
                setreceiveCurreny(response.data.message.receiveCurrency[0]);
                setoriginatingCountry(response.data.message.originatingCountry[0]);
                setSender(response.data.message.senderFirstName[0]+' '+response.data.message.senderMiddleName[0]+' '+response.data.message.senderLastName[0]+' '+response.data.message.senderLastName2[0]);
                setReceiver(response.data.message.receiverFirstName[0]+' '+response.data.message.receiverMiddleName[0]+' '+response.data.message.receiverLastName[0]+' '+response.data.message.receiverLastName2[0]);
                */
        }
      })
      .catch((error) => {});
  };
  function ButtonFind() {
    if (buttonreject === true) {
      return (
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full"
          type="submit"
        >
          Next
        </button>
      );
    }
  }
  const submitProcess = async (event: any) => {
    event.preventDefault();
    Swal.fire({
      text: "Please wait...",
      showConfirmButton: false,
      timer: 5000,
      icon: "info",
    });
    const token = Cookies.get("token")?.toString();
    const plaintext = jwtDecode(token as string) as any;
    const params = {
      receiveCountry: "IDN",
      amount: amount,
      receiveCurrency: receiveCurrency,
      mgiSession: mgiSession,
      referenceNumber: refNumber,
      originatingCountry: originatingCountry,
      sender: sender,
      receiver: receiver,
    };
    if (typeof window !== "undefined") {
      console.log(params);
      sessionStorage.setItem("rcvgfpp", JSON.stringify(params));
      router.push(pathname + "/gfpp");
    }
  };
  return (
    <>
      <div className="px-5 col-12 py-5 card h-100 w-full">
        <div>
          <h2 className="text-3xl">Receive transactions</h2>
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
            <div key={index} className="card-body">
              <div className="row">
                <div className="col-md-4">
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

                  {parseInt(mgs.notOkForPickupReasonCode) !== 0 ? (
                    <div className="mt-3 mb-1">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        <div className="alert alert-danger">
                          {mgs.notOkForPickupReasonCode}{" "}
                          {mgs.notOkForPickupReasonDescription}
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="mt-3 mb-1">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        <div className="alert alert-danger">
                          <div>{alerts}</div>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
                <div className="col-md-4">
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

                <div className="col-md-4">
                  <label className="text-2xl mb-3">Transaction</label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Reference Number : {mgs.referenceNumber}
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status : {mgs.transactionStatus}
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Delivery option :{" "}
                    {mgs.deliveryOption.toString().replaceAll("_", " ")}
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Originating Country : {mgs.originatingCountry}
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Send Amount : {mgs.originalSendCurrency}{" "}
                    {Number(mgs.originalSendAmount).toLocaleString("id-ID", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Receive Amount : {mgs.receiveCurrency}{" "}
                    {Number(mgs.receiveAmount).toLocaleString("id-ID", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </label>
                </div>
              </div>
            </div>
          ))}

          <form onSubmit={submitProcess}>
            <div className="form-group px-3 mb-3">{ButtonFind()}</div>
          </form>
        </div>
      </div>
    </>
  );
}
