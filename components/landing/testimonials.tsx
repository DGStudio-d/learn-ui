"use client";

import { useI18n } from "@/components/providers/i18n";

export default function Testimonials() {
  const { locale } = useI18n();
  const quote =
    locale === "ar"
      ? "الدورة كانت أكثر من رائعة! وجدت المدرّس لطيفًا ومتمرسًا، كما أن المواعيد كانت مناسبة لي. أشعر الآن بثقة أكبر في تعلم اللغة."
      : locale === "es"
      ? "¡El curso fue excelente! El profesor fue amable y con experiencia, y los horarios se adaptaron a mí. Ahora tengo más confianza."
      : "The course was fantastic! The teacher was kind and experienced, and the schedule worked for me. I feel more confident now.";

  const title =
    locale === "ar" ? "ماذا يقول طلابنا" : locale === "es" ? "Qué dicen nuestros alumnos" : "What our students say";

  return (
    <section className="bg-green-700 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
        <div className="bg-white text-gray-800 rounded shadow p-6 md:p-10">
          <div className="text-4xl text-green-700 mb-4">“</div>
          <p className="leading-relaxed">{quote}</p>
        </div>
      </div>
    </section>
  );
}
