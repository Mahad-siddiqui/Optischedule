import type { EAParams, SchedulePayload, SSEGenerationEvent } from "../types/schedule";

/** Start the EA and stream generation events via SSE */
export function startEvolution(
  params: EAParams,
  callbacks: {
    onGeneration: (event: SSEGenerationEvent) => void;
    onComplete: (data: unknown) => void;
    onError: (error: string) => void;
    onInit: (data: unknown) => void;
  }
): AbortController {
  const controller = new AbortController();

  fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        const text = await response.text();
        callbacks.onError(`Server error: ${response.status} — ${text}`);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        callbacks.onError("No stream available.");
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const eventStr of events) {
          const lines = eventStr.split("\n");
          let eventType = "";
          let eventData = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7);
            } else if (line.startsWith("data: ")) {
              eventData = line.slice(6);
            }
          }

          if (!eventType || !eventData) continue;

          try {
            const parsed = JSON.parse(eventData);
            switch (eventType) {
              case "init":
                callbacks.onInit(parsed);
                break;
              case "generation":
                callbacks.onGeneration(parsed as SSEGenerationEvent);
                break;
              case "complete":
                callbacks.onComplete(parsed);
                break;
              case "error":
                callbacks.onError(parsed.error ?? "Unknown error");
                break;
            }
          } catch {
            // Skip malformed events
          }
        }
      }
    })
    .catch((err) => {
      if (err instanceof Error && err.name === "AbortError") return;
      callbacks.onError(err instanceof Error ? err.message : String(err));
    });

  return controller;
}

/** Fetch the last generated schedule */
export async function fetchSchedule(): Promise<SchedulePayload> {
  const response = await fetch("/api/schedule");
  if (!response.ok) {
    throw new Error(`Failed to fetch schedule: ${response.status}`);
  }
  return response.json();
}

/** Check server status */
export async function checkStatus(): Promise<{ isRunning: boolean; hasSchedule: boolean }> {
  const response = await fetch("/api/status");
  return response.json();
}

/** Get export download URL */
export function getExportUrl(fileName: string): string {
  return `/api/exports/${fileName}`;
}

/** Fetch full university data for info pages */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchUniversityData(): Promise<any> {
  const response = await fetch("/api/data");
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }
  return response.json();
}
