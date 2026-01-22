'use client'

import Autoplay from 'embla-carousel-autoplay'
import { Image } from '@heroui/image'

import EventsSection from '@/components/ui/cards/EventsSection'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'
import { homepagePictures } from '@/config/site'

export default function Home() {
    return (
        <>
            <Carousel
                className="w-full"
                opts={{
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 4000,
                    }),
                ]}
            >
                <CarouselContent>
                    {homepagePictures.map((pictureUrl) => (
                        <CarouselItem
                            key={pictureUrl}
                            className="rounded-lg overflow-hidden"
                        >
                            <div className="flex items-center pt-0 md:pt-50 justify-center max-h-110 md:max-h-130 rounded-lg overflow-hidden">
                                <Image
                                    removeWrapper
                                    alt={'homepage image: ' + pictureUrl}
                                    className="w-full h-full object-cover"
                                    src={'/homepageImages/' + pictureUrl}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <EventsSection />
        </>
    )
}
