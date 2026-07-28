"use client";

import {
  Box,
  Button,
  Center,
  Image,
  Link,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { req } from "../app/utils/req";
import { api } from "../app/config/api";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(null);

  const handleGetProfile = useCallback(async (token = null) => {
    try {
      const valid = await req(`${api.verifyToken}?token=${token}&app_name=Timein`, "GET");
      if (valid?.success) {
        const res = await req(`${api.profile}?token=${token}&app_name=Timein`, "GET");
        if (res?.success) {
          localStorage.setItem("fianut_profile", JSON.stringify(res.data));
        }

        router.replace("/");
        setTimeout(() => {
          setIsAuthorized(true);
        }, 2000);
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      localStorage.removeItem("fianut_auth_token");
      localStorage.removeItem("fianut_profile");
      setIsAuthorized(false);
    }
  }, [router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const savedToken = localStorage.getItem("fianut_auth_token");

    if (token) {
      localStorage.setItem("fianut_auth_token", token);
      handleGetProfile(token);
    } else if (savedToken) {
      handleGetProfile(savedToken);
    }

    if (!token && !savedToken) {
      localStorage.removeItem("fianut_auth_token");
      localStorage.removeItem("fianut_profile");
      setIsAuthorized(false);
    }
  }, [handleGetProfile]);

  if (isAuthorized == null) {
    return (
      <Center height="100vh" bgGradient="linear(to-b, gray.50, teal.50)">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  if (!isAuthorized) {
    return (
      <Center height="100vh" px={4} bgGradient="linear(to-b, gray.50, teal.50)">
        <Box textAlign="center" p={8} rounded="2xl">
          <Image
            src={`${process.env.NEXT_PUBLIC_FIANUT_MAIN_URL}/fianut_1.webp`}
            alt="fianut"
            h={6}
            mb={4}
          />
          <Text fontSize="xl" mb={4}>
            Oops, kamu belum masuk. Yuk
            <Link
              color={"teal.600"}
              fontWeight={"semibold"}
              href={`${process.env.NEXT_PUBLIC_FIANUT_MAIN_URL}`}
            >
              &nbsp;masuk&nbsp;
            </Link>
            dulu!
          </Text>
        </Box>
      </Center>
    );
  } else {
    return <>{children}</>;
  }
}
