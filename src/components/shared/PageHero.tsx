import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ReactNode } from 'react';
interface PageHeroProps {
  backgroundImage: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  iconLabel?: string;
  imagePosition?: string;
}
const PageHero = ({
  backgroundImage,
  title,
  subtitle,
  icon,
  iconLabel,
  imagePosition = 'center'
}: PageHeroProps) => {
  const {
    isRTL
  } = useLanguage();
  const heroAnim = useScrollAnimation();
  return <section className="relative min-h-[70vh] sm:min-h-[75vh] flex flex-col overflow-visible -mt-20">
      {/* Full Background Image - No overlay, sharp and sparkling */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt={title}
          className="w-full h-full object-cover" 
          style={{ objectPosition: imagePosition }}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
        />
      </div>

      {/* Spacer to push content box to bottom */}
      <div className="flex-grow" />

      {/* Content Box - Overflows into next section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 translate-y-12 sm:translate-y-16 lg:translate-y-20">
        <div ref={heroAnim.ref} className={cn("max-w-5xl mx-auto transition-all duration-700", heroAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          {/* Text Box - wider and narrower */}
          <div className={cn("bg-primary/95 backdrop-blur-sm px-5 py-5 sm:px-8 sm:py-6 lg:px-12 lg:py-8 shadow-2xl", isRTL && "font-hebrew text-right")}>
            {/* Icon and Label */}
            {icon && iconLabel && <div className={cn("flex items-center gap-3 mb-4", isRTL && "flex-row-reverse")}>
                {icon}
                <span className="text-accent font-medium">{iconLabel}</span>
              </div>}

            {/* Gold accent line */}
            <div className={cn("w-16 h-1 bg-accent mb-4", isRTL && "mr-0 ml-auto")} />

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-primary-foreground mb-4 leading-tight">
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle}
          </div>
        </div>
      </div>
    </section>;
};
export default PageHero;