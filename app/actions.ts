"use server";

import { Songkick } from "./songkick";

const fetchJson = async <T>(url: string | URL, init?: RequestInit) =>
  fetch(url, init).then((res) => res.json() as Promise<T>);

const fetchSongKick = async <T>(input: string | URL, init?: RequestInit) => {
  const url = new URL(input, "https://api.songkick.com/api/3.0/");
  url.searchParams.set("apikey", process.env.SONGKICK_APIKEY!);

  return fetchJson<T>(url, init);
};

export const getPastEvents = async (artistId: number) =>
  fetchSongKick<{
    resultsPage: {
      status: string;
      results: { event: Songkick.Event[] };
      perPage: number;
      page: number;
      totalEntries: number;
    };
  }>(`artists/${artistId}/gigography.json`).then(({ resultsPage }) =>
    resultsPage.totalEntries ? resultsPage.results.event : [],
  );

export const getUpcomingEvents = async (artistId: number) =>
  fetchSongKick<{
    resultsPage: {
      status: string;
      results: { event: Songkick.Event[] };
      perPage: number;
      page: number;
      totalEntries: number;
    };
  }>(`artists/${artistId}/calendar.json`).then(({ resultsPage }) =>
    resultsPage.totalEntries ? resultsPage.results.event : [],
  );

export const searchArtists = async (query: string) =>
  fetchSongKick<{
    resultsPage: {
      status: string;
      results: { artist: Songkick.Artist[] };
      perPage: number;
      page: number;
      totalEntries: number;
    };
  }>(`search/artists.json?query=${encodeURIComponent(query)}`).then(
    ({ resultsPage }) =>
      resultsPage.totalEntries ? resultsPage.results.artist : [],
  );
export const getArtistById = async (artistId: number) =>
  fetchSongKick<{
    resultsPage: {
      status: string;
      results: { artist: Songkick.Artist & { onTourUntil?: string } };
    };
  }>(`artists/${artistId}.json`).then(
    ({ resultsPage }) => resultsPage.results.artist ?? null,
  );
