namespace convert_to_c_
{

    using System;
    using System.Data.SqlClient;

    class Program
    {
        static void Main()
        {
            string connectionString = "your-connection-string-here";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                string query = "SELECT Name FROM Employees WHERE City = 'Jerusalem'";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string name = reader.GetString(0);
                        Console.WriteLine(name);
                    }
                }
            }
        }
    }



}
