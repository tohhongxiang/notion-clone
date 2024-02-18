import { Button } from "@/components/ui/button";
import Logo from "./logo";

export function Footer() {
	return (
		<footer className="p-6 z-50 flex w-full items-center bg-background dark:bg-[#1F1F1F]">
			<Logo />
			<div className="flex w-full items-center justify-between gap-x-2 text-muted-foreground md:ml-auto md:justify-end">
				<Button variant="ghost" size="sm">
					Privacy Policy
				</Button>
				<Button variant="ghost" size="sm">
					Terms and Conditions
				</Button>
			</div>
		</footer>
	);
}
