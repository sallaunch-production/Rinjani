"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import moment from "moment";
import { Buffer } from "buffer";
import { encode, decode } from "js-base64";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import PasswordStrengthBar from "react-password-strength-bar";

export default function ForgotPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfPassword, setNewPasswordConfirmation] = useState("");
  const [scoreNewConf, setScore] = useState(0);
  const [scoreNewPass, setScore2] = useState(0);
  const [expired, setExpired] = useState("");
  useEffect(() => {
    const tokens = Cookies.get("token")?.toString();
    const plaintext = jwtDecode(tokens ? tokens : "") as any;

    var params = {
      email: plaintext.email,
    };
    const data_country = axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/check-expired`, params, {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
        },
      })

      .then((response) => {
        const array_empty = [];

        if (response.data.status === "error") {
          setExpired(
            "Your password is expired. Please change password immediately"
          );
        }
      })
      .catch((error) => {});
  }, []);
  const changePass = async (event: any) => {
    event.preventDefault();
    const token = Cookies.get("token") as string;
    const plaintext = jwtDecode(token as string) as any;

    var params = { email: plaintext.email, password: oldPassword };

    //send data to server
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/signin`, params)
      .then(async (response) => {
        //set token on cookies
        if (response.data.auth === true) {
          if (oldPassword === newConfPassword) {
            Swal.fire("Password couln't same with existing password");
          } else if (newPassword !== newConfPassword) {
            Swal.fire("Password confirmation is not same with new password");
          } else if (newPassword.length < 8) {
            Swal.fire("Minimal password length is 8");
          } else if (newConfPassword.length < 8) {
            Swal.fire("Minimal password length is 8");
          } else if (scoreNewConf < 4 || scoreNewPass < 4) {
            Swal.fire("Minimal Password strengh is strong");
          } else {
            var params = { email: plaintext.email, password: newConfPassword };

            await axios
              .post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/changepass`,
                params,
                {
                  headers: {
                    Authorization: "Bearer " + token, //the token is a variable which holds the token
                  },
                }
              )
              .then((response) => {
                //set token on cookies
                if (response.data.auth === true) {
                  Swal.fire("Password changed successfully");
                }
              })
              .catch((error) => {
                Swal.fire(error);

                return false;

                //assign error to state "validation"
              });
          }
        }
      })
      .catch((error) => {
        Swal.fire("Wrong password. ");

        return false;

        //assign error to state "validation"
      });
  };

  return (
    <>
      <div className="px-5 py-5 card h-100 w-full">
        <h2 className="text-2xl mb-5 text-red-400"> {expired}</h2>
        <div>
          <h2 className="text-3xl px-5">Change Password</h2>
        </div>
        <form onSubmit={changePass}>
          <div className="mt-3 content-center card-body relative overflow-x-auto shadow-md sm:rounded-lg ">
            <div className="col-md-6">
              <div className="items-center border-t border-teal-500 py-2 pl-3 pt-3">
                <div className="form-group mb-3 mt-3">
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="password"
                    placeholder="Old Password"
                    aria-label="Old password"
                    onChange={(event) => setOldPassword(event.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3 mt-5">
                  <input
                    className="bg-gray-50 mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="password"
                    placeholder="New Password"
                    aria-label="New Password"
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                  />
                  <PasswordStrengthBar
                    password={newPassword}
                    onChangeScore={(score) => {
                      setScore2(score);
                    }}
                  />
                </div>
                <div className="form-group mb-3">
                  <input
                    className="bg-gray-50 mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="password"
                    placeholder="New Password Confirmation"
                    aria-label="New Password Confirmation"
                    onChange={(event) =>
                      setNewPasswordConfirmation(event.target.value)
                    }
                    required
                  />
                  <PasswordStrengthBar
                    password={newConfPassword}
                    onChangeScore={(score) => {
                      setScore(score);
                    }}
                  />
                </div>

                <button
                  className="mt-3 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
        <br />
      </div>
    </>
  );
}
