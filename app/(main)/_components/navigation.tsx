"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import {
	ChevronsLeft,
	MenuIcon,
	Plus,
	PlusCircle,
	Search,
	Settings,
	Trash,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ElementRef, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { DocumentList } from "./document-list";
import Item from "./item";
import TrashBox from "./trash-box";
import UserItem from "./user-item";

export default function Navigation() {
	const settings = useSettings();
	const search = useSearch();
	const pathname = usePathname();
	const isMobile = useMediaQuery("(max-width: 768px)");
	const create = useMutation(api.documents.create);

	const isResizingRef = useRef(false);
	const sidebarRef = useRef<ElementRef<"aside">>(null);
	const navbarRef = useRef<ElementRef<"div">>(null);

	const [isResetting, setIsResetting] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(isMobile);

	const handleMouseDown = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault();
		event.stopPropagation();

		isResizingRef.current = true;
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isResizingRef.current) return;

		let newWidth = e.clientX;

		if (newWidth < 240) newWidth = 240;
		if (newWidth > 480) newWidth = 480;

		if (sidebarRef.current && navbarRef.current) {
			sidebarRef.current.style.width = `${newWidth}px`;
			navbarRef.current.style.setProperty("left", `${newWidth}px`);
			navbarRef.current.style.setProperty(
				"width",
				`calc(100% - ${newWidth}px)`
			);
		}
	};

	const handleMouseUp = () => {
		isResizingRef.current = false;
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	};

	const resetWidth = useCallback(() => {
		if (sidebarRef.current && navbarRef.current) {
			setIsCollapsed(false);
			setIsResetting(true);

			sidebarRef.current.style.width = isMobile ? "100%" : "240px";
			navbarRef.current.style.setProperty(
				"width",
				isMobile ? "0" : "calc(100% - 240px)"
			);
			navbarRef.current.style.setProperty(
				"left",
				isMobile ? "100%" : "240px"
			);

			setTimeout(() => setIsResetting(false), 300);
		}
	}, [isMobile]);

	const collapse = () => {
		if (sidebarRef.current && navbarRef.current) {
			setIsCollapsed(true);
			setIsResetting(true);

			sidebarRef.current.style.width = "0";
			navbarRef.current.style.setProperty("width", "100%");
			navbarRef.current.style.setProperty("left", "0");

			setTimeout(() => setIsResetting(false), 300);
		}
	};

	useEffect(() => {
		if (isMobile) {
			collapse();
		} else {
			resetWidth();
		}
	}, [isMobile, resetWidth]);

	useEffect(() => {
		if (isMobile) {
			collapse();
		}
	}, [pathname, isMobile]);

	const handleCreate = () => {
		const promise = create({ title: "Untitled" });

		toast.promise(promise, {
			loading: "Creating a new note...",
			success: "New note created!",
			error: "Failed to create a new note.",
		});
	};

	return (
		<>
			<aside
				ref={sidebarRef}
				className={cn(
					"group/sidebar relative z-[99999] flex h-full w-60 flex-col overflow-y-auto bg-secondary",
					isResetting && "transition-all duration-300 ease-in-out",
					isMobile && "w-0"
				)}
			>
				<button
					onClick={collapse}
					className={cn(
						"absolute right-2 top-3 h-6 w-6 rounded-sm text-muted-foreground opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100 dark:hover:bg-neutral-600",
						isMobile && "opacity-100"
					)}
				>
					<ChevronsLeft className="h-6 w-6" />
				</button>
				<div>
					<UserItem />
					<Item
						label="Search"
						icon={Search}
						isSearch
						onClick={search.onOpen}
					/>
					<Item
						label="Settings"
						icon={Settings}
						onClick={settings.onOpen}
					/>
					<Item
						onClick={handleCreate}
						label="New page"
						icon={PlusCircle}
					/>
				</div>
				<div className="mt-4">
					<DocumentList />
					<Item
						onClick={handleCreate}
						icon={Plus}
						label="Add a page"
					/>
					<Popover>
						<PopoverTrigger className="mt-4 w-full">
							<Item label="Trash" icon={Trash} />
						</PopoverTrigger>
						<PopoverContent
							className="w-72 p-0"
							side={isMobile ? "bottom" : "right"}
						>
							<TrashBox />
						</PopoverContent>
					</Popover>
				</div>
				<button
					onMouseDown={handleMouseDown}
					onClick={resetWidth}
					className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
				/>
			</aside>
			<div
				ref={navbarRef}
				className={cn(
					"absolute left-60 top-0 z-[99999] w-[calc(100%-240px)]",
					isResetting && "transition-all duration-300 ease-in-out",
					isMobile && "left-0 w-full"
				)}
			>
				<nav className="w-full bg-transparent px-3 py-2">
					{isCollapsed && (
						<MenuIcon
							onClick={resetWidth}
							role="button"
							className="h-6 w-6 text-muted-foreground"
						/>
					)}
				</nav>
			</div>
		</>
	);
}
