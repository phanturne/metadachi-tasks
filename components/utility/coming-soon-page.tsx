// Adapted from https://ui.aceternity.com/components/background-beams

import { ShootingStars } from "@/components/aceternityui/shooting-stars";
import { StarsBackground } from "@/components/aceternityui/stars-background";
import React from "react";

const messages = [
	"Whoa, you’re early! We’re still putting the magic touch on something epic. Come back soon when it’s ready, or if you’re too eager, go check out our other cool stuff to keep you busy.",
	"Patience, human! We’re not quite done here. Pop back later for the big reveal, or if you’re really bored, poke around our other content for now.",
	"You’re a bit ahead of the game! We’re still working on our next big thing. Check back later when it’s ready, or distract yourself with our other awesome offerings in the meantime.",
	"Oops, you caught us too soon! We’re still perfecting what’s coming. Why not come back when it’s done? Or, if you can’t wait, go explore our other stuff. It’s pretty cool too.",
	"Hey, you’re a little too early! We’re still tinkering away here. Check back later, or dive into our other creations to kill some time.",
	"Whoa there! You’re ahead of schedule. We’re still putting the finishing touches on something awesome. Come back soon, or if you’re feeling curious, explore our other content.",
	"Hold up, you’re just a tad too early! We’re still working on what’s coming next. Swing by later, or if you’re itching for something cool, check out our other stuff.",
	"Easy there, early bird! We’re still making the magic happen. Come back soon, or if you’re in a browsing mood, go see what else we’ve got cooking.",
];

export default function ComingSoonPage() {
	// Randomly select one message
	const randomMessage = messages[Math.floor(Math.random() * messages.length)];

	return (
		<div className="relative flex size-full flex-col items-center justify-center rounded-md bg-neutral-950 antialiased">
			<div className="mx-auto max-w-2xl gap-2">
				<h1 className="relative z-10 bg-gradient-to-b from-neutral-200 to-neutral-600 bg-clip-text pb-2 text-center font-bold font-sans text-4xl text-transparent md:text-7xl">
					Coming Soon
				</h1>
				<p className="relative z-10 mx-auto my-2 max-w-lg text-center text-neutral-500">
					{randomMessage}
				</p>
			</div>
			<ShootingStars />
			<StarsBackground />
		</div>
	);
}
