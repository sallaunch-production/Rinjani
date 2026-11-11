"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { redirect } from "next/navigation";
export default function DemoPage() {
  const [dataq, setData] = useState<any[]>([]);
  const [dataqm, setDatam] = useState<any[]>([]);
  const [datareceive, setDatareceive] = useState<any[]>([]);
  const [datareceivem, setDatareceivem] = useState<any[]>([]);
  const token = Cookies.get("token");
  let plaintext = "" as any;
  if (token) {
    plaintext = jwtDecode(token as string) as any;
  }
  useEffect(() => {
    if (
      plaintext.roles.some(function (el: any) {
        return el.name !== "approver";
      })
    ) {
      redirect("/dashboard");
    }
    var params = {
      status: "",
    };
    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/list-transaction-agent`,
        params,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        const array_empty: any[] = [];

        response.data.map((post: any) => array_empty.push(post));

        setData(array_empty);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    var params = {
      status: "",
    };
    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/list-transaction-agent-month`,
        params,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        const array_empty: any[] = [];

        response.data.map((post: any) => array_empty.push(post));

        setDatam(array_empty);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    var params = {
      status: "",
    };
    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/list-transaction-rcv-agent`,
        params,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        const array_empty: any[] = [];

        response.data.map((post: any) => array_empty.push(post));

        setDatareceive(array_empty);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    var params = {
      status: "",
    };
    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/list-transaction-agent-rcv-month`,
        params,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        const array_empty: any[] = [];

        response.data.map((post: any) => array_empty.push(post));

        setDatareceivem(array_empty);
      })
      .catch((error) => {});
  }, []);

  return (
    <div className="card">
      <div className="container mx-auto card-body mt-3">
        <div className="row">
          <div className="col-lg-6">
            <h2 className="text-2xl">Send</h2>
            <div className="card">
              <div className="card-body">
                <h3>
                  Period: {new Date().getDate().toString()}{" "}
                  {new Date().toLocaleString("default", { month: "long" })}{" "}
                  {new Date().getFullYear().toString()}
                </h3>
                <br />
                <table className="table table-striped">
                  <tbody>
                    {dataq.map((data, index) => (
                      <tr>
                        <td>
                          <a href={"report-sends/today-" + data.agent_id}>
                            {data.nama.toString().toUpperCase()}
                          </a>
                        </td>
                        <td> {data.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <h3>
                  Period:{" "}
                  {new Date().toLocaleString("default", { month: "long" })}{" "}
                  {new Date().getFullYear()}
                </h3>
                <br />
                <table className="table table-striped">
                  <tbody>
                    {dataqm.map((data, index) => (
                      <tr>
                        <td>
                          <a href={"report-sends/month-" + data.agent_id}>
                            {data.nama.toString().toUpperCase()}
                          </a>
                        </td>
                        <td> {data.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <h2 className="text-2xl">Receive</h2>
            <div className="card">
              <div className="card-body">
                <h3>
                  Period: {new Date().getDate().toString()}{" "}
                  {new Date().toLocaleString("default", { month: "long" })}{" "}
                  {new Date().getFullYear().toString()}
                </h3>
                <br />
                <table className="table table-striped">
                  <tbody>
                    {datareceive.map((data, index) => (
                      <tr>
                        <td>
                          <a href={"report-receives/today-" + data.agent_id}>
                            {data.nama.toString().toUpperCase()}
                          </a>
                        </td>
                        <td> {data.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <h3>
                  Period:{" "}
                  {new Date().toLocaleString("default", { month: "long" })}{" "}
                  {new Date().getFullYear()}
                </h3>
                <br />
                <table className="table table-striped">
                  <tbody>
                    {datareceivem.map((data, index) => (
                      <tr>
                        <td>
                          <a href={"report-receives/month-" + data.agent_id}>
                            {data.nama.toString().toUpperCase()}
                          </a>
                        </td>
                        <td> {data.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
