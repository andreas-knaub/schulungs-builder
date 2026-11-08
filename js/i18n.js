// ---------------------------------------------------------------
// Sprachen: feste Beschriftungen auf den Folien (z. B. "Schritt 2 von 4").
// Den eigentlichen Inhalt übersetzt die KI, diese Texte kommen von hier.
// ---------------------------------------------------------------

const LANGUAGES = [
  // name = Eigenname (für Mitarbeiter im Präsentationsmodus), de = Name im Builder
  { code: "de", target: "Deutsche",   name: "Deutsch", de: "Deutsch",   english: "German" },
  { code: "en", target: "Englische",  name: "English", de: "Englisch",  english: "English" },
  { code: "tr", target: "Türkische",  name: "Türkçe",  de: "Türkisch",  english: "Turkish" },
  { code: "ro", target: "Rumänische", name: "Română",  de: "Rumänisch", english: "Romanian" },
  { code: "pl", target: "Polnische",  name: "Polski",  de: "Polnisch",  english: "Polish" },
  { code: "ru", target: "Russische",  name: "Русский", de: "Russisch",  english: "Russian" }
];

const LABELS = {
  de: { material: "Schulungsunterlage", steps: "Arbeitsschritte", step: "Schritt {n} von {m}", slide: "Folie",
        safety: "Sicherheit", tip: "Hinweis", minutes: "Minuten", duration: "Dauer", version: "Version",
        author: "Erstellt von", area: "Bereich", summary: "Zusammenfassung", done: "Schulung abgeschlossen",
        doneText: "Sie haben alle Inhalte zu {t} durchgearbeitet. Bei Fragen wenden Sie sich an Ihre Teamleitung.",
        warnings: "Sicherheitshinweise", questions: "Wissensfragen", qr: "Schulung am Arbeitsplatz aufrufen",
        quiz: "Wissenscheck" },
  en: { material: "Training material", steps: "Work steps", step: "Step {n} of {m}", slide: "Slide",
        safety: "Safety", tip: "Note", minutes: "Minutes", duration: "Duration", version: "Version",
        author: "Created by", area: "Area", summary: "Summary", done: "Training completed",
        doneText: "You have completed all content of {t}. If you have any questions, please contact your team leader.",
        warnings: "Safety notes", questions: "Quiz questions", qr: "Open this training at the workstation",
        quiz: "Knowledge check" },
  tr: { material: "Eğitim dokümanı", steps: "İş adımları", step: "Adım {n} / {m}", slide: "Slayt",
        safety: "Güvenlik", tip: "Not", minutes: "Dakika", duration: "Süre", version: "Sürüm",
        author: "Hazırlayan", area: "Alan", summary: "Özet", done: "Eğitim tamamlandı",
        doneText: "{t} ile ilgili tüm içerikleri tamamladınız. Sorularınız için ekip liderinize başvurun.",
        warnings: "Güvenlik uyarıları", questions: "Bilgi soruları", qr: "Eğitimi iş istasyonunda açın",
        quiz: "Bilgi kontrolü" },
  ro: { material: "Material de instruire", steps: "Pași de lucru", step: "Pasul {n} din {m}", slide: "Diapozitiv",
        safety: "Siguranță", tip: "Indicație", minutes: "Minute", duration: "Durată", version: "Versiune",
        author: "Creat de", area: "Domeniu", summary: "Rezumat", done: "Instruire finalizată",
        doneText: "Ați parcurs tot conținutul despre {t}. Pentru întrebări, adresați-vă șefului de echipă.",
        warnings: "Instrucțiuni de siguranță", questions: "Întrebări de verificare", qr: "Deschideți instruirea la postul de lucru",
        quiz: "Verificarea cunoștințelor" },
  pl: { material: "Materiał szkoleniowy", steps: "Kroki pracy", step: "Krok {n} z {m}", slide: "Slajd",
        safety: "Bezpieczeństwo", tip: "Wskazówka", minutes: "Minut", duration: "Czas trwania", version: "Wersja",
        author: "Autor", area: "Obszar", summary: "Podsumowanie", done: "Szkolenie zakończone",
        doneText: "Zapoznałeś się z całą treścią szkolenia: {t}. W razie pytań zwróć się do lidera zespołu.",
        warnings: "Wskazówki bezpieczeństwa", questions: "Pytania kontrolne", qr: "Otwórz szkolenie na stanowisku pracy",
        quiz: "Sprawdzenie wiedzy" },
  ru: { material: "Учебный материал", steps: "Рабочие шаги", step: "Шаг {n} из {m}", slide: "Слайд",
        safety: "Безопасность", tip: "Подсказка", minutes: "Минут", duration: "Длительность", version: "Версия",
        author: "Автор", area: "Участок", summary: "Итоги", done: "Обучение завершено",
        doneText: "Вы изучили все материалы по теме «{t}». Если есть вопросы, обратитесь к руководителю бригады.",
        warnings: "Указания по безопасности", questions: "Контрольные вопросы", qr: "Открыть обучение на рабочем месте",
        quiz: "Проверка знаний" }
};

// Aktuelle Beschriftungen (wird beim Erstellen der Folien gesetzt)
let L = LABELS.de;
function useLabels(code) { L = LABELS[code] || LABELS.de; }
function stepText(n, m) { return L.step.replace("{n}", n).replace("{m}", m); }
