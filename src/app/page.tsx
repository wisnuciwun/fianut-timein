"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge, Box, Button, Heading, Table } from "@chakra-ui/react";
import moment from "moment";
import DefaultHeader from "../components/defaultheader";
import { Toaster, toaster } from "../components/ui/toaster";
import { api } from "./config/api";
import { req } from "./utils/req";
import { getToken } from "./utils/useToken";

export default function Home() {
  const token = getToken();
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadToday = useCallback(async () => {
    const res = await req(`${api.today}?token=${token}`, "GET");
    if (res?.success) {
      setToday(res.data);
    }
  }, [token]);

  const loadHistory = useCallback(async () => {
    const res = await req(`${api.history}?token=${token}`, "GET");
    if (res?.success) {
      setHistory(res.data?.data ?? []);
    }
  }, [token]);

  useEffect(() => {
    loadToday();
    loadHistory();
  }, [loadToday, loadHistory]);

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const res = await req(api.clockIn, "POST", { token });
      if (res?.success) {
        toaster.create({ description: res.message, type: "success", duration: 4000 });
        loadToday();
        loadHistory();
      } else {
        toaster.create({ description: res?.message, type: "error", duration: 4000 });
      }
    } catch (err) {
      toaster.create({ description: "Gagal memproses absensi. Silakan coba lagi.", type: "error", duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const res = await req(api.clockOut, "POST", { token });
      if (res?.success) {
        toaster.create({ description: res.message, type: "success", duration: 4000 });
        loadToday();
        loadHistory();
      } else {
        toaster.create({ description: res?.message, type: "error", duration: 4000 });
      }
    } catch (err) {
      toaster.create({ description: "Gagal memproses absensi. Silakan coba lagi.", type: "error", duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <DefaultHeader />
      <Box mt={{ base: 10, md: 14 }} maxW="4xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <Box bg="white" shadow="md" borderRadius="lg" p={{ base: 6, md: 10 }}>
          <Heading fontSize="2xl" mb={6}>
            Absensi
          </Heading>

          {!today?.clock_in_at && (
            <Button colorPalette="teal" size="lg" loading={loading} onClick={handleClockIn}>
              Clock In
            </Button>
          )}
          {today?.clock_in_at && !today?.clock_out_at && (
            <Button colorPalette="red" size="lg" loading={loading} onClick={handleClockOut}>
              Clock Out
            </Button>
          )}
          {today?.clock_in_at && today?.clock_out_at && (
            <Badge colorPalette="green" fontSize="md" p={2}>
              Selesai hari ini
            </Badge>
          )}

          <Heading fontSize="lg" mt={10} mb={4}>
            Riwayat Absensi
          </Heading>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Tanggal</Table.ColumnHeader>
                <Table.ColumnHeader>Masuk</Table.ColumnHeader>
                <Table.ColumnHeader>Pulang</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {history.map((row: any) => (
                <Table.Row key={row.id}>
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
