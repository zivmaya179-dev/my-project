import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Users, FileCheck, Home, Building, Clock, CheckCircle, ArrowRight, ArrowLeft, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLocalePath } from '@/hooks/useLocalePath';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import PageHero from '@/components/shared/PageHero';
import olimHeroBg from '@/assets/olim-hero-airport.webp';
import taxPositioningImage from '@/assets/tax-positioning-olim.webp';
import { SEO, createServiceSchema, createBreadcrumbSchema } from '@/components/SEO';
import RelatedServices from '@/components/shared/RelatedServices';

const OlimResidents = () => {
  const {
    t,
    isRTL,
    language
  } = useLanguage();
  const localePath = useLocalePath();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const frameworkItems = [{
    title: t('olim.framework.planning.title'),
    desc: t('olim.framework.planning.desc'),
    icon: Clock
  }, {
    title: t('olim.framework.property.title'),
    desc: t('olim.framework.property.desc'),
    icon: Home
  }, {
    title: t('olim.framework.banking.title'),
    desc: t('olim.framework.banking.desc'),
    icon: Building
  }, {
    title: t('olim.framework.peace.title'),
    desc: t('olim.framework.peace.desc'),
    icon: Globe
  }];
  const expectItems = [t('olim.expect.item1'), t('olim.expect.item2'), t('olim.expect.item3')];
  const contextAnim = useScrollAnimation();
  const frameworkAnim = useScrollAnimation();
  const taxAnim = useScrollAnimation();
  const clientsAnim = useScrollAnimation();
  const expectAnim = useScrollAnimation();
  const ctaAnim = useScrollAnimation();
  const olimSchema = createServiceSchema({
    name: 'Legal Services for Olim and Returning Residents',
    description: 'A structured legal framework for your transition to Israel. Tax positioning, property acquisition, and asset integration for Olim and Returning Residents.',
    url: 'https://mayaziv-law.com/olim-residents',
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: language === 'he' ? 'בית' : 'Home', url: 'https://mayaziv-law.com/' },
    { name: language === 'he' ? 'עולים ותושבים חוזרים' : 'Olim and Returning Residents', url: 'https://mayaziv-law.com/olim-residents' },
  ]);

  return <Layout>
      <SEO
        titleEn="Lawyer for Olim Hadashim and Returning Residents | Israeli Legal Guidance"
        titleHe="עורך דין לעולים ותושבים חוזרים בתל אביב"
        descriptionEn="Legal support for new immigrants and returning residents navigating Israeli law. Real estate, tax benefits, financial planning and cross border matters."
        descriptionHe="מסגרת משפטית מובנית למעבר לישראל. מיצוב מס, רכישת נכס ושילוב נכסים לעולים ותושבים חוזרים."
        path="/olim-residents"
        schema={[olimSchema, breadcrumbSchema]}
      />
      {/* Hero Section */}
      <PageHero backgroundImage={olimHeroBg} title={t('olim.hero.title')} imagePosition="center 30%" />

      <section className="pt-24 sm:pt-28 pb-12 gradient-stone">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={contextAnim.ref} className={cn("max-w-4xl mx-auto transition-all duration-700", isRTL && "font-hebrew text-right", contextAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <div className={cn("w-16 h-0.5 bg-accent mb-6", isRTL && "ml-auto")} />
            <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-6">{t('olim.context.title')}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{t('olim.context.body')}</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={frameworkAnim.ref} className={cn("max-w-4xl mx-auto mb-10 transition-all duration-700", isRTL && "font-hebrew text-right", frameworkAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <div className={cn("w-16 h-0.5 bg-accent mb-6", isRTL && "ml-auto")} />
            <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-6">{t('olim.framework.title')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {frameworkItems.map((item, i) => <div key={i} className={cn("p-6 bg-card rounded-lg border border-border transition-all duration-500", isRTL && "font-hebrew text-right", frameworkAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} style={{
            transitionDelay: frameworkAnim.isVisible ? `${i * 150}ms` : '0ms'
          }}>
                <item.icon className="h-6 w-6 text-accent mb-4" />
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-lg text-muted-foreground">{item.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      <section className="relative z-20 py-12 bg-background overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={taxAnim.ref} className={cn("relative max-w-6xl mx-auto transition-all duration-700", taxAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <div className={cn("absolute -top-8 w-[60%] bg-secondary h-[calc(100%+4rem)]", isRTL ? "-right-8 lg:-right-16" : "left-0 -ml-8 lg:-ml-16")} />
            <div className={cn("relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center")}>
              {/* Text card */}
              <div className={cn("bg-background py-8 px-6 lg:py-10 lg:px-10 shadow-sm", isRTL ? "font-hebrew text-right lg:order-1" : "lg:order-1")}>
                <div className={cn("w-16 h-0.5 bg-accent mb-6", isRTL && "ml-auto")} />
                <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-6 text-foreground">{t('olim.tax.title')}</h2>
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed">{t('olim.tax.body')}</p>
                <p className="text-lg text-muted-foreground leading-relaxed">{t('olim.tax.body2')}</p>
              </div>
              {/* Image */}
              <div className={cn("relative", isRTL ? "lg:order-2" : "lg:order-2")}>
                <div className="aspect-[3/4] max-w-sm mx-auto lg:mx-0 overflow-hidden rounded-sm shadow-premium">
                  <img alt={language === 'he' ? 'תכנון מס לעולים' : 'Tax positioning for Olim'} className="w-full h-full object-cover" src="/lovable-uploads/8883ef4e-474d-45c3-bf10-74ce4eabdba0.png" loading="lazy" decoding="async" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 gradient-stone">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={clientsAnim.ref} className={cn("max-w-4xl mx-auto transition-all duration-700", isRTL && "font-hebrew text-right", clientsAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <div className={cn("w-16 h-0.5 bg-accent mb-6", isRTL && "ml-auto")} />
            <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-6">{t('olim.clients.title')}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{t('olim.clients.body')}</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={expectAnim.ref} className={cn("max-w-4xl mx-auto transition-all duration-700", isRTL && "font-hebrew text-right", expectAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <div className={cn("w-16 h-0.5 bg-accent mb-6", isRTL && "ml-auto")} />
            <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-6">{t('olim.expect.title')}</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{t('olim.expect.body')}</p>
            <ul className="space-y-3">
              {expectItems.map((item, i) => <li key={i} className={cn("flex items-start gap-3 transition-all duration-500", expectAnim.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4")} style={{
              transitionDelay: expectAnim.isVisible ? `${i * 100}ms` : '0ms'
            }}>
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-lg text-muted-foreground">{item}</span>
                </li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <RelatedServices currentPath="/olim-residents" />

      <section className="py-12 bg-[#faf8f5]">
        <div ref={ctaAnim.ref} className={cn("container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700", ctaAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-0.5 bg-accent mx-auto mb-6" />
            <h2 className={cn("text-4xl sm:text-5xl lg:text-6xl font-display font-semibold mb-5 text-primary", isRTL && "font-hebrew")}>{t('olim.cta.title')}</h2>
            <p className={cn("text-xl mb-8 max-w-xl mx-auto text-primary", isRTL && "font-hebrew")}>{t('olim.cta.body')}</p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-6 sm:px-10 py-6 text-base group max-w-full">
              <Link to={localePath('/contact')} className={cn("flex items-center gap-2 whitespace-normal text-center", isRTL && "flex-row-reverse")}>
                {t('olim.cta.button')}
                <Arrow className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>;
};
export default OlimResidents;