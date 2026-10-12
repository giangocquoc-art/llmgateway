const ZALO_URL = "https://zalo.me/0583799593";
const SOURCE_URL =
	"https://github.com/giangocquoc-art/llmgateway/tree/psharehub/cf-ui-release";

export default function Footer() {
	return (
		<footer className="relative bg-white py-10">
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9d8d1] to-transparent" />
			<div className="container mx-auto flex flex-col gap-8 px-4">
				<div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
					<div>
						<a
							href="https://psharehub.com/"
							className="font-display text-lg font-bold text-[#151c38] hover:text-[#6045e8]"
						>
							PShareHub
						</a>
						<p className="mt-2 max-w-md text-sm text-[#5d6680]">
							Hỗ trợ Codex CLI và Claude CLI.
						</p>
					</div>
					<a
						href={ZALO_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm font-medium text-[#6045e8] hover:underline"
					>
						Liên hệ Zalo · 0583 799 593
					</a>
				</div>
				<div className="flex flex-col items-center justify-between gap-2 border-t border-[#d9d8d1]/70 pt-6 text-center text-xs text-[#5d6680] sm:flex-row sm:text-left">
					<p>
						© {new Date().getFullYear()} PShareHub. Giao diện sử dụng LLM
						Gateway theo giấy phép AGPLv3.
					</p>
					<a
						href={SOURCE_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="underline underline-offset-4 hover:text-[#6045e8]"
					>
						Mã nguồn & thông tin giấy phép
					</a>
				</div>
			</div>
		</footer>
	);
}
