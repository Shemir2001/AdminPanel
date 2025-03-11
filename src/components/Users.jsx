import React, { useEffect, useState } from "react";
import { firestore } from "./Firebase.js";
import { getDocs, collection } from "firebase/firestore";
import {
  Avatar,
  Box,
  CircularProgress,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import "./Load.css";

const User = () => {
  const [UsersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const FetchUserData = async () => {
    setLoading(true);
    const ref = await getDocs(collection(firestore, "Users"));
    const actualData = ref.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsersData(actualData);
    setFilteredData(actualData);
    setLoading(false);
  };

  const filterData = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    if (value === "") {
      setFilteredData(UsersData);
    } else {
      const filtered = UsersData.filter((user) =>
        user.firstName?.toLowerCase().includes(value)
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    FetchUserData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box className="w-full flex flex-col mt-4" padding={2}>
      {/* Search Box */}
      <Box mb={4}>
  <input
    type="text"
    placeholder="Search User..."
    value={search}
    onChange={filterData}
    style={{
      padding: '8px',
      border: '1px solid #666',
      borderRadius: '4px',
      backgroundColor: '#1f1838',
      color: 'white',
      width: '100%',
      outline: '2px solid transparent',
    }}
    sx={{
      '&:focus': {
        outline: '2px solid #352f4c',
        boxShadow: 'none',
      },
      '&::placeholder': {
        color: '#575b69',
      },
    }}
  />
</Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: "#1f1838" }}>
        <Table sx={{ borderCollapse: "collapse", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#352f4c",
                  color: "white",
                  fontWeight: "bold",
                  border: "1px solid #666",
                }}
              >
                Profile Picture
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#352f4c",
                  color: "white",
                  fontWeight: "bold",
                  border: "1px solid #666",
                }}
              >
                Name
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#352f4c",
                  color: "white",
                  fontWeight: "bold",
                  border: "1px solid #666",
                }}
              >
                Email
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#352f4c",
                  color: "white",
                  fontWeight: "bold",
                  border: "1px solid #666",
                }}
              >
                Phone Number
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((user) => (
              <TableRow key={user.id}>
                <TableCell
                  align="center"
                  sx={{ border: "1px solid #666", color: "white" }}
                >
                  <Avatar
                    src={user.profileImage || ""}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#ccc",
                      color: "#fff",
                      objectFit: "cover",
                    }}
                  >
                    {!user.profileImage && <FaUserCircle />}
                  </Avatar>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: "1px solid #666", color: "white" }}
                >
                  {user.firstName || "N/A"}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: "1px solid #666", color: "white" }}
                >
                  {user.email}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: "1px solid #666", color: "white" }}
                >
                  {user.phoneNumber || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default User;
