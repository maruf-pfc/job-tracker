import { describe, it, expect, vi, beforeEach } from "vitest";
import { getWebhookConfig, triggerWebhooks } from "../webhookService";
import { api } from "../api";

vi.mock("../api", () => ({
  api: {
    post: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("webhookService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return empty config when localStorage is empty", () => {
    const config = getWebhookConfig();
    expect(config.discordWebhookUrl).toBe("");
    expect(config.n8nWebhookUrl).toBe("");
    expect(config.telegramToken).toBe("");
    expect(config.telegramChatId).toBe("");
  });

  it("should read configured webhooks from localStorage", () => {
    localStorage.setItem("discord_webhook_url", "https://discord.com/api/webhooks/123/abc");
    localStorage.setItem("n8n_webhook_url", "https://n8n.example.com/webhook");
    localStorage.setItem("telegram_token", "123456:ABC");
    localStorage.setItem("telegram_chat_id", "-10012345");

    const config = getWebhookConfig();
    expect(config.discordWebhookUrl).toBe("https://discord.com/api/webhooks/123/abc");
    expect(config.n8nWebhookUrl).toBe("https://n8n.example.com/webhook");
    expect(config.telegramToken).toBe("123456:ABC");
    expect(config.telegramChatId).toBe("-10012345");
  });

  it("should return empty array and skip dispatch when no webhooks are configured", async () => {
    const results = await triggerWebhooks("application_created", {
      company: "Acme",
      role: "Developer",
    });

    expect(results).toEqual([]);
    expect(api.post).not.toHaveBeenCalled();
  });

  it("should dispatch webhook payload when discord webhook is configured", async () => {
    localStorage.setItem("discord_webhook_url", "https://discord.com/api/webhooks/123/abc");

    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        data: [{ provider: "Discord", success: true }],
      },
    });

    const results = await triggerWebhooks("application_created", {
      company: "Acme",
      role: "Senior Dev",
    });

    expect(api.post).toHaveBeenCalledWith(
      "/webhooks/dispatch",
      expect.objectContaining({
        event: "application_created",
        discordWebhookUrl: "https://discord.com/api/webhooks/123/abc",
      })
    );
    expect(results).toEqual([{ provider: "Discord", success: true }]);
  });
});
