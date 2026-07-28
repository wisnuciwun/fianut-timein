"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Heading, Table, Text } from "@chakra-ui/react";
import moment from "moment";
import DefaultHeader from "../../components/defaultheader";
import { api } from "../config/api";
import { req } from "../utils/req";
import { getToken } from "../utils/useToken";
import { getProfile } from "../utils/useProfile";

export default function Report() {
  const token = getToken();
  const profile = getProfile();
  const [rows, setRows] = useState([]);

  const loadReport = useCallback(async () => {
    const res = await req(`${api.report}?token=${token}`, "GET");
    if (res?.success) {
      setRows(res.data ?? []);
    }
  }, [token]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  if (profile?.user?.is_owner != 1) {
    return (
      <>
        <DefaultHeader />
        <Box mt={20} textAlign="center">
          <Text>Halaman ini hanya untuk pemilik instansi.</Text>
        </Box>
      </>
    );
  }

  return (
    <>
      <DefaultHeader />
      <Box mt={{ base: 10, md: 14 }} maxW="6xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <Box bg="white" shadow="md" borderRadius="lg" p={{ base: 6, md: 10 }}>
          <Heading fontSize="2xl" mb={6}>
            Laporan Absensi
          </Heading>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Nama</Table.ColumnHeader>
                <Table.ColumnHeader>Tanggal</Table.ColumnHeader>
                <Table.ColumnHeader>Masuk</Table.ColumnHeader>
                <Table.ColumnHeader>Pulang</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((row: any) => (
                <Table.Row key={row.id}>
                  <Table.Cell>{row.user?.name}</Table.Cell>
                  <Table.Cell>{moment(row.date).format("DD MMM YYYY")}</Table.Cell>
                  <Table.Cell>
                    {row.clock_in_at ? moment(row.clock_in_at).format("HH:mm") : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {row.clock_out_at ? moment(row.clock_out_at).format("HH:mm") : "-"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </>
  );
}
