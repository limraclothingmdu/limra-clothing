"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function AdminOrdersRealtime() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    let timer: ReturnType<typeof setTimeout> | undefined;

    const refresh = () => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        router.refresh();
      }, 300);
    };

    const channel = supabase
      .channel("admin-orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        refresh
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      if (timer) {
        clearTimeout(timer);
      }

      supabase.removeChannel(channel);
    };
  }, [router]);

  return (
    <div className="fixed right-4 top-20 z-40">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#081A4A]/10 bg-white px-3 py-2 text-xs font-semibold shadow-sm">
        <span
          className={`h-2 w-2 rounded-full ${
            connected ? "bg-green-500" : "bg-gray-400"
          }`}
        />

        {connected ? "Live orders" : "Connecting..."}
      </div>
    </div>
  );
}