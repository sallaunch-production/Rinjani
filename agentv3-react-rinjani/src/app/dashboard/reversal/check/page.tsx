"use client";
import axios from "axios";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import moment from 'moment';

import { Buffer } from "buffer";
import { encode, decode } from 'js-base64';


export default function ReversalCheck() {
    const [dataq, setData] = useState<any[]>([]);
    useEffect(() => {
    var params= { 
        status:0
     }
     const data_country = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/list-reversal`,params,{
         headers: {
           Authorization: 'Bearer ' + Cookies.get('token') //the token is a variable which holds the token
         }
        })
        
     .then((response) => {
        const array_empty: any[] = [];
        
         response.data.reversal.map((post: any)=>(
             array_empty.push(post)
           ));
         setData(array_empty);    
     })
     .catch((error) => {
         
     })
    }, []);
    return(
        <>
        <div className="px-5 py-5 content-center card">
            
            <div><h2 className="text-3xl">List of Reversal transactions</h2></div>
            
            <div className="mt-3 card-body relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                No Referensi
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Cancel Reason
                            </th>
                           
                            <th scope="col" className="px-6 py-3">
                                Created date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {dataq.map((student, index) => (
                        
                         <><tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {student.no_referensi}
                            </th>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {student.cancel_reason}
                            </th>
                            
                            <td className="px-6 py-4">
                            <p> { moment(new Date(student.created_at)).format("ddd, MMMM Do YYYY, HH:mm:ss A")}</p>
                            </td>
                            <td className="px-6 py-4">
                                <a href={'/dashboard/reversal/detail/'+ encode(student.mgisession, true)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View Detail</a>
                            </td>
                        </tr></>
                    ))}
                       
                       
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}