"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

export default function DocumentsPage() {
	const { user } = useUser();

	return (
		<div className="flex h-full flex-col items-center justify-center space-y-4">
			<Image
				src="/empty.png"
				height={300}
				width={300}
				alt="empty"
				className="dark:hidden"
			/>
			<Image
				src="/empty-dark.png"
				height={300}
				width={300}
				alt="empty"
				className="hidden dark:block"
			/>
			<h2 className="text-lg font-medium">
				Welcome to {user?.username}&apos;s Jotion
			</h2>
			<Button>
				<PlusCircle className="mr-2 h-4 w-4" /> Create a Note
			</Button>
		</div>
	);
}
