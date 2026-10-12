"use client";

import { createContext, use, useEffect, useMemo, useState } from "react";

import type { ReactNode } from "react";

export type Language = "vi" | "en";

const translations: Record<Language, Record<string, string>> = {
	vi: {
		"language.label": "Ngôn ngữ",
		"language.vietnamese": "Tiếng Việt",
		"language.english": "English",
		"nav.Dashboard": "Tổng quan",
		"nav.Activity": "Hoạt động",
		"nav.Agents": "Tác nhân AI",
		"nav.Model Usage": "Mức sử dụng model",
		"nav.Analytics": "Phân tích",
		"nav.Usage & Metrics": "Sử dụng & chỉ số",
		"nav.API Keys": "API key",
		"nav.Prompts": "Prompt",
		"nav.Preferences": "Tùy chọn",
		"nav.Payments SDK": "Payments SDK",
		"nav.Routing": "Định tuyến",
		"nav.Dynamic Routes": "Định tuyến động",
		"nav.Guardrails": "Guardrails",
		"nav.Team": "Nhóm",
		"nav.Provider Keys": "Khóa nhà cung cấp",
		"nav.Your Discounts": "Ưu đãi của bạn",
		"nav.Models": "Model",
		"nav.Skills": "Kỹ năng",
		"nav.Compliance": "Tuân thủ",
		"nav.Billing": "Thanh toán",
		"nav.Settings": "Cài đặt",
		"nav.Organization": "Tổ chức",
		"nav.Project": "Dự án",
		"nav.Tools & Resources": "Công cụ & tài nguyên",
		"nav.Security Events": "Sự kiện bảo mật",
		"nav.Data Streams": "Luồng dữ liệu",
		"nav.Master Keys": "Khóa chính",
		"nav.SSO": "SSO",
		"nav.Transactions": "Giao dịch",
		"nav.Referrals": "Giới thiệu",
		"nav.Limits": "Giới hạn",
		"nav.Policies": "Chính sách",
		"nav.Notifications": "Thông báo",
		"nav.Smart Routing": "Định tuyến thông minh",
		"nav.Audit Logs": "Nhật ký kiểm tra",
		"nav.Account": "Tài khoản",
		"nav.Security": "Bảo mật",
		"nav.Log out": "Đăng xuất",
		"nav.Search links...": "Tìm trong menu...",
		"nav.dashboard": "Tổng quan",
		"nav.activity": "Hoạt động",
		"nav.agents": "Tác nhân AI",
		"nav.modelUsage": "Mức sử dụng model",
		"nav.analytics": "Phân tích",
		"nav.usageMetrics": "Sử dụng & chỉ số",
		"nav.apiKeys": "API key",
		"nav.prompts": "Prompt",
		"nav.preferences": "Tùy chọn",
		"nav.paymentsSdk": "Payments SDK",
		"nav.routing": "Định tuyến",
		"nav.dynamicRoutes": "Định tuyến động",
		"nav.guardrails": "Guardrails",
		"nav.team": "Nhóm",
		"nav.providerKeys": "Khóa nhà cung cấp",
		"nav.discounts": "Ưu đãi của bạn",
		"nav.models": "Model",
		"nav.skills": "Kỹ năng",
		"nav.compliance": "Tuân thủ",
		"nav.billing": "Thanh toán",
		"nav.settings": "Cài đặt",
		"auth.loginTitle": "Đăng nhập",
		"auth.loginDescription": "Đăng nhập để tiếp tục đến tài khoản của bạn.",
		"auth.loginPrompt": "Nhập thông tin đăng nhập để mở bảng điều khiển.",
		"auth.signupTitle": "Tạo tài khoản miễn phí",
		"auth.signupDescription":
			"Không cần thẻ thanh toán. Bắt đầu chỉ trong vài giây.",
		"auth.email": "Email",
		"auth.password": "Mật khẩu",
		"auth.name": "Tên",
		"auth.forgotPassword": "Quên mật khẩu?",
		"auth.continue": "Tiếp tục",
		"auth.or": "Hoặc",
		"auth.signingIn": "Đang đăng nhập...",
		"auth.signInPasskey": "Đăng nhập bằng passkey",
		"auth.signInSso": "Đăng nhập bằng SSO",
		"auth.signUpPrompt": "Chưa có tài khoản? Đăng ký",
		"auth.nameOptional": "Tên (không bắt buộc)",
		"auth.passwordMin12Hint": "Mật khẩu tối thiểu 12 ký tự",
		"auth.newsletter": "Nhận cập nhật sản phẩm",
		"auth.creatingAccount": "Đang tạo tài khoản...",
		"auth.startFree": "Bắt đầu miễn phí",
		"auth.termsAgreement": "Khi đăng ký, bạn đồng ý với",
		"auth.terms": "Điều khoản sử dụng PShareHub AI Gateway",
		"auth.signInPrompt": "Đã có tài khoản? Đăng nhập",
		"auth.signIn": "Đăng nhập",
		"auth.signUp": "Đăng ký",
		"auth.createAccount": "Tạo tài khoản",
		"auth.noAccount": "Chưa có tài khoản?",
		"auth.hasAccount": "Đã có tài khoản?",
		"auth.orContinueWith": "Hoặc tiếp tục với",
		"auth.validEmail": "Vui lòng nhập địa chỉ email hợp lệ",
		"auth.passwordMin": "Mật khẩu cần có ít nhất 8 ký tự",
		"auth.passwordMin12": "Mật khẩu cần có ít nhất 12 ký tự",
		"auth.loginSuccess": "Đăng nhập thành công",
		"auth.accountCreated": "Đã tạo tài khoản",
		"auth.verifyEmail":
			"Vui lòng kiểm tra email và xác minh tài khoản trước khi đăng nhập.",
		"dashboard.organizationCredits": "Số dư tổ chức",
		"dashboard.availableBalance": "Số dư khả dụng",
		"dashboard.totalRequests": "Tổng số yêu cầu",
		"dashboard.totalSpend": "Tổng chi phí",
		"dashboard.creditsSpend": "Chi phí từ số dư",
		"dashboard.byokUsage": "Sử dụng BYOK",
		"dashboard.totalSavings": "Tổng tiền tiết kiệm",
		"dashboard.discountsThisPeriod": "Ưu đãi trong kỳ này",
		"dashboard.inputTokens": "Token đầu vào",
		"dashboard.outputTokens": "Token đầu ra",
		"dashboard.cachedTokens": "Token đã lưu bộ nhớ đệm",
		"dashboard.topModel": "Model được dùng nhiều nhất",
		"dashboard.noUsageYet": "Chưa có dữ liệu sử dụng",
		"dashboard.usageMetrics": "Sử dụng & chỉ số",
		"dashboard.createApiKey": "Tạo API key",
		"dashboard.cacheHitRate": "tỷ lệ cache hit",
		"dashboard.errors": "lỗi",
		"dashboard.loading": "Đang tải...",
		"dashboard.trendsCompare": "Xu hướng so với",
		"dashboard.title": "Tổng quan",
		"dashboard.project": "Dự án",
		"dashboard.organization": "Tổ chức",
		"dashboard.cacheHitRateLabel": "tỷ lệ cache hit",
		"dashboard.errorCount": "lỗi",
		"dashboard.credits": "tín dụng",
		"dashboard.notBilled": "không tính phí",
		"dashboard.providerKeysUsage":
			"Được xử lý bằng khóa nhà cung cấp của bạn — không trừ tín dụng",
		"dashboard.avgPerRequest": "trung bình mỗi yêu cầu",
		"dashboard.requestsLabel": "yêu cầu",
		"dashboard.storageLabel": "lưu trữ",
		"dashboard.spendLabel": "chi phí",
		"dashboard.includedInInput": "đã tính trong token đầu vào",
		"dashboard.via": "qua",
		"dashboard.topUpTitle": "Nạp tiền để bắt đầu gửi yêu cầu",
		"dashboard.topUpDescription":
			"Thêm tín dụng vào tổ chức để mở khóa các model trả phí. Bạn luôn có thể dùng model miễn phí tại Lounge.",
		"dashboard.payAsYouGo": "Dùng bao nhiêu, trả bấy nhiêu",
		"dashboard.creditsNeverExpire":
			"Tín dụng không hết hạn. Bạn chỉ trả cho phần đã sử dụng.",
		"dashboard.freeModels": "Model miễn phí",
		"dashboard.tryFreeModels": "Dùng thử model miễn phí mà không cần nạp tiền.",
		"dashboard.secureCheckout": "Thanh toán an toàn",
		"dashboard.stripeCheckout":
			"Được cung cấp bởi Stripe. Bạn có thể hủy hoặc yêu cầu hoàn tiền bất cứ lúc nào.",
		"dashboard.tryModelsLounge": "Dùng thử model tại Lounge",
		"dashboard.docs": "Tài liệu",
		"dashboard.getStarted": "Bắt đầu",
		"dashboard.setupCalls":
			"Bạn đã gửi {count} yêu cầu trong quá trình thiết lập! Hãy tích hợp LLM Gateway vào mã nguồn của bạn.",
		"dashboard.setupFirstCall":
			"Bạn đã gửi yêu cầu đầu tiên trong quá trình thiết lập! Hãy tích hợp LLM Gateway vào mã nguồn của bạn.",
		"dashboard.integrateInOneLine":
			"Tích hợp LLM Gateway chỉ với một dòng — thay đổi base URL là xong.",
		"dashboard.lounge": "Lounge",
		"dashboard.models": "Model",
		"dashboard.usageOverview": "Tổng quan mức sử dụng",
		"dashboard.dailyInferenceSpend":
			"Chi phí suy luận hằng ngày theo giá niêm yết của nhà cung cấp",
		"dashboard.dailyRequests": "Số yêu cầu hằng ngày",
		"dashboard.dailySpendByToken": "Chi phí suy luận hằng ngày theo loại token",
		"dashboard.requestsByDay": "Số lượng yêu cầu hằng ngày",
		"dashboard.costs": "Chi phí",
		"dashboard.requestsTab": "Yêu cầu",
		"dashboard.total": "Tổng",
		"dashboard.breakdown": "Chi tiết",
		"dashboard.searchDateRanges": "Tìm khoảng thời gian...",
		"date.custom": "Tùy chỉnh",
		"date.today": "Hôm nay",
		"date.thisWeek": "Tuần này",
		"date.thisMonth": "Tháng này",
		"date.thisYear": "Năm nay",
		"date.lastWeek": "Tuần trước",
		"date.lastMonth": "Tháng trước",
		"date.lastYear": "Năm trước",
		"date.last30Days": "30 ngày qua",
		"date.last90Days": "90 ngày qua",
		"date.last6Months": "6 tháng qua",
		"date.thisQuarter": "Quý này",
		"date.lastQuarter": "Quý trước",
		"date.twoQuartersAgo": "2 quý trước",
		"date.threeQuartersAgo": "3 quý trước",
		"date.allTime": "Toàn thời gian",
		"date.from": "Từ ngày",
		"date.to": "Đến ngày",
		"date.selectDay": "Chọn ngày",
		"date.selectRange": "Chọn ngày bắt đầu và kết thúc",
		"date.apply": "Áp dụng khoảng thời gian",
		"date.compare": "So sánh",
		"common.cancel": "Hủy",
		"apikeys.title": "API key",
		"apikeys.description":
			"Tạo và quản lý API key để xác thực yêu cầu gửi đến PShareHub AI Gateway.",
		"apikeys.create": "Tạo API key",
		"apikeys.selectProject": "Vui lòng chọn dự án để xem API key.",
		"apikeys.loading": "Đang tải API key...",
		"apikeys.loadFailed": "Không thể tải API key. Vui lòng thử lại.",
		"apikeys.empty": "Bạn chưa tạo API key nào.",
		"apikeys.noFilterMatch": "Không có API key nào khớp với bộ lọc đã chọn.",
		"apikeys.createDescription":
			"Tạo API key mới để truy cập PShareHub AI Gateway.",
		"apikeys.project": "Dự án",
		"apikeys.iamCreateHint":
			"Sau khi tạo, bạn có thể cấu hình quy tắc IAM để giới hạn model, nhà cung cấp hoặc mức giá được phép.",
		"apikeys.name": "Tên API key",
		"apikeys.namePlaceholder": "Ví dụ: API key production",
		"apikeys.personalPolicy":
			"Chính sách mặc định cá nhân hoặc tổ chức của bạn",
		"common.creating": "Đang tạo...",
		"common.done": "Xong",
		"apikeys.created": "Đã tạo API key",
		"apikeys.createdCopy":
			"API key đã được tạo. Hãy sao chép ngay vì bạn sẽ không thể xem lại sau khi đóng hộp thoại.",
		"apikeys.iamCreatedHint":
			"Bạn có thể cấu hình quy tắc IAM cho key này để giới hạn quyền truy cập model trong trang API key.",
		"apikeys.copy": "Sao chép API key",
		"apikeys.storeSecurely":
			"Hãy lưu API key này ở nơi an toàn. Bạn sẽ không thể xem lại sau khi đóng hộp thoại.",
		"apikeys.createPrompt": "Tạo API key mới",
		"apikeys.all": "Tất cả",
		"apikeys.active": "Đang hoạt động",
		"apikeys.inactive": "Đã tắt",
		"usage.title": "Mức sử dụng",
		"usage.description": "Theo dõi mức sử dụng, chi phí và hoạt động của API.",
		"usage.apiKeysAll": "Tất cả API key",
		"usage.requests": "Yêu cầu",
		"usage.models": "Model",
		"usage.errors": "Lỗi",
		"usage.cache": "Bộ nhớ đệm",
		"usage.costs": "Chi phí",
		"usage.requestVolume": "Số lượng yêu cầu",
		"usage.requestsOverTime": "Số yêu cầu API theo thời gian",
		"usage.topModels": "Model được dùng nhiều nhất",
		"usage.breakdownByModel": "Mức sử dụng theo model",
		"usage.errorRate": "Tỷ lệ lỗi",
		"usage.cacheRate": "Tỷ lệ cache",
		"usage.costBreakdown": "Chi tiết chi phí",
		"usage.requestErrors": "Lỗi yêu cầu",
		"usage.errorRateDescription": "Tỷ lệ lỗi của yêu cầu API theo thời gian",
		"usage.cacheRateDescription": "Tỷ lệ cache của yêu cầu API theo thời gian",
		"usage.estimatedCosts": "Chi phí ước tính theo nhà cung cấp và model",
		"settings.title": "Tùy chọn",
		"settings.description": "Quản lý tùy chọn cho dự án của bạn.",
		"settings.projectId": "ID dự án",
		"settings.projectIdDescription":
			"Dùng ID này khi tham chiếu đến dự án trong API hoặc khi liên hệ hỗ trợ.",
		"settings.copyProjectId": "Sao chép ID dự án",
		"settings.projectName": "Tên dự án",
		"settings.projectNameDescription": "Cập nhật tên hiển thị của dự án.",
		"settings.projectMode": "Chế độ dự án",
		"settings.projectModeDescription": "Cấu hình cách tổ chức quản lý dự án.",
		"settings.caching": "Bộ nhớ đệm",
		"settings.cachingDescription":
			"Cấu hình bộ nhớ đệm prompt của nhà cung cấp và bộ nhớ đệm phản hồi của gateway.",
		"settings.dangerZone": "Khu vực nguy hiểm",
		"settings.irreversible": "Các thao tác không thể hoàn tác.",
	},
	en: {},
};

interface LanguageContextValue {
	language: Language;
	setLanguage: (language: Language) => void;
	t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguageState] = useState<Language>("vi");

	useEffect(() => {
		const savedLanguage = window.localStorage.getItem("psharehub-language");
		if (savedLanguage === "vi" || savedLanguage === "en") {
			setLanguageState(savedLanguage);
		}
	}, []);

	useEffect(() => {
		document.documentElement.lang = language;
	}, [language]);

	const value = useMemo<LanguageContextValue>(
		() => ({
			language,
			setLanguage: (nextLanguage) => {
				window.localStorage.setItem("psharehub-language", nextLanguage);
				setLanguageState(nextLanguage);
			},
			t: (key, fallback = key) => translations[language][key] ?? fallback,
		}),
		[language],
	);

	return <LanguageContext value={value}>{children}</LanguageContext>;
}

export function useLanguage() {
	const context = use(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within LanguageProvider");
	}
	return context;
}
