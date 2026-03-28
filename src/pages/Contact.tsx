import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { SEO } from '@/components/SEO';

const Contact = () => {
  const { t, isRTL, language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', inquiry: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const heroAnim = useScrollAnimation();
  const contentAnim = useScrollAnimation();
  const formAnim = useScrollAnimation();

  const inquiryOptions = [
    { value: 'real-estate', label: t('contact.inquiry.realEstate') },
    { value: 'taxation', label: t('contact.inquiry.taxation') },
    { value: 'estate', label: t('contact.inquiry.estate') },
    { value: 'other', label: t('contact.inquiry.other') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New Inquiry: ${formData.inquiry}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nInquiry: ${formData.inquiry}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:info@mayaziv-law.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <Layout>
      <SEO
        titleEn="Contact Maya Ziv Law | Attorney in Israel | Hebrew and English"
        titleHe="צור קשר | משרד מאיה זיו עו״ד"
        descriptionEn="Reach Maya Ziv Law for inquiries about real estate, tax, estate planning and commercial matters. Based in Israel. Accepting clients in Israel and internationally."
        descriptionHe="צרו קשר עם משרד מאיה זיו לייעוץ משפטי בנדל״ן, מיסוי, תכנון עיזבון ועסקאות בינלאומיות בישראל."
        path="/contact"
      />
      <section className="pt-28 pb-10 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={heroAnim.ref} className={cn("max-w-4xl transition-all duration-700", isRTL && "font-hebrew text-right mr-auto", heroAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <div className="w-16 h-1 bg-accent mb-8" />
            <h1 className="text-4xl sm:text-5xl font-display font-semibold text-foreground mb-6">{t('contact.title')}</h1>
            <p className="text-xl text-muted-foreground">{t('contact.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div ref={formAnim.ref} className={cn("bg-card rounded-lg shadow-lg p-6 lg:p-10 transition-all duration-700", formAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
              <div className={cn(isRTL && "font-hebrew text-right")}>
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-accent mb-4" />
                    <p className="text-lg text-foreground">{t('contact.form.success')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">{t('contact.form.name')}</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={cn("w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors", isRTL && "text-right")}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">{t('contact.form.email')}</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className={cn("w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors", isRTL && "text-right")}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">{t('contact.form.phone')}</label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className={cn("w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors", isRTL && "text-right")}
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiry" className="block text-sm font-medium text-foreground mb-1.5">{t('contact.form.inquiry')}</label>
                      <select
                        id="inquiry"
                        required
                        value={formData.inquiry}
                        onChange={(e) => setFormData(prev => ({ ...prev, inquiry: e.target.value }))}
                        className={cn("w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors", isRTL && "text-right")}
                      >
                        <option value="">{isRTL ? 'בחרו נושא' : 'Select a topic'}</option>
                        {inquiryOptions.map(opt => (
                          <option key={opt.value} value={opt.label}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">{t('contact.form.message')}</label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className={cn("w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none", isRTL && "text-right")}
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-6 text-base">
                      {t('contact.form.submit')}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div ref={contentAnim.ref} className={cn("bg-card rounded-lg shadow-lg p-6 lg:p-10 transition-all duration-700", contentAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
              <div className={cn(isRTL && "font-hebrew text-right")}>
                <h2 className="text-3xl font-display font-semibold text-foreground mb-8">{language === 'he' ? 'פרטי התקשרות' : 'Contact Info'}</h2>
                <div className="space-y-6">
                  <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
                    <Mail className="h-6 w-6 text-accent shrink-0" />
                    <a href="mailto:info@mayaziv-law.com" className="text-lg text-foreground hover:text-accent transition-colors">info@mayaziv-law.com</a>
                  </div>
                  <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
                    <Phone className="h-6 w-6 text-accent shrink-0" />
                    <a href="tel:+972544943597" className="text-lg text-foreground hover:text-accent transition-colors">+972.544943597</a>
                  </div>
                  <div className={cn("flex items-start gap-4", isRTL && "flex-row-reverse")}>
                    <MapPin className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                    <span className="text-lg text-foreground">{isRTL ? 'משה סנה 18, תל אביב' : '18 Moshe Sneh, Tel Aviv Israel'}</span>
                  </div>
                </div>
                <div className={cn("flex gap-4 mt-10", isRTL && "flex-row-reverse")}>
                  <a href="https://wa.me/972544943597" target="_blank" rel="noopener noreferrer" className="w-14 h-14 sm:w-12 sm:h-12 rounded-full border border-border/50 flex items-center justify-center text-foreground hover:text-accent hover:border-accent transition-colors" aria-label="WhatsApp">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/maya-ziv/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 sm:w-12 sm:h-12 rounded-full border border-border/50 flex items-center justify-center text-foreground hover:text-accent hover:border-accent transition-colors" aria-label="LinkedIn">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
