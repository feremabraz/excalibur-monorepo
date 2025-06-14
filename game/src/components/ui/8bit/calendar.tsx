"use client";

import type * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { cva } from "class-variance-authority";

const calendarVariants = cva(
	"p-3 bg-card border-2 border-foreground shadow-[4px_4px_0_0_theme(colors.foreground)] dark:shadow-[4px_4px_0_0_theme(colors.ring)]",
	{
		variants: {
			font: {
				mono: "font-mono",
				sans: "font-sans",
				serif: "font-serif",
			},
		},
		defaultVariants: {
			font: "mono",
		},
	},
);

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
	font?: "mono" | "sans" | "serif";
};

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	font,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(calendarVariants({ font }), className)}
			classNames={{
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				month: "space-y-4",
				caption: "flex justify-center pt-1 relative items-center",
				caption_label: "text-sm font-medium",
				nav: "space-x-1 flex items-center",
				nav_button: cn(
					buttonVariants({ variant: "outline" }),
					"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
				),
				nav_button_previous: "absolute left-1",
				nav_button_next: "absolute right-1",
				table: "w-full border-collapse space-y-1",
				head_row: "flex",
				head_cell:
					"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
				row: "flex w-full mt-2",
				cell: "h-9 w-9 text-center text-sm p-0 relative",
				day: cn(
					buttonVariants({ variant: "ghost" }),
					"h-9 w-9 p-0 font-normal aria-selected:opacity-100",
				),
				day_range_end: "day-range-end",
				day_selected:
					"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
				day_today: "bg-accent text-accent-foreground",
				day_outside:
					"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
				day_disabled: "text-muted-foreground opacity-50",
				day_range_middle:
					"aria-selected:bg-accent aria-selected:text-accent-foreground",
				day_hidden: "invisible",
				...classNames,
			}}
			components={{
				IconLeft: (props) => (
					<svg className="h-4 w-4" viewBox="0 0 15 15" fill="none" {...props}>
						<title>Previous</title>
						<path
							d="m8.84182 3.13514c.04312.05562.04312.12306 0 .17868L7.06977 5.69226c-.02068.02663-.02068.06581 0 .09244L8.84182 7.16618c.04312.05562.04312.12306 0 .17868-.04312.05563-.11306.05563-.15618 0L6.26764 5.34487c-.07216-.09284-.07216-.22258 0-.31542L8.68564 3.13514c.04312-.05562.11306-.05562.15618 0Z"
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
						/>
					</svg>
				),
				IconRight: (props) => (
					<svg className="h-4 w-4" viewBox="0 0 15 15" fill="none" {...props}>
						<title>Next</title>
						<path
							d="m6.1584 3.13508c-.04312.05562-.04312.12306 0 .17868l1.7719 2.37844c.02068.02663.02068.06581 0 .09244L6.1584 7.16617c-.04312.05562-.04312.12306 0 .17868.04312.05562.11306.05562.15618 0l2.4182-2.99995c.0722-.09284.0722-.22258 0-.31542L6.31458 3.13508c-.04312-.05562-.11306-.05562-.15618 0Z"
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
						/>
					</svg>
				),
			}}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
