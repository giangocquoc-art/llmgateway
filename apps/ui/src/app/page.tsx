import dynamic from "next/dynamic";

import { HeroRSC } from "@/components/landing/hero-rsc";
import { LandingHero } from "@/components/landing/landing-hero";

const TrustBar = dynamic(() =>
	import("@/components/enterprise/trust-bar").then(
		(mod) => mod.TrustBarEnterprise,
	),
);
const Faq = dynamic(() =>
	import("@/components/landing/faq").then((mod) => mod.Faq),
);
const EnterpriseCTA = dynamic(() =>
	import("@/components/landing/enterprise-cta").then(
		(mod) => mod.EnterpriseCTA,
	),
);
const CallToAction = dynamic(() => import("@/components/landing/cta"));
const Footer = dynamic(() => import("@/components/landing/footer"));

export default function Home() {
	return (
		<>
			<HeroRSC />
			<main>
				<LandingHero />
				<TrustBar />
				<Faq />
				<EnterpriseCTA />
				<CallToAction />
			</main>
			<Footer />
		</>
	);
}
