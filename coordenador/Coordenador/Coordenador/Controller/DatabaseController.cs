using Coordenador.Model;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;

namespace Coordenador.Controller
{
    public class DatabaseController
    {
        public MySqlConnection pool { get; set; }
        public DatabaseController()
        {
            this.pool = new MySqlConnection(
                string.Format("server={0};User Id={1};database={2}; password={3}",
                    Database.HOST, Database.USER, Database.DATABASE, Database.PASS)
            );
        }
        public List<MyModel> Get<MyModel>(string table, string and = "")
        {
            string sqlBuilder = string.Format("SELECT * FROM {0} WHERE 1=1 {1} order by id desc ",
                table, and);

            return this.Query<MyModel>(sqlBuilder);
        }
        public void insert<MyModel>(string table, MyModel param)
        {
            var loop = 0;
            string[] binds = new string[2];
            Type classType = param.GetType();
            foreach (var property in classType.GetProperties())
            {
                if (property.GetValue(param) != null)
                {
                    binds[0] += (loop != 0 ? ", " : " ") + property.Name;
                    binds[1] += (loop != 0 ? ", " : " ") + string.Format("'{0}'",
                        property.GetValue(param).GetType() == typeof(DateTime)
                        ? ((DateTime)property.GetValue(param)).ToString("yyyy-MM-dd H:mm:ss")
                        : property.GetValue(param));
                    loop++;
                }
            }
            string sqlBuilder = string.Format("INSERT INTO {0} ({1}) VALUES({2})", table, binds[0], binds[1]);
            this.exec(sqlBuilder);
        }
        public void update<MyModel>(string table, int id, MyModel param)
        {
            Type classType = param.GetType();
            var binds = "";
            var loop = 0;
            foreach (var property in classType.GetProperties())
            {
                if (property.GetValue(param) != null && property.Name != "id")
                {
                    binds += (loop != 0 ? ", " : " ") + string.Format(" {0} = '{1}'",
                        property.Name,
                        property.GetValue(param).GetType() == typeof(DateTime)
                        ? ((DateTime)property.GetValue(param)).ToString("yyyy-MM-dd H:mm:ss")
                        : property.GetValue(param));
                    loop++;
                }
            }
            string sqlBuilder = string.Format("UPDATE {0} SET {1} WHERE id = {2}", table, binds, id);
            this.exec(sqlBuilder);
        }

        public void updateSet3()
        {
            this.exec("update request set status=2 where status=0");
        }

        private List<MyModel> Query<MyModel>(string sql)
        {
            var list = new List<MyModel>();
            try
            {
                pool.Open();
                MySqlCommand comando = this.pool.CreateCommand();
                comando.CommandText = sql;
                comando.ExecuteNonQuery();
                DataTable dt = new DataTable();
                MySqlDataAdapter da = new MySqlDataAdapter(comando);
                da.Fill(dt);
                foreach (DataRow reader in dt.Rows)
                {
                    MyModel obj = Activator.CreateInstance<MyModel>();
                    Type classType = obj.GetType();
                    foreach (var property in classType.GetProperties())
                    {
                        if (reader[property.Name] != null && reader[property.Name] != DBNull.Value && property.Name != "password")
                        {
                            property.SetValue(obj, reader[property.Name], null);
                        }
                    }
                    list.Add(obj);
                }
            }
            catch (Exception e)
            {
                return list;
            }
            finally
            {
                pool.Close();
            }
            return list;
        }

        private void exec(string sqlBuilder)
        {
            try
            {
                pool.Open();
                MySqlCommand comando = this.pool.CreateCommand();
                comando.CommandText = sqlBuilder;
                comando.ExecuteNonQuery();
            }
            finally
            {
                pool.Close();
            }
        }

        private dynamic parse(string type, object value)
        {
            switch (type)
            {
                case "string":
                    return value.ToString();
                case "int32":
                    return int.Parse(value.ToString());
                case "Datetime":
                    return DateTime.Parse(value.ToString());
            }
            return null;
        }
    }
}
