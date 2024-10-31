// Sanity configuration file (sanity.js)
import { createImageUrlBuilder, createCurrentUserHook, createClient } from "next-sanity";

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1ld5igqx", // Replace with actual project ID if needed
  apiVersion: "2021-03-25",
  useCdn: false,
};

// Set up the client
export const sanityClient = createClient(config);

// Helper functions
export const urlFor = (source) => createImageUrlBuilder(config).image(source);
export const useCurrentUser = createCurrentUserHook(config);