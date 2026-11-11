"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter, usePathname, redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import moment from "moment-timezone";

export default function SendCommit() {
  const [infojson, setInfoJson] = useState<any[]>([]);

  const [data, setData] = useState([]);
  const [infoVal, setInfo] = useState({});
  const [country, setCountry] = useState<any[]>([]);
  const [countryval, setCountryValue] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [occupation, setOccupation] = useState("");
  const [senderState, setSenderState] = useState("");
  const [senderMailingState, setSenderMailingState] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [answer, setAnswer] = useState("");
  const [city, setCity] = useState("");
  const [cityOfBirth, setCityofBirth] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [gender, setGender] = useState("");
  const [mailingCountry, setMailingCountry] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [mailingCity, setMailingCity] = useState("");
  const [mailingZipCode, setMailingZipCode] = useState("");
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [mgiSession, setMgiSession] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photoIdType, setPhotoIdType] = useState("");
  const [photoIdNumber, setPhotoIdNumber] = useState("");
  const [promoCodeValues, setPromoCodeValues] = useState("");
  const [senderPhotoIdState, setSenderPhotoIdState] = useState("");
  const [rcvCountryCode, setRcvCountryCode] = useState("");
  const [rcvFirstName, setRcvFirstName] = useState("");
  const [rcvMiddleName, setRcvMiddleName] = useState("");
  const [rcvLastName, setRcvLastName] = useState("");
  const [rcvLastName2, setRcvLastName2] = useState("");
  const [rcvPhoneNumber, setRcvPhoneNumber] = useState("");
  const [relationship, setRelationship] = useState("");
  const [senderIntended, setSenderIntended] = useState("");
  const [sendPurpose, setSendPurpose] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [dateofBirth, setDateofBirth] = useState("");
  const [buttonSubmit, setButtonSubmit] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const [param_data, setParamData] = useState<any>({});
  useEffect(() => {
    const token = Cookies.get("token");
    const plaintext = jwtDecode(token as string) as any;

    const storedValue: string | null = sessionStorage.getItem("params");
    const valueData = storedValue ? JSON.parse(storedValue) : {};
    setParamData(valueData);
    const info = sessionStorage.getItem("validation")
      ? sessionStorage.getItem("validation")
      : null;
    const array_empty: any[] = [];
    array_empty.push(JSON.parse(info as any));
    setInfoJson(array_empty);
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
        const array_country: any[] = [];
        response.data.country_info.map((post: any) =>
          array_country.push({
            value: post.countryCode,
            label: post.countryName,
          })
        );
        setCountry(array_country);
      })
      .catch((error) => {});
  }, []);

  return (
    <>
      <form>
        <div className="mx-10 my-10">
          <div className="h-dvh">
            <h1 className="font-large text-teal-600 text-lg md:text-lg text-center">
              Send Transaction
            </h1>
            <hr className="text-teal-600"></hr>
            <div className="container mt-5">
              <div className="row">
                <div className="col-4 card">
                  <div className="card-body px-auto">
                    <h3 className="text-teal-600">Information</h3>
                    <hr className="my-3"></hr>
                    <div className="form-group px-3 mb-3">
                      <div className="row">
                        <div className="form-group px-3 mt-3">
                          <label>
                            <b>Destination Country</b>
                          </label>
                          <p>{param_data.destinationCountry}</p>
                        </div>
                        <div className="col-12 mt-3">
                          <label>
                            <b>Timestamp</b>
                          </label>
                          <p>
                            {" "}
                            {infojson.map((student, index) =>
                              moment
                                .tz(
                                  new Date(infojson[0].timeStamp),
                                  "Asia/Jakarta"
                                )
                                .format()
                            )}{" "}
                          </p>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12">
                          <label>
                            <b>Exchange Rate Applied</b>
                          </label>
                          <p>
                            {infojson.map(
                              (student, index) => student.exchangeRateApplied
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12">
                          <label>
                            <b>Receive Amount</b>
                          </label>
                          <p className="text-red-600">
                            {" "}
                            {infojson.map(
                              (student, index) =>
                                student.receiveAmounts[0].payoutCurrency[0]
                            )}{" "}
                            {infojson.map(
                              (student, index) =>
                                student.receiveAmounts[0].receiveAmount[0]
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12">
                          <label>
                            <b>Send Amount</b>
                          </label>
                          <p className="text-red-600 text-bold">
                            IDR{" "}
                            {infojson.map((student, index) =>
                              Number(
                                student.sendAmounts[0].sendAmount[0]
                              ).toLocaleString("id-ID", {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12">
                          <label>
                            <b>Total Send Fee</b>
                          </label>
                          <p className="text-red-600 text-bold">
                            IDR{" "}
                            {infojson.map((student, index) =>
                              Number(
                                student.sendAmounts[0].totalSendFees[0]
                              ).toLocaleString("id-ID", {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12">
                          <label>
                            <b>Total Amount to Collect</b>
                          </label>
                          <p className="text-red-600 text-bold">
                            IDR{" "}
                            {infojson.map((student, index) =>
                              Number(
                                student.sendAmounts[0].totalAmountToCollect[0]
                              ).toLocaleString("id-ID", {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4 card">
                  <div className="card-body px-auto">
                    <h3 className="text-teal-600">Sender</h3>
                    <hr className="my-3"></hr>

                    <div className="form-group px-3 mb-3">
                      <label>
                        <b>Full name</b>
                      </label>
                      <p>
                        {param_data.senderFirstName}{" "}
                        {param_data.senderMiddleName
                          ? param_data.senderMiddleName
                          : ""}{" "}
                        {param_data.senderLastName}{" "}
                        {param_data.senderLastName2
                          ? param_data.senderLastName2
                          : ""}{" "}
                      </p>
                    </div>
                    <div className="form-group px-3 mt-3">
                      <label>
                        <b>Address</b>
                      </label>
                      <p>
                        {param_data.senderAddress}{" "}
                        {param_data.senderCity ? param_data.senderCity : ""}{" "}
                        {param_data.senderZipCode} {param_data.senderCountry}{" "}
                      </p>
                    </div>
                    <div className="form-group px-3 mt-3">
                      <label>
                        <b>ID Number</b>
                      </label>
                      <p>
                        {param_data.senderPhotoIdType}{" "}
                        {param_data.senderPhotoIdNumber}
                      </p>
                    </div>
                    <div className="form-group px-3 mt-3">
                      <label>
                        <b>Phone Number</b>
                      </label>
                      <p>
                        {param_data.senderHomePhoneCountryCode}{" "}
                        {param_data.senderHomePhone}
                      </p>
                    </div>
                    <div className="form-group px-3 mt-3">
                      <label>
                        <b>Send purpose of transaction</b>
                      </label>
                      <p>{param_data.sendPurposeOfTransaction}</p>
                    </div>
                    <div className="form-group px-3 mt-3">
                      <label>
                        <b>Relationship to receiver</b>
                      </label>
                      <p>{param_data.relationshipToReceiver}</p>
                    </div>
                    <div className="form-group px-3 mt-3">
                      <label>
                        <b>Source of funds</b>
                      </label>
                      <p>
                        {param_data.sourceOfFunds
                          ? param_data.sourceOfFunds.replaceAll("_", " ")
                          : param_data.sourceOfFunds}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-4 card">
                  <div className="card-body px-auto">
                    <h3 className="text-teal-600">Receiver</h3>
                    <hr className="my-3"></hr>
                    <div className="form-group px-3 mb-3">
                      <label>
                        <b>Full name</b>
                      </label>
                      <p>
                        {param_data.receiverFirstName}{" "}
                        {param_data.receiverMiddleName
                          ? param_data.receiverMiddleName
                          : ""}{" "}
                        {param_data.receiverLastName}{" "}
                        {param_data.receiverLastName2
                          ? param_data.receiverLastName2
                          : ""}{" "}
                      </p>
                    </div>
                    <div className="form-group px-3 mt-3">
                      <label>
                        <b>Address</b>
                      </label>
                      <p>
                        {param_data.receiverAddress
                          ? param_data.receiverAddress
                          : "-"}
                      </p>
                    </div>

                    <div className="form-group px-3 mt-3">
                      <label>
                        <b>Phone Number</b>
                      </label>
                      <p>
                        {param_data.receiverPhoneCountryCode
                          ? param_data.receiverPhoneCountryCode
                          : "-"}{" "}
                        {param_data.receiverPhone
                          ? param_data.receiverPhone
                          : "-"}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
