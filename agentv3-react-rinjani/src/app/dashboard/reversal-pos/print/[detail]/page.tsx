"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

import { Buffer } from "buffer";
import { encode, decode } from "js-base64";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

import { redirect } from "next/navigation";
export default function Print({ params }: { params: { detail: string } }) {
  const contentToPrint = useRef(null);
  const token = Cookies.get("token");
  const plaintext = jwtDecode(token as string) as any;
  const [dataReversal, setDataReversal] = useState<any[]>([]);
  const [cancelReason, setCancelReason] = useState("");
  const [dataq, setData] = useState<any[]>([]);
  const [datamg, setMg] = useState<any[]>([]);
  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });
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
      mgiTransactionSessionID: decode(params.detail),
      operatorName: plaintext.name,
    };

    const data_country = axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/detail-lookup`, parameter, {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
        },
      })

      .then((response) => {
        const array_empty: any[] = [];
        array_empty.push(response.data.message);

        setMg(array_empty);
      })
      .catch((error) => {});
  }, []);
  useEffect(() => {
    var parameter = {
      id: decode(params.detail),
    };
    const data_amend = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reversal-detail`,
        parameter,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )
      .then((response) => {
        console.log(response.data.reversal);
        const array_empty: any[] = [];
        array_empty.push(response.data.reversal);
        setDataReversal(array_empty);
        setCancelReason(response.data.reversal.cancel_reason);
      })
      .catch((error) => {});
  }, []);
  return (
    <div className="content-center text-center card col-md-6">
      <div className="card-body">
        {datamg.map((mgs, index) => (
          <div className="alert alert-danger">{mgs.transactionStatus}</div>
        ))}
        <button
          className="btn btn-success"
          onClick={() => {
            handlePrint(null, () => contentToPrint.current);
          }}
        >
          PRINT
        </button>

        {dataq.map((student, index) => (
          <>
            <div className="container  text-xs text-center">
              <div
                ref={contentToPrint}
                className="px-5 py-5 text-center text-xs"
              >
                PT MoneyGram Payments System Indonesia <br />
                <br />
                AGENT COPY
                <br />
                ARTHAPOS - JAKARTA - HQ CILANDAK
                <br />
                JL. CILANDAK TENGAH No.36,
                <br />
                KEC. CILANDAK
                <br />
                JAKARTA, 12430
                <br />
                +62-21 71794849
                <br />
                +62-8111757737 <br />
                {dataReversal.map((data_reversal, index) => (
                  <>
                    <br />
                    Date/Time :{" "}
                    {moment(new Date()).format("MMM, DD YYYY HH:mm:ss")}
                    <br />
                    Operator Name : {data_reversal.operator_name}
                    <br />
                    <br />
                    REFUND RECEIPT
                    <br />
                    <br />
                    The following transfer has been canceled
                    <br />
                    <br />
                    Transfer Date : {student.timestamp}
                    <br />
                    Cancel Date : {data_reversal.timestamp}
                    <br />
                    Reference : {student.no_referensi} <br />
                    Sender :{student.nama_pengirim}
                    <br />
                    Receiver :{student.nama_penerima}
                    <br />
                    Reason : {cancelReason.replaceAll("_", " ")} <br />
                    Refund Status : Yes <br />
                    Transfer Amount:{" "}
                    {Number(data_reversal.refund_face_amount).toLocaleString(
                      "id-ID",
                      { maximumFractionDigits: 2, minimumFractionDigits: 2 }
                    )}
                    <br />
                    Transfer Fees:{" "}
                    {Number(data_reversal.refund_fee_amount).toLocaleString(
                      "id-ID",
                      { maximumFractionDigits: 2, minimumFractionDigits: 2 }
                    )}
                    <br />
                    Total:{" "}
                    {Number(data_reversal.refund_total_amount).toLocaleString(
                      "id-ID",
                      { maximumFractionDigits: 2, minimumFractionDigits: 2 }
                    )}
                    <br />
                    <br />
                    Please return the total amount.
                    <br />
                    <br />
                    <br />
                    <br />
                    _________________________________
                    <br />
                    Signature
                    <br />
                    <br />
                    <br />
                    <br />
                    <div>
                      PT MoneyGram Payments System Indonesia <br />
                      CUSTOMER COPY
                      <br />
                      ARTHAPOS - JAKARTA - HQ CILANDAK
                      <br />
                      JL. CILANDAK TENGAH No.36,
                      <br />
                      KEC. CILANDAK
                      <br />
                      JAKARTA, 12430
                      <br />
                      +62-21 71794849
                      <br />
                      +62-8111757737 <br />
                      <br />
                      Operator Name : {data_reversal.operator_name}
                      <br />
                      <br />
                      REFUND RECEIPT
                      <br />
                      <br />
                      The following transfer has been canceled
                      <br />
                      <br />
                      Transfer Date :{student.created_at}
                      <br />
                      Cancel Date : {data_reversal.timestamp}
                      <br />
                      Reference : <br />
                      Sender :{student.nama_pengirim}
                      <br />
                      Receiver :{student.nama_penerima}
                      <br />
                      Reason : {cancelReason.replaceAll("_", " ")} <br />
                      Refund Status : Yes <br />
                      Transfer Amount:{" "}
                      {Number(data_reversal.refund_face_amount).toLocaleString(
                        "id-ID",
                        { maximumFractionDigits: 2, minimumFractionDigits: 2 }
                      )}
                      <br />
                      Transfer Fees:{" "}
                      {Number(data_reversal.refund_fee_amount).toLocaleString(
                        "id-ID",
                        { maximumFractionDigits: 2, minimumFractionDigits: 2 }
                      )}
                      <br />
                      Total:{" "}
                      {Number(data_reversal.refund_total_amount).toLocaleString(
                        "id-ID",
                        { maximumFractionDigits: 2, minimumFractionDigits: 2 }
                      )}
                      <br />
                      Total amount will be refunded.
                    </div>
                  </>
                ))}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
