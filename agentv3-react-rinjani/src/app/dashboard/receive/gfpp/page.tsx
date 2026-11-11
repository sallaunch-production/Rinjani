"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
export default function ReceiveGFPP() {
  const [data, setData] = useState<any[]>([]);
  const [infoVal, setInfo] = useState({});
  const [country, setCountry] = useState<any[]>([]);
  const [province, setProvince] = useState<any[]>([]);
  const [receiverState, setreceiverState] = useState("");
  const [countryval, setCountryValue] = useState(null);
  const [countryofbirth, setcountryofBirth] = useState(null);
  const [citizenship, setCitizenship] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [refNumber, setRefNumber] = useState("");
  const [receiveCountry, setReceiveCountry] = useState("");
  const [receiver, setReceiver] = useState("");
  const [sender, setSender] = useState("");
  const [rcvCity, setrcvCity] = useState("");
  const [question, setQuestion] = useState("");
  const [receiveCurrency, setReceiveCurrency] = useState("");
  const [rcvZipCode, setrcvZipCode] = useState("");
  const [rcvCountry, setrcvCountry] = useState("");
  const [rcvState, setrcvState] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [occupation, setOccupation] = useState("");
  const [receiverMailingState, setreceiverMailingState] = useState("");
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
  const [originatingCountry, setoriginatingCountry] = useState("");
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [mgiSession, setMgiSession] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photoIdType, setPhotoIdType] = useState("");
  const [photoIdNumber, setPhotoIdNumber] = useState("");
  const [promoCodeValues, setPromoCodeValues] = useState("");
  const [receiverPhotoIdState, setreceiverPhotoIdState] = useState("");
  const [receiverPhotoIdCountry, setreceiverPhotoIdCountry] = useState("");
  const [rcvCountryCode, setRcvCountryCode] = useState("");
  const [rcvFirstName, setRcvFirstName] = useState("");
  const [rcvMiddleName, setRcvMiddleName] = useState("");
  const [rcvLastName, setRcvLastName] = useState("");
  const [rcvLastName2, setRcvLastName2] = useState("");
  const [rcvPhoneNumber, setRcvPhoneNumber] = useState("");
  const [relationship, setRelationship] = useState("");
  const [receiverIntended, setreceiverIntended] = useState("");
  const [sendPurpose, setSendPurpose] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [dateofBirth, setDateofBirth] = useState("");
  const [fieldValues, setFieldValues] = useState("");
  const [buttonretrieve, setButtonRetrieve] = useState(false);
  const [dataq, setDataReceive] = useState<any[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  function changereceiverCountry(country: any) {
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
  function changereceiverPhotoIdCountry(country: any) {
    setreceiverPhotoIdCountry(country.value);
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
      text: "Please wait...",
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
      sender: sender,
      receiver: receiver,
      operatorName: plaintext.name,
      referenceNumber: refNumber,
      receiveCurrency: receiveCurrency,
      agentCheckAmount: amount,
      receiverAddress: address,
      receiverCity: city,
      receiverZipCode: zipCode,
      receiverCountry: countryval,
      receiverHomePhone: phoneNumber,
      receiverMailingAddress: mailingAddress,
      receiverMailingCity: mailingCity,
      receiverMailingZipCode: mailingZipCode,
      receiverMailingCountry: mailingCountry,

      receiverPhotoIdType: photoIdType,
      receiverPhotoIdNumber: photoIdNumber,
      originatingCountry: originatingCountry,
      receiverPhotoIdCountry: receiverPhotoIdCountry,
      receiverDOB: dateofBirth,
      receiverOccupation: occupation,
      receiverBirthCountry: countryofbirth,
      receiverBirthCity: cityOfBirth,
      receiverPhone: phoneNumber,
      receiverPhoneCountryCode: phoneCountryCode,
      mgiTransactionSessionID: mgiSession,
      formFreestaging: false,
      consumerId: 0,
      receivePurposeOfTransaction: sendPurpose,
      relationshipToSender: relationship,
      receiverGender: gender,
      receiverCitizenshipCountry: citizenship,
      sourceOfFunds: sourceOfFunds,
      receiverIntendedUseOfMGIServices: receiverIntended,
      fieldValues: fieldValues,
    };
    console.log(params);
    if (accountNumber != "") {
      params.accountNumber = accountNumber;
    }

    if (receiverState != "") {
      params.receiverState = receiverState;
    }
    if (receiverMailingState != "") {
      params.receiverMailingState = receiverMailingState;
    }
    if (receiverPhotoIdState != "") {
      params.receiverPhotoIdState = receiverPhotoIdState;
    }

    //send data to server
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/receive-validation`,
        params,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )
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
              "rcvvalidation",
              JSON.stringify(response.data.message)
            );
            sessionStorage.setItem("rcvparams", JSON.stringify(params));
          }
          router.push("/dashboard/receive/commit");
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        //assign error to state "validation"
      });
  };

  useEffect(() => {
    // Perform localStorage action
    const info = sessionStorage.getItem("rcvgfpp")
      ? sessionStorage.getItem("rcvgfpp")
      : null;
    const infojson = JSON.parse(info as any);
    setAmount(infojson.amount);
    setReceiveCurrency(infojson.receiveCurrency);
    setRefNumber(infojson.referenceNumber);
    setReceiveCountry(infojson.receiveCountry);
    setoriginatingCountry(infojson.originatingCountry);
    setMgiSession(infojson.mgiSession);
    setInfo(infojson);
    setSender(infojson.sender);
    setReceiver(infojson.receiver);
    const array_empty2: any[] = [];
    const data_sendgfpp = axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/receive-gfpp`, infojson, {
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
    var parameters = {
      id: infojson.referenceNumber,
    };
    const receive_temps = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/detail-receive-temp`,
        parameters,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        if (response.data.transaction) {
          setButtonRetrieve(true);
        }
      })
      .catch((error) => {});
  }, []);

  const checkProcess = async (event: any) => {
    event.preventDefault();
    const token = Cookies.get("token");
    const plaintext = jwtDecode(token as string) as any;
    const info = sessionStorage.getItem("rcvgfpp")
      ? sessionStorage.getItem("rcvgfpp")
      : null;
    const infojson = JSON.parse(info as any);

    var parameter = {
      id: infojson.referenceNumber,
    };

    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/detail-receive-temp`,
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
        setDataReceive(array_empty);
        setPhoneNumber(response.data.transaction.telepon_penerima);
        setAddress(response.data.transaction.alamat_penerima);
        setCity(response.data.transaction.kota_penerima);
        setZipCode(response.data.transaction.kode_pos_penerima);
        setPhotoIdType(response.data.transaction.identitas);
        setPhotoIdNumber(response.data.transaction.nomor_identitas);
        setCityofBirth(response.data.transaction.kota_kelahiran);
        setDateofBirth(response.data.transaction.tanggal_lahir);
        setGender(response.data.transaction.jenis_kelamin);
        setMailingCity(response.data.transaction.kota_domisili_penerima);
        setMailingAddress(response.data.transaction.alamat_domisili_penerima);
        setMailingZipCode(response.data.transaction.kode_pos_domisili_penerima);
        setOccupation(response.data.transaction.pekerjaan);
        setRelationship(response.data.transaction.hubungan);
        setSendPurpose(response.data.transaction.tujuan_penggunaan_dana);
      })
      .catch((error) => {});
  };
  function buttonRetrieve() {
    if (buttonretrieve == true) {
      return (
        <div className="mx-10 mt-3 text-right">
          <button
            onClick={checkProcess}
            type="submit"
            className="border border-solid bg-green-500 hover:bg-green-700 text-white font-bold border-black py-2 px-4 rounded cursor-pointer"
          >
            Get Previous Data
          </button>
        </div>
      );
    }
  }
  return (
    <>
      <form onSubmit={submitHandler}>
        <div className="mx-10 my-10">
          <div className="h-dvh">
            <h1 className="font-large text-teal-600 text-lg md:text-lg text-center">
              Receive Transaction
            </h1>

            <hr className="text-teal-600"></hr>

            {buttonRetrieve()}

            <div className="container mt-3">
              <div className="row">
                <div className="col-4 card">
                  <div className="card-body px-auto">
                    <h3 className="text-teal-600">Receiver</h3>
                    <hr className="my-3"></hr>
                    <div className="form-group px-3 mb-3">
                      <div className="row">
                        <div className="col-12">
                          <label>Reference number</label>
                          <div className="mt-1 font-bold">{refNumber}</div>
                        </div>
                        <div className="col-12 mt-3">
                          <label>Sender</label>
                          <div className="mt-1 font-bold">{sender}</div>
                        </div>
                        <div className="col-12 mt-3">
                          <label>Receiver</label>
                          <div className="mt-1 font-bold">{receiver}</div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group px-3 mb-3">
                      <div className="row">
                        <div className="col-6">
                          <label>Amount</label>
                          <div className="mt-1 font-bold">
                            {receiveCurrency}{" "}
                            {Number(amount).toLocaleString("id-ID", {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group px-3 mb-3">
                      <div className="row">
                        <div className="col-12">
                          <label>Originating country</label>
                          <div className="mt-1 font-bold">
                            {originatingCountry}
                          </div>
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
                        onChange={changereceiverCountry}
                        options={country}
                      />
                    </div>
                    <div className="form-group px-3 mb-3">
                      <label>State</label>
                      <Select
                        defaultValue={selectedOption}
                        onChange={(receiverState) =>
                          setreceiverState(receiverState.value)
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
                  </div>
                </div>
                <div className="col-4 card">
                  <div className="card-body px-auto">
                    <h3 className="text-teal-600">Receiver</h3>
                    <hr className="my-3"></hr>
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
                        onChange={(event) =>
                          setPhotoIdNumber(event.target.value)
                        }
                      ></input>
                    </div>

                    <div className="form-group px-3 mb-3">
                      <label>Photo id country*</label>
                      <Select
                        defaultValue={selectedOption}
                        onChange={changereceiverPhotoIdCountry}
                        options={country}
                      />
                    </div>
                    <div className="form-group px-3 mb-3">
                      <label>Photo id state</label>
                      <Select
                        defaultValue={selectedOption}
                        onChange={(receiverPhotoIdState) =>
                          setreceiverPhotoIdState(receiverPhotoIdState.value)
                        }
                        options={province}
                      />
                    </div>
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
                  </div>
                </div>
                <div className="col-4 card">
                  <div className="card-body px-auto">
                    <h3 className="text-teal-600">Receiver</h3>
                    <hr className="my-3"></hr>
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
                        onChange={(receiverState) =>
                          setreceiverMailingState(receiverState.value)
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

                    {data.map(function (person) {
                      if (person.xmlTag[0] === "receiverOccupation") {
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
                      if (
                        person.xmlTag[0] === "receiverIntendedUseOfMGIServices"
                      ) {
                        return (
                          <div className="form-group px-3 mb-3">
                            <label>{person.fieldLabel}</label>

                            <select
                              className="form-control"
                              onChange={(event) =>
                                setreceiverIntended(event.target.value)
                              }
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

                    {data.map(function (person) {
                      if (person.xmlTag[0] === "relationshipToSender") {
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
                                Choose Relationship to Sender
                              </option>
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

                    {data.map(function (person) {
                      if (person.xmlTag[0] === "receivePurposeOfTransaction") {
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
                                  onChange={(event) =>
                                    setFieldValues(
                                      event.target.value +
                                        "-" +
                                        person.xmlTag[0]
                                    )
                                  }
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
                                  onChange={(event) =>
                                    setFieldValues(
                                      event.target.value +
                                        "-" +
                                        person.xmlTag[0]
                                    )
                                  }
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
      <br />
    </>
  );
}
