"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const formSchema = z.object({
	input: z.string().startsWith("{").endsWith("}").includes("data"),
});

type TData = {
	is_success: boolean;
	user_id: string;
	email: string;
	roll_number: string;
	numbers: string[];
	alphabets: string[];
	highest_alphabet: string[];
};

export function HomeForm() {
	const [data, setData] = useState<TData>();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			input: "",
		},
	});

	const validateJsonString = (jsonString: string) => {
		try {
			JSON.parse(jsonString);
			return true;
		} catch (error) {
			console.error("Validation failed:", error);
			return false;
		}
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (validateJsonString(values.input)) {
			const res = await fetch("/bfhl", {
				method: "POST",
				body: values.input,
			});
			const resData = await res.json();
			setData(resData);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="my-auto mx-auto space-y-8 max-w-7xl"
			>
				<FormField
					control={form.control}
					name="input"
					render={({ field }) => (
						<FormItem>
							<FormLabel>API Input</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full">
					Submit
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger></DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Alphabets</DropdownMenuItem>
						<DropdownMenuItem>Numbers</DropdownMenuItem>
						<DropdownMenuItem>Highest Alphabet</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<div>
					<h2>Filtered Response</h2>
					<div>Numbers: {data?.numbers.map((num) => `${num},`)}</div>
					<div>Alphabets: {data?.alphabets.map((alpha) => `${alpha},`)}</div>
					<div>Highest alphabet: {data?.highest_alphabet[0]}</div>
				</div>
			</form>
		</Form>
	);
}
