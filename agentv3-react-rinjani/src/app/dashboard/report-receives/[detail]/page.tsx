"use client";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import ExcelJS from "exceljs";
export default function Page({ params }: { params: { detail: string } }) {
  const [dataq, setData] = useState<any[]>([]);
  const [period, setPeriod] = useState("");
  useEffect(() => {
    const token = Cookies.get("token");
    const plaintext = jwtDecode(token as string) as any;
    if (
      plaintext.roles.some(function (el: any) {
        return el.name !== "approver";
      })
    ) {
      redirect("/dashboard");
    }
    var paramsa = {
      status: "1",
    };
    const isi_detail = params.detail.split("-");
    if (isi_detail[0] === "today") {
      paramsa = {
        status: "2",
      };
      const period =
        new Date().getDate() +
        " " +
        new Date().toLocaleString("default", { month: "long" }) +
        " " +
        new Date().getFullYear();
      setPeriod(period);
    } else if (isi_detail[0] === "month") {
      paramsa = {
        status: "1",
      };
      const period =
        new Date().toLocaleString("default", { month: "long" }) +
        " " +
        new Date().getFullYear();
      setPeriod(period);
    }
    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/list-transaction-rcv-ok`,
        params,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        const array_empty: any[] = [];

        response.data.transaksi_send_temp.map((post: any) =>
          array_empty.push(post)
        );
        setData(array_empty);
      })
      .catch((error) => {});
  }, []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = Cookies.get("token");
    const plaintext = jwtDecode(token as string) as any;
    if (
      plaintext.roles.some(function (el: any) {
        return el.name !== "approver";
      })
    ) {
      redirect("/dashboard");
    }
    var paramsa = {
      status: "1",
    };
    const isi_detail = params.detail.split("-");
    if (isi_detail[0] === "today") {
      paramsa = {
        status: "2",
      };
      const period =
        new Date().getDate() +
        " " +
        new Date().toLocaleString("default", { month: "long" }) +
        " " +
        new Date().getFullYear();
      setPeriod(period);
    } else if (isi_detail[0] === "month") {
      paramsa = {
        status: "1",
      };
      const period =
        new Date().toLocaleString("default", { month: "long" }) +
        " " +
        new Date().getFullYear();
      setPeriod(period);
    }
    const data_country = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/list-transaction-rcv-ok`,
        params,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"), //the token is a variable which holds the token
          },
        }
      )

      .then((response) => {
        const array_empty: any[] = [];

        response.data.transaksi_send_temp.map((post: any) =>
          array_empty.push(post)
        );
        setData(array_empty);
      })
      .catch((error) => {});
  }, []);

  const onGetExporProduct = async (title?: string, worksheetname?: string) => {
    try {
      setLoading(true);
      // Check if the action result contains data and if it's an array
      if (dataq && Array.isArray(dataq)) {
        // Input validation and sanitization
        const maxRows = 10000; // Limit export size to prevent performance issues
        const sanitizedData = dataq.slice(0, maxRows).map((pro: any) => ({
          "Nama Pengirim": String(pro.nama_pengirim || "").substring(0, 255),
          "Nama Penerima": String(pro.nama_penerima || "").substring(0, 255),
          Amount: pro.amount || 0,
          "No. Referensi": String(pro.no_referensi || "").substring(0, 100),
          Identitas: String(pro.identitas || "").substring(0, 50),
          "No. Identitas": String(pro.nomor_identitas || "").substring(0, 50),
          "Tanggal Lahir": String(pro.tanggal_lahir || "").substring(0, 50),
          "Tempat Lahir": String(pro.tempat_lahir || "").substring(0, 100),
          Hubungan: String(pro.hubungan_pengirim || "").substring(0, 100),
          Pekerjaan: String(pro.pekerjaan || "").substring(0, 100),
          "Tujuan Penggunaan Dana": String(
            pro.tujuan_penggunaan_dana || ""
          ).substring(0, 255),
          "Kode Pos": String(pro.kode_pos || "").substring(0, 20),
          "Jenis Kelamin": String(pro.jenis_kelamin || "").substring(0, 20),
          "Negara Asal": String(pro.negara_pengirim || "").substring(0, 100),
          "Negara Penerbit ID": String(pro.photoidcountry || "").substring(
            0,
            100
          ),
          "Alamat Penerima": String(pro.alamat_penerima || "").substring(
            0,
            255
          ),
          "Telepon Penerima": String(pro.telepon_penerima || "").substring(
            0,
            50
          ),
          "Kota Penerima": String(pro.kota_penerima || "").substring(0, 100),
          "Alamat Domisili": String(
            pro.alamat_domisili_penerima || ""
          ).substring(0, 255),
          "Kota Domisili": String(pro.kota_domisili_penerima || "").substring(
            0,
            100
          ),
          "Kode Domisili": String(
            pro.kode_pos_domisili_penerima || ""
          ).substring(0, 20),
          "Provinsi Domisili": String(
            pro.provinsi_domisili_penerima || ""
          ).substring(0, 100),
        }));

        // Create Excel workbook and worksheet using ExcelJS
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(worksheetname || "Sheet1");

        // Add headers
        const headers = Object.keys(sanitizedData[0] || {});
        worksheet.addRow(headers);

        // Add data rows
        sanitizedData.forEach((row) => {
          worksheet.addRow(Object.values(row));
        });

        // Style the header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE0E0E0" },
        };

        // Auto-fit columns
        worksheet.columns.forEach((column: any) => {
          column.width = Math.min(
            Math.max(column.header?.length || 10, 10),
            50
          );
        });

        // Generate Excel file buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Create download link
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log(`Exported data to ${title}.xlsx`);
        setLoading(false);
      } else {
        setLoading(false);
        console.log("#==================Export Error: No data to export");
      }
    } catch (error: any) {
      setLoading(false);
      console.log("#==================Export Error", error.message);

      // Fallback to CSV export if ExcelJS fails
      try {
        const csvData = dataq.map((pro: any) => ({
          "Nama Pengirim": pro.nama_pengirim,
          "Nama Penerima": pro.nama_penerima,
          Amount: pro.amount,
          "No. Referensi": pro.no_referensi,
          Identitas: pro.identitas,
          "No. Identitas": pro.nomor_identitas,
          "Tanggal Lahir": pro.tanggal_lahir,
          "Tempat Lahir": pro.tempat_lahir,
          Hubungan: pro.hubungan_pengirim,
          Pekerjaan: pro.pekerjaan,
          "Tujuan Penggunaan Dana": pro.tujuan_penggunaan_dana,
          "Kode Pos": pro.kode_pos,
          "Jenis Kelamin": pro.jenis_kelamin,
          "Negara Asal": pro.negara_pengirim,
          "Negara Penerbit ID": pro.photoidcountry,
          "Alamat Penerima": pro.alamat_penerima,
          "Telepon Penerima": pro.telepon_penerima,
          "Kota Penerima": pro.kota_penerima,
          "Alamat Domisili": pro.alamat_domisili_penerima,
          "Kota Domisili": pro.kota_domisili_penerima,
          "Kode Domisili": pro.kode_pos_domisili_penerima,
          "Provinsi Domisili": pro.provinsi_domisili_penerima,
        }));

        const csv = [
          Object.keys(csvData[0] || {}).join(","),
          ...csvData.map((row) =>
            Object.values(row)
              .map((val) => `"${String(val).replace(/"/g, '""')}"`)
              .join(",")
          ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log(`Fallback: Exported data to ${title}.csv`);
      } catch (csvError: any) {
        console.log("#==================CSV Export Error", csvError.message);
      }
    }
  };
  return (
    <div className="card">
      <div className="card-body">
        <button
          onClick={() => onGetExporProduct("Receive - " + period, "Receiev")}
          className="w-40 ml-5 mt-3 mb-3 btn btn-success px-3 text-white transition hover:bg-red-800"
        >
          <span className="relative">{loading ? "Loading..." : "Export"}</span>
        </button>
        <h2 className="text-2xl mt-3">List All Receive Transactions</h2>
      </div>
      <div className="container mx-auto">
        <h3>Period: {period}</h3>
        <DataTable columns={columns} data={dataq} />
      </div>
    </div>
  );
}
