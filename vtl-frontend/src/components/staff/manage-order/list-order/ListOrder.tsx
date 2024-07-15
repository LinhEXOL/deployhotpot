/* eslint-disable react-hooks/exhaustive-deps */
import { useAppSelector } from "@/redux/hooks";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Chip, Paper } from "@mui/material";
import { socket } from "@/socket";
import useStaff from "@/controllers/useStaff";
import * as React from "react";
import Link from "next/link";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 30,
    renderCell: (params: GridRenderCellParams) => (
      <div style={{ cursor: "pointer" }}>
        <Link
          href={{
            pathname: "/staff/manage-order/update",
            query: { orderId: params.value },
          }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </Link>
      </div>
    ),
  },
  {
    field: "fullName",
    headerName: "Customer",
    width: 130,
    renderCell: (params: GridRenderCellParams) => (
      <div style={{ cursor: "pointer" }}>
        <Link
          href={{
            pathname: "/staff/manage-order/update",
            query: { orderId: params.row.id },
          }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </Link>
      </div>
    ),
  },
  {
    field: "phoneNumber",
    headerName: "Phone",
    width: 120,
    renderCell: (params: GridRenderCellParams) => (
      <div style={{ cursor: "pointer" }}>
        <Link
          href={{
            pathname: "/staff/manage-order/update",
            query: { orderId: params.row.id },
          }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </Link>
      </div>
    ),
  },
  {
    field: "resDate",
    headerName: "Reservation Date",
    width: 150,
    renderCell: (params: GridRenderCellParams) => (
      <div style={{ cursor: "pointer" }}>
        <Link
          href={{
            pathname: "/staff/manage-order/update",
            query: { orderId: params.row.id },
          }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </Link>
      </div>
    ),
  },
  {
    field: "resTime",
    headerName: "Reservation Time",
    width: 150,
    renderCell: (params: GridRenderCellParams) => (
      <div style={{ cursor: "pointer" }}>
        <Link
          href={{
            pathname: "/staff/manage-order/update",
            query: { orderId: params.row.id },
          }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </Link>
      </div>
    ),
  },
  {
    field: "people",
    headerName: "People",
    width: 60,
    renderCell: (params: GridRenderCellParams) => (
      <div style={{ cursor: "pointer" }}>
        <Link
          href={{
            pathname: "/staff/manage-order/update",
            query: { orderId: params.row.id },
          }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </Link>
      </div>
    ),
  },
  {
    field: "resStatus",
    headerName: "Reservation Status",
    width: 150,
    renderCell: (params: GridRenderCellParams) => (
      <div style={{ cursor: "pointer" }}>
        <Link
          href={{
            pathname: "/staff/manage-order/update",
            query: { orderId: params.row.id },
          }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Chip
            label={params.value}
            color={
              params.value === "pending"
                ? "primary"
                : params.value === "confirmed"
                ? "secondary"
                : params.value === "seated"
                ? "info"
                : params.value === "done"
                ? "success"
                : "default"
            }
          />
        </Link>
      </div>
    ),
  },
  {
    field: "depositAmount",
    headerName: "Deposit Amount",
    width: 150,
    renderCell: (params: GridRenderCellParams) => (
      <div style={{ cursor: "pointer" }}>
        <Link
          href={{
            pathname: "/staff/manage-order/update",
            query: { orderId: params.row.id },
          }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </Link>
      </div>
    ),
  },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    width: 150,
    renderCell: (params: GridRenderCellParams) => (
      <div style={{ cursor: "pointer" }}>
        <Link
          href={{
            pathname: "/staff/manage-order/update",
            query: { orderId: params.row.id },
          }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </Link>
      </div>
    ),
  },
];

type Order = {
  id: string;
  fullName: string;
  phoneNumber: string;
  resDate: string;
  resTime: string;
  people: number;
  resStatus: string;
  depositAmount: number;
  totalAmount: number;
};
const ListOrder = ({ filter }: { filter: string[] }) => {
  console.log("🚀 ~ ListOrder ~ filter:", filter);
  const { restaurantId } = useAppSelector((state) => state.profile);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const { getAllOrdersByRestaurantId } = useStaff();
  const fetchData = async () => {
    const response = await getAllOrdersByRestaurantId({
      restaurantId: restaurantId,
    });
    if (response.status !== 200) {
      return;
    }
    let tmp: Order[] = [];
    response.data.forEach((element: any) => {
      tmp.push({
        id: element.id,
        fullName: element.fullName,
        phoneNumber: element.phoneNumber,
        resDate: element.resDate,
        resTime: element.resTime,
        people: element.people,
        resStatus: element.resStatus,
        depositAmount: element.depositAmount,
        totalAmount: element.totalAmount,
      });
    });
    setOrders(
      tmp.filter((order) => {
        if (filter[0] === "all") {
          return true;
        }
        return filter.includes(order.resStatus);
      })
    );
  };
  React.useEffect(() => {
    fetchData();
  }, [restaurantId]);
  React.useEffect(() => {
    if (socket) {
      socket.on("update-order-list", (data) => {
        // Handle the update order list event here
        console.log("update-order-list", data);
        fetchData();
      });
      socket.on("payment-res", (data) => {
        console.log("🚀 ~ payment-res", data);
        if (data == "success") fetchData();
      });
    }

    // Clean up the effect by removing the event listener
    return () => {
      if (socket) {
        socket.off("update-order-list");
        socket.off("payment-res");
      }
    };
  }, [socket]);
  return (
    <Paper
      sx={{
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Box sx={{ maxHeight: 512, minHeight: 256 }}>
        {orders.length > 0 ? (
          <DataGrid
            rows={orders}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5]}
            //   rowsPerPageOptions={[10]}
            //   checkboxSelection

            disableRowSelectionOnClick={true}
          />
        ) : (
          <h1>No orders</h1>
        )}
      </Box>
    </Paper>
  );
};

export default ListOrder;
