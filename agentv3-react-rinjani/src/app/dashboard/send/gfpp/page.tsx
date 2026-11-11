"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
export default function SendGFPP() {
  const [data, setData] = useState<any[]>([]);
  const [infoVal, setInfo] = useState({});
  const [country, setCountry] = useState<any[]>([]);
  const [province, setProvince] = useState<any[]>([]);
  const [senderState, setsenderState] = useState("");
  const [countryval, setCountryValue] = useState(null);
  const [countryofbirth, setcountryofBirth] = useState(null);
  const [citizenship, setCitizenship] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [rcvAddress, setrcvAddress] = useState("");
  const [rcvCity, setrcvCity] = useState("");
  const [question, setQuestion] = useState("");
  const [rcvZipCode, setrcvZipCode] = useState("");
  const [rcvCountry, setrcvCountry] = useState("");
  const [rcvState, setrcvState] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [occupation, setOccupation] = useState("");
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
  const [senderPhotoIdState, setsenderPhotoIdState] = useState("");
  const [senderPhotoIdCountry, setsenderPhotoIdCountry] = useState("");
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
  const [fieldValues, setFieldValues] = useState<any>([]);
  const router = useRouter();
  const pathname = usePathname();

  const changeHandler = async (e: any) => {
    const name = e.target.getAttribute("name");
    const value = e.target.value;
    //console.log(fieldValues);

    let newArray = fieldValues.filter((item: any) => !item.includes(name));

    setFieldValues(newArray);
    setFieldValues((fieldValues: any[]) => [
      ...fieldValues,
      name + "-" + value,
    ]);
    console.log(fieldValues);
  };
  function changeSenderCountry(country: any) {
    setCountryValue(country.value);
    console.log(country.value);
    if (
      country.value === "CAN" ||
      country.value === "IND" ||
      country.value === "IDN" ||
      country.value === "ITA" ||
      country.value === "MEX" ||
      country.value === "USA"
    ) {
      var params = {
        countryCode: country.value,
      };
      const data_province = axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/api/province-info`, params, {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        })

        .then((response) => {
          const array_country: any[] = [];
          response.data.province_info.map((post: any) =>
            array_country.push({
              value: post.stateProvinceCode,
              label: post.stateProvinceName,
            })
          );
          setProvince(array_country);
        })
        .catch((error) => {});
    } else {
      setProvince([]);
    }
  }
  function changeReceiverCountry(country: any) {
    setrcvCountry(country.value);
    console.log(country.value);
    if (
      country.value === "CAN" ||
      country.value === "IND" ||
      country.value === "IDN" ||
      country.value === "ITA" ||
      country.value === "MEX" ||
      country.value === "USA"
    ) {
      var params = {
        countryCode: country.value,
      };
      const data_province = axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/api/province-info`, params, {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        })

        .then((response) => {
          const array_country: any[] = [];
          response.data.province_info.map((post: any) =>
            array_country.push({
              value: post.stateProvinceCode,
              label: post.stateProvinceName,
            })
          );
          setProvince(array_country);
        })
        .catch((error) => {});
    } else {
      setProvince([]);
    }
  }
  function changeMailingCountry(country: any) {
    setMailingCountry(country.value);
    console.log(country.value);
    if (
      country.value === "CAN" ||
      country.value === "IND" ||
      country.value === "IDN" ||
      country.value === "ITA" ||
      country.value === "MEX" ||
      country.value === "USA"
    ) {
      var params = {
        countryCode: country.value,
      };
      const data_province = axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/api/province-info`, params, {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        })

        .then((response) => {
          const array_country: any[] = [];
          response.data.province_info.map((post: any) =>
            array_country.push({
              value: post.stateProvinceCode,
              label: post.stateProvinceName,
            })
          );
          setProvince(array_country);
        })
        .catch((error) => {});
    } else {
      setProvince([]);
    }
  }
  function changeSenderPhotoIdCountry(country: any) {
    setsenderPhotoIdCountry(country.value);
    console.log(country.value);
    if (
      country.value === "CAN" ||
      country.value === "IND" ||
      country.value === "IDN" ||
      country.value === "ITA" ||
      country.value === "MEX" ||
      country.value === "USA"
    ) {
      var params = {
        countryCode: country.value,
      };
      const data_province = axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/api/province-info`, params, {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        })

        .then((response) => {
          const array_country: any[] = [];
          response.data.province_info.map((post: any) =>
            array_country.push({
              value: post.stateProvinceCode,
              label: post.stateProvinceName,
            })
          );
          setProvince(array_country);
        })
        .catch((error) => {});
    } else {
      setProvince([]);
    }
  }
  const submitHandler = async (event: any) => {
    event.preventDefault();
    Swal.fire({
      text: "Please wait",
      showConfirmButton: false,
      timer: 5000,
      icon: "info",
    });
    const info = sessionStorage.getItem("gfpp")
      ? sessionStorage.getItem("gfpp")
      : null;
    const infojson = JSON.parse(info as string);
    const token = Cookies.get("token");
    const plaintext = jwtDecode(token as string) as any;
    var params: any = {};
    params = {
      operatorName: plaintext.name,
      amount: infojson.amount,
      destinationCountry: infojson.receiveCountry,
      deliveryOption: infojson.deliveryOption,
      receiveCurrency: infojson.receiveCurrency,
      senderFirstName: firstName,
      sending_fee: infojson.sending_fee,
      senderLastName: lastName,

      senderAddress: address,
      senderCity: city,

      senderZipCode: zipCode,
      senderCountry: countryval,
      senderHomePhone: phoneNumber,
      senderMailingAddress: mailingAddress,
      senderMailingCity: mailingCity,

      senderMailingZipCode: mailingZipCode,
      senderMailingCountry: mailingCountry,
      receiverFirstName: rcvFirstName,
      receiverLastName: rcvLastName,
      receiverAddress: rcvAddress,
      receiverCity: rcvCity,
      receiverZipCode: rcvZipCode,
      receiverCountry: rcvCountry,
      receiverPhone: rcvPhoneNumber,
      receiverPhoneCountryCode: rcvCountryCode,
      senderPhotoIdType: photoIdType,
      senderPhotoIdNumber: photoIdNumber,

      senderPhotoIdCountry: senderPhotoIdCountry,
      senderDOB: dateofBirth,
      senderOccupation: occupation,
      senderBirthCity: cityOfBirth,
      senderBirthCountry: "IDN",
      senderEmailAddress: emailAddress,
      sendCurrency: infojson.sendCurrency,
      consumerId: 0,
      senderNationalityCountry: countryval,
      mgiTransactionSessionID: infojson.mgiTransactionSessionID,
      receiveAgentID: infojson.receiveAgentID,
      opt_display: infojson.optDisplay,
      receive_abb_name: infojson.receiveAgentName,
      receiveAmount: infojson.receiveAmount,
      formFreeStaging: false,
      sendPurposeOfTransaction: sendPurpose,
      sourceOfFunds: sourceOfFunds,
      relationshipToReceiver: relationship,
      senderGender: gender,
      senderCitizenshipCountry: citizenship,
      senderTransactionEmailNotificationOptIn: false,
      senderTransactionSMSNotificationOptIn: false,
      senderMarketingEmailNotificationOptIn: false,
      senderMarketingSMSNotificationOptIn: false,
      senderHomePhoneCountryCode: phoneCountryCode,
      senderIntendedUseOfMGIServices: senderIntended,
      totalAmountToCollect: infojson.total_amount_to_collect,
      fieldValues: fieldValues,
    };
    console.log(params);
    if (accountNumber != "") {
      params.accountNumber = accountNumber;
    }
    if (middleName != "") {
      params.senderMiddleName = middleName;
    }
    if (lastName2 != "") {
      params.senderLastName2 = lastName2;
    }
    if (rcvMiddleName != "") {
      params.receiverMiddleName = rcvMiddleName;
    }
    if (rcvLastName2 != "") {
      params.receiverLastName2 = rcvLastName2;
    }
    if (senderState != "") {
      params.senderState = senderState;
    }
    if (senderMailingState != "") {
      params.senderMailingState = senderMailingState;
    }
    if (senderPhotoIdState != "") {
      params.senderPhotoIdState = senderPhotoIdState;
    }

    //send data to server
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/send-validation`, params, {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
        },
      })
      .then((response) => {
        const array_empty2: any[] = [];

        if (response.data.status === "error") {
          const abs = response.data.message.offendingField || "";
          Swal.fire({
            title: "Error!",
            text: response.data.message.errorString + " " + abs,
            icon: "error",
          });
        } else if (response.data.status === "success") {
          Swal.fire({
            title: "Success!",
            text: "Your transaction has been CREATED.",
            icon: "success",
          });
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              "validation",
              JSON.stringify(response.data.message)
            );
            sessionStorage.setItem("params", JSON.stringify(params));
          }
          router.push("/dashboard/send/commit");
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        //assign error to state "validation"
      });
  };
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 17);
  const [maxDateFormatted] = maxDate.toISOString().split("T");

  useEffect(() => {
    // Perform localStorage action

    const info = sessionStorage.getItem("gfpp")
      ? sessionStorage.getItem("gfpp")
      : null;
    const infojson = JSON.parse(info as any);
    setInfo(infojson);
    const array_empty2: any[] = [];
    const data_sendgfpp = axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/send-gfpp`, infojson, {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
        },
      })

      .then((response) => {
        response.data.message.productFieldInfo.map((post: any) =>
          array_empty2.push({
            visibility: post.visibility,
            xmlTag: post.xmlTag,
            enumerated: post.enumerated,
            dynamic: post.dynamic,
            fieldLabel: post.fieldLabel,
            enumeratedValues: post.enumeratedValues,
          })
        );

        setData(array_empty2);
      })
      .catch((error) => {});

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
            value: post.countrycode,
            label: post.countryname,
          })
        );
        setCountry(array_country);
      })
      .catch((error) => {});
  }, []);
  return (
    <form onSubmit={submitHandler}>
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
                  <h3 className="text-teal-600">Sender</h3>
                  <hr className="my-3"></hr>
                  <div className="form-group px-3 mb-3">
                    <div className="row">
                      <div className="col-6">
                        <label>First Name*</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          onChange={(event) => setFirstName(event.target.value)}
                        ></input>
                      </div>
                      <div className="col-6">
                        <label>Middle Name</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(event) =>
                            setMiddleName(event.target.value)
                          }
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <div className="row">
                      <div className="col-6">
                        <label>Last Name*</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(event) => setLastName(event.target.value)}
                          required
                        ></input>
                      </div>
                      <div className="col-6">
                        <label>Last Name2</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(event) => setLastName2(event.target.value)}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <div className="row">
                      <div className="col-4">
                        <label>C.Code*</label>
                        <input
                          type="number"
                          min={0}
                          maxLength={3}
                          className="form-control"
                          placeholder=""
                          onChange={(event) =>
                            setPhoneCountryCode(event.target.value)
                          }
                          required
                        ></input>
                      </div>
                      <div className="col-8">
                        <label>Phone number*</label>
                        <input
                          type="number"
                          min={0}
                          maxLength={14}
                          className="form-control"
                          onChange={(event) =>
                            setPhoneNumber(event.target.value)
                          }
                          required
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Country*</label>
                    <Select
                      defaultValue={selectedOption}
                      onChange={changeSenderCountry}
                      options={country}
                    />
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>State</label>
                    <Select
                      defaultValue={selectedOption}
                      onChange={(senderState) =>
                        setsenderState(senderState.value)
                      }
                      options={province}
                    />
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Address*</label>
                    <input
                      type="text"
                      onChange={(event) => setAddress(event.target.value)}
                      className="form-control"
                      required
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>City*</label>
                    <input
                      type="text"
                      onChange={(event) => setCity(event.target.value)}
                      className="form-control"
                      required
                    ></input>
                  </div>

                  <div className="form-group px-3 mb-3">
                    <label>Zip code*</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(event) => setZipCode(event.target.value)}
                      required
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Photo id type*</label>
                    <select
                      name="photo_id_type"
                      className="form-control"
                      onChange={(event) => setPhotoIdType(event.target.value)}
                      required
                    >
                      <option value="">Choose photo id type</option>
                      <option value={"GOV"}>eKTP</option>
                      <option value={"DRV"}>SIM</option>
                      <option value={"PAS"}>Passport</option>
                    </select>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Photo id number*</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(event) => setPhotoIdNumber(event.target.value)}
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Photo id country*</label>
                    <Select
                      defaultValue={selectedOption}
                      onChange={changeSenderPhotoIdCountry}
                      options={country}
                    />
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Photo id state</label>
                    <Select
                      defaultValue={selectedOption}
                      onChange={(senderPhotoIdState) =>
                        setsenderPhotoIdState(senderPhotoIdState.value)
                      }
                      options={province}
                    />
                  </div>

                  {data.map(function (person) {
                    if (person.xmlTag[0] === "senderOccupation") {
                      return (
                        <div className="form-group px-3 mb-3">
                          <label>{person.fieldLabel}*</label>

                          <select
                            className="form-control"
                            required
                            onChange={(event) =>
                              setOccupation(event.target.value)
                            }
                          >
                            <option value="">Choose occupation</option>
                            {person.enumeratedValues[0].enumeratedValueInfo.map(
                              (post: any) => (
                                <option value={post.value}>{post.label}</option>
                              )
                            )}
                          </select>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <div className="col-4 card">
                <div className="card-body px-auto">
                  <h3 className="text-teal-600">Sender</h3>
                  <hr className="my-3"></hr>

                  <div className="form-group px-3 mb-3">
                    <label>Country Of Birth*</label>
                    <Select
                      defaultValue={selectedOption}
                      onChange={(countryofbirth) =>
                        setcountryofBirth(countryofbirth.value)
                      }
                      options={country}
                    />
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>City of Birth*</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(event) => setCityofBirth(event.target.value)}
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Date of Birth*</label>

                    <input
                      type="date"
                      className="form-control"
                      onChange={(event) => setDateofBirth(event.target.value)}
                      required
                      max={maxDateFormatted}
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Gender*</label>
                    <select
                      className="form-control"
                      onChange={(event) => setGender(event.target.value)}
                      required
                    >
                      <option value="">Choose gender</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="MALE">MALE</option>
                    </select>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Mailing Country*</label>
                    <Select
                      defaultValue={selectedOption}
                      onChange={changeMailingCountry}
                      options={country}
                    />
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Mailing State</label>
                    <Select
                      defaultValue={selectedOption}
                      onChange={(senderState) =>
                        setSenderMailingState(senderState.value)
                      }
                      options={province}
                    />
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Mailing City*</label>
                    <input
                      type="text"
                      onChange={(event) => setMailingCity(event.target.value)}
                      className="form-control"
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Mailing Address*</label>
                    <input
                      type="text"
                      onChange={(event) =>
                        setMailingAddress(event.target.value)
                      }
                      className="form-control"
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Mailing Zip Code*</label>
                    <input
                      type="text"
                      onChange={(event) =>
                        setMailingZipCode(event.target.value)
                      }
                      className="form-control"
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Citizenship*</label>
                    <Select
                      defaultValue={selectedOption}
                      onChange={(citizenship) =>
                        setCitizenship(citizenship.value)
                      }
                      options={country}
                    />
                  </div>

                  {data.map(function (person) {
                    if (person.xmlTag[0] === "senderIntendedUseOfMGIServices") {
                      return (
                        <div className="form-group px-3 mb-3">
                          <label>{person.fieldLabel}*</label>

                          <select
                            className="form-control"
                            onChange={(event) =>
                              setSenderIntended(event.target.value)
                            }
                          >
                            <option value="">Choose</option>
                            {person.enumeratedValues[0].enumeratedValueInfo.map(
                              (post: any) => (
                                <option value={post.value}>{post.label}</option>
                              )
                            )}
                          </select>
                        </div>
                      );
                    }
                  })}

                  {data.map(function (person) {
                    if (person.xmlTag[0] === "relationshipToReceiver") {
                      return (
                        <div className="form-group px-3 mb-3">
                          <label>{person.fieldLabel}*</label>

                          <select
                            className="form-control"
                            required
                            onChange={(event) =>
                              setRelationship(event.target.value)
                            }
                          >
                            <option value="">
                              Choose Relationship to Receiver
                            </option>
                            {person.enumeratedValues[0].enumeratedValueInfo.map(
                              (post: any) => (
                                <option value={post.value}>{post.label}</option>
                              )
                            )}
                          </select>
                        </div>
                      );
                    }
                  })}

                  {data.map(function (person) {
                    if (person.xmlTag[0] === "sourceOfFunds") {
                      return (
                        <div className="form-group px-3 mb-3">
                          <label>{person.fieldLabel}*</label>

                          <select
                            className="form-control"
                            required
                            onChange={(event) =>
                              setSourceOfFunds(event.target.value)
                            }
                          >
                            <option value="">Choose source of funds</option>
                            {person.enumeratedValues[0].enumeratedValueInfo.map(
                              (post: any) => (
                                <option value={post.value}>{post.label}</option>
                              )
                            )}
                          </select>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <div className="col-4 card">
                <div className="card-body px-auto">
                  <h3 className="text-teal-600">Receiver</h3>
                  <hr className="my-3"></hr>
                  <div className="form-group px-3 mb-3">
                    <div className="row">
                      <div className="col-6">
                        <label>First Name*</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(event) =>
                            setRcvFirstName(event.target.value)
                          }
                          required
                        ></input>
                      </div>
                      <div className="col-6">
                        <label>Middle Name</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(event) =>
                            setRcvMiddleName(event.target.value)
                          }
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <div className="row">
                      <div className="col-6">
                        <label>Last Name*</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(event) =>
                            setRcvLastName(event.target.value)
                          }
                          required
                        ></input>
                      </div>
                      <div className="col-6">
                        <label>Last Name2</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(event) =>
                            setRcvLastName2(event.target.value)
                          }
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <div className="row">
                      <div className="col-12">
                        <label>Address</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(event) =>
                            setrcvAddress(event.target.value)
                          }
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <div className="row">
                      <div className="col-12">
                        <label>City</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(event) => setrcvCity(event.target.value)}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <div className="row">
                      <div className="col-12">
                        <label>Country</label>
                        <Select
                          defaultValue={selectedOption}
                          onChange={changeReceiverCountry}
                          options={country}
                        />
                        <br />
                        {province.length > 0 ? (
                          <>
                            <div className="col-12">
                              <label>State</label>
                            </div>
                            <Select
                              defaultValue={selectedOption}
                              onChange={(rcvState) =>
                                setrcvState(rcvState.value)
                              }
                              options={province}
                            />
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <div className="row">
                      <div className="col-12">
                        <label>Zip Code</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(event) =>
                            setrcvZipCode(event.target.value)
                          }
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <div className="row">
                      <div className="col-4">
                        <label>C.Code*</label>
                        <input
                          type="number"
                          onChange={(event) =>
                            setRcvCountryCode(event.target.value)
                          }
                          required
                          min={0}
                          maxLength={3}
                          className="form-control"
                        ></input>
                      </div>
                      <div className="col-8">
                        <label>Phone number*</label>
                        <input
                          type="number"
                          onChange={(event) =>
                            setRcvPhoneNumber(event.target.value)
                          }
                          min={0}
                          maxLength={14}
                          className="form-control"
                          required
                        ></input>
                      </div>
                    </div>
                  </div>
                  {data.map(function (person) {
                    if (person.xmlTag[0] === "sendPurposeOfTransaction") {
                      return (
                        <div className="form-group px-3 mb-3">
                          <label>{person.fieldLabel}*</label>

                          <select
                            className="form-control"
                            onChange={(event) =>
                              setSendPurpose(event.target.value)
                            }
                            required
                          >
                            <option value="">
                              Choose purpose of transaction
                            </option>
                            {person.enumeratedValues[0].enumeratedValueInfo.map(
                              (post: any) => (
                                <option value={post.value}>{post.label}</option>
                              )
                            )}
                          </select>
                        </div>
                      );
                    }
                  })}
                  <div className="form-group px-3 mb-3">
                    <label>Test Question</label>
                    <input
                      type="text"
                      onChange={(event) => setQuestion(event.target.value)}
                      className="form-control"
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Test Answer</label>
                    <input
                      type="text"
                      onChange={(event) => setAnswer(event.target.value)}
                      className="form-control"
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Message</label>
                    <input
                      type="text"
                      onChange={(event) => setMessage(event.target.value)}
                      className="form-control"
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Message2</label>
                    <input
                      type="text"
                      onChange={(event) => setMessage2(event.target.value)}
                      className="form-control"
                    ></input>
                  </div>

                  <div className="form-group px-3 mb-3">
                    <label>Sender email address</label>
                    <input
                      type="text"
                      onChange={(event) => setEmailAddress(event.target.value)}
                      className="form-control"
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>Email notification</label>
                    <br />
                    Transaction{" "}
                    <input
                      type="checkbox"
                      id="cb1"
                      name="senderTransactionEmailNotificationOptIn"
                      value="1"
                    ></input>{" "}
                    &nbsp;&nbsp;&nbsp; Marketing{" "}
                    <input
                      type="checkbox"
                      id="cb2"
                      name="senderMarketingEmailNotificationOptIn"
                      value="1"
                    ></input>
                  </div>
                  <div className="form-group px-3 mb-3">
                    <label>SMS Notification</label>
                    <br />
                    Transaction{" "}
                    <input
                      type="checkbox"
                      name="senderTransactionSMSNotificationOptIn"
                      value="1"
                    ></input>
                    &nbsp;&nbsp;&nbsp; Marketing{" "}
                    <input
                      type="checkbox"
                      name="senderMarketingSMSNotificationOptIn"
                      value="1"
                    ></input>
                  </div>
                  {
                    <div>
                      {data.map(function (person) {
                        if (
                          person.xmlTag[0] === "accountNumber" &&
                          person.visibility[0] === "REQ"
                        ) {
                          return (
                            <div className="form-group px-3 mb-3">
                              <label>{person.fieldLabel}</label>

                              <input
                                type="text"
                                onChange={(event) =>
                                  setAccountNumber(event.target.value)
                                }
                                className="form-control"
                                required
                              ></input>
                            </div>
                          );
                        }
                        if (
                          person.dynamic[0] === "true" &&
                          person.enumerated[0] === "false"
                        ) {
                          return (
                            <div className="form-group px-3 mb-3">
                              <label>{person.fieldLabel}</label>

                              <input
                                type="text"
                                className="form-control"
                                required
                                name={person.xmlTag}
                                onChange={changeHandler}
                              ></input>
                            </div>
                          );
                        } else if (
                          person.dynamic[0] === "true" &&
                          person.enumerated[0] === "true"
                        ) {
                          return (
                            <div className="form-group px-3 mb-3">
                              <label>{person.fieldLabel}</label>
                              <select
                                className="form-control"
                                name={person.xmlTag}
                                onChange={changeHandler}
                              >
                                <option value="">Choose</option>
                                {person.enumeratedValues[0].enumeratedValueInfo.map(
                                  (post: any) => (
                                    <option value={post.value}>
                                      {post.label}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          );
                        }
                      })}
                    </div>
                  }
                  <button
                    type="submit"
                    className="mt-4 border border-solid bg-blue-500 hover:bg-blue-700 text-white font-bold border-black py-2 px-4 rounded cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
