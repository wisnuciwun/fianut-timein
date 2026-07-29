"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Table,
  Tabs,
  HStack,
  Icon,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import {
  IoTimeOutline,
  IoPersonOutline,
  IoBusinessOutline,
  IoListOutline,
} from "react-icons/io5";
import DefaultHeader from "../components/defaultheader";
import { Toaster, toaster } from "../components/ui/toaster";
import { api } from "./config/api";
import { req } from "./utils/req";
import { getToken } from "./utils/useToken";
import { getProfile } from "./utils/useProfile";

export default function Home() {
  const token = getToken();
  const profile = getProfile();
  const [tab, setTab] = useState("absensi");
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));
  const [currentDate, setCurrentDate] = useState(
    moment().format("dddd, DD MMMM YYYY"),
  );

  const userName = profile?.user?.name ?? "Pengguna";
  const companyName =
    Array.isArray(profile?.instance) && profile.instance.length > 0
      ? profile.instance[0]?.name
      : "";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss"));
      setCurrentDate(moment().format("dddd, DD MMMM YYYY"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
        toaster.create({
          description: res.message,
          type: "success",
          duration: 4000,
        });
        loadToday();
        loadHistory();
      } else {
        toaster.create({
          description: res?.message,
          type: "error",
          duration: 4000,
        });
      }
    } catch (err) {
      toaster.create({
        description: "Gagal memproses absensi. Silakan coba lagi.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const res = await req(api.clockOut, "POST", { token });
      if (res?.success) {
        toaster.create({
          description: res.message,
          type: "success",
          duration: 4000,
        });
        loadToday();
        loadHistory();
      } else {
        toaster.create({
          description: res?.message,
          type: "error",
          duration: 4000,
        });
      }
    } catch (err) {
      toaster.create({
        description: "Gagal memproses absensi. Silakan coba lagi.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <DefaultHeader />
      <Box mt={{ base: 10, md: 14 }} bg="#fffefa">
        <Box maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
          <Box bg="white" shadow="md" borderRadius="lg" p={{ base: 6, md: 10 }}>
            <Heading fontSize="2xl" mb={6}>
              Timein
            </Heading>

            <Tabs.Root
              value={tab}
              variant="subtle"
              onValueChange={(e) => setTab(e.value)}
            >
              <Box overflowX="auto" whiteSpace="nowrap">
                <Tabs.List>
                  {/* @ts-expect-error Chakra v3 Tabs.Trigger types missing children */}
                  <Tabs.Trigger value="absensi">
                    <Icon as={IoTimeOutline} boxSize={4} /> Absensi
                  </Tabs.Trigger>
                  {/* @ts-expect-error Chakra v3 Tabs.Trigger types missing children */}
                  <Tabs.Trigger value="riwayat">
                    <Icon as={IoListOutline} boxSize={4} /> Riwayat Absensi
                  </Tabs.Trigger>
                </Tabs.List>
              </Box>

              {/* @ts-expect-error Chakra v3 Tabs.Content types missing children */}
              <Tabs.Content value="absensi" mt={6}>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "flex-start", md: "center" }}
                  gap={4}
                  mb={6}
                >
                  <Box>
                    <HStack gap={1} color="gray.500" fontSize="sm">
                      <Icon as={IoPersonOutline} boxSize={4} />
                      <Text fontWeight="500">{userName}</Text>
                      {companyName && (
                        <>
                          <Text>·</Text>
                          <Icon as={IoBusinessOutline} boxSize={4} />
                          <Text fontWeight="500">{companyName}</Text>
                        </>
                      )}
                    </HStack>
                  </Box>
                  <VStack
                    align={{ base: "flex-start", md: "flex-end" }}
                    gap={1}
                  >
                    <HStack gap={2} color="gray.600">
                      <Icon as={IoTimeOutline} boxSize={5} color="red.400" />
                      <Text
                        fontSize="3xl"
                        fontWeight="700"
                        fontFamily="mono"
                        letterSpacing="wider"
                      >
                        {currentTime}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.400" fontWeight="500">
                      {currentDate}
                    </Text>
                  </VStack>
                </Flex>

                <Flex
                  direction={{ base: "column", sm: "row" }}
                  gap={4}
                  align="center"
                  justify="space-between"
                  bg="gray.100"
                  borderRadius="xl"
                  p={6}
                  borderWidth="1px"
                  borderColor="gray.100"
                >
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={1}>
                      Status Absensi
                    </Text>
                    {!today?.clock_in_at && (
                      <Badge
                        colorPalette="orange"
                        fontSize="md"
                        px={3}
                        py={1}
                        borderRadius="md"
                      >
                        Belum Clock In
                      </Badge>
                    )}
                    {today?.clock_in_at && !today?.clock_out_at && (
                      <Badge
                        colorPalette="blue"
                        fontSize="md"
                        px={3}
                        py={1}
                        borderRadius="md"
                      >
                        Sedang Bekerja
                      </Badge>
                    )}
                    {today?.clock_in_at && today?.clock_out_at && (
                      <Badge
                        colorPalette="green"
                        fontSize="md"
                        px={3}
                        py={1}
                        borderRadius="md"
                      >
                        Selesai hari ini
                      </Badge>
                    )}
                  </Box>
                  <Box>
                    {!today?.clock_in_at && (
                      <Button
                        colorPalette="teal"
                        size="lg"
                        loading={loading}
                        onClick={handleClockIn}
                        borderRadius="lg"
                        fontWeight="600"
                        minW="160px"
                        boxShadow="sm"
                      >
                        Clock In
                      </Button>
                    )}
                    {today?.clock_in_at && !today?.clock_out_at && (
                      <Button
                        colorPalette="red"
                        size="lg"
                        loading={loading}
                        onClick={handleClockOut}
                        borderRadius="lg"
                        fontWeight="600"
                        minW="160px"
                        boxShadow="sm"
                      >
                        Clock Out
                      </Button>
                    )}
                    {today?.clock_in_at && today?.clock_out_at && (
                      <Text fontSize="sm" color="gray.400" fontWeight="500">
                        Terima kasih atas kerja kerasmu hari ini
                      </Text>
                    )}
                  </Box>
                </Flex>
              </Tabs.Content>

              {/* @ts-expect-error Chakra v3 Tabs.Content types missing children */}
              <Tabs.Content value="riwayat" mt={6}>
                <Table.Root
                  size="sm"
                  variant="line"
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <Table.Header bg="gray.50">
                    <Table.Row>
                      <Table.ColumnHeader
                        fontWeight="700"
                        color="gray.600"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Tanggal
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        fontWeight="700"
                        color="gray.600"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Masuk
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        fontWeight="700"
                        color="gray.600"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Pulang
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {history.map((row: any) => (
                      <Table.Row key={row.id}>
                        <Table.Cell fontWeight="500" color="gray.700">
                          {moment(row.date).format("DD MMM YYYY")}
                        </Table.Cell>
                        <Table.Cell>
                          <HStack gap={2}>
                            <Box
                              w={2}
                              h={2}
                              borderRadius="full"
                              bg="teal.400"
                            />
                            <Text fontWeight="500" color="gray.700">
                              {row.clock_in_at
                                ? moment(row.clock_in_at).format("HH:mm")
                                : "-"}
                            </Text>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell>
                          <HStack gap={2}>
                            <Box w={2} h={2} borderRadius="full" bg="red.400" />
                            <Text fontWeight="500" color="gray.700">
                              {row.clock_out_at
                                ? moment(row.clock_out_at).format("HH:mm")
                                : "-"}
                            </Text>
                          </HStack>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
                {history.length === 0 && (
                  <Text
                    textAlign="center"
                    color="gray.400"
                    mt={6}
                    fontSize="sm"
                  >
                    Belum ada riwayat absensi
                  </Text>
                )}
              </Tabs.Content>
            </Tabs.Root>
          </Box>
        </Box>
      </Box>
    </>
  );
}
