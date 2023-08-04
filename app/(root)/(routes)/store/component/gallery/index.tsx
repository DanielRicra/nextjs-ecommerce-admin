"use client";

import { useState } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper/types";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import "./styles.css";

import { type Image as ImageModel } from "@prisma/client";
import Image from "next/image";

interface GalleryProps {
	images: ImageModel[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

	return (
		<div className="mx-auto w-full max-w-2xl sm:block lg:max-w-none">
			<Swiper
				style={
					{
						"--swiper-navigation-color": "#000",
						"--swiper-pagination-color": "#000",
					} as React.CSSProperties
				}
				spaceBetween={10}
				navigation={true}
				thumbs={{ swiper: thumbsSwiper }}
				modules={[FreeMode, Navigation, Thumbs]}
				className="aspect-square w-full border rounded-md mb-4 mySwiper2"
			>
				{images.map((image) => (
					<SwiperSlide key={image.id}>
						<Image
							src={image.url}
							fill
							alt="product image"
							className="object-cover"
						/>
					</SwiperSlide>
				))}
			</Swiper>

			<Swiper
				onSwiper={(swiper) => setThumbsSwiper(swiper)}
				spaceBetween={10}
				slidesPerView={4}
				freeMode={true}
				watchSlidesProgress={true}
				modules={[FreeMode, Navigation, Thumbs]}
				className="h-[120px] py-2 mySwiper"
			>
				{images.map((image) => (
					<SwiperSlide
						key={image.id}
						className="border rounded-md w-[25%] aspect-square overflow-hidden"
					>
						<Image
							src={image.url}
							fill
							alt="product image"
							className="block object-cover cursor-pointer"
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};
export default Gallery;
