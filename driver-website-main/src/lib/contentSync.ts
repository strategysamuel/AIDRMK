import { supabase } from "@/integrations/supabase/client";

type ContentResource = "schemes" | "gallery";

const CONTENT_SYNC = {
  schemes: {
    topic: "public-content-sync-schemes",
    event: "schemes_changed",
    table: "schemes",
  },
  gallery: {
    topic: "public-content-sync-gallery",
    event: "gallery_changed",
    table: "gallery_items",
  },
} as const;

const isBrowser = typeof window !== "undefined";

export const subscribeToContentChanges = (
  resource: ContentResource,
  onChange: () => void | Promise<void>,
) => {
  const config = CONTENT_SYNC[resource];
  const channel = supabase
    .channel(config.topic)
    .on("broadcast", { event: config.event }, () => {
      void onChange();
    })
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: config.table },
      () => {
        void onChange();
      },
    )
    .subscribe();

  const refreshWhenVisible = () => {
    if (document.visibilityState === "visible") {
      void onChange();
    }
  };

  const refreshOnFocus = () => {
    void onChange();
  };

  if (isBrowser) {
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("focus", refreshOnFocus);
  }

  return () => {
    supabase.removeChannel(channel);
    if (isBrowser) {
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("focus", refreshOnFocus);
    }
  };
};

export const broadcastContentChange = async (resource: ContentResource) => {
  const config = CONTENT_SYNC[resource];
  const channel = supabase.channel(config.topic);

  try {
    await new Promise<void>((resolve) => {
      const timeout = window.setTimeout(resolve, 1500);
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          window.clearTimeout(timeout);
          resolve();
        }
      });
    });

    await channel.send({
      type: "broadcast",
      event: config.event,
      payload: {
        resource,
        changedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.warn(`Failed to broadcast ${resource} content change`, error);
  } finally {
    supabase.removeChannel(channel);
  }
};
