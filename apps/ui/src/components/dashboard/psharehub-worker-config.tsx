import { ArrowUpRight, CircleAlert, KeyRound, Route } from "lucide-react";
import Link from "next/link";

interface PShareHubWorkerConfigProps {
	mode: "provider" | "routing";
}

const CLOUDFLARE_WORKERS_URL =
	"https://dash.cloudflare.com/3fb472351c1ce2a2d64188bbd484db3e/workers-and-pages";

export function PShareHubWorkerConfig({ mode }: PShareHubWorkerConfigProps) {
	const isProvider = mode === "provider";
	const Icon = isProvider ? KeyRound : Route;
	const title = isProvider ? "Nhà cung cấp AI" : "Định tuyến";

	return (
		<main className="mx-auto w-full max-w-5xl space-y-6 p-6 md:p-8">
			<header className="space-y-2">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<Icon aria-hidden="true" className="size-5" />
					</div>
					<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
				</div>
				<p className="max-w-3xl text-sm leading-6 text-muted-foreground">
					{isProvider
						? "PShareHub chuyển tiếp yêu cầu đến nhà cung cấp AI bằng thông tin xác thực do bạn quản lý trong Cloudflare Worker."
						: "Worker nhận yêu cầu theo giao thức Anthropic Messages và chuyển chúng đến tuyến Anthropic đã cấu hình."}
				</p>
			</header>

			<section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h2 className="font-semibold">Trạng thái kết nối</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Anthropic API · api.anthropic.com
						</p>
					</div>
					<span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-800 dark:text-amber-300">
						<CircleAlert aria-hidden="true" className="size-4" />
						Chưa bật upstream
					</span>
				</div>
				<p className="mt-5 text-sm leading-6 text-muted-foreground">
					Gateway và dashboard đang hoạt động. Tuyến suy luận chưa có thông tin xác thực upstream, vì vậy yêu cầu tạo nội dung chưa thể gửi đến Anthropic.
				</p>
			</section>

			<section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
				<h2 className="font-semibold">Cấu hình trong Cloudflare</h2>
				<ol className="mt-4 list-inside list-decimal space-y-3 text-sm leading-6 text-muted-foreground">
					<li>Mở Workers & Pages và chọn Worker <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">psharehub-ai-gateway</code>.</li>
					<li>Vào Settings → Variables and Secrets để thêm khóa API chính thức mà bạn được phép sử dụng.</li>
					<li>Để thêm tuyến tương thích khác, cấu hình <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">MODEL_ROUTES</code> và secret tương ứng trên Worker.</li>
				</ol>
				<p className="mt-4 text-xs leading-5 text-muted-foreground">
					Không nhập khóa provider vào trình duyệt hay nội dung yêu cầu. Các tùy chọn chiến lược Enterprise của LLMGateway không được dùng trong dashboard PShareHub.
				</p>
				<a
					href={CLOUDFLARE_WORKERS_URL}
					target="_blank"
					rel="noreferrer"
					className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
				>
					Mở Cloudflare Workers
					<ArrowUpRight aria-hidden="true" className="size-4" />
				</a>
			</section>

			{isProvider ? (
				<section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 md:p-6">
					<h2 className="font-semibold">Khóa API của ứng dụng</h2>
					<p className="mt-2 text-sm leading-6 text-muted-foreground">
						Tạo và thu hồi khóa mà ứng dụng dùng để gọi gateway trong mục{" "}
						<Link
							href="/dashboard/psharehub-owner/psharehub-gateway/api-keys"
							className="font-medium text-primary underline underline-offset-4"
						>
							Khóa API
						</Link>
						. Khóa này khác với khóa provider; gateway chỉ lưu bản băm của khóa ứng dụng.
					</p>
				</section>
			) : null}
		</main>
	);
}
