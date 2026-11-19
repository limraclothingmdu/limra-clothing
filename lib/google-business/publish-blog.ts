
import "server-only";

import { createHash } from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";
import { getGoogleBusinessAccessToken } from "@/lib/google-business/access-token";
import { siteConfig } from "@/lib/site";

interface PublishBlogResult {
  success: boolean;
  status:
    | "synced"
    | "already_tracked"
    | "skipped"
    | "failed"
    | "pending";
  message: string;
  googlePostName?: string;
}

interface GoogleCreatedPost {
  name?: string;
  state?: string;
  searchUrl?: string;
  createTime?: string;
}

interface BlogRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  is_published: boolean;
}

function createPostSummary(blog: BlogRecord): string {
  const source = blog.excerpt?.trim()
    ? blog.excerpt
    : blog.content;

  const summary = source
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (!summary) {
    throw new Error("The blog does not contain a usable summary.");
  }

  return summary.length > 1500
    ? `${summary.slice(0, 1497).trimEnd()}...`
    : summary;
}

function getErrorMessage(value: string): string {
  try {
    const parsed = JSON.parse(value) as {
      error?: unknown;
    };

    // Preserve Google's complete structured error,
    // including details and field-level validation errors.
    if (parsed.error !== undefined) {
      return JSON.stringify(parsed.error).slice(0, 1800);
    }

    return JSON.stringify(parsed).slice(0, 1800);
  } catch {
    return value.slice(0, 1800);
  }
}

export async function publishBlogToGoogle(
  blogId: string
): Promise<PublishBlogResult> {
  const supabase = createAdminClient();

  try {
    // Load the article.
    const { data: blog, error: blogError } = await supabase
      .from("blogs")
      .select(
        "id, title, slug, excerpt, content, featured_image, is_published"
      )
      .eq("id", blogId)
      .maybeSingle();

    if (blogError || !blog) {
      return {
        success: false,
        status: "failed",
        message: "Unable to find the blog article.",
      };
    }

    if (!blog.is_published) {
      return {
        success: false,
        status: "skipped",
        message: "Draft articles are not published to Google.",
      };
    }

    // Never create a second post for an article with a tracking record.
    const { data: existing, error: existingError } = await supabase
      .from("google_business_posts")
      .select("id, sync_status, google_post_name")
      .eq("blog_id", blog.id)
      .maybeSingle();

    if (existingError) {
      throw new Error("Unable to check existing Google post tracking.");
    }

    if (existing) {
      return {
        success: existing.sync_status === "synced",
        status: "already_tracked",
        message:
          "This article already has a Google publishing record. No duplicate post was created.",
        googlePostName: existing.google_post_name ?? undefined,
      };
    }

    const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
    const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

    if (
      !accountId ||
      !/^\d+$/.test(accountId) ||
      !locationId ||
      !/^\d+$/.test(locationId)
    ) {
      throw new Error("Google Business configuration is invalid.");
    }

    if (
      !blog.featured_image ||
      !blog.featured_image.startsWith("https://")
    ) {
      throw new Error("A valid HTTPS featured image is required.");
    }

    const articleUrl = `${siteConfig.url}/blog/${blog.slug}`;
    const summary = createPostSummary(blog);

    // Obtain authentication before reserving the article.
    const accessToken = await getGoogleBusinessAccessToken();

    const contentHash = createHash("sha256")
      .update(`${summary}|${articleUrl}|${blog.featured_image}`)
      .digest("hex");

    // Reserve the article before making the external request.
    const { data: tracking, error: trackingError } = await supabase
      .from("google_business_posts")
      .insert({
        blog_id: blog.id,
        google_location_id: locationId,
        sync_status: "pending",
        content_hash: contentHash,
        last_attempt_at: new Date().toISOString(),
        sync_attempts: 1,
      })
      .select("id")
      .single();

    if (trackingError) {
      if (trackingError.code === "23505") {
        return {
          success: false,
          status: "already_tracked",
          message:
            "A Google publishing record already exists. No duplicate post was created.",
        };
      }

      throw new Error("Unable to reserve the article for Google publishing.");
    }

    const googleUrl =
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}` +
      `/locations/${locationId}/localPosts`;

    let googleResponse: Response;

    try {
      googleResponse = await fetch(googleUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          languageCode: "en",
          summary,
          topicType: "STANDARD",
          callToAction: {
            actionType: "LEARN_MORE",
            url: articleUrl,
          },
          media: [
            {
              mediaFormat: "PHOTO",
              sourceUrl: blog.featured_image,
            },
          ],
        }),
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown network error";

      // The request may have reached Google. Keep it pending.
      await supabase
        .from("google_business_posts")
        .update({
          last_error: `Uncertain Google request result: ${message}`.slice(
            0,
            2000
          ),
        })
        .eq("id", tracking.id);

      return {
        success: false,
        status: "pending",
        message:
          "The Google request result is uncertain. Check Google posts before attempting recovery.",
      };
    }

    const responseText = await googleResponse.text();

    if (!googleResponse.ok) {
        const googleMessage = getErrorMessage(responseText);
        const diagnostic =
  `HTTP ${googleResponse.status}: ${googleMessage}`.slice(0, 2000);

      // A server error may have an uncertain outcome.
      const nextStatus =
        googleResponse.status >= 500 ? "pending" : "failed";

      await supabase
        .from("google_business_posts")
        .update({
          sync_status: nextStatus,
          last_error: diagnostic,
        })
        .eq("id", tracking.id);

console.error("Google blog publishing failed:", {
  status: googleResponse.status,
  response: googleMessage,
});

      return {
        success: false,
        status: nextStatus,
        message: `Google API rejected the request. ${diagnostic}`,
      };
    }

    let created: GoogleCreatedPost;

    try {
      created = JSON.parse(responseText) as GoogleCreatedPost;
    } catch {
      created = {};
    }

    if (!created.name) {
      await supabase
        .from("google_business_posts")
        .update({
          last_error:
            "Google response did not contain a post resource name. Verify Google Posts before recovery.",
        })
        .eq("id", tracking.id);

      return {
        success: false,
        status: "pending",
        message:
          "Google returned an unexpected response. Verify the post before taking further action.",
      };
    }

    // Save the external post reference.
    const { error: updateError } = await supabase
      .from("google_business_posts")
      .update({
        google_post_name: created.name,
        sync_status: "synced",
        last_synced_at: new Date().toISOString(),
        last_error: null,
      })
      .eq("id", tracking.id);

    if (updateError) {
      console.error(
        "Google post created but tracking update failed:",
        updateError.message
      );

      return {
        success: false,
        status: "pending",
        message:
          "Google created the post, but its tracking update failed. Do not publish again.",
        googlePostName: created.name,
      };
    }

    return {
      success: true,
      status: "synced",
      message: "Blog successfully submitted to Google Business Profile.",
      googlePostName: created.name,
    };
  } catch (error) {
    console.error(
      "Google blog publishing exception:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return {
      success: false,
      status: "failed",
      message:
        error instanceof Error
          ? error.message
          : "Unable to publish the blog to Google.",
    };
  }
}
