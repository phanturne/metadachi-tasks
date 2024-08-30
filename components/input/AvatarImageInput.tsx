// Source: https://github.com/mckaywrigley/chatbot-ui/blob/main/components/ui/image-picker.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function AvatarImageInput({
	src,
	name,
	onSrcChange,
	onImageChange,
}: {
	src: string;
	name?: string;
	onSrcChange: (src: string) => void;
	onImageChange: (image: File) => void;
}) {
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target.files[0];

			if (file.size > 6000000) {
				toast.error("Image must be less than 6MB!");
				return;
			}

			const url = URL.createObjectURL(file);

			const img = new window.Image();
			img.src = url;

			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					toast.error("Unable to create canvas context.");
					return;
				}

				const size = Math.min(img.width, img.height);
				canvas.width = size;
				canvas.height = size;

				ctx.drawImage(
					img,
					(img.width - size) / 2,
					(img.height - size) / 2,
					size,
					size,
					0,
					0,
					size,
					size,
				);

				const squareUrl = canvas.toDataURL();

				onSrcChange(squareUrl);
				onImageChange(file);
			};
		}
	};

	return (
		<div className="relative inline-block">
			<Avatar className="h-12 w-12">
				<AvatarImage src={src} alt={name || "User avatar"} />
				<AvatarFallback>
					{name ? name.charAt(0).toUpperCase() : "U"}
				</AvatarFallback>
			</Avatar>
			<Button
				size="icon"
				variant="secondary"
				className="-bottom-1 -right-1 absolute h-5 w-5 rounded-full shadow"
				onClick={() => fileInputRef.current?.click()}
			>
				<Pen className="h-2.5 w-2.5" />
				<span className="sr-only">Edit avatar</span>
			</Button>
			<input
				type="file"
				accept="image/*"
				ref={fileInputRef}
				className="hidden"
				onChange={handleImageSelect}
			/>
		</div>
	);
}
