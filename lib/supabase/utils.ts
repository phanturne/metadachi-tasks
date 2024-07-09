/**
 * Constructs a URL for an image stored in Supabase storage.
 *
 * @param bucket - The name of the storage bucket.
 * @param imagePath - The path to the image within the bucket.
 * @returns The full URL to the image.
 */
export function getImageUrl(bucket: string, imagePath: string): string {
	return `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${bucket}/${imagePath}`;
}
