import {
  Avatar,
  Flex,
  Heading,
  Icon,
  Input,
  Menu,
  Popover,
  Portal,
  Text,
  Image,
  Separator,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { req } from "../app/utils/req";
import { api } from "../app/config/api";
import { getToken } from "../app/utils/useToken";
import { getProfile } from "../app/utils/useProfile";
import imageLink from "../app/utils/imageLink";
import { HiLogout } from "react-icons/hi";

const DefaultHeader = () => {
  const router = useRouter();
  const token = getToken();
  const profile = getProfile();

  const handleLogOut = async () => {
    localStorage.removeItem("fianut_auth_token");
    localStorage.removeItem("fianut_profile");
    await req(api.logout, "POST", { token: token }).then((res) => {
      if (res.success) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  };

  return (
    <Flex
      as="header"
      justify="space-between"
      align="center"
      px={6}
      py={4}
      bg="white"
      boxShadow="sm"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={10}
    >
      <Heading size="md" color="gray.800">
        <Image
          cursor={"pointer"}
          src={`${process.env.NEXT_PUBLIC_FIANUT_MAIN_URL}/fianut_1.webp`}
          alt="fianut"
          h={5}
          onClick={() => router.push(process.env.NEXT_PUBLIC_FIANUT_MAIN_URL)}
        />
      </Heading>
      <Flex align="center" gap={4}>
        <Menu.Root>
          <Menu.Trigger>
            <Avatar.Root size={"xs"}>
              <Avatar.Fallback name={profile?.user?.name} />
              <Avatar.Image
                {...{
                  src: imageLink(profile?.user?.image) as any,
                }}
              />
            </Avatar.Root>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item {...({ mb: 2 } as any)}>
                  <Avatar.Root size={"lg"}>
                    <Avatar.Fallback
                      name={
                        Array.isArray(profile?.instance) &&
                        profile.instance[0]?.name
                      }
                    />
                    <Avatar.Image
                      {...{
                        src: imageLink(
                          profile?.instance_settings?.img_instance_logo
                        ) as any,
                      }}
                    />
                  </Avatar.Root>
                  {Array.isArray(profile?.instance) &&
                    profile.instance.length > 0 && (
                    <Text
                      wordBreak="break-word"
                      whiteSpace="normal"
                      maxW="25vw"
                    >
                      {profile.instance[0]?.name}
                    </Text>
                  )}
                </Menu.Item>
                <Menu.Item
                  {...({ value: "profile" } as any)}
                  onClick={() =>
                    router.push(
                      `${process.env.NEXT_PUBLIC_FIANUT_MAIN_URL}/profile`
                    )
                  }
                >
                  Profil Pengguna
                </Menu.Item>
                <Separator mt={1} />
                <Menu.Item
                  {...({ value: "logout" } as any)}
                  onClick={handleLogOut}
                >
                  <HiLogout /> Keluar
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Flex>
  );
};

export default DefaultHeader;
