import { HttpAgent } from "@icp-sdk/core/agent";
import { useEffect, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useInternetIdentity } from "./useInternetIdentity";

export function useStorageClient(): StorageClient | null {
  const [client, setClient] = useState<StorageClient | null>(null);
  const { identity } = useInternetIdentity();

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const config = await loadConfig();
        const agent = new HttpAgent({
          host: config.backend_host,
          identity: identity ?? undefined,
        });
        if (config.backend_host?.includes("localhost")) {
          await agent.fetchRootKey().catch(() => {});
        }
        const sc = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent,
        );
        if (!cancelled) setClient(sc);
      } catch {
        // ignore
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [identity]);

  return client;
}
