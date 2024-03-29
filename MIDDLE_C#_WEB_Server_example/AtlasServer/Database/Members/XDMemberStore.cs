﻿using System;
using System.IO;
using System.Text;

using Newtonsoft.Json;

namespace Atlas.Database
{
    /// <summary>
    /// Организует доступ к таблице цен и остатков пользователя
    /// </summary>
    [Serializable]
    public class XDBMemberStore
    {
        /// <summary>
        /// Уникальный идентификатор.
        /// </summary>

        [JsonProperty("uid")]
        public long Uid { set; get; }


        /// <summary>
        /// Идентификатор пользователя - владельца информации
        /// </summary>
        [JsonProperty("member_uniq")]
        public string MemberUniq { set; get; }

        /// <summary>
        /// Идентификатор группы товаров, объединенных одним артикулом
        /// </summary>
        [JsonProperty("group_uniq")]
        public string GroupUniq { set; get; }

        /// <summary>
        /// Артикул товара в магазине
        /// </summary>
        [JsonProperty("article")]
        public string Article { set; get; }

        /// <summary>
        /// Единица валюты
        /// </summary>
        [JsonProperty("currency")]
        public string Currency { set; get; }

        /// <summary>
        /// Метод подсчета
        /// </summary>
        [JsonProperty("calculation")]
        public int Calculation { set; get; }

        /// <summary>
        /// Единицы измерения (1 - шт, 2 - м2)
        /// </summary>
        [JsonProperty("units")]
        public int Units { set; get; }

        /// <summary>
        /// Стоимость в валюте за единицу товара
        /// </summary>
        [JsonProperty("price")]
        public double Price { set; get; }

        /// <summary>
        /// Доступно единиц в магазине
        /// </summary>
        [JsonProperty("available")]
        public double Available { set; get; }

        /// <summary>
        /// Дата последнего обновления
        /// Если значение изменилось, требуется обновление всех данных.
        /// </summary>
        [JsonProperty("date_modified")]
        public long DateModified { set; get; }

        public XDBMemberStore()
        {
        }

        /// <summary>
        /// Десериализует данные из массива байт.
        /// </summary>
        /// <param name="bt_data"></param>
        /// <returns></returns>
        public static XDBMemberStore FromBytes(byte[] bt_data)
        {
            XDBMemberStore db_store = new XDBMemberStore();
            MemoryStream ms = new MemoryStream(bt_data);
            BinaryReader br = new BinaryReader(ms);

            try
            {
                db_store.Uid = br.ReadInt64();

                int len = br.ReadInt32();
                db_store.MemberUniq = Encoding.UTF8.GetString(br.ReadBytes(len));

                len = br.ReadInt32();
                db_store.GroupUniq = Encoding.UTF8.GetString(br.ReadBytes(len));

                len = br.ReadInt32();
                db_store.Article = Encoding.UTF8.GetString(br.ReadBytes(len));

                len = br.ReadInt32();
                db_store.Currency = Encoding.UTF8.GetString(br.ReadBytes(len));

                db_store.Calculation = br.ReadInt32();
                db_store.Units = br.ReadInt32();
                db_store.Price = br.ReadDouble();
                db_store.Available = br.ReadDouble();
                db_store.DateModified = br.ReadInt64();
            }
            catch (Exception ex)
            {
                
                db_store = null;
            }

            br.Close();
            ms.Close();
            return db_store;
        }

        /// <summary>
        /// Сериализует данные в массив байт.
        /// </summary>
        /// <param name="db_store"></param>
        /// <returns></returns>
        public static byte[] ToBytes(XDBMemberStore db_store)
        {
            MemoryStream ms = new MemoryStream();
            BinaryWriter bw = new BinaryWriter(ms);

            bw.Write(BitConverter.GetBytes((long)db_store.Uid));

            bw.Write(BitConverter.GetBytes((int)Encoding.UTF8.GetByteCount(db_store.MemberUniq)));
            bw.Write(Encoding.UTF8.GetBytes(db_store.MemberUniq));

            bw.Write(BitConverter.GetBytes((int)Encoding.UTF8.GetByteCount(db_store.GroupUniq)));
            bw.Write(Encoding.UTF8.GetBytes(db_store.GroupUniq));

            bw.Write(BitConverter.GetBytes((int)Encoding.UTF8.GetByteCount(db_store.Article)));
            bw.Write(Encoding.UTF8.GetBytes(db_store.Article));

            bw.Write(BitConverter.GetBytes((int)Encoding.UTF8.GetByteCount(db_store.Currency)));
            bw.Write(Encoding.UTF8.GetBytes(db_store.Currency));

            bw.Write(BitConverter.GetBytes((int)db_store.Calculation));
            bw.Write(BitConverter.GetBytes((int)db_store.Units));
            bw.Write(BitConverter.GetBytes((double)db_store.Price));
            bw.Write(BitConverter.GetBytes((double)db_store.Available));
            bw.Write(BitConverter.GetBytes((long)db_store.DateModified));

            byte[] bt_data = ms.ToArray();
            bw.Close();
            ms.Close();
            return bt_data;
        }

        /// <summary>
        /// Сравнивает два экземпляра класса
        /// </summary>
        /// <param name="db_store"></param>
        /// <returns></returns>
        public bool CompareTo(XDBMemberStore db_store)
        {
            if (db_store == null) return false;
            if (db_store.MemberUniq != MemberUniq) return false;
            if (db_store.GroupUniq != GroupUniq) return false;
            if (db_store.Available != Available) return false;
            if (db_store.Calculation != Calculation) return false;
            if (db_store.Units != Units) return false;
            if (db_store.Price != Price) return false;
            if (db_store.Currency != Currency) return false;
            return true;
        }
    }
}