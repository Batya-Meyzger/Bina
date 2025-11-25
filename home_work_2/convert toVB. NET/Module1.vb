Imports System.Data.SqlClient
Imports System


Module Program
        Sub Main()
            Dim connectionString As String = "your-connection-string-here"

            Using conn As New SqlConnection(connectionString)
                conn.Open()

                Dim query As String = "SELECT Name FROM Employees WHERE City = 'Jerusalem'"

                Using cmd As New SqlCommand(query, conn)
                    Using reader As SqlDataReader = cmd.ExecuteReader()
                        While reader.Read()
                            Dim name As String = reader.GetString(0)
                            Console.WriteLine(name)
                        End While
                    End Using
                End Using
            End Using
        End Sub
    End Module


