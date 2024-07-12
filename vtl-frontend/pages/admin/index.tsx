import PageContainer from "@/components/container/PageContainer";
import AdminFullLayout from "@/layouts/admin/AdminFullLayout";
import { Box } from "@mui/material";
import { ReactElement } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import Home from "@/components/admin/Admin";
import OrderItemsChart from "@/components/admin/dashboard/OrderItemsChart";
import Dashboard from "@/components/admin/dashboard/Dashboard";
export default function AdminPage() {
  const { roleId } = useAppSelector((state) => state.profile);
  useEffect(() => {
    if (roleId !== 1) {
      window.location.href = "/admin/login";
    }
  }, [roleId]);
  return (
    <PageContainer title="Admin">
      <Box>
        {/* <AdminComponent />*/}
        <Dashboard />
      </Box>
    </PageContainer>
  );
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminFullLayout>{page}</AdminFullLayout>;
};
