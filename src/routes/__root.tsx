import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">Página não encontrada.</p>
        <a href="/" className="mt-6 inline-block rounded-md bg-[var(--brand-blue)] px-4 py-2 text-sm font-medium text-white">
          Voltar ao início
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-[var(--brand-blue)] px-4 py-2 text-sm font-medium text-white"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hub de Inovação | Edital Inova Soluções Públicas — INOVATEC-JP" },
      { name: "description", content: "O Hub de Inovação da INOVATEC-JP está selecionando ideias inovadoras de base tecnológica para desenvolver sistemas aplicáveis ao setor público. Inscreva-se e concorra a aporte financeiro e suporte institucional completo." },
      { property: "og:title", content: "Hub de Inovação | Edital Inova Soluções Públicas — INOVATEC-JP" },
      { property: "og:description", content: "O Hub de Inovação da INOVATEC-JP está selecionando ideias inovadoras de base tecnológica para desenvolver sistemas aplicáveis ao setor público. Inscreva-se e concorra a aporte financeiro e suporte institucional completo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Hub de Inovação | Edital Inova Soluções Públicas — INOVATEC-JP" },
      { name: "twitter:description", content: "O Hub de Inovação da INOVATEC-JP está selecionando ideias inovadoras de base tecnológica para desenvolver sistemas aplicáveis ao setor público. Inscreva-se e concorra a aporte financeiro e suporte institucional completo." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7ccce6d5-54e5-4d51-bc08-a6f00bacc88b/id-preview-a47e5c22--b1bbde3a-716c-4a9a-80cd-1cbb89245b84.lovable.app-1779905067461.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7ccce6d5-54e5-4d51-bc08-a6f00bacc88b/id-preview-a47e5c22--b1bbde3a-716c-4a9a-80cd-1cbb89245b84.lovable.app-1779905067461.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
