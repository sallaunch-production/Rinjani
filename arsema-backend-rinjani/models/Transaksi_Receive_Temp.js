const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");

const Transaksi_receive_temp = sq.define("transaksi_receive_temp_clients", {
  no: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },

  id_transaksi: {
    type: DataTypes.STRING,
  },
  bsubanyak: {
    type: DataTypes.STRING,
  },
  nama_pengirim: {
    type: DataTypes.STRING,
  },
  nama_penerima: {
    type: DataTypes.STRING,
  },
  negara_pengirim: {
    type: DataTypes.STRING,
  },
  no_referensi: {
    type: DataTypes.STRING,
  },
  identitas: {
    type: DataTypes.STRING,
  },
  nomor_identitas: {
    type: DataTypes.STRING,
  },
  tanggal_lahir: {
    type: DataTypes.STRING,
  },
  hubungan: {
    type: DataTypes.STRING,
  },
  alamat_penerima: {
    type: DataTypes.STRING,
  },
  telepon_penerima: {
    type: DataTypes.STRING,
  },
  receiverIntendedUseOfMGIServices: {
    type: DataTypes.STRING,
  },
  kota_penerima: {
    type: DataTypes.STRING,
  },
  pekerjaan: {
    type: DataTypes.STRING,
  },
  kewarganegaraan: {
    type: DataTypes.STRING,
  },
  tujuan_penggunaan_dana: {
    type: DataTypes.STRING,
  },
  id_pos: {
    type: DataTypes.STRING,
  },
  tanggal: {
    type: DataTypes.DATE,
  },
  deltawork: {
    type: DataTypes.STRING,
  },
  deltawork708: {
    type: DataTypes.STRING,
  },
  provinsi: {
    type: DataTypes.STRING,
  },
  mgisession: {
    type: DataTypes.STRING,
  },
  sumber_dana: {
    type: DataTypes.TEXT,
  },
  tempat_lahir: {
    type: DataTypes.STRING,
  },
  kode_pos: {
    type: DataTypes.STRING,
  },
  kode_pos_penerima: {
    type: DataTypes.STRING,
  },
  jenis_kelamin: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.STRING,
  },
  pesan: {
    type: DataTypes.STRING,
  },
  timestamp: {
    type: DataTypes.STRING,
  },
  negara_penerima: {
    type: DataTypes.STRING,
  },
  photoidcountry: {
    type: DataTypes.STRING,
  },
  photoidstate: {
    type: DataTypes.STRING,
  },
  arsema_validation: {
    type: DataTypes.STRING,
  },
  status_cta: {
    type: DataTypes.STRING,
  },

  tanggal_transaksi: {
    type: DataTypes.STRING,
  },

  kota_kelahiran: {
    type: DataTypes.STRING,
  },

  alamat_domisili_penerima: {
    type: DataTypes.STRING,
  },
  kota_domisili_penerima: {
    type: DataTypes.STRING,
  },
  kode_pos_domisili_penerima: {
    type: DataTypes.STRING,
  },
  provinsi_domisili_penerima: {
    type: DataTypes.STRING,
  },
  negara_domisili_penerima: {
    type: DataTypes.STRING,
  },

  created_at: {
    type: DataTypes.DATE,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
  corporate: {
    type: DataTypes.STRING,
  },
  agent_id: {
    type: DataTypes.STRING,
  },
  maker: {
    type: DataTypes.STRING,
  },
  approver: {
    type: DataTypes.STRING,
  },
});
Transaksi_receive_temp.removeAttribute("id");
module.exports = Transaksi_receive_temp;
