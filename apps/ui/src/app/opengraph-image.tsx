import { homeOgImage } from "@/lib/home-og";
import { ogContentType, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt =
	"PShareHub AI Gateway hỗ trợ Anthropic Messages và OpenAI Chat Completions.";

export default function Image() {
	return homeOgImage();
}
