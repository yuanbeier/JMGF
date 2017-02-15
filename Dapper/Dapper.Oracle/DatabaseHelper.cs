using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace Dapper
{
	public class DatabaseHelper
	{
		public static bool TableCoulmnsSave(string tableName, System.Collections.Generic.Dictionary<string, object> coulmns, System.Collections.Generic.Dictionary<string, object> primaryKeys, OracleDapperOld db, DbTransaction t)
		{
			bool result;
			if (DatabaseHelper.TableUpdate(coulmns, primaryKeys, tableName, db, t))
			{
				result = true;
			}
			else
			{
				foreach (System.Collections.Generic.KeyValuePair<string, object> current in primaryKeys)
				{
					coulmns[current.Key] = current.Value;
				}
				result = DatabaseHelper.TableInsert(coulmns, tableName, db, t);
			}
			return result;
		}

		public static System.Collections.Generic.Dictionary<string, object> GetTableCoulmns(string tableName, System.Collections.Generic.List<string> coulmns, System.Collections.Generic.Dictionary<string, object> primaryKeys, OracleDapperOld db)
		{
			System.Collections.Generic.Dictionary<string, object> dictionary = new System.Collections.Generic.Dictionary<string, object>(System.StringComparer.OrdinalIgnoreCase);
			if (coulmns.Count > 0 && primaryKeys.Count > 0)
			{
				DbCommand dbCommand = db.CreateCommand();
				System.Text.StringBuilder stringBuilder = new System.Text.StringBuilder();
				stringBuilder.Append("SELECT ");
				int num = 0;
				foreach (string current in coulmns)
				{
					if (num > 0)
					{
						stringBuilder.Append(",");
					}
					stringBuilder.Append(current);
					num++;
				}
				stringBuilder.AppendFormat(" FROM {0} ", tableName);
				num = 0;
				foreach (System.Collections.Generic.KeyValuePair<string, object> current2 in primaryKeys)
				{
					stringBuilder.Append((num == 0) ? " WHERE " : " AND ");
					string text = db.ParameterToken + "p_" + current2.Key;
					stringBuilder.AppendFormat(" {0} = {1} ", current2.Key, text);
					db.AddInParameter(dbCommand, text, DatabaseHelper.ObjectToDbType(current2.Value), current2.Value);
					num++;
				}
				dbCommand.CommandText = stringBuilder.ToString();
				dbCommand.CommandType = CommandType.Text;
				using (IDataReader dataReader = db.ExecuteReader(dbCommand))
				{
					if (dataReader.Read())
					{
						for (int i = 0; i < dataReader.FieldCount; i++)
						{
							dictionary.Add(dataReader.GetName(i), dataReader[i]);
						}
					}
				}
			}
			return dictionary;
		}

		public static bool TableUpdate(System.Collections.Generic.Dictionary<string, object> coulmns, System.Collections.Generic.Dictionary<string, object> primaryKeys, string tableName, OracleDapperOld db, DbTransaction t)
		{
			bool result = false;
			if (coulmns != null && coulmns.Count > 0 && primaryKeys != null && primaryKeys.Count > 0)
			{
				System.Text.StringBuilder stringBuilder = new System.Text.StringBuilder();
				DbCommand dbCommand = db.CreateCommand();
				dbCommand.CommandType = CommandType.Text;
				stringBuilder.AppendFormat("Update {0} SET ", tableName);
				int num = 0;
				foreach (System.Collections.Generic.KeyValuePair<string, object> current in coulmns)
				{
					if (num > 0)
					{
						stringBuilder.Append(",");
					}
					string text = db.ParameterToken + "pu_" + current.Key;
					stringBuilder.AppendFormat(" {0} = {1}", current.Key, text);
					db.AddInParameter(dbCommand, text, DatabaseHelper.ObjectToDbType(current.Value), current.Value);
					num++;
				}
				num = 0;
				foreach (System.Collections.Generic.KeyValuePair<string, object> current in primaryKeys)
				{
					stringBuilder.Append((num == 0) ? " WHERE " : " AND ");
					string text = db.ParameterToken + "pw_" + current.Key;
					stringBuilder.AppendFormat(" {0} = {1} ", current.Key, text);
					db.AddInParameter(dbCommand, text, DatabaseHelper.ObjectToDbType(current.Value), current.Value);
					num++;
				}
				dbCommand.CommandText = stringBuilder.ToString();
				result = ((t == null) ? (db.ExecuteNonQuery(dbCommand) > 0) : (db.ExecuteNonQuery(dbCommand, t) > 0));
			}
			return result;
		}

		public static bool TableInsert(System.Collections.Generic.Dictionary<string, object> coulmns, string tableName, OracleDapperOld db, DbTransaction t)
		{
			bool result = false;
			if (coulmns != null && coulmns.Count > 0)
			{
				DbCommand dbCommand = db.CreateCommand();
				dbCommand.CommandType = CommandType.Text;
				System.Text.StringBuilder stringBuilder = new System.Text.StringBuilder();
				stringBuilder.AppendFormat("Insert INTO {0} (", tableName);
				int num = 0;
				foreach (string current in coulmns.Keys)
				{
					if (num > 0)
					{
						stringBuilder.Append(",");
					}
					stringBuilder.Append(current);
					num++;
				}
				stringBuilder.Append(" ) VALUES ( ");
				num = 0;
				foreach (System.Collections.Generic.KeyValuePair<string, object> current2 in coulmns)
				{
					if (num > 0)
					{
						stringBuilder.Append(",");
					}
					string text = db.ParameterToken + "p_" + current2.Key;
					stringBuilder.Append(text);
					db.AddInParameter(dbCommand, text, DatabaseHelper.ObjectToDbType(current2.Value), current2.Value);
					num++;
				}
				stringBuilder.Append(" )");
				dbCommand.CommandText = stringBuilder.ToString();
				result = ((t == null) ? (db.ExecuteNonQuery(dbCommand) > 0) : (db.ExecuteNonQuery(dbCommand, t) > 0));
			}
			return result;
		}

		public static DbType ObjectToDbType(object o)
		{
			DbType result = DbType.String;
			System.Type type = o.GetType();
			if (type == typeof(string))
			{
				result = DbType.String;
			}
			else if (type == typeof(int) || type == typeof(int?) || type.IsEnum)
			{
				result = DbType.Int32;
			}
			else if (type == typeof(System.Guid) || type == typeof(System.Guid?))
			{
				result = DbType.Guid;
			}
			else if (type == typeof(long) || type == typeof(long?))
			{
				result = DbType.Int64;
			}
			else if (type == typeof(System.DateTime) || type == typeof(System.DateTime?))
			{
				result = DbType.DateTime;
			}
			else if (type == typeof(decimal) || type == typeof(decimal?))
			{
				result = DbType.Decimal;
			}
			else if (type == typeof(float) || type == typeof(float?))
			{
				result = DbType.Single;
			}
			else if (type == typeof(double) || type == typeof(double?))
			{
				result = DbType.Double;
			}
			else if (type == typeof(byte[]))
			{
				result = DbType.Binary;
			}
			else if (type == typeof(short) || type == typeof(short?))
			{
				result = DbType.Int16;
			}
			else if (type == typeof(byte) || type == typeof(byte?))
			{
				result = DbType.Byte;
			}
			else if (type == typeof(sbyte) || type == typeof(sbyte?))
			{
				result = DbType.SByte;
			}
			else if (type == typeof(bool))
			{
				result = DbType.Boolean;
			}
			else if (type == typeof(ushort) || type == typeof(ushort?))
			{
				result = DbType.UInt16;
			}
			else if (type == typeof(uint) || type == typeof(uint?))
			{
				result = DbType.UInt32;
			}
			else if (type == typeof(ulong) || type == typeof(ulong?))
			{
				result = DbType.UInt64;
			}
			return result;
		}
	}
}
