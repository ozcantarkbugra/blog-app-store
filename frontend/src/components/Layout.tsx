import { AppShell, Container, Group, Title, Anchor, Stack, ActionIcon, Tooltip, useMantineColorScheme } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/categories", label: "Kategoriler" },
  { to: "/post/new", label: "Yazı Ekle" },
  { to: "/data", label: "Veri" },
] as const;

export function Layout({ children }: LayoutProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header withBorder>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between" wrap="nowrap">
            <Anchor component={Link} to="/" variant="subtle" c="inherit" underline="never">
              <Title order={3} fw={700} style={{ letterSpacing: "-0.02em" }}>
                Blog
              </Title>
            </Anchor>

            <Group gap={4} wrap="wrap">
              {NAV_LINKS.map(({ to, label }) => {
                const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
                return (
                  <Anchor
                    key={to}
                    component={Link}
                    to={to}
                    size="sm"
                    fw={500}
                    px="md"
                    py="xs"
                    style={{
                      borderRadius: "var(--mantine-radius-md)",
                      backgroundColor: active ? "var(--mantine-color-default-hover)" : undefined,
                      color: active ? "var(--mantine-primary-color-filled)" : undefined,
                    }}
                  >
                    {label}
                  </Anchor>
                );
              })}
            </Group>

            <Group gap="xs">
              <Tooltip label={colorScheme === "dark" ? "Açık tema" : "Koyu tema"} position="bottom">
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  radius="md"
                  onClick={() => toggleColorScheme()}
                  aria-label="Tema değiştir"
                >
                  <span style={{ fontSize: "1.1rem" }}>{colorScheme === "dark" ? "☀️" : "🌙"}</span>
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="lg" py="md">
          <Stack gap="lg">{children}</Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
