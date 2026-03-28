import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Briefcase, FileText, Shield, Scale, Globe, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLocalePath } from '@/hooks/useLocalePath';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import PageHero from '@/components/shared/PageHero';
import commercialHeroBg from '@/assets/commercial-hero-new.jpg';
import crossBorderImage from '@/assets/cross-border-business.webp';
import { SEO, createServiceSchema, createBreadcrumbSchema } from '@/components/SEO';
import RelatedServices from '@/components/shared/RelatedServices';

const Commercial = () => {
  const { t, isRTL, language } = useLanguage();
  const localePath = useLocalePath();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const coreServices = [
    { 
      title: t('commercial.services.contracts.title'), 
      desc: t('commercial.services.contracts.desc'), 
      icon: FileText 
    },
    { 
      title: t('commercial.services.negotiation.title'), 
      desc: t('commercial.services.negotiation.desc'), 
      icon: Scale 
    },
    {
      title: t('commercial.services.dispute.title'),
      desc: t('commercial.services.dispute.desc'),
      icon: Shield
    },
    {
      title: t('commercial.services.crossborder.title'),
      desc: t('commercial.services.crossborder.desc'),
      icon: Globe
    },
  ];

  const philosophyAnim = useScrollAnimation();
  const servicesAnim = useScrollAnimation();
  const crossBorderAnim = useScrollAnimation();
  const clientsAnim = useScrollAnimation();
  const ctaAnim = useScrollAnimation();

  const commercialSchema = createServiceSchema({
    name: 'Commercial Legal Services',
    description: 'Commercial legal counsel in Israel. Drafting contracts, partnership agreements, and managing cross border business disputes for international clients.',
    url: 'https://mayaziv-law.com/commercial',
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: language === 'he' ? 'בית' : 'Home', url: 'https://mayaziv-law.com/' },
    { name: language === 'he' ? 'מסחרי ואזרחי' : 'Commercial and Civil', url: 'https://mayaziv-law.com/commercial' },
  ]);

  return (
    <Layout>
      <SEO
        titleEn="Commercial Lawyer Israel | Contracts, Risk Allocation and Business Transactions"
        titleHe="עורך דין מסחרי בתל אביב | חוזים ויישוב סכסוכים"
        descriptionEn="Commercial legal advice for businesses in Israel and internationally. Contract drafting, risk allocation, and transaction structuring with financial discipline."
        descriptionHe="ייעוץ משפטי מסחרי בתל אביב. ניסוח חוזים, הסכמי שותפות וניהול סכסוכים עסקיים חוצי גבולות ללקוחות בינלאומיים."
        path="/commercial"
        schema={[commercialSchema, breadcrumbSchema]}
      />

      {/* Hero Section */}
      <PageHero
        backgroundImage={commercialHeroBg}
        title={t('commercial.hero.title')}
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
            <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-6">
              {t('commercial.philosophy.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              {t('commercial.philosophy.body')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('commercial.philosophy.body2')}
            </p>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={servicesAnim.ref}
            className={cn(
              "max-w-4xl mx-auto mb-10 transition-all duration-700",
              isRTL && "font-hebrew text-right",
              servicesAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-6">
              {t('commercial.services.title')}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {coreServices.map((service, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-6 bg-card rounded-lg border border-border transition-all duration-500",
                  isRTL && "font-hebrew text-right",
                  servicesAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: servicesAnim.isVisible ? `${i * 100}ms` : '0ms' }}
              >
                <service.icon className="h-6 w-6 text-accent mb-4" />
                <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                <p className="text-lg text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Border Section */}
      <section className="relative z-20 py-12 bg-background overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={crossBorderAnim.ref}
            className={cn(
              "relative max-w-6xl mx-auto transition-all duration-700",
              crossBorderAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {/* Offset beige background */}
            <div className={cn(
              "absolute -top-8 w-[60%] bg-secondary h-[calc(100%+4rem)]",
              isRTL ? "right-0 -mr-8 lg:-mr-16" : "left-0 -ml-8 lg:-ml-16"
            )} />
            
            {/* Content grid */}
            <div className={cn(
              "relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            )}>
              {/* Text content in white card */}
              <div className={cn(
                "bg-background py-8 px-6 lg:py-10 lg:px-10 shadow-sm",
                isRTL && "font-hebrew text-right"
              )}>
                <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-6 text-foreground">
                  {t('commercial.crossborder.title')}
                </h2>
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                  {t('commercial.crossborder.body')}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('commercial.crossborder.body2')}
                </p>
              </div>

              {/* Image */}
              <div className={cn(
                "relative",
                isRTL ? "lg:order-first" : ""
              )}>
                <div className="aspect-[3/4] max-w-sm mx-auto lg:mx-0 overflow-hidden rounded-sm shadow-premium">
                  <img
                    src={crossBorderImage}
                    alt={language === 'he' ? 'עסקים חוצי גבולות' : 'Cross border business'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Work With Section */}
      <section className="py-12 gradient-stone">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={clientsAnim.ref}
            className={cn(
              "max-w-4xl mx-auto transition-all duration-700",
              isRTL && "font-hebrew text-right",
              clientsAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-6">
              {t('commercial.clients.title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('commercial.clients.body')}
            </p>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <RelatedServices currentPath="/commercial" />

      {/* CTA Section */}
      <section className="py-12 bg-[#faf8f5]">
        <div
          ref={ctaAnim.ref}
          className={cn(
            "container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700",
            ctaAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-0.5 bg-accent mx-auto mb-6" />
            <h2 className={cn("text-4xl sm:text-5xl lg:text-6xl font-display font-semibold mb-5 text-primary", isRTL && "font-hebrew")}>
              {t('commercial.cta.title')}
            </h2>
            <p className={cn("text-xl mb-8 max-w-xl mx-auto text-primary", isRTL && "font-hebrew")}>
              {t('commercial.cta.body')}
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-6 sm:px-10 py-6 text-base group max-w-full">
              <Link to={localePath('/contact')} className={cn("flex items-center gap-2 whitespace-normal text-center", isRTL && "flex-row-reverse")}>
                {t('commercial.cta.button')}
                <Arrow className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Commercial;
