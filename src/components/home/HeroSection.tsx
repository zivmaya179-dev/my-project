import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
const heroImage = '/images/tel-aviv-hero-new.webp';

const HeroSection = () => {
  const {
    t,
    isRTL
  } = useLanguage();
  
  return <section className="relative z-10 -mt-20 pt-20 min-h-[90vh] flex flex-col overflow-visible" style={{ contain: 'layout style' }}>
      {/* Full Background Image - optimized for LCP */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Israel skyline and coastline at dusk"
          className="w-full h-full object-cover" 
          src={heroImage}
          fetchPriority="high" 
          loading="eager" 
          decoding="sync"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
          width={1920} 
          height={1080}
        />
      </div>

      {/* Spacer to push content box to bottom */}
      <div className="flex-grow" />

      {/* Content Box - Overflows into next section */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 translate-y-12 sm:translate-y-16 lg:translate-y-20">
        <div className={cn("max-w-2xl", isRTL ? "ml-auto mr-4 lg:mr-8" : "mr-auto ml-4 lg:ml-8")}>
          {/* Text Box - optimized for faster render */}
          <div className={cn("bg-primary/95 px-5 py-5 sm:px-10 sm:py-8 lg:px-12 lg:py-10 shadow-2xl", isRTL && "font-hebrew text-right")}>
            {/* Tagline */}
            <h1 className={cn("text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-primary-foreground mb-4 leading-tight", isRTL && "font-hebrew")}>
              {t('hero.tagline')}
            </h1>

            {/* Gold accent line */}
            <div className={cn("w-16 h-1 bg-accent mb-6", isRTL && "mr-0 ml-auto")} />


            {/* Sub-headline Line 1 - Context */}
            <p className={cn("text-xl sm:text-2xl text-primary-foreground/90 font-medium mb-3", isRTL && "font-hebrew")}>
              {t('hero.subtitle1')}
            </p>


          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;