// Course-category names come straight from the backend course data, so they
// aren't part of the next-intl message catalog. This maps the known categories
// to Arabic for the localized landing; unknown names fall back to English and
// should ideally be localized backend-side long-term.
const CATEGORY_AR: Record<string, string> = {
  "Arts & Photography": "الفنون والتصوير",
  "Computers & Technology": "الحاسوب والتقنية",
  "Business & Money": "الأعمال والمال",
  "Politics & Social Sciences": "السياسة والعلوم الاجتماعية",
  "Health & Fitness": "الصحة واللياقة",
  "Personal Development": "التطوير الشخصي",
  "Marketing": "التسويق",
  "Design": "التصميم",
  "Development": "البرمجة والتطوير",
  "Finance & Accounting": "المالية والمحاسبة",
  "IT & Software": "تقنية المعلومات والبرمجيات",
  "Music": "الموسيقى",
  "Teaching & Academics": "التعليم والأكاديميا",
  "Language Learning": "تعلّم اللغات",
  "Lifestyle": "نمط الحياة",
  "Other": "أخرى",
};

/** Localize a backend category name. Arabic falls back to the English name when
 *  the category isn't in the map; non-Arabic locales return the name as-is. */
export function localizeCategoryName(name: string, locale: string): string {
  if (locale?.startsWith("ar")) return CATEGORY_AR[name] ?? name;
  return name;
}
