import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useLocalePath } from '@/hooks/useLocalePath';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { FileCheck, Clock, MessageCircle, ArrowRight, ArrowLeft, Target, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import PageHero from '@/components/shared/PageHero';
import mayaPortrait from '@/assets/maya-portrait.webp';
import aboutHeroBg from '@/assets/about-hero-globe.webp';
import { SEO, attorneySchema } from '@/components/SEO';
import MethodologySection from '@/components/home/MethodologySection';

const About = () => {
  const { t, isRTL, language } = useLanguage();
  const localePath = useLocalePath();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const expectations = [
    {
      icon: FileCheck,
      titleKey: 'about.expect.doc.title',
      descKey: 'about.expect.doc.desc',
    },
    {
      icon: Globe,
      titleKey: 'about.expect.intl.title',
      descKey: 'about.expect.intl.desc',
    },
    {
      icon: Clock,
      titleKey: 'about.expect.timeline.title',
      descKey: 'about.expect.timeline.desc',
    },
    {
      icon: MessageCircle,
      titleKey: 'about.expect.comm.title',
      descKey: 'about.expect.comm.desc',
    },
    {
      icon: Target,
      titleKey: 'about.expect.foresight.title',
      descKey: 'about.expect.foresight.desc',
    },
  ];

  // Scroll animations
  const philosophyAnim = useScrollAnimation();
  const attorneyAnim = useScrollAnimation();
  const serveAnim = useScrollAnimation();
  const expectAnim = useScrollAnimation();
  const ctaAnim = useScrollAnimation();

  return (
    <Layout>
      <SEO
        titleEn="About Maya Ziv | Attorney with Legal and Financial Expertise | Israel"
        titleHe="מאיה זיו משרד עורכי דין | מקרקעין | מיסוי בינלאומי | ניהול עזבונות וצוואות"
        descriptionEn="Maya Ziv holds an LLB and a BBA in Finance from Baruch College New York. Prior experience at Citi Innovation Lab and Vornado Realty Trust. Complex transactions where law and finance intersect."
        descriptionHe="ניהול סיכונים משפטי ואסטרטגיית מיסוי עבור תושבי ישראל ולקוחות בזירה הגלובלית. התמחות בבדיקת נאותות למקרקעין, ציות בנקאי וניהול עזבונות חוצי גבולות."
        path="/about"
        schema={attorneySchema}
      />

      {/* Hero Section */}
      <PageHero
        backgroundImage={aboutHeroBg}
        title={t('about.hero.title')}
      />

      {/* Philosophy Section */}
      <section className="pt-24 sm:pt-28 pb-12 gradient-stone">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={philosophyAnim.ref}
            className={cn(
              "max-w-4xl mx-auto transition-all duration-700",
              isRTL && "font-hebrew text-right",
              philosophyAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {t('about.philosophy.title') && (
              <>
                <h2 className="text-4xl sm:text-5xl font-display font-semibold text-foreground mb-5">
                  {t('about.philosophy.title')}
                </h2>
                <div className={cn("w-16 h-0.5 bg-accent mb-6", isRTL && "mr-0 ml-auto")} />
              </>
            )}
            <div className="space-y-5">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.philosophy.body')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Attorney Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={attorneyAnim.ref}
            className={cn(
              "max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center transition-all duration-700",
              isRTL && "lg:grid-flow-dense",
              attorneyAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {/* Image */}
            <div 
              className={cn(
                "w-full max-w-lg mx-auto lg:mx-0 transition-all duration-700 delay-200",
                isRTL ? "lg:col-start-2" : "lg:col-start-1",
                attorneyAnim.isVisible ? "opacity-100 translate-x-0" : isRTL ? "opacity-0 translate-x-8" : "opacity-0 -translate-x-8"
              )}
            >
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden rounded-sm shadow-premium">
                  <img
                    src={mayaPortrait}
                    alt="Maya Ziv - Attorney"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Decorative accent */}
                <div className={cn(
                  "absolute -bottom-4 w-24 h-1 bg-accent",
                  isRTL ? "-left-4" : "-right-4"
                )} />
              </div>
            </div>

            {/* Content */}
            <div 
              className={cn(
                "transition-all duration-700 delay-300",
                isRTL && "lg:col-start-1 font-hebrew text-right",
                attorneyAnim.isVisible ? "opacity-100 translate-x-0" : isRTL ? "opacity-0 -translate-x-8" : "opacity-0 translate-x-8"
              )}
            >
              <h2 className="text-4xl sm:text-5xl font-display font-semibold text-foreground mb-5">
                {t('about.attorney.title')}
              </h2>
              <div className={cn("w-16 h-0.5 bg-accent mb-6", isRTL && "mr-0 ml-auto")} />
              <div className="space-y-5">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('about.attorney.body')}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('about.attorney.body2')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section - Bridges between sections */}
      <section className="relative z-20 pb-0 pt-12 bg-background overflow-visible">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={serveAnim.ref}
            className={cn(
              "relative max-w-6xl mx-auto transition-all duration-700",
              serveAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {/* Offset beige background that extends down into next section */}
            <div className={cn(
              "absolute -top-12 w-[95%] bg-secondary",
              "h-[calc(100%+9rem)]",
              isRTL ? "left-0 -ml-8 lg:-ml-16" : "right-0 -mr-8 lg:-mr-16"
            )} />
            
            {/* White content card - overlaps next section */}
            <div className={cn(
              "relative z-10 bg-background py-8 px-6 lg:py-10 lg:px-10 w-[92%] shadow-sm",
              isRTL ? "mr-auto ml-0" : "ml-auto mr-0"
            )}>
              <div className={cn(isRTL && "font-hebrew text-right")}>
                <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground mb-5">
                  {t('about.serve.title')}
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {t('about.serve.body')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {t('about.serve.body2')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="pt-28 lg:pt-32 pb-10 lg:pb-12 bg-secondary/30 -mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={expectAnim.ref}
            className={cn(
              "text-center mb-10 transition-all duration-700",
              isRTL && "font-hebrew",
              expectAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-foreground">
              {t('about.expect.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {expectations.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center text-center transition-all duration-500",
                  isRTL && "font-hebrew",
                  expectAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: expectAnim.isVisible ? `${index * 150}ms` : '0ms' }}
              >
                {/* Icon with outlined circle */}
                <div className="w-12 h-12 rounded-full border border-accent flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-display font-medium text-foreground mb-3 italic">
                  {t(item.titleKey)}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {t(item.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <MethodologySection />

      {/* CTA Section */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={ctaAnim.ref}
            className={cn(
              "max-w-3xl mx-auto text-center transition-all duration-700",
              isRTL && "font-hebrew",
              ctaAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="w-16 h-0.5 bg-accent mx-auto mb-6" />
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-body font-semibold text-primary-foreground mb-5">
              {t('about.cta.title')}
            </h2>
            
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              {t('about.cta.body')}
            </p>

            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-6 sm:px-10 py-6 text-base group max-w-full"
            >
              <Link to={localePath('/contact')} className={cn("flex items-center gap-2 whitespace-normal text-center", isRTL && "flex-row-reverse")}>
                {t('about.cta.button')}
                <Arrow className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
