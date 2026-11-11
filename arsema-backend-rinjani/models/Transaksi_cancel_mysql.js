const { sq2 } = require("../config/db");
const { DataTypes } = require("sequelize");

const Transaksi_cancel_mysql= sq2.define("transaksi_cancel", {
    no: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    id_transaksi :{
      type: DataTypes.STRING,
    },
    bsubanyak : {
      type: DataTypes.STRING,
    },
    nama_pengirim : {
      type: DataTypes.STRING,
    },
    nama_penerima : {
      type: DataTypes.STRING,
    },
    
    no_referensi : {
      type: DataTypes.STRING,
    },
    identitas : {
      type: DataTypes.STRING,
    },
    nomor_identitas : {
      type: DataTypes.STRING,
    },
    
    pekerjaan : {
      type: DataTypes.STRING,
    },
    tujuan_penggunaan_dana : {
      type: DataTypes.STRING,
    },
    id_pos : {
      type: DataTypes.STRING,
    },
    tanggal : {
      type: DataTypes.DATE,
    },
    deltawork : {
      type: DataTypes.STRING,
    },
    deltawork708 : {
      type: DataTypes.STRING,
    },
    provinsi : {
      type: DataTypes.STRING,
    },
    mgisession : {
      type: DataTypes.STRING,
    },
    sumber_dana : {
      type: DataTypes.TEXT,
    },
    tempat_lahir : {
      type: DataTypes.STRING,
    },
    kode_pos : {
      type: DataTypes.STRING,
    },
    jenis_kelamin : {
      type: DataTypes.STRING,
    },
    amount : {
      type: DataTypes.STRING,
    },
    pesan : {
      type: DataTypes.STRING,
    },
    timestamp : {
      type: DataTypes.STRING,
    },
    negara_penerima : {
      type: DataTypes.STRING,
    },
    photoidcountry : {
      type: DataTypes.STRING,
    },
    photoidstate : {
      type: DataTypes.STRING,
    },
    arsema_validation : {
      type: DataTypes.STRING,
    },
    status_cta : {
      type: DataTypes.STRING,
    },
    receive_amount : {
      type: DataTypes.STRING,
    },
    currency : {
      type: DataTypes.STRING,
    },
    foto_id : {
      type: DataTypes.STRING,
    },
    telpon_pengirim : {
      type: DataTypes.STRING,
    },
    tanggal_transaksi : {
      type: DataTypes.STRING,
    },
    sigue : {
      type: DataTypes.STRING,
    },
    alamat_pengirim : {
      type: DataTypes.STRING,
    },
    kota_pengirim : {
      type: DataTypes.STRING,
    },
    provinsi_pengirim : {
      type: DataTypes.STRING,
    },
    kode_pos_pengirim : {
      type: DataTypes.STRING,
    },
    opt_display : {
      type: DataTypes.STRING,
    },
    payout_currency : {
      type: DataTypes.STRING,
    },
    receive_agent_abb : {
      type: DataTypes.STRING,
    },
    receive_fee : {
      type: DataTypes.STRING,
    },
    receive_tax : {
      type: DataTypes.STRING,
    },
    
    exchange_rate : {
      type: DataTypes.STRING,
    },
    operator_name : {
      type: DataTypes.STRING,
    },
    refund_total_amount : {
      type: DataTypes.STRING,
    },
    cancel_date : {
      type: DataTypes.STRING,
    },
    cancel_reason : {
      type: DataTypes.STRING,
    },
    refund_face_amount : {
      type: DataTypes.STRING,
    },
    checker : {
      type: DataTypes.STRING,
    },
    approver : {
      type: DataTypes.STRING,
    },
    status : {
      type: DataTypes.STRING,
    },
    created_at : {
      type: DataTypes.DATE,
    },
    updated_at : {
      type: DataTypes.DATE,
    },
  });

  module.exports = Transaksi_cancel_mysql;