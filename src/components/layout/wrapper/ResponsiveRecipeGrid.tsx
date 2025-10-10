import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";

const ResponsiveRecipeGrid = ({
  children,
  swipe = false,
}: {
  children: React.ReactNode;
  swipe?: boolean;
}) => {
  return (
    <>
      {/* Mobile: Carousel (only when swipe=true) */}
      {swipe && (
        <div className="block sm:hidden">
          <Carousel>
            <CarouselContent>
              {React.Children.toArray(children).map((child, index) => (
                <CarouselItem key={index}>{child}</CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      )}

      {/* Desktop: Grid (always shown, or when swipe=false) */}
      <div
        className={`grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 ${
          swipe ? "hidden sm:grid" : ""
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default ResponsiveRecipeGrid;
