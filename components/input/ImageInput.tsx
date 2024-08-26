import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function ImageInput({
	src,
	image,
	onSrcChange,
	onImageChange,
	width = 200,
	height = 200,
	label = "",
}: {
	src: string;
	image: File | null;
	onSrcChange: (src: string) => void;
	onImageChange: (image: File) => void;
	width?: number;
	height?: number;
	label?: string;
}) {
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);
	const [previewSrc, setPreviewSrc] = React.useState<string>(src);
	const [previewImage, setPreviewImage] = useState<File | null>(image);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target?.files[0];

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

				setPreviewSrc(squareUrl);
				setPreviewImage(file);
				onSrcChange(squareUrl);
				onImageChange(file);
			};
		}
	};

	return (
		<div className="flex flex-col gap-2">
			{label && <Label htmlFor="image-upload">{label}</Label>}
			<div className="flex w-full items-center gap-4">
				{previewSrc && (
					<img
						height={height}
						width={width}
						src={previewSrc}
						alt="Preview"
						className="rounded-full object-cover"
					/>
				)}
				<Button
					variant="outline"
					size="sm"
					onClick={() => fileInputRef.current?.click()}
					className="gap-2"
				>
					<Upload className="h-4 w-4" />
					Upload an image
				</Button>
				<input
					id="image-upload"
					type="file"
					accept="image/*"
					ref={fileInputRef}
					className="hidden"
					onChange={handleImageSelect}
				/>
			</div>
		</div>
	);
}
