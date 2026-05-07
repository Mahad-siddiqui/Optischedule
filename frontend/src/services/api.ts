import axios, { type AxiosAdapter, type AxiosResponse } from "axios";
import { mockSchedule } from "../data/mockSchedule";
import type { GenerationResponse, SchedulePayload } from "../types/schedule";

const sleep = (milliseconds: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const mockAdapter: AxiosAdapter = async (config) => {
  await sleep(config.method === "post" ? 1400 : 350);

  if (config.url === "/api/generate" && config.method === "post") {
    return response<GenerationResponse>(config, {
      message: "Schedule generated successfully.",
      schedule: {
        ...mockSchedule,
        generatedAt: new Date().toISOString()
      }
    });
  }

  if (config.url === "/api/schedule" && config.method === "get") {
    return response<SchedulePayload>(config, mockSchedule);
  }

  return {
    data: { message: "Mock endpoint not found." },
    status: 404,
    statusText: "Not Found",
    headers: {},
    config
  };
};

const api = axios.create({
  baseURL: "/",
  adapter: mockAdapter
});

export async function generateSchedule(): Promise<GenerationResponse> {
  const { data } = await api.post<GenerationResponse>("/api/generate");
  return data;
}

export async function fetchSchedule(): Promise<SchedulePayload> {
  const { data } = await api.get<SchedulePayload>("/api/schedule");
  return data;
}

function response<T>(config: Parameters<AxiosAdapter>[0], data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config
  };
}
