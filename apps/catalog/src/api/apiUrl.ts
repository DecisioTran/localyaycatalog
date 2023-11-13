/* eslint-disable @typescript-eslint/no-explicit-any */
import ky from "ky";

export const wpEndpoint = ky.create({
  prefixUrl: `${(window as any).yayCatalogData.restUrl}yay_catalog/v1/`,
  headers: {
    "X-WP-Nonce": (window as any).yayCatalogData.restNonce,
  },
});

export default wpEndpoint;
