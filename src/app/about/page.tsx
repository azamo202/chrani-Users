"use client";

import { Award, Target, Eye, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const About = () => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* History Section */}
      <section className="container-wide py-20 lg:py-32">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1 relative group rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
            <img
              src="/WhatsApp Image 2026-05-14 at 7.53.29 AM.jpeg"
              alt="Premium Home Appliances"
              className="w-full aspect-video lg:aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Decorative element */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-black/40 to-transparent z-10" />
          </div>
          
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("about.history.title")}
            </h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
            <div className="text-lg leading-relaxed text-muted-foreground font-light text-justify">
              <p>
                {t("about.history.body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="container-wide py-20 lg:py-32 border-t border-border">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-3xl font-bold sm:text-4xl text-foreground">
            {t("about.certificates.title")}
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "/WhatsApp Image 2026-05-14 at 7.53.28 AM (3).jpeg",
            "/WhatsApp Image 2026-05-14 at 7.53.28 AM (2).jpeg",
            "/WhatsApp Image 2026-05-14 at 7.53.28 AM (1).jpeg",
          ].map((src, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden shadow-lg border border-border/50 bg-card transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <img src={src} alt="Certificate" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>

      {/* Values/Mission/Vision Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-t border-border">
        {/* Background elements */}
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 blur-3xl rounded-full" />
        
        <div className="container-wide relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-3xl font-bold sm:text-4xl text-foreground">
              {t("about.values.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("about.values.subtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Eye, title: t("about.vision"), body: t("about.vision.body"), delay: "0" },
              { icon: Target, title: t("about.mission"), body: t("about.mission.body"), delay: "100" },
              { icon: Award, title: t("about.values"), body: t("about.values.body"), delay: "200" },
            ].map((item) => (
              <div 
                key={item.title} 
                className="group relative rounded-3xl border border-border/50 bg-background p-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/20 overflow-hidden"
              >
                {/* Decorative background hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-4 font-display text-2xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-base leading-relaxed text-muted-foreground font-light">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
