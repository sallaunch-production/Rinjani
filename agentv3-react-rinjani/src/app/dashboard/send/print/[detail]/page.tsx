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
  const [dataq, setData] = useState<any[]>([]);
  const [datamg, setMg] = useState<any[]>([]);
  const [dataagent, setAgent] = useState<any[]>([]);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/detail-transaction-send`,
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

    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/detail-agentid`,
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
        setAgent(array_empty);
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
  return (
    <div className="content-center text-center card col-md-6">
      <div className="card-body">
        {datamg.map((mgs, index) => (
          <div className="alert alert-primary">{mgs.transactionStatus}</div>
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
                <br />
                {dataagent.map((agent, index) => (
                  <div>{agent.nama}</div>
                ))}
                <br />
                {dataagent.map((agent, index) => (
                  <div>{agent.alamat}</div>
                ))}
                <br />
                +62-21 71794849
                <br />
                +62-8111757737 <br />
                <br />
                Date/Time :{" "}
                {moment(new Date(student.created_at)).format(
                  "MMM, DD YYYY HH:mm:ss"
                )}
                <br />
                <br />
                Sender Information
                <br />
                {student.nama_pengirim} <br />
                {student.alamat_pengirim} <br />
                Identity : {student.identitas} {student.nomor_identitas}
                <br />
                City : {student.kota_pengirim}
                <br />
                State : {student.provinsi_pengirim} <br />
                Zip Code : {student.kode_pos_pengirim}
                <br />
                Phone : {student.telpon_pengirim}
                <br />
                Source of funds : {student.sumber_dana.replaceAll("_", " ")}
                <br />
                Purpose of transaction :{" "}
                {student.tujuan_penggunaan_dana.replaceAll("_", " ")} <br />
                Consumer Text : {student.consumer_text}
                <br />
                <br />
                Receiver Information
                <br />
                {student.nama_penerima}
                <br />
                Expected Destination : {student.negara_penerima}
                <br />
                Service Type : {student.opt_display} -{" "}
                {student.receive_abb_name === "undefined"
                  ? ""
                  : student.receive_abb_name + "-"}{" "}
                IDR
                <br />
                Account ID : {student.account_id}
                <br />
                <br />
                <br /> Promotion Code : {student.promotion_code}
                <br />
                <br />
                <b>Reference #{student.no_referensi}</b>
                <br />
                Expected date of delivery:
                {student.expected_date}
                <br />
                <br />
                <br />
                {datamg.map((mgs, index) => (
                  <div>
                    Send Amount: IDR {student.amount}
                    <br />
                    Send Fees: IDR {mgs.sendAmounts[0].totalSendFees} <br />
                    Promotion Discount: IDR{" "}
                    {mgs.sendAmounts[0].totalDiscountAmount}
                    <br />
                    Send Taxes: IDR {mgs.sendAmounts[0].totalSendTaxes}
                    <br />
                    <br />
                    Total: IDR {student.total_collect_amount} <br />
                    <br />
                    data promo not null Total Discount not to exceed fee amount{" "}
                    <br />
                    <br />
                    Exchange Rate: IDR 1 ={" "}
                    {mgs.receiveAmounts[0].payoutCurrency}{" "}
                    {mgs.exchangeRateApplied} <br />
                    Receive Amount:{mgs.receiveAmounts[0].payoutCurrency}{" "}
                    {mgs.receiveAmounts[0].receiveAmount} <br />
                    Other Fees: {mgs.receiveAmounts[0].payoutCurrency}{" "}
                    {mgs.receiveAmounts[0].totalReceiveFees} <br />
                    Other Taxes: {mgs.receiveAmounts[0].payoutCurrency}{" "}
                    {mgs.receiveAmounts[0].totalReceiveTaxes} <br />
                    Total to Recipient: {
                      mgs.receiveAmounts[0].payoutCurrency
                    }{" "}
                    {mgs.receiveAmounts[0].totalReceiveAmount}
                  </div>
                ))}
                <br />
                <br />
                I acknowledge that I have received and reviewed MoneyGram's
                consumer fraud warning and/or pre-transaction disclosure prior
                to the completion of my purchase of MoneyGram's money transfer
                services. All information provided by me and contained on any
                documentation issued in connection with my purchase of such
                services is accurate. I further acknowledge that this
                transaction is subject to MoneyGram's terms and conditions
                provided with this transaction and that I agree to these terms
                and conditions.
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
                <br />
                <br />
                <div>
                  PT MoneyGram Payments System Indonesia <br />
                  CUSTOMER COPY
                  <br /> <br />
                  {dataagent.map((agent, index) => (
                    <div>{agent.nama}</div>
                  ))}
                  <br />
                  {dataagent.map((agent, index) => (
                    <div>{agent.alamat}</div>
                  ))}
                  <br />
                  +62-21 71794849
                  <br />
                  +62-8111757737 <br />
                  <br />
                  Date/Time :{" "}
                  {moment(new Date(student.created_at)).format(
                    "MMM, DD YYYY HH:mm:ss"
                  )}
                  <br />
                  <br />
                  Sender Information
                  <br />
                  {student.nama_pengirim} <br />
                  {student.alamat_pengirim} <br />
                  Identity : {student.identitas} {student.nomor_identitas}
                  <br />
                  City : {student.kota_pengirim}
                  <br />
                  State : {student.provinsi_pengirim} <br />
                  Zip Code : {student.kode_pos_pengirim}
                  <br />
                  Phone : {student.telpon_pengirim}
                  <br />
                  Source of funds : {student.sumber_dana.replaceAll("_", " ")}
                  <br />
                  Purpose of transaction :{" "}
                  {student.tujuan_penggunaan_dana.replaceAll("_", " ")} <br />
                  Consumer Text : {student.consumer_text}
                  <br />
                  Dial : {student.dial}
                  <br />
                  Pin : {student.pin} <br />
                  Receiver Information
                  <br />
                  {student.nama_penerima}
                  <br />
                  Expected Destination : {student.negara_penerima}
                  <br />
                  Service Type : {student.opt_display} -{" "}
                  {student.receive_abb_name === "undefined"
                    ? ""
                    : student.receive_abb_name + "-"}{" "}
                  IDR
                  <br />
                  <br />
                  Promotion Code : {student.promotion_code}
                  <br />
                  <br />
                  {student.no_referensi}
                  <br />
                  Expected date of delivery:
                  {student.expected_date}
                  <br />
                  <br />
                  <br />
                  {datamg.map((mgs, index) => (
                    <div>
                      Send Amount: IDR {student.amount}
                      <br />
                      Send Fees: IDR {mgs.sendAmounts[0].totalSendFees} <br />
                      Promotion Discount: IDR{" "}
                      {mgs.sendAmounts[0].totalDiscountAmount}
                      <br />
                      Send Taxes: IDR {mgs.sendAmounts[0].totalSendTaxes}
                      <br />
                      <br />
                      Total: IDR {student.total_collect_amount} <br />
                      <br />
                      data promo not null Total Discount not to exceed fee
                      amount <br />
                      <br />
                      Exchange Rate: IDR 1 ={" "}
                      {mgs.receiveAmounts[0].payoutCurrency}{" "}
                      {mgs.exchangeRateApplied} <br />
                      Receive Amount:{mgs.receiveAmounts[0].payoutCurrency}{" "}
                      {mgs.receiveAmounts[0].receiveAmount} <br />
                      Other Fees: {mgs.receiveAmounts[0].payoutCurrency}{" "}
                      {mgs.receiveAmounts[0].totalReceiveFees} <br />
                      Other Taxes: {mgs.receiveAmounts[0].payoutCurrency}{" "}
                      {mgs.receiveAmounts[0].totalReceiveTaxes} <br />
                      Total to Recipient: {
                        mgs.receiveAmounts[0].payoutCurrency
                      }{" "}
                      {mgs.receiveAmounts[0].totalReceiveAmount}
                    </div>
                  ))}
                  <br />
                  <br />
                  Please visit www.moneygram.com to view your MoneyGram Plus
                  information Privacy Notice. Our Privacy Statement has not
                  changed in ways that require additional notice, and you may
                  review our Privacy Statement and practices with respect to
                  your personal information at www.moneygram.com/privacy-notice
                  or we will mail you a free copy upo request.
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
