"use client";

import { ModeToggle } from "@/components/mode-toggle";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import Logo from "./logo";

export default function Navbar() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const scrolled = useScrollTop();
	return (
		<nav
			className={cn(
				"fixed top-0 z-50 flex w-full items-center bg-background p-6 dark:bg-[#1F1F1F]",
				scrolled && "border-b shadow-sm"
			)}
		>
			<Logo />
			<div className="flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end">
				{isLoading && <Spinner />}
				{!isAuthenticated && !isLoading && (
					<>
						<SignInButton mode="modal">
							<Button variant="ghost" size="sm">
								Log In
							</Button>
						</SignInButton>
						<SignInButton mode="modal">
							<Button size="sm">Get Jotion Free</Button>
						</SignInButton>
					</>
				)}
				{isAuthenticated && !isLoading && (
					<>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/documents">Enter Jotion</Link>
						</Button>
						<UserButton afterSignOutUrl="/" />
					</>
				)}
				<ModeToggle />
			</div>
		</nav>
	);
}
