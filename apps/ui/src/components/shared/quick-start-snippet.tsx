"use client";

import { Code, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/lib/components/button";
import { Card, CardContent } from "@/lib/components/card";
import { toast } from "@/lib/components/use-toast";
import { useAppConfig } from "@/lib/config";

export function QuickStartSection({
	apiKey,
	onCopy,
}: {
	apiKey?: string;
	onCopy?: () => void;
}) {
	const [activeTab, setActiveTab] = useState<"curl" | "typescript" | "python">(
		"curl",
	);
	const { gatewayUrl } = useAppConfig();

	const keyPlaceholder = apiKey ?? "YOUR_API_KEY";

	const curlExample = `curl ${gatewayUrl}/v1/messages \\
  -H "x-api-key: ${keyPlaceholder}" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{"model":"claude-sonnet-4-5","max_tokens":256,"messages":[{"role":"user","content":"Xin ch\u00e0o"}]}'`;

	const tsExample = `const response = await fetch("${gatewayUrl}/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": "${keyPlaceholder}",
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-5",
    max_tokens: 256,
    messages: [{ role: "user", content: "Xin ch\u00e0o" }],
  }),
});

const data = await response.json();`;

	const pythonExample = `import anthropic

client = anthropic.Anthropic(
    api_key="${keyPlaceholder}",
    base_url="${gatewayUrl}",
)

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=256,
    messages=[{"role": "user", "content": "Xin ch\u00e0o"}],
)`;

	const code =
		activeTab === "curl"
			? curlExample
			: activeTab === "typescript"
				? tsExample
				: pythonExample;

	function copyCode() {
		void navigator.clipboard.writeText(code);
		onCopy?.();
		toast({
			title: "Copied to clipboard",
			description: "Code snippet copied to clipboard",
		});
	}

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<Code className="h-5 w-5 text-muted-foreground" />
						<span className="font-medium">
							{"K\u1ebft n\u1ed1i v\u1edbi PShareHub AI Gateway"}
						</span>
					</div>
					<p className="text-sm text-muted-foreground">
						{
							"G\u1eedi y\u00eau c\u1ea7u theo giao th\u1ee9c Anthropic Messages \u0111\u1ebfn API PShareHub b\u1eb1ng key c\u1ee7a b\u1ea1n."
						}
					</p>
					<div className="flex gap-2">
						<Button
							variant={activeTab === "curl" ? "default" : "outline"}
							size="sm"
							onClick={() => setActiveTab("curl")}
							type="button"
						>
							cURL
						</Button>
						<Button
							variant={activeTab === "typescript" ? "default" : "outline"}
							size="sm"
							onClick={() => setActiveTab("typescript")}
							type="button"
						>
							TypeScript
						</Button>
						<Button
							variant={activeTab === "python" ? "default" : "outline"}
							size="sm"
							onClick={() => setActiveTab("python")}
							type="button"
						>
							Python
						</Button>
					</div>
					<div className="relative rounded-md border bg-muted/50">
						<Button
							variant="ghost"
							size="sm"
							onClick={copyCode}
							type="button"
							className="absolute right-2 top-2 h-7 w-7 p-0"
						>
							<Copy className="h-3.5 w-3.5" />
							<span className="sr-only">Copy code</span>
						</Button>
						<pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed">
							{code}
						</pre>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
