import { Link } from 'react-router-dom';
import { useLocalePath } from '@/hooks/useLocalePath';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { isPrerender } from '@/lib/isPrerender';
import { Building2, AlertTriangle, Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import PageHero from '@/components/shared/PageHero';
import dueDiligenceImage from '@/assets/real-estate-due-diligence.webp';
import remoteTransactionImage from '@/assets/remote-transaction.webp';
import realEstateHeroBg from '@/assets/real-estate-hero-new.webp';
import { SEO, createServiceSchema, createFAQSchema, createBreadcrumbSchema } from '@/components/SEO';
import RelatedServices from '@/components/shared/RelatedServices';

const RealEstate = () => {
  const {
    t,
    isRTL,
    language
  } = useLanguage();
  const localePath = useLocalePath();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const risks = [{
    titleKey: 'realestate.risk.liabilities.title',
    descKey: 'realestate.risk.liabilities.desc'
  }, {
    titleKey: 'realestate.risk.planning.title',
    descKey: 'realestate.risk.planning.desc'
  }, {
    titleKey: 'realestate.risk.tax.title',
    descKey: 'realestate.risk.tax.desc'
  }];
  const faqs = [{
    qKey: 'realestate.faq.q1',
    aKey: 'realestate.faq.a1'
  }, {
    qKey: 'realestate.faq.q2',
    aKey: 'realestate.faq.a2'
  }, {
    qKey: 'realestate.faq.q3',
    aKey: 'realestate.faq.a3'
  }];

  // Scroll animations
  const approachAnim = useScrollAnimation();
  const riskAnim = useScrollAnimation();
  const taxAnim = useScrollAnimation();
  const dueDiligenceAnim = useScrollAnimation();
  const remoteAnim = useScrollAnimation();
  const faqAnim = useScrollAnimation();
  const ctaAnim = useScrollAnimation();
  const realEstateSchema = createServiceSchema({
    name: 'Real Estate Legal Services',
    description: 'Legal counsel for buying property in Israel. Due diligence, purchase tax planning, and remote representation for foreign residents and investors.',
    url: 'https://mayaziv-law.com/real-estate',
  });

  const faqSchema = createFAQSchema(faqs.map(faq => ({
    question: t(faq.qKey),
    answer: t(faq.aKey),
  })));

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: language === 'he' ? 'בית' : 'Home', url: 'https://mayaziv-law.com/' },
    { name: language === 'he' ? 'נדל"ן' : 'Real Estate', url: 'https://mayaziv-law.com/real-estate' },
  ]);

  return <Layout>
      <SEO
        titleEn="Real Estate Lawyer in Israel | Property Transactions for Local and Foreign Buyers"
        titleHe="עורכת דין נדל״ן בתל אביב | רכישת נכס בישראל"
        descriptionEn="Legal advice on buying and selling property in Israel. Representing Israeli and international clients in residential and commercial real estate transactions. Maya Ziv Law."
        descriptionHe="ייעוץ משפטי לרכישת נכס בישראל. בדיקת נאותות, תכנון מס רכישה וייצוג מרחוק לתושבי חוץ ומשקיעים."
        path="/real-estate"
        schema={[realEstateSchema, faqSchema, breadcrumbSchema]}
      />
      {/* Hero Section */}
      <PageHero backgroundImage={realEstateHeroBg} title={t('realestate.hero.title')} />

      {/* The Approach Section */}
      <section className="pt-24 sm:pt-28 pb-12 gradient-stone">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={approachAnim.ref} className={cn("max-w-4xl mx-auto transition-all duration-700", isRTL && "font-hebrew text-right", approachAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-foreground mb-5">
              {t('realestate.approach.title')}
            </h2>
            <div className={cn("w-16 h-0.5 bg-accent mb-6", isRTL && "mr-0 ml-auto")} />
            <div className="space-y-5">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('realestate.approach.body')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('realestate.approach.body2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Map Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={riskAnim.ref} className={cn("max-w-4xl mx-auto transition-all duration-700", isRTL && "font-hebrew text-right", riskAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-foreground mb-5">
              {t('realestate.risk.title')}
            </h2>
            <div className={cn("w-16 h-0.5 bg-accent mb-6", isRTL && "mr-0 ml-auto")} />
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t('realestate.risk.intro')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {risks.map((risk, index) => <div key={index} className={cn("flex flex-col items-center text-center transition-all duration-500", isRTL && "font-hebrew", riskAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} style={{
              transitionDelay: riskAnim.isVisible ? `${index * 150}ms` : '0ms'
            }}>
                  {/* Icon with outlined circle */}
                  <div className="w-14 h-14 rounded-full border border-accent flex items-center justify-center mb-5">
                    <AlertTriangle className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-display font-medium text-foreground mb-4">
                    {t(risk.titleKey)}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {t(risk.descKey)}
                  </p>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Tax Planning Section */}
      <section className="py-12 gradient-stone">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={taxAnim.ref} className={cn("max-w-4xl mx-auto transition-all duration-700", isRTL && "font-hebrew text-right", taxAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-foreground mb-5">
              {t('realestate.tax.title')}
            </h2>
            <div className={cn("w-16 h-0.5 bg-accent mb-6", isRTL && "mr-0 ml-auto")} />
            <div className="space-y-5">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('realestate.tax.body')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('realestate.tax.body2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Due Diligence Section - Asymmetric Design */}
      <section className="relative z-20 py-12 bg-background overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={dueDiligenceAnim.ref} className={cn("relative max-w-6xl mx-auto transition-all duration-700", dueDiligenceAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            {/* Offset beige background */}
            <div className={cn("absolute -top-8 w-[60%] bg-secondary", "h-[calc(100%+4rem)]", isRTL ? "right-0 -mr-8 lg:-mr-16" : "left-0 -ml-8 lg:-ml-16")} />
            
            {/* Content grid */}
            <div className={cn("relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center", isRTL && "lg:grid-flow-dense")}>
              {/* Text content in white card */}
              <div className={cn("bg-background py-8 px-6 lg:py-10 lg:px-10 shadow-sm transition-all duration-700 delay-200", isRTL ? "lg:col-start-1" : "lg:col-start-1", dueDiligenceAnim.isVisible ? "opacity-100 translate-x-0" : isRTL ? "opacity-0 -translate-x-8" : "opacity-0 -translate-x-8")}>
                <div className={cn(isRTL && "font-hebrew text-right")}>
                  <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground mb-5">
                    {t('realestate.diligence.title')}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {t('realestate.diligence.body')}
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {t('realestate.diligence.body2')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className={cn("relative transition-all duration-700 delay-300", isRTL ? "lg:col-start-2" : "lg:col-start-2", dueDiligenceAnim.isVisible ? "opacity-100 translate-x-0" : isRTL ? "opacity-0 translate-x-8" : "opacity-0 translate-x-8")}>
                <div className="aspect-[3/4] max-w-sm mx-auto lg:mx-0 overflow-hidden rounded-sm shadow-premium">
                  <img alt="Real estate due diligence" className="w-full h-full object-cover" src="/lovable-uploads/81459920-5f87-4bcb-8430-47c1c2edc6e4.png" loading="lazy" decoding="async" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Remote Execution Section - Same layout as Due Diligence */}
      <section className="relative z-20 py-12 bg-background overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={remoteAnim.ref} className={cn("relative max-w-6xl mx-auto transition-all duration-700", remoteAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            {/* Offset beige background - same position as Due Diligence */}
            <div className={cn("absolute -top-8 w-[60%] bg-secondary", "h-[calc(100%+4rem)]", isRTL ? "right-0 -mr-8 lg:-mr-16" : "left-0 -ml-8 lg:-ml-16")} />
            
            {/* Content grid */}
            <div className={cn("relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center", isRTL && "lg:grid-flow-dense")}>
              {/* Image - on left */}
              <div className={cn("relative transition-all duration-700 delay-200", isRTL ? "lg:col-start-2" : "lg:col-start-1", remoteAnim.isVisible ? "opacity-100 translate-x-0" : isRTL ? "opacity-0 translate-x-8" : "opacity-0 -translate-x-8")}>
                <div className="aspect-[3/4] max-w-sm mx-auto lg:mx-0 overflow-hidden rounded-sm shadow-premium">
                  <img alt="Remote real estate transaction" className="w-full h-full object-cover" src="/lovable-uploads/ba3c3a72-3db5-4141-9459-1f85fc39e53f.png" loading="lazy" decoding="async" />
                </div>
              </div>

              {/* Text content in white card - on right */}
              <div className={cn("bg-background py-8 px-6 lg:py-10 lg:px-10 shadow-sm transition-all duration-700 delay-300", isRTL ? "lg:col-start-1" : "lg:col-start-2", remoteAnim.isVisible ? "opacity-100 translate-x-0" : isRTL ? "opacity-0 -translate-x-8" : "opacity-0 translate-x-8")}>
                <div className={cn(isRTL && "font-hebrew text-right")}>
                  <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground mb-5">
                    {t('realestate.remote.title')}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {t('realestate.remote.body')}
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {t('realestate.remote.body2')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div ref={faqAnim.ref} className={cn("text-center mb-10 transition-all duration-700", isRTL && "font-hebrew", faqAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-foreground mb-4">
              {t('service.faq')}
            </h2>
            <div className="w-16 h-0.5 bg-accent mx-auto" />
          </div>
          
          {isPrerender() ? (
          <Accordion type="multiple" defaultValue={faqs.map((_, i) => `item-${i}`)} className="w-full">
            {faqs.map((faq, i) => <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className={cn("text-left", isRTL && "font-hebrew text-right")}>
                  {t(faq.qKey)}
                </AccordionTrigger>
                <AccordionContent className={cn(isRTL && "font-hebrew text-right")}>
                  {t(faq.aKey)}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
          ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => <AccordionItem key={i} value={`item-${i}`} className={cn("transition-all duration-500", faqAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")} style={{
            transitionDelay: faqAnim.isVisible ? `${i * 100}ms` : '0ms'
          }}>
                <AccordionTrigger className={cn("text-left", isRTL && "font-hebrew text-right")}>
                  {t(faq.qKey)}
                </AccordionTrigger>
                <AccordionContent className={cn(isRTL && "font-hebrew text-right")}>
                  {t(faq.aKey)}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
          )}
        </div>
      </section>

      {/* Related Services */}
      <RelatedServices currentPath="/real-estate" />

      {/* CTA Section */}
      <section className="py-12 text-primary bg-[#faf8f5]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={ctaAnim.ref} className={cn("max-w-3xl mx-auto text-center transition-all duration-700", isRTL && "font-hebrew", ctaAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <div className="w-16 h-0.5 bg-accent mx-auto mb-6" />
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold mb-5 text-primary">
              {t('realestate.cta.title')}
            </h2>
            
            <p className="text-lg mb-8 max-w-xl mx-auto text-primary">
              {t('realestate.cta.body')}
            </p>

            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-6 sm:px-10 py-6 text-base group max-w-full">
              <Link to={localePath('/contact')} className={cn("flex items-center gap-2 whitespace-normal text-center", isRTL && "flex-row-reverse")}>
                {t('realestate.cta.button')}
                <Arrow className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>;
};
export default RealEstate;