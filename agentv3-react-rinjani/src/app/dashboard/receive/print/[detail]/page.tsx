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
        `${process.env.NEXT_PUBLIC_API_URL}/api/detail-receive`,
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
                MONEYGRAM(R) RECEIVE
                <br />
                <br />
                Date/Time :{" "}
                {moment(new Date(student.created_at)).format(
                  "MMM, DD YYYY HH:mm:ss"
                )}
                <br />
                <br />
                Receiver Information
                <br />
                {student.nama_penerima} <br />
                {student.alamat_penerima} <br />
                Identity : {student.identitas} {student.nomor_identitas}
                <br />
                City : {student.kota_penerima}
                <br />
                State : {student.provinsi} <br />
                Zip Code : {student.kode_pos}
                <br />
                Phone : {student.telepon_penerima}
                <br />
                Purpose of transaction :{" "}
                {student.tujuan_penggunaan_dana.replaceAll("_", " ")} <br />
                Consumer Text : {student.consumer_text}
                <br />
                <br />
                Sender Information
                <br />
                {student.nama_pengirim}
                <br />
                Origination Country
                <br />
                {student.negara_pengirim}
                <br />
                <br />
                Message From Sender
                <br />
                {student.pesan}
                <br />
                <div>
                  Reference# &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  {student.no_referensi}
                  <br />
                  Pay to receiver &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  {Number(student.amount).toLocaleString("id-ID", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}{" "}
                  <br />
                  <br />
                  Receive &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; IDR{" "}
                  {Number(student.amount).toLocaleString("id-ID", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}{" "}
                  <br />
                  <br />
                </div>
                I acknowledge that I have received this transaction in the
                amount and in the form of currency as specifically identified
                above. I further acknowledge that this transaction is subject to
                MoneyGram's terms and conditions provided on the Receive Form
                used in connection with this transaction and issued with the
                receipt
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
                  MONEYGRAM(R) RECEIVE
                  <br />
                  <br />
                  Date/Time :{" "}
                  {moment(new Date(student.created_at)).format(
                    "MMM, DD YYYY HH:mm:ss"
                  )}
                  <br />
                  <br />
                  Receiver Information
                  <br />
                  {student.nama_penerima} <br />
                  {student.alamat_penerima} <br />
                  Identity : {student.identitas} {student.nomor_identitas}
                  <br />
                  City : {student.kota_penerima}
                  <br />
                  State : {student.provinsi} <br />
                  Zip Code : {student.kode_pos}
                  <br />
                  Phone : {student.telepon_penerima}
                  <br />
                  Purpose of transaction :{" "}
                  {student.tujuan_penggunaan_dana.replaceAll("_", " ")} <br />
                  Occupation : {student.pekerjaan}
                  <br />
                  Sender Information
                  <br />
                  {student.nama_pengirim}
                  <br />
                  Origination Country <br />
                  {student.negara_pengirim}
                  <br />
                  <br />
                  Message From Sender
                  <br />
                  {student.pesan}
                  <br />
                  <br />
                  <div>
                    Reference# &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {student.no_referensi}
                    <br />
                    Amount Received &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {Number(student.amount).toLocaleString("id-ID", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}{" "}
                    <br />
                    <br />
                    <br />
                    Received &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; IDR{" "}
                    {Number(student.amount).toLocaleString("id-ID", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}{" "}
                    <br />
                    <br />
                    <br />
                  </div>
                  <br />
                  <br />
                  This Transaction is subject to MoneyGram terms and condition
                  Please keep your MoneyGram stub/receipt should you to
                  reference it
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
