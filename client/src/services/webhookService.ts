import { api } from "./api";
import { toast } from "sonner";
import type { JobApplication } from "@/types/job-application";

export interface WebhookConfig {
  n8nWebhookUrl?: string;
  discordWebhookUrl?: string;
  telegramToken?: string;
  telegramChatId?: string;
}

export interface WebhookResult {
  provider: string;
  success: boolean;
  error?: string;
}

export function getWebhookConfig(): WebhookConfig {
  return {
    n8nWebhookUrl: (localStorage.getItem("n8n_webhook_url") || "").trim(),
    discordWebhookUrl: (localStorage.getItem("discord_webhook_url") || "").trim(),
    telegramToken: (localStorage.getItem("telegram_token") || "").trim(),
    telegramChatId: (localStorage.getItem("telegram_chat_id") || "").trim(),
  };
}

/**
 * Dispatches an event payload to configured n8n, Discord, and Telegram webhooks via the backend proxy.
 */
export async function triggerWebhooks(
  event: "application_created" | "application_updated" | "status_updated" | "test_event",
  application?: Partial<JobApplication> | null
): Promise<WebhookResult[]> {
  const config = getWebhookConfig();

  // If no webhooks are configured, log and return empty
  if (
    !config.discordWebhookUrl &&
    !config.n8nWebhookUrl &&
    (!config.telegramToken || !config.telegramChatId)
  ) {
    console.info(
      "JobTracker Webhooks: No webhook URL configured in Settings (localStorage). Skipping webhook dispatch."
    );
    return [];
  }

  const eventLabel =
    event === "application_created"
      ? "New Application Created"
      : event === "status_updated"
      ? "Application Status Updated"
      : event === "application_updated"
      ? "Application Details Modified"
      : "JobTracker Test Event";

  try {
    const payload = {
      discordWebhookUrl: config.discordWebhookUrl || undefined,
      n8nWebhookUrl: config.n8nWebhookUrl || undefined,
      telegramToken: config.telegramToken || undefined,
      telegramChatId: config.telegramChatId || undefined,
      event,
      eventLabel,
      application: {
        id: application?.id,
        company: application?.company || "Sample Company / Organization",
        role: application?.role || "Software Engineer",
        status: application?.applicationStatus || "Applied",
        jobUrl: application?.jobUrl,
        location: application?.location,
        salaryRange: application?.salaryRange,
        appliedAt: application?.appliedAt,
        followUpDate: application?.followUpDate,
        priority: application?.priority,
        workType: application?.workType,
        jobType: application?.jobType,
        notes: application?.notes,
      },
    };

    const response = await api.post<{ data: WebhookResult[] }>("/webhooks/dispatch", payload);
    const results = response.data?.data || [];

    const discordResult = results.find((r) => r.provider === "Discord");
    if (discordResult) {
      if (discordResult.success) {
        if (event === "application_created") {
          toast.success("Discord alert sent for new application!");
        }
      } else {
        console.warn("Discord Webhook dispatch failed:", discordResult.error);
        toast.error(`Discord webhook failed: ${discordResult.error}`);
      }
    }

    return results;
  } catch (err: unknown) {
    console.warn("Backend webhook dispatch failed:", err);
    return [
      {
        provider: "Webhook Service",
        success: false,
        error: err instanceof Error ? err.message : "Failed to reach backend dispatcher",
      },
    ];
  }
}
