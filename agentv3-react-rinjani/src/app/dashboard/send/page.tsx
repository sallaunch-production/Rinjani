"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";
export default function Send() {
  const [data, setData] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [country, setCountry] = useState("");
  const [countryName, setCountryName] = useState("");
  const [amount, setAmount] = useState("");
  const [sendtype, setSendType] = useState(null);
  const [promoCodeValues, setPromoCodeValues] = useState("");
  const [hiding, setHide] = useState("d-none");
  const [hiding_icon, setHideIcon] = useState("d-none");
  const [mgisession, setMgiSession] = useState("");
  const [disabledbutton, setDisabled] = useState("d-none");
  const router = useRouter();
  const pathname = usePathname();
  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMgiSession(e.target.value);

    setDisabled("");
    //onChange(e); // this fires the onChange handler (handleRadio) you passed in SearchItem
  };
  const sendHandler = async (event: any) => {
    if (mgisession === "" || mgisession === undefined) {
      alert("Please check the agent receiver name");
    }
    event.preventDefault();
    const countries = country.split("-");
    const mgisession_value = mgisession.split("-");
    const params = {
      receiveCountry: countries[0],
      deliveryOption: mgisession_value[1],
      amount: mgisession_value[4],
      receiveCurrency: mgisession_value[2],
      optDisplay: mgisession_value[6],
      receiveAgentName: mgisession_value[8],
      receiveAgentID: mgisession_value[7],
      sendCurrency: "IDR",
      receiveAmount: mgisession_value[3],
      sending_fee: mgisession_value[9],
      mgiTransactionSessionID: mgisession_value[0],
      total_amount_to_collect: mgisession_value[5],
    };
    if (typeof window !== "undefined") {
      sessionStorage.setItem("gfpp", JSON.stringify(params));
    }
    router.push(pathname + "/gfpp");
  };

  const submitHandler = async (event: any) => {
    event.preventDefault();
    setHide("d-none");
    setOptions([]);
    const countries = country.split("-");
    setCountryName(countries[1]);
    var params = {
      country: countries[0],
      amount: amount.replaceAll(",", ""),
      sendtype: sendtype,
      promoCodeValues: promoCodeValues,
    };
    Swal.fire({
      text: "Please wait...",
      showConfirmButton: false,
      timer: 5000,
      icon: "info",
    });
    //send data to server
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/send`, params, {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
        },
      })
      .then((response) => {
        const array_empty2: any[] = [];
        if (response.data.status === "success") {
          setHide("");

          response.data.message.feeInfo.map((post: any) =>
            array_empty2.push({
              receiveAgentName: post.receiveAgentName,
              deliveryOptDisplayName: post.deliveryOptDisplayName,
              deliveryOption: post.deliveryOption,
              validReceiveAmount: post.validReceiveAmount,
              validReceiveCurrency: post.validReceiveCurrency,
              validCurrencyIndicator: post.validCurrencyIndicator,
              validExchangeRate: post.validExchangeRate,
              estimatedExchangeRate: post.estimatedExchangeRate,
              mgiTransactionSessionID: post.mgiTransactionSessionID,
              sendAmounts: post.sendAmounts,
              receiveAmounts: post.receiveAmounts,
              receiveCountry: post.receiveCountry,
              totalAmountToCollect: post.totalAmountToCollect,
              receiveAgentID: post.receiveAgentID ?? "",
            })
          );
          setOptions(array_empty2);
        } else if (response.data.status === "error") {
          Swal.fire(
            response.data.message.errorString +
              " " +
              response.data.message.errorCode
          );
        }
      })
      .catch((error) => {
        console.log(error);
        //assign error to state "validation"
      });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
  };
  useEffect(() => {
    const token = Cookies.get("token");
    const plaintext = jwtDecode(token as string) as any;
    if (
      plaintext.roles.some(function (el: any) {
        return el.name !== "maker";
      })
    ) {
      redirect("/dashboard");
    }
    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/country-info`,
        {},
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        const array_empty: any[] = [];
        response.data.country_info.map((post: any) =>
          array_empty.push({ value: post.countrycode, label: post.countryname })
        );
        setData(array_empty);
      })
      .catch((error) => {});
  }, []);
  const [selectedOption, setSelectedOption] = useState(null);
  return (
    <>
      <div className="card mx-10 my-10">
        <div className="card-body">
          <h1 className="font-large text-teal-600 text-lg md:text-lg text-center">
            Send Transaction
          </h1>
          <hr className="text-teal-600"></hr>
          <div className="container mt-5">
            <form onSubmit={submitHandler}>
              <div className="row form-group border-b-2 mb-3 py-3 border-grey-100">
                <div className="col-4">
                  <label>Destination Country</label>
                </div>
                <div className="col-4">
                  <Select
                    defaultValue={selectedOption}
                    onChange={(country) =>
                      setCountry(country.value + "-" + country.label)
                    }
                    options={data}
                  />
                </div>
              </div>
              <div className="row form-group border-b-2 mb-3 py-3 border-grey-100">
                <div className="col-4">
                  <label>Amount</label>
                </div>
                <div className="col-4">
                  <NumericFormat
                    placeholder="0"
                    thousandSeparator
                    className="form-control"
                    onChange={(event: any) => setAmount(event.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row form-group border-b-2 mb-3 py-3 border-grey-100">
                <div className="col-4">
                  <label>Quote by</label>
                </div>
                <div className="col-8">
                  <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div className="flex items-center ps-3">
                        <input
                          id="horizontal-list-radio-license"
                          type="radio"
                          onChange={(event: any) =>
                            setSendType(event.target.value)
                          }
                          value="include"
                          name="list-radio"
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="horizontal-list-radio-license"
                          className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Include Fee{" "}
                        </label>
                      </div>
                    </li>
                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div className="flex items-center ps-3">
                        <input
                          id="horizontal-list-radio-id"
                          type="radio"
                          value="exclude"
                          onChange={(event: any) =>
                            setSendType(event.target.value)
                          }
                          name="list-radio"
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="horizontal-list-radio-id"
                          className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Exclude Fee
                        </label>
                      </div>
                    </li>
                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div className="flex items-center ps-3">
                        <input
                          id="horizontal-list-radio-military"
                          type="radio"
                          value="receive_amount"
                          onChange={(event: any) =>
                            setSendType(event.target.value)
                          }
                          name="list-radio"
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="horizontal-list-radio-military"
                          className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Receive Amount
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="row form-group border-b-2 mb-3 py-3 border-grey-100">
                <div className="col-4">
                  <label>Promo Code / Reward</label>
                </div>
                <div className="col-4">
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="row form-group border-b-2 mb-3 py-3 border-grey-100">
                <div className="col-4"></div>
                <div className="col-4">
                  <button className="btn btn-primary w-full">Submit</button>
                </div>
              </div>
            </form>
          </div>
          <div className={"container mt-5" + hiding}>
            <ul className="grid w-full gap-4 md:grid-cols-3">
              {options.map((post) => (
                <>
                  <li key={post.mgiTransactionSessionID}>
                    <div
                      style={{
                        marginBottom: "-50px",
                        zIndex: 20,
                        position: "relative",
                        float: "right",
                      }}
                      className={"py-3 " + hiding_icon}
                    >
                      <img src={"../images/check_mark.png"} width={48}></img>
                    </div>
                    <input
                      type="radio"
                      id={post.mgiTransactionSessionID}
                      name="package"
                      value={
                        post.mgiTransactionSessionID +
                        "-" +
                        post.deliveryOption +
                        "-" +
                        post.receiveAmounts[0].payoutCurrency +
                        "-" +
                        post.validReceiveAmount +
                        "-" +
                        post.sendAmounts[0].sendAmount +
                        "-" +
                        post.sendAmounts[0].totalAmountToCollect +
                        "-" +
                        post.deliveryOptDisplayName
                          .toString()
                          .replaceAll("-", "") +
                        "-" +
                        post.receiveAgentID +
                        "-" +
                        post.receiveAgentName +
                        "-" +
                        post.sendAmounts[0].totalSendFees
                      }
                      className="hidden peer"
                      onChange={handleChanges}
                    />

                    <label
                      htmlFor={post.mgiTransactionSessionID}
                      className="inline-flex items-center justify-between w-full p-5 text-gray-500 border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-red-500 peer-checked:border-red-600 peer-checked:text-white peer-checked:bg-red-600 hover:text-green-600 hover:border-red-400 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <div className="w-100">
                        <div className="w-full text-lg font-semibold">
                          Send To: {countryName}
                        </div>
                        <div className="w-full text-lg font-semibold">
                          {post.deliveryOptDisplayName}
                        </div>
                        <div className="w-full text-lg font-semibold">
                          {post.receiveAgentName ?? ""}
                        </div>
                        <div className="w-full">
                          <table className="table table-border">
                            <thead>
                              <tr>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <label className="italic">Send Amount</label>{" "}
                                  <br /> {post.sendAmounts[0].sendCurrency}{" "}
                                  {Number(
                                    post.sendAmounts[0].sendAmount
                                  ).toLocaleString("id-ID", {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2,
                                  })}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <label className="italic">
                                    Receive Amount
                                  </label>
                                  <br /> {post.receiveAmounts[0].payoutCurrency}{" "}
                                  {Number(
                                    post.receiveAmounts[0].totalReceiveAmount
                                  ).toLocaleString("id-ID", {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2,
                                  })}
                                  <br /> /
                                  {post.receiveAmounts[0]
                                    .validCurrencyIndicator[0] === "false"
                                    ? post.validReceiveCurrency +
                                      " " +
                                      Number(
                                        post.validReceiveAmount
                                      ).toLocaleString("id-ID", {
                                        maximumFractionDigits: 2,
                                        minimumFractionDigits: 2,
                                      })
                                    : ""}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <label className="italic">Fee</label> <br />{" "}
                                  {post.sendAmounts[0].sendCurrency}{" "}
                                  {Number(
                                    post.sendAmounts[0].totalSendFees
                                  ).toLocaleString("id-ID", {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2,
                                  })}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <label className="italic">
                                    Total Amount to Collect
                                  </label>{" "}
                                  <br />
                                  IDR{" "}
                                  {Number(
                                    post.sendAmounts[0].totalAmountToCollect
                                  ).toLocaleString("id-ID", {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2,
                                  })}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </label>
                  </li>
                </>
              ))}
            </ul>
            <div className="text-center">
              <button
                className={
                  "btn btn-success w-40 mt-3 text-center " + disabledbutton
                }
                onClick={sendHandler}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
